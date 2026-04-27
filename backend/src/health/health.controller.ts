import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async check() {
    let dbStatus = 'disconnected';
    let dbMessage = 'Not connected';

    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        dbStatus = 'connected';
        dbMessage = `PostgreSQL ${await this.getDatabaseVersion()}`;
      }
    } catch (error: unknown) {
      dbStatus = 'error';
      dbMessage =
        error instanceof Error ? error.message : 'Unknown health check error';
    }

    return {
      status: 'ok',
      timestamp: Date.now(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      database: {
        status: dbStatus,
        type: 'PostgreSQL',
        message: dbMessage,
      },
    };
  }

  private async getDatabaseVersion(): Promise<string> {
    try {
      const result: unknown = await this.dataSource.query('SELECT version()');
      if (!Array.isArray(result) || result.length === 0) {
        return 'Unknown';
      }

      const firstRow: unknown = (result as unknown[])[0];
      if (typeof firstRow !== 'object' || firstRow === null) {
        return 'Unknown';
      }

      const version = (firstRow as { version?: unknown }).version;
      if (typeof version !== 'string') {
        return 'Unknown';
      }

      // Extract just the version number (e.g., "16.1")
      const match = version.match(/PostgreSQL (\d+\.\d+)/);
      return match ? match[1] : 'Unknown';
    } catch {
      return 'Unknown';
    }
  }
}

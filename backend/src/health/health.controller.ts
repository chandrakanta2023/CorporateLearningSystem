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
    } catch (error) {
      dbStatus = 'error';
      dbMessage = error.message;
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
      const result = await this.dataSource.query('SELECT version()');
      const version = result[0]?.version || 'Unknown';
      // Extract just the version number (e.g., "16.1")
      const match = version.match(/PostgreSQL (\d+\.\d+)/);
      return match ? match[1] : 'Unknown';
    } catch {
      return 'Unknown';
    }
  }
}

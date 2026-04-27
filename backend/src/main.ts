import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const defaultCorsOrigins = ['http://localhost:5173', 'http://localhost:4173'];
  const envCorsOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const corsOrigins = Array.from(new Set([...defaultCorsOrigins, ...envCorsOrigins]));

  // Enable CORS for frontend connection
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Keep API routes versioned while preserving an easy-to-test /health endpoint.
  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📊 Health check: http://localhost:${port}/health`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Keep API routes versioned while preserving an easy-to-test /health endpoint.
  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  // Swagger / OpenAPI documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Corporate Learning System API')
    .setDescription('API for tracking employee learning progress, interventions, and compliance')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('dashboard', 'Dashboard summary metrics')
    .addTag('ingestion', 'Data ingestion APIs')
    .addTag('profiles', 'Employee learning profiles')
    .addTag('rules', 'Risk rule management')
    .addTag('risk-evaluations', 'Risk scoring execution')
    .addTag('interventions', 'Intervention lifecycle management')
    .addTag('compliance', 'Compliance report generation')
    .addTag('audit', 'Audit trail logs')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📊 Health check: http://localhost:${port}/health`);
  logger.log(`📖 API docs: http://localhost:${port}/api/docs`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();

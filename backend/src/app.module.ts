import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User, Course, Enrollment, Intervention } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(
      process.env.DB_TYPE === 'sqljs'
        ? {
            type: 'sqljs',
            autoSave: true,
            location: process.env.DB_SQLJS_PATH || '.data/dev.sqlite',
            entities: [User, Course, Enrollment, Intervention],
            synchronize: true,
            logging: false,
          }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT ?? '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'corporate_learning_db',
            entities: [User, Course, Enrollment, Intervention],
            synchronize: process.env.NODE_ENV === 'development',
            logging: process.env.NODE_ENV === 'development',
          },
    ),
    HealthModule,
    UsersModule,
    AuthModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

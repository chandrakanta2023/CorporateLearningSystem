import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import {
  User,
  Course,
  Enrollment,
  Intervention,
  AttendanceRecord,
  AssessmentRecord,
  CompetencyMilestone,
  RiskRule,
  RiskClassification,
  ComplianceReport,
} from './entities';
import { IngestionModule } from './ingestion/ingestion.module';
import { ProfilesModule } from './profiles/profiles.module';
import { RulesModule } from './rules/rules.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RiskEvaluationsModule } from './risk-evaluations/risk-evaluations.module';
import { InterventionsModule } from './interventions/interventions.module';
import { ComplianceModule } from './compliance/compliance.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'corporate_learning_db',
      entities: [
        User,
        Course,
        Enrollment,
        Intervention,
        AttendanceRecord,
        AssessmentRecord,
        CompetencyMilestone,
        RiskRule,
        RiskClassification,
        ComplianceReport,
      ],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    HealthModule,
    IngestionModule,
    ProfilesModule,
    RulesModule,
    DashboardModule,
    RiskEvaluationsModule,
    InterventionsModule,
    ComplianceModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

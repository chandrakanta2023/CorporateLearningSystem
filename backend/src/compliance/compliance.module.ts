import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Enrollment } from '../entities/enrollment.entity';
import { Intervention } from '../entities/intervention.entity';
import { ComplianceReport } from '../entities/compliance-report.entity';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Enrollment, Intervention, ComplianceReport])],
  controllers: [ComplianceController],
  providers: [ComplianceService],
})
export class ComplianceModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { AssessmentRecord } from '../entities/assessment-record.entity';
import { CompetencyMilestone } from '../entities/competency-milestone.entity';
import { RiskRule } from '../entities/risk-rule.entity';
import { RiskClassification } from '../entities/risk-classification.entity';
import { RiskEvaluationsService } from './risk-evaluations.service';
import { RiskEvaluationsController } from './risk-evaluations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AttendanceRecord,
      AssessmentRecord,
      CompetencyMilestone,
      RiskRule,
      RiskClassification,
    ]),
  ],
  controllers: [RiskEvaluationsController],
  providers: [RiskEvaluationsService],
  exports: [RiskEvaluationsService],
})
export class RiskEvaluationsModule {}

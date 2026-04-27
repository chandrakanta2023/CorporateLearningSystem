import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { AssessmentRecord } from '../entities/assessment-record.entity';
import { CompetencyMilestone } from '../entities/competency-milestone.entity';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord, AssessmentRecord, CompetencyMilestone])],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Enrollment } from '../entities/enrollment.entity';
import { Intervention } from '../entities/intervention.entity';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { AssessmentRecord } from '../entities/assessment-record.entity';
import { CompetencyMilestone } from '../entities/competency-milestone.entity';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Enrollment,
      Intervention,
      AttendanceRecord,
      AssessmentRecord,
      CompetencyMilestone,
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}

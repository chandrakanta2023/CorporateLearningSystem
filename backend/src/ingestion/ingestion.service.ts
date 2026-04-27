import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { AssessmentRecord } from '../entities/assessment-record.entity';
import { CompetencyMilestone, CompetencyStatus } from '../entities/competency-milestone.entity';
import { AttendanceInput } from './dto/create-attendance.dto';
import { AssessmentInput } from './dto/create-assessment.dto';
import { CompetencyInput } from './dto/create-competency.dto';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(AssessmentRecord)
    private readonly assessmentRepository: Repository<AssessmentRecord>,
    @InjectRepository(CompetencyMilestone)
    private readonly competencyRepository: Repository<CompetencyMilestone>,
  ) {}

  async ingestAttendance(records: AttendanceInput[]) {
    if (!Array.isArray(records) || records.length === 0) {
      throw new BadRequestException('Attendance payload must be a non-empty array');
    }

    const entities = records.map((record) => {
      if (!record.userId || !record.courseId || !record.sessionDate) {
        throw new BadRequestException('userId, courseId, and sessionDate are required for attendance records');
      }

      return this.attendanceRepository.create({
        userId: record.userId,
        courseId: record.courseId,
        sessionDate: record.sessionDate,
        attended: record.attended,
        attendancePercentage: record.attendancePercentage ?? (record.attended ? 100 : 0),
        sourceSystem: record.sourceSystem ?? 'manual',
      });
    });

    const saved = await this.attendanceRepository.save(entities);
    return { ingestedCount: saved.length };
  }

  async ingestAssessments(records: AssessmentInput[]) {
    if (!Array.isArray(records) || records.length === 0) {
      throw new BadRequestException('Assessment payload must be a non-empty array');
    }

    const entities = records.map((record) => {
      if (!record.userId || !record.courseId || !record.assessmentName) {
        throw new BadRequestException('userId, courseId, and assessmentName are required for assessment records');
      }

      if (record.maxScore <= 0) {
        throw new BadRequestException('maxScore must be greater than 0');
      }

      return this.assessmentRepository.create({
        userId: record.userId,
        courseId: record.courseId,
        assessmentName: record.assessmentName,
        score: record.score,
        maxScore: record.maxScore,
        attemptNumber: record.attemptNumber ?? 1,
        passed: (record.score / record.maxScore) * 100 >= 70,
        assessedAt: new Date(record.assessedAt),
        gradingScale: record.gradingScale ?? 'percentage',
      });
    });

    const saved = await this.assessmentRepository.save(entities);
    return { ingestedCount: saved.length };
  }

  async ingestCompetencies(records: CompetencyInput[]) {
    if (!Array.isArray(records) || records.length === 0) {
      throw new BadRequestException('Competency payload must be a non-empty array');
    }

    const result: CompetencyMilestone[] = [];

    for (const record of records) {
      if (!record.userId || !record.competencyCode || !record.competencyName) {
        throw new BadRequestException('userId, competencyCode, and competencyName are required for competency records');
      }

      const existing = await this.competencyRepository.findOne({
        where: { userId: record.userId, competencyCode: record.competencyCode },
      });

      const status = record.status ?? (record.currentLevel >= record.targetLevel ? CompetencyStatus.ACHIEVED : CompetencyStatus.IN_PROGRESS);

      if (existing) {
        existing.currentLevel = record.currentLevel;
        existing.targetLevel = record.targetLevel;
        existing.targetDate = record.targetDate ?? existing.targetDate;
        existing.status = status;
        if (status === CompetencyStatus.ACHIEVED && !existing.achievedAt) {
          existing.achievedAt = new Date();
        }
        result.push(await this.competencyRepository.save(existing));
      } else {
        const created = this.competencyRepository.create({
          userId: record.userId,
          competencyCode: record.competencyCode,
          competencyName: record.competencyName,
          currentLevel: record.currentLevel,
          targetLevel: record.targetLevel,
          targetDate: record.targetDate ?? null,
          status,
          achievedAt: status === CompetencyStatus.ACHIEVED ? new Date() : null,
        });
        result.push(await this.competencyRepository.save(created));
      }
    }

    return { ingestedCount: result.length };
  }
}

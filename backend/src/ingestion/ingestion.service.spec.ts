import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { AssessmentRecord } from '../entities/assessment-record.entity';
import {
  CompetencyMilestone,
  CompetencyStatus,
} from '../entities/competency-milestone.entity';
import { IngestionService } from './ingestion.service';

const makeAttendanceEntity = (userId = 'u1'): AttendanceRecord =>
  ({
    id: 'att-1',
    userId,
    courseId: 'course-1',
    sessionDate: '2026-01-10',
    attended: true,
    attendancePercentage: 100,
    sourceSystem: 'manual',
  }) as AttendanceRecord;

const makeAssessmentEntity = (userId = 'u1'): AssessmentRecord =>
  ({
    id: 'ass-1',
    userId,
    courseId: 'course-1',
    assessmentName: 'Module 1 Quiz',
    score: 80,
    maxScore: 100,
    attemptNumber: 1,
    passed: true,
    assessedAt: new Date('2026-01-15'),
    gradingScale: 'percentage',
  }) as AssessmentRecord;

const makeCompetencyEntity = (
  userId = 'u1',
  status = CompetencyStatus.IN_PROGRESS,
): CompetencyMilestone =>
  ({
    id: 'comp-1',
    userId,
    competencyCode: 'COMP-001',
    competencyName: 'Data Analysis',
    currentLevel: 2,
    targetLevel: 3,
    targetDate: null,
    achievedAt: null,
    status,
  }) as CompetencyMilestone;

describe('IngestionService', () => {
  let service: IngestionService;

  const mockAttendanceRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };
  const mockAssessmentRepo = { create: jest.fn(), save: jest.fn() };
  const mockCompetencyRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(AttendanceRecord),
          useValue: mockAttendanceRepo,
        },
        {
          provide: getRepositoryToken(AssessmentRecord),
          useValue: mockAssessmentRepo,
        },
        {
          provide: getRepositoryToken(CompetencyMilestone),
          useValue: mockCompetencyRepo,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    jest.clearAllMocks();
  });

  // ── Attendance ─────────────────────────────────────────────────────────────

  describe('ingestAttendance()', () => {
    it('throws BadRequestException for empty array', async () => {
      await expect(service.ingestAttendance([])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when required fields are missing', async () => {
      await expect(
        service.ingestAttendance([
          {
            userId: '',
            courseId: 'c1',
            sessionDate: '2026-01-10',
            attended: true,
          },
        ]),
      ).rejects.toThrow(BadRequestException);
    });

    it('defaults attendancePercentage to 100 when attended=true', async () => {
      const entity = makeAttendanceEntity();
      let created: Partial<AttendanceRecord> | null = null;
      mockAttendanceRepo.create.mockImplementation(
        (value: Partial<AttendanceRecord>) => {
          created = value;
          return entity;
        },
      );
      mockAttendanceRepo.save.mockResolvedValue([entity]);

      const result = await service.ingestAttendance([
        {
          userId: 'u1',
          courseId: 'course-1',
          sessionDate: '2026-01-10',
          attended: true,
        },
      ]);

      expect(created?.attendancePercentage).toBe(100);
      expect(result.ingestedCount).toBe(1);
    });

    it('defaults attendancePercentage to 0 when attended=false', async () => {
      const entity = {
        ...makeAttendanceEntity(),
        attended: false,
        attendancePercentage: 0,
      };
      let created: Partial<AttendanceRecord> | null = null;
      mockAttendanceRepo.create.mockImplementation(
        (value: Partial<AttendanceRecord>) => {
          created = value;
          return entity;
        },
      );
      mockAttendanceRepo.save.mockResolvedValue([entity]);

      await service.ingestAttendance([
        {
          userId: 'u1',
          courseId: 'course-1',
          sessionDate: '2026-01-10',
          attended: false,
        },
      ]);

      expect(created?.attendancePercentage).toBe(0);
    });

    it('uses provided attendancePercentage over default', async () => {
      const entity = makeAttendanceEntity();
      let created: Partial<AttendanceRecord> | null = null;
      mockAttendanceRepo.create.mockImplementation(
        (value: Partial<AttendanceRecord>) => {
          created = value;
          return entity;
        },
      );
      mockAttendanceRepo.save.mockResolvedValue([entity]);

      await service.ingestAttendance([
        {
          userId: 'u1',
          courseId: 'course-1',
          sessionDate: '2026-01-10',
          attended: true,
          attendancePercentage: 75,
        },
      ]);

      expect(created?.attendancePercentage).toBe(75);
    });

    it('defaults sourceSystem to "manual" when not provided', async () => {
      const entity = makeAttendanceEntity();
      let created: Partial<AttendanceRecord> | null = null;
      mockAttendanceRepo.create.mockImplementation(
        (value: Partial<AttendanceRecord>) => {
          created = value;
          return entity;
        },
      );
      mockAttendanceRepo.save.mockResolvedValue([entity]);

      await service.ingestAttendance([
        {
          userId: 'u1',
          courseId: 'course-1',
          sessionDate: '2026-01-10',
          attended: true,
        },
      ]);

      expect(created?.sourceSystem).toBe('manual');
    });
  });

  // ── Assessments ────────────────────────────────────────────────────────────

  describe('ingestAssessments()', () => {
    it('throws BadRequestException for empty array', async () => {
      await expect(service.ingestAssessments([])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when maxScore is zero', async () => {
      await expect(
        service.ingestAssessments([
          {
            userId: 'u1',
            courseId: 'c1',
            assessmentName: 'Quiz',
            score: 50,
            maxScore: 0,
            assessedAt: '2026-01-15',
          },
        ]),
      ).rejects.toThrow(BadRequestException);
    });

    it('sets passed=true when score >= 70%', async () => {
      const entity = makeAssessmentEntity();
      let created: Partial<AssessmentRecord> | null = null;
      mockAssessmentRepo.create.mockImplementation(
        (value: Partial<AssessmentRecord>) => {
          created = value;
          return entity;
        },
      );
      mockAssessmentRepo.save.mockResolvedValue([entity]);

      await service.ingestAssessments([
        {
          userId: 'u1',
          courseId: 'c1',
          assessmentName: 'Quiz',
          score: 70,
          maxScore: 100,
          assessedAt: '2026-01-15',
        },
      ]);

      expect(created?.passed).toBe(true);
    });

    it('sets passed=false when score < 70%', async () => {
      const entity = { ...makeAssessmentEntity(), passed: false };
      let created: Partial<AssessmentRecord> | null = null;
      mockAssessmentRepo.create.mockImplementation(
        (value: Partial<AssessmentRecord>) => {
          created = value;
          return entity;
        },
      );
      mockAssessmentRepo.save.mockResolvedValue([entity]);

      await service.ingestAssessments([
        {
          userId: 'u1',
          courseId: 'c1',
          assessmentName: 'Quiz',
          score: 60,
          maxScore: 100,
          assessedAt: '2026-01-15',
        },
      ]);

      expect(created?.passed).toBe(false);
    });

    it('defaults attemptNumber to 1 and gradingScale to "percentage"', async () => {
      const entity = makeAssessmentEntity();
      let created: Partial<AssessmentRecord> | null = null;
      mockAssessmentRepo.create.mockImplementation(
        (value: Partial<AssessmentRecord>) => {
          created = value;
          return entity;
        },
      );
      mockAssessmentRepo.save.mockResolvedValue([entity]);

      await service.ingestAssessments([
        {
          userId: 'u1',
          courseId: 'c1',
          assessmentName: 'Quiz',
          score: 80,
          maxScore: 100,
          assessedAt: '2026-01-15',
        },
      ]);

      expect(created?.attemptNumber).toBe(1);
      expect(created?.gradingScale).toBe('percentage');
    });

    it('returns ingestedCount matching saved records', async () => {
      const entities = [makeAssessmentEntity(), makeAssessmentEntity('u2')];
      mockAssessmentRepo.create.mockImplementation(
        (v: Partial<AssessmentRecord>) => v as AssessmentRecord,
      );
      mockAssessmentRepo.save.mockResolvedValue(entities);

      const result = await service.ingestAssessments([
        {
          userId: 'u1',
          courseId: 'c1',
          assessmentName: 'Q1',
          score: 80,
          maxScore: 100,
          assessedAt: '2026-01-15',
        },
        {
          userId: 'u2',
          courseId: 'c1',
          assessmentName: 'Q1',
          score: 75,
          maxScore: 100,
          assessedAt: '2026-01-15',
        },
      ]);

      expect(result.ingestedCount).toBe(2);
    });
  });

  // ── Competencies ────────────────────────────────────────────────────────────

  describe('ingestCompetencies()', () => {
    it('throws BadRequestException for empty array', async () => {
      await expect(service.ingestCompetencies([])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when required competency fields are missing', async () => {
      await expect(
        service.ingestCompetencies([
          {
            userId: 'u1',
            competencyCode: '',
            competencyName: 'Data Analysis',
            currentLevel: 2,
            targetLevel: 3,
          },
        ]),
      ).rejects.toThrow(BadRequestException);
    });

    it('auto-sets status to ACHIEVED when currentLevel >= targetLevel', async () => {
      mockCompetencyRepo.findOne.mockResolvedValue(null);
      const entity = makeCompetencyEntity('u1', CompetencyStatus.ACHIEVED);
      let created: Partial<CompetencyMilestone> | null = null;
      mockCompetencyRepo.create.mockImplementation(
        (value: Partial<CompetencyMilestone>) => {
          created = value;
          return entity;
        },
      );
      mockCompetencyRepo.save.mockResolvedValue(entity);

      await service.ingestCompetencies([
        {
          userId: 'u1',
          competencyCode: 'COMP-001',
          competencyName: 'Data Analysis',
          currentLevel: 3,
          targetLevel: 3,
        },
      ]);

      expect(created?.status).toBe(CompetencyStatus.ACHIEVED);
      expect(created?.achievedAt).toBeInstanceOf(Date);
    });

    it('auto-sets status to IN_PROGRESS when currentLevel < targetLevel', async () => {
      mockCompetencyRepo.findOne.mockResolvedValue(null);
      const entity = makeCompetencyEntity('u1', CompetencyStatus.IN_PROGRESS);
      let created: Partial<CompetencyMilestone> | null = null;
      mockCompetencyRepo.create.mockImplementation(
        (value: Partial<CompetencyMilestone>) => {
          created = value;
          return entity;
        },
      );
      mockCompetencyRepo.save.mockResolvedValue(entity);

      await service.ingestCompetencies([
        {
          userId: 'u1',
          competencyCode: 'COMP-001',
          competencyName: 'Data Analysis',
          currentLevel: 1,
          targetLevel: 3,
        },
      ]);

      expect(created?.status).toBe(CompetencyStatus.IN_PROGRESS);
      expect(created?.achievedAt).toBeNull();
    });

    it('updates an existing competency record instead of creating a new one', async () => {
      const existing = makeCompetencyEntity('u1', CompetencyStatus.IN_PROGRESS);
      mockCompetencyRepo.findOne.mockResolvedValue(existing);
      mockCompetencyRepo.save.mockResolvedValue({
        ...existing,
        currentLevel: 3,
        status: CompetencyStatus.ACHIEVED,
      });

      const result = await service.ingestCompetencies([
        {
          userId: 'u1',
          competencyCode: 'COMP-001',
          competencyName: 'Data Analysis',
          currentLevel: 3,
          targetLevel: 3,
        },
      ]);

      expect(mockCompetencyRepo.create).not.toHaveBeenCalled();
      expect(mockCompetencyRepo.save).toHaveBeenCalledTimes(1);
      expect(result.ingestedCount).toBe(1);
    });

    it('sets achievedAt when updating an existing record to ACHIEVED status', async () => {
      const existing = makeCompetencyEntity('u1', CompetencyStatus.IN_PROGRESS);
      existing.achievedAt = null;
      mockCompetencyRepo.findOne.mockResolvedValue(existing);
      mockCompetencyRepo.save.mockImplementation((e: CompetencyMilestone) =>
        Promise.resolve(e),
      );

      await service.ingestCompetencies([
        {
          userId: 'u1',
          competencyCode: 'COMP-001',
          competencyName: 'Data Analysis',
          currentLevel: 3,
          targetLevel: 3,
        },
      ]);

      expect(existing.status).toBe(CompetencyStatus.ACHIEVED);
      expect(existing.achievedAt).toBeInstanceOf(Date);
    });
  });
});

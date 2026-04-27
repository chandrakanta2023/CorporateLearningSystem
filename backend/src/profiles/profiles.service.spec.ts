import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Enrollment, EnrollmentStatus } from '../entities/enrollment.entity';
import {
  Intervention,
  InterventionStatus,
  InterventionType,
} from '../entities/intervention.entity';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { AssessmentRecord } from '../entities/assessment-record.entity';
import {
  CompetencyMilestone,
  CompetencyStatus,
} from '../entities/competency-milestone.entity';
import { ProfilesService } from './profiles.service';

const makeUser = (id = 'u1'): User =>
  ({
    id,
    email: `${id}@corp.com`,
    firstName: 'Alice',
    lastName: 'Smith',
    department: 'Engineering',
    role: 'employee',
    managerId: null,
    isActive: true,
  }) as unknown as User;

const makeEnrollment = (userId: string, status: EnrollmentStatus): Enrollment =>
  ({ userId, status }) as Enrollment;

const makeIntervention = (
  userId: string,
  status: InterventionStatus,
): Intervention =>
  ({
    id: 'int-1',
    userId,
    status,
    type: InterventionType.REMINDER,
    progress: 0,
    createdAt: new Date('2026-01-01'),
  }) as unknown as Intervention;

const makeAttendance = (userId: string, pct: number): AttendanceRecord =>
  ({ userId, attendancePercentage: pct }) as AttendanceRecord;

const makeAssessment = (
  userId: string,
  score: number,
  maxScore: number,
): AssessmentRecord => ({ userId, score, maxScore }) as AssessmentRecord;

const makeCompetency = (
  userId: string,
  status: CompetencyStatus,
): CompetencyMilestone => ({ userId, status }) as CompetencyMilestone;

describe('ProfilesService', () => {
  let service: ProfilesService;

  const mockUserRepo = { findOne: jest.fn(), find: jest.fn() };
  const mockEnrollmentRepo = { find: jest.fn() };
  const mockInterventionRepo = { find: jest.fn() };
  const mockAttendanceRepo = { find: jest.fn() };
  const mockAssessmentRepo = { find: jest.fn() };
  const mockCompetencyRepo = { find: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockEnrollmentRepo,
        },
        {
          provide: getRepositoryToken(Intervention),
          useValue: mockInterventionRepo,
        },
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

    service = module.get<ProfilesService>(ProfilesService);
    jest.clearAllMocks();
  });

  // ── getEmployeeProfile ─────────────────────────────────────────────────────

  describe('getEmployeeProfile()', () => {
    it('throws NotFoundException when user does not exist', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.getEmployeeProfile('ghost-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns profile with 0 metrics when no data exists for user', async () => {
      mockUserRepo.findOne.mockResolvedValue(makeUser());
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([]);
      mockAssessmentRepo.find.mockResolvedValue([]);
      mockCompetencyRepo.find.mockResolvedValue([]);

      const result = await service.getEmployeeProfile('u1');

      expect(result.metrics.completionRate).toBe(0);
      expect(result.metrics.avgAssessmentScore).toBe(0);
      expect(result.metrics.attendancePercentage).toBe(0);
      expect(result.metrics.competencyAchievementRate).toBe(0);
    });

    it('calculates completionRate correctly from enrollments', async () => {
      mockUserRepo.findOne.mockResolvedValue(makeUser());
      mockEnrollmentRepo.find.mockResolvedValue([
        makeEnrollment('u1', EnrollmentStatus.COMPLETED),
        makeEnrollment('u1', EnrollmentStatus.COMPLETED),
        makeEnrollment('u1', EnrollmentStatus.IN_PROGRESS),
        makeEnrollment('u1', EnrollmentStatus.NOT_STARTED),
      ]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([]);
      mockAssessmentRepo.find.mockResolvedValue([]);
      mockCompetencyRepo.find.mockResolvedValue([]);

      const result = await service.getEmployeeProfile('u1');
      // 2 completed out of 4 = 50%
      expect(result.metrics.completionRate).toBe(50);
    });

    it('calculates avgAssessmentScore as percentage of maxScore', async () => {
      mockUserRepo.findOne.mockResolvedValue(makeUser());
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([]);
      mockAssessmentRepo.find.mockResolvedValue([
        makeAssessment('u1', 80, 100),
        makeAssessment('u1', 60, 100),
      ]);
      mockCompetencyRepo.find.mockResolvedValue([]);

      const result = await service.getEmployeeProfile('u1');
      // (80% + 60%) / 2 = 70%
      expect(result.metrics.avgAssessmentScore).toBe(70);
    });

    it('calculates attendancePercentage as average of records', async () => {
      mockUserRepo.findOne.mockResolvedValue(makeUser());
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([
        makeAttendance('u1', 100),
        makeAttendance('u1', 80),
        makeAttendance('u1', 60),
      ]);
      mockAssessmentRepo.find.mockResolvedValue([]);
      mockCompetencyRepo.find.mockResolvedValue([]);

      const result = await service.getEmployeeProfile('u1');
      // (100 + 80 + 60) / 3 = 80
      expect(result.metrics.attendancePercentage).toBe(80);
    });

    it('calculates competencyAchievementRate from milestone statuses', async () => {
      mockUserRepo.findOne.mockResolvedValue(makeUser());
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([]);
      mockAssessmentRepo.find.mockResolvedValue([]);
      mockCompetencyRepo.find.mockResolvedValue([
        makeCompetency('u1', CompetencyStatus.ACHIEVED),
        makeCompetency('u1', CompetencyStatus.ACHIEVED),
        makeCompetency('u1', CompetencyStatus.IN_PROGRESS),
        makeCompetency('u1', CompetencyStatus.NOT_STARTED),
      ]);

      const result = await service.getEmployeeProfile('u1');
      // 2 achieved out of 4 = 50%
      expect(result.metrics.competencyAchievementRate).toBe(50);
    });

    it('assigns riskLevel=high when attendance is critically low', async () => {
      mockUserRepo.findOne.mockResolvedValue(makeUser());
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([makeAttendance('u1', 40)]); // below 60
      mockAssessmentRepo.find.mockResolvedValue([
        makeAssessment('u1', 80, 100),
      ]);
      mockCompetencyRepo.find.mockResolvedValue([
        makeCompetency('u1', CompetencyStatus.ACHIEVED),
      ]);

      const result = await service.getEmployeeProfile('u1');
      expect(result.riskLevel).toBe('high');
    });

    it('assigns riskLevel=low when all metrics are healthy', async () => {
      mockUserRepo.findOne.mockResolvedValue(makeUser());
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([makeAttendance('u1', 90)]);
      mockAssessmentRepo.find.mockResolvedValue([
        makeAssessment('u1', 85, 100),
      ]);
      mockCompetencyRepo.find.mockResolvedValue([
        makeCompetency('u1', CompetencyStatus.ACHIEVED),
      ]);

      const result = await service.getEmployeeProfile('u1');
      expect(result.riskLevel).toBe('low');
    });

    it('caps interventions in profile to latest 10', async () => {
      mockUserRepo.findOne.mockResolvedValue(makeUser());
      mockEnrollmentRepo.find.mockResolvedValue([]);
      const interventions = Array.from<Intervention>({ length: 15 }, () =>
        makeIntervention('u1', InterventionStatus.COMPLETED),
      );
      mockInterventionRepo.find.mockResolvedValue(interventions);
      mockAttendanceRepo.find.mockResolvedValue([]);
      mockAssessmentRepo.find.mockResolvedValue([]);
      mockCompetencyRepo.find.mockResolvedValue([]);

      const result = await service.getEmployeeProfile('u1');
      expect(result.interventions).toHaveLength(10);
      expect(result.counts.interventions).toBe(15);
    });

    it('returns correct employee fields from user entity', async () => {
      const user = makeUser('u1');
      mockUserRepo.findOne.mockResolvedValue(user);
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([]);
      mockAssessmentRepo.find.mockResolvedValue([]);
      mockCompetencyRepo.find.mockResolvedValue([]);

      const result = await service.getEmployeeProfile('u1');

      expect(result.employee.id).toBe('u1');
      expect(result.employee.email).toBe('u1@corp.com');
      expect(result.employee.firstName).toBe('Alice');
    });
  });

  // ── getDashboardSummary ────────────────────────────────────────────────────

  describe('getDashboardSummary()', () => {
    it('returns zero metrics when no data exists', async () => {
      mockUserRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([]);

      const result = await service.getDashboardSummary();

      expect(result.metrics.totalEmployees).toBe(0);
      expect(result.metrics.atRiskCount).toBe(0);
      expect(result.metrics.activeInterventions).toBe(0);
      expect(result.metrics.complianceRate).toBe(0);
    });

    it('identifies at-risk employees from attendance below 75%', async () => {
      const users = [makeUser('u1'), makeUser('u2'), makeUser('u3')];
      mockUserRepo.find.mockResolvedValue(users);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([
        makeAttendance('u1', 50), // high risk
        makeAttendance('u2', 70), // medium risk
        makeAttendance('u3', 90), // low risk
      ]);

      const result = await service.getDashboardSummary();
      // u1 (high) and u2 (medium) should be in atRiskEmployees, u3 not
      expect(result.atRiskEmployees).toHaveLength(2);
      expect(result.metrics.atRiskCount).toBe(2);
    });

    it('counts PENDING and ACTIVE interventions as active', async () => {
      mockUserRepo.find.mockResolvedValue([makeUser()]);
      mockInterventionRepo.find.mockResolvedValue([
        makeIntervention('u1', InterventionStatus.PENDING),
        makeIntervention('u1', InterventionStatus.ACTIVE),
        makeIntervention('u1', InterventionStatus.COMPLETED),
      ]);
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([]);

      const result = await service.getDashboardSummary();
      expect(result.metrics.activeInterventions).toBe(2);
    });

    it('calculates complianceRate from enrollment completion ratio', async () => {
      mockUserRepo.find.mockResolvedValue([makeUser()]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockEnrollmentRepo.find.mockResolvedValue([
        makeEnrollment('u1', EnrollmentStatus.COMPLETED),
        makeEnrollment('u1', EnrollmentStatus.COMPLETED),
        makeEnrollment('u1', EnrollmentStatus.IN_PROGRESS),
        makeEnrollment('u1', EnrollmentStatus.NOT_STARTED),
      ]);
      mockAttendanceRepo.find.mockResolvedValue([]);

      const result = await service.getDashboardSummary();
      // 2 / 4 = 50%
      expect(result.metrics.complianceRate).toBe(50);
    });

    it('returns 6 months of progressData', async () => {
      mockUserRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockAttendanceRepo.find.mockResolvedValue([]);

      const result = await service.getDashboardSummary();
      expect(result.progressData).toHaveLength(6);
    });
  });
});

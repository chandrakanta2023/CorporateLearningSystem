import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Enrollment, EnrollmentStatus } from '../entities/enrollment.entity';
import {
  Intervention,
  InterventionStatus,
} from '../entities/intervention.entity';
import { ComplianceReport } from '../entities/compliance-report.entity';
import { ComplianceService } from './compliance.service';

const makeUser = (id: string, isActive = true) => ({ id, isActive }) as User;

const makeEnrollment = (userId: string, status: EnrollmentStatus): Enrollment =>
  ({ userId, status }) as Enrollment;

const makeIntervention = (status: InterventionStatus): Intervention =>
  ({ status }) as Intervention;

const makeSavedReport = (
  overrides: Partial<ComplianceReport> = {},
): ComplianceReport => ({
  id: 'report-uuid-1',
  reportType: 'monthly',
  status: 'generated',
  totalEmployees: 0,
  compliantEmployees: 0,
  complianceRate: 0,
  activeInterventions: 0,
  metadata: null,
  generatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('ComplianceService', () => {
  let service: ComplianceService;

  const mockUserRepo = { find: jest.fn() };
  const mockEnrollmentRepo = { find: jest.fn() };
  const mockInterventionRepo = { find: jest.fn() };
  const mockReportRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplianceService,
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
          provide: getRepositoryToken(ComplianceReport),
          useValue: mockReportRepo,
        },
      ],
    }).compile();

    service = module.get<ComplianceService>(ComplianceService);
    jest.clearAllMocks();
  });

  describe('generateSummaryReport()', () => {
    it('calculates 100% compliance when all enrollments are completed', async () => {
      mockUserRepo.find.mockResolvedValue([makeUser('u1'), makeUser('u2')]);
      mockEnrollmentRepo.find.mockResolvedValue([
        makeEnrollment('u1', EnrollmentStatus.COMPLETED),
        makeEnrollment('u2', EnrollmentStatus.COMPLETED),
      ]);
      mockInterventionRepo.find.mockResolvedValue([]);

      const report = makeSavedReport({
        totalEmployees: 2,
        compliantEmployees: 2,
        complianceRate: 100,
      });
      mockReportRepo.create.mockReturnValue(report);
      mockReportRepo.save.mockResolvedValue(report);

      const result = await service.generateSummaryReport();
      expect(result.complianceRate).toBe(100);
      expect(result.compliantEmployees).toBe(2);
    });

    it('calculates 50% compliance when half the users have incomplete enrollments', async () => {
      mockUserRepo.find.mockResolvedValue([makeUser('u1'), makeUser('u2')]);
      mockEnrollmentRepo.find.mockResolvedValue([
        makeEnrollment('u1', EnrollmentStatus.COMPLETED),
        makeEnrollment('u2', EnrollmentStatus.IN_PROGRESS),
      ]);
      mockInterventionRepo.find.mockResolvedValue([]);

      const report = makeSavedReport({
        totalEmployees: 2,
        compliantEmployees: 1,
        complianceRate: 50,
      });
      mockReportRepo.create.mockReturnValue(report);
      mockReportRepo.save.mockResolvedValue(report);

      const result = await service.generateSummaryReport();
      expect(result.complianceRate).toBe(50);
      expect(result.compliantEmployees).toBe(1);
      expect(result.nonCompliantEmployees).toBe(1);
    });

    it('counts users with no enrollments as compliant', async () => {
      mockUserRepo.find.mockResolvedValue([makeUser('u1'), makeUser('u2')]);
      mockEnrollmentRepo.find.mockResolvedValue([]); // no enrollments at all
      mockInterventionRepo.find.mockResolvedValue([]);

      const report = makeSavedReport({
        totalEmployees: 2,
        compliantEmployees: 2,
        complianceRate: 100,
      });
      mockReportRepo.create.mockReturnValue(report);
      mockReportRepo.save.mockResolvedValue(report);

      const result = await service.generateSummaryReport();
      expect(result.compliantEmployees).toBe(2);
    });

    it('counts PENDING and ACTIVE interventions as active', async () => {
      mockUserRepo.find.mockResolvedValue([makeUser('u1')]);
      mockEnrollmentRepo.find.mockResolvedValue([
        makeEnrollment('u1', EnrollmentStatus.COMPLETED),
      ]);
      mockInterventionRepo.find.mockResolvedValue([
        makeIntervention(InterventionStatus.PENDING),
        makeIntervention(InterventionStatus.ACTIVE),
        makeIntervention(InterventionStatus.COMPLETED),
      ]);

      const report = makeSavedReport({ activeInterventions: 2 });
      mockReportRepo.create.mockReturnValue(report);
      mockReportRepo.save.mockResolvedValue(report);

      const result = await service.generateSummaryReport();
      expect(result.activeInterventions).toBe(2);
    });

    it('returns complianceRate=0 when there are no active users', async () => {
      mockUserRepo.find.mockResolvedValue([]);
      mockEnrollmentRepo.find.mockResolvedValue([]);
      mockInterventionRepo.find.mockResolvedValue([]);

      const report = makeSavedReport({ totalEmployees: 0, complianceRate: 0 });
      mockReportRepo.create.mockReturnValue(report);
      mockReportRepo.save.mockResolvedValue(report);

      const result = await service.generateSummaryReport();
      expect(result.totalEmployees).toBe(0);
      expect(result.complianceRate).toBe(0);
    });
  });

  describe('exportLatestCsv()', () => {
    it('returns a header-only CSV when no reports exist', async () => {
      mockReportRepo.findOne.mockResolvedValue(null);

      const result = await service.exportLatestCsv();
      expect(result).toContain('reportId,generatedAt,reportType');
      expect(result.trim().split('\n')).toHaveLength(1);
    });

    it('returns a CSV with one data row when a report exists', async () => {
      mockReportRepo.findOne.mockResolvedValue(
        makeSavedReport({
          id: 'report-1',
          totalEmployees: 10,
          compliantEmployees: 8,
          complianceRate: 80,
          activeInterventions: 2,
        }),
      );

      const result = await service.exportLatestCsv();
      const lines = result.trim().split('\n');
      expect(lines).toHaveLength(2);
      expect(lines[1]).toContain('report-1');
      expect(lines[1]).toContain('80');
    });
  });

  describe('getLatestReports()', () => {
    it('returns reports capped at the requested limit', async () => {
      const reports = Array(3).fill(makeSavedReport());
      mockReportRepo.find.mockResolvedValue(reports);

      const result = await service.getLatestReports(3);
      expect(result).toHaveLength(3);
    });
  });
});

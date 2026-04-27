import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { AssessmentRecord } from '../entities/assessment-record.entity';
import {
  CompetencyMilestone,
  CompetencyStatus,
} from '../entities/competency-milestone.entity';
import { RiskRule } from '../entities/risk-rule.entity';
import {
  RiskClassification,
  RiskLevel,
} from '../entities/risk-classification.entity';
import { RiskEvaluationsService } from './risk-evaluations.service';

const makeUser = (id: string) =>
  ({
    id,
    email: `user-${id}@corp.com`,
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
  }) as User;

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

const makeRule = (): RiskRule => ({ id: 'rule-1', isActive: true }) as RiskRule;

describe('RiskEvaluationsService', () => {
  let service: RiskEvaluationsService;

  const mockUserRepo = { find: jest.fn() };
  const mockAttendanceRepo = { find: jest.fn() };
  const mockAssessmentRepo = { find: jest.fn() };
  const mockCompetencyRepo = { find: jest.fn() };
  const mockRuleRepo = { find: jest.fn() };
  const mockRiskRepo = { find: jest.fn(), create: jest.fn(), save: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskEvaluationsService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
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
        { provide: getRepositoryToken(RiskRule), useValue: mockRuleRepo },
        {
          provide: getRepositoryToken(RiskClassification),
          useValue: mockRiskRepo,
        },
      ],
    }).compile();

    service = module.get<RiskEvaluationsService>(RiskEvaluationsService);
    jest.clearAllMocks();
  });

  describe('runEvaluation()', () => {
    const setupUserEval = (
      userId: string,
      attendance: number,
      score: number,
      competencyRate: number,
    ) => {
      const totalCompetencies = 10;
      const achieved = Math.round(competencyRate * totalCompetencies);
      mockAttendanceRepo.find.mockResolvedValue([
        makeAttendance(userId, attendance),
      ]);
      mockAssessmentRepo.find.mockResolvedValue([
        makeAssessment(userId, score, 100),
      ]);
      mockCompetencyRepo.find.mockResolvedValue([
        ...Array.from<CompetencyMilestone>({ length: achieved }, () =>
          makeCompetency(userId, CompetencyStatus.ACHIEVED),
        ),
        ...Array.from<CompetencyMilestone>(
          { length: totalCompetencies - achieved },
          () => makeCompetency(userId, CompetencyStatus.IN_PROGRESS),
        ),
      ]);
    };

    it('classifies a fully compliant user as NONE risk', async () => {
      const userId = 'user-good';
      mockUserRepo.find.mockResolvedValue([makeUser(userId)]);
      mockRuleRepo.find.mockResolvedValue([makeRule()]);
      setupUserEval(userId, 95, 90, 1.0);

      const classification = {
        riskLevel: RiskLevel.NONE,
        riskScore: 2,
        userId,
      } as RiskClassification;
      mockRiskRepo.create.mockReturnValue(classification);
      mockRiskRepo.save.mockResolvedValue(classification);

      const result = await service.runEvaluation();
      expect(result.evaluatedUsers).toBe(1);
      expect(result.none).toBe(1);
    });

    it('classifies a user with very low attendance as HIGH or CRITICAL risk', async () => {
      const userId = 'user-bad';
      mockUserRepo.find.mockResolvedValue([makeUser(userId)]);
      mockRuleRepo.find.mockResolvedValue([makeRule()]);
      setupUserEval(userId, 40, 35, 0.2);

      const classification = {
        riskLevel: RiskLevel.CRITICAL,
        riskScore: 80,
        userId,
      } as RiskClassification;
      mockRiskRepo.create.mockReturnValue(classification);
      mockRiskRepo.save.mockResolvedValue(classification);

      const result = await service.runEvaluation();
      // critical or high — either indicates at-risk detection is working
      expect(
        [result.critical, result.high].reduce((a, b) => a + b),
      ).toBeGreaterThan(0);
    });

    it('evaluates zero users when no active users exist', async () => {
      mockUserRepo.find.mockResolvedValue([]);
      mockRuleRepo.find.mockResolvedValue([makeRule()]);

      const result = await service.runEvaluation();
      expect(result.evaluatedUsers).toBe(0);
      expect(mockRiskRepo.save).not.toHaveBeenCalled();
    });

    it('returns summary with correct counts across all risk levels', async () => {
      const users = ['u1', 'u2', 'u3'].map(makeUser);
      mockUserRepo.find.mockResolvedValue(users);
      mockRuleRepo.find.mockResolvedValue([makeRule()]);

      const savedClassifications = [
        { riskLevel: RiskLevel.NONE, riskScore: 0, userId: 'u1' },
        { riskLevel: RiskLevel.MEDIUM, riskScore: 35, userId: 'u2' },
        { riskLevel: RiskLevel.HIGH, riskScore: 60, userId: 'u3' },
      ] as RiskClassification[];

      mockAttendanceRepo.find.mockResolvedValue([]);
      mockAssessmentRepo.find.mockResolvedValue([]);
      mockCompetencyRepo.find.mockResolvedValue([]);

      let callIdx = 0;
      mockRiskRepo.create.mockImplementation(
        () => savedClassifications[callIdx],
      );
      mockRiskRepo.save.mockImplementation(() =>
        Promise.resolve(savedClassifications[callIdx++]),
      );

      const result = await service.runEvaluation();
      expect(result.evaluatedUsers).toBe(3);
      expect(
        result.none +
          result.low +
          result.medium +
          result.high +
          result.critical,
      ).toBe(3);
    });
  });

  describe('getLatest()', () => {
    it('returns classifications capped at the requested limit', async () => {
      const rows = Array(5).fill({
        riskLevel: RiskLevel.LOW,
      });
      mockRiskRepo.find.mockResolvedValue(rows);

      const result = await service.getLatest(5);
      expect(result).toHaveLength(5);
      expect(mockRiskRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 }),
      );
    });
  });
});

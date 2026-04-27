import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RiskRule, RuleSeverity } from '../entities/risk-rule.entity';
import { RulesService } from './rules.service';

const makeRule = (overrides: Partial<RiskRule> = {}): RiskRule => ({
  id: 'rule-uuid-1',
  name: 'Low Attendance Rule',
  description: 'Flags users with attendance below 75%',
  severity: RuleSeverity.HIGH,
  definition: { attendanceThreshold: 75, scoreThreshold: 60 },
  version: 1,
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('RulesService', () => {
  let service: RulesService;
  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RulesService,
        { provide: getRepositoryToken(RiskRule), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<RulesService>(RulesService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('throws BadRequestException when required fields are missing', async () => {
      await expect(
        service.create({
          name: '',
          description: 'some description',
          definition: {},
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when a rule with the same name already exists', async () => {
      mockRepo.findOne.mockResolvedValue(makeRule());

      await expect(
        service.create({
          name: 'Low Attendance Rule',
          description: 'duplicate',
          definition: { threshold: 70 },
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates a rule with isActive=true by default', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const rule = makeRule();
      mockRepo.create.mockReturnValue(rule);
      mockRepo.save.mockResolvedValue(rule);

      const result = await service.create({
        name: 'Low Attendance Rule',
        description: 'Flags users with attendance below 75%',
        definition: { attendanceThreshold: 75 },
      });

      expect(result.isActive).toBe(true);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update()', () => {
    it('throws NotFoundException when rule does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { description: 'updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('increments version when definition is changed', async () => {
      const rule = makeRule({ version: 1 });
      mockRepo.findOne.mockResolvedValue(rule);
      mockRepo.save.mockImplementation((entity: RiskRule) =>
        Promise.resolve(entity),
      );

      const result = await service.update(rule.id, {
        definition: { attendanceThreshold: 80 },
      });

      expect(result.version).toBe(2);
      expect(result.definition).toEqual({ attendanceThreshold: 80 });
    });

    it('does not increment version when only description changes', async () => {
      const rule = makeRule({ version: 1 });
      mockRepo.findOne.mockResolvedValue(rule);
      mockRepo.save.mockImplementation((entity: RiskRule) =>
        Promise.resolve(entity),
      );

      const result = await service.update(rule.id, {
        description: 'Updated description only',
      });

      expect(result.version).toBe(1);
    });

    it('updates severity and isActive independently', async () => {
      const rule = makeRule({ severity: RuleSeverity.LOW, isActive: true });
      mockRepo.findOne.mockResolvedValue(rule);
      mockRepo.save.mockImplementation((entity: RiskRule) =>
        Promise.resolve(entity),
      );

      const result = await service.update(rule.id, {
        severity: RuleSeverity.CRITICAL,
        isActive: false,
      });

      expect(result.severity).toBe(RuleSeverity.CRITICAL);
      expect(result.isActive).toBe(false);
    });
  });

  describe('setActive()', () => {
    it('throws NotFoundException when rule does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.setActive('bad-id', true)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('activates a deactivated rule', async () => {
      const rule = makeRule({ isActive: false });
      mockRepo.findOne.mockResolvedValue(rule);
      mockRepo.save.mockImplementation((entity: RiskRule) =>
        Promise.resolve(entity),
      );

      const result = await service.setActive(rule.id, true);
      expect(result.isActive).toBe(true);
    });

    it('deactivates an active rule', async () => {
      const rule = makeRule({ isActive: true });
      mockRepo.findOne.mockResolvedValue(rule);
      mockRepo.save.mockImplementation((entity: RiskRule) =>
        Promise.resolve(entity),
      );

      const result = await service.setActive(rule.id, false);
      expect(result.isActive).toBe(false);
    });
  });

  describe('findAll()', () => {
    it('returns all rules ordered by createdAt DESC', async () => {
      const rules = [makeRule({ id: 'r1' }), makeRule({ id: 'r2' })];
      mockRepo.find.mockResolvedValue(rules);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(mockRepo.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });
});

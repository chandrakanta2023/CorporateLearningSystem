import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Intervention,
  InterventionStatus,
  InterventionType,
} from '../entities/intervention.entity';
import { InterventionsService } from './interventions.service';

const makeIntervention = (
  overrides: Partial<Intervention> = {},
): Intervention => ({
  id: 'int-uuid-1',
  enrollmentId: 'enroll-1',
  userId: 'user-1',
  courseId: 'course-1',
  type: InterventionType.REMINDER,
  status: InterventionStatus.PENDING,
  message: 'Complete module 3',
  recipientEmail: null,
  assignedBy: null,
  dueDate: null,
  progress: 0,
  sentAt: null,
  completedAt: null,
  errorMessage: null,
  outcomeNotes: null,
  preInterventionScore: null,
  postInterventionScore: null,
  createdAt: new Date('2026-01-01'),
  ...overrides,
});

describe('InterventionsService', () => {
  let service: InterventionsService;
  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterventionsService,
        { provide: getRepositoryToken(Intervention), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<InterventionsService>(InterventionsService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('throws BadRequestException when required fields are missing', async () => {
      await expect(
        service.create({
          enrollmentId: '',
          userId: 'user-1',
          courseId: 'course-1',
          type: InterventionType.REMINDER,
          message: 'msg',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates an intervention with PENDING status by default', async () => {
      const entity = makeIntervention();
      mockRepo.create.mockReturnValue(entity);
      mockRepo.save.mockResolvedValue(entity);

      const result = await service.create({
        enrollmentId: 'enroll-1',
        userId: 'user-1',
        courseId: 'course-1',
        type: InterventionType.REMINDER,
        message: 'Complete module 3',
      });

      expect(result.status).toBe(InterventionStatus.PENDING);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('sets progress=100 when status is COMPLETED on creation', async () => {
      const entity = makeIntervention({
        status: InterventionStatus.COMPLETED,
        progress: 100,
      });
      mockRepo.create.mockReturnValue(entity);
      mockRepo.save.mockResolvedValue(entity);

      const result = await service.create({
        enrollmentId: 'enroll-1',
        userId: 'user-1',
        courseId: 'course-1',
        type: InterventionType.REMINDER,
        message: 'msg',
        status: InterventionStatus.COMPLETED,
      });

      expect(result.progress).toBe(100);
    });
  });

  describe('update()', () => {
    it('throws NotFoundException when intervention does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { status: InterventionStatus.ACTIVE }),
      ).rejects.toThrow(NotFoundException);
    });

    it('sets completedAt and progress=100 when status transitions to COMPLETED', async () => {
      const existing = makeIntervention({
        status: InterventionStatus.ACTIVE,
        sentAt: new Date(),
      });
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockImplementation((entity: Intervention) =>
        Promise.resolve(entity),
      );

      const result = await service.update(existing.id, {
        status: InterventionStatus.COMPLETED,
      });

      expect(result.status).toBe(InterventionStatus.COMPLETED);
      expect(result.progress).toBe(100);
      expect(result.completedAt).toBeInstanceOf(Date);
    });

    it('sets sentAt when status transitions to ACTIVE', async () => {
      const existing = makeIntervention({ sentAt: null });
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockImplementation((entity: Intervention) =>
        Promise.resolve(entity),
      );

      const result = await service.update(existing.id, {
        status: InterventionStatus.ACTIVE,
      });

      expect(result.status).toBe(InterventionStatus.ACTIVE);
      expect(result.sentAt).toBeInstanceOf(Date);
    });

    it('clamps progress between 0 and 100', async () => {
      const existing = makeIntervention();
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockImplementation((entity: Intervention) =>
        Promise.resolve(entity),
      );

      const result = await service.update(existing.id, { progress: 150 });
      expect(result.progress).toBe(100);
    });
  });

  describe('close()', () => {
    it('marks intervention as COMPLETED with outcome notes', async () => {
      const existing = makeIntervention({
        status: InterventionStatus.ACTIVE,
        sentAt: new Date(),
      });
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockImplementation((entity: Intervention) =>
        Promise.resolve(entity),
      );

      const result = await service.close(
        existing.id,
        'Improved attendance',
        85,
      );

      expect(result.status).toBe(InterventionStatus.COMPLETED);
      expect(result.outcomeNotes).toBe('Improved attendance');
      expect(result.postInterventionScore).toBe(85);
    });
  });

  describe('summary()', () => {
    it('returns correct status counts and success rate', async () => {
      mockRepo.find.mockResolvedValue([
        makeIntervention({ status: InterventionStatus.PENDING }),
        makeIntervention({ status: InterventionStatus.ACTIVE }),
        makeIntervention({ status: InterventionStatus.COMPLETED }),
        makeIntervention({ status: InterventionStatus.COMPLETED }),
        makeIntervention({ status: InterventionStatus.FAILED }),
      ]);

      const result = await service.summary();

      expect(result.total).toBe(5);
      expect(result.pending).toBe(1);
      expect(result.active).toBe(1);
      expect(result.completed).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.successRate).toBe(40);
    });

    it('calculates avgImprovement from pre/post scores', async () => {
      mockRepo.find.mockResolvedValue([
        makeIntervention({
          status: InterventionStatus.COMPLETED,
          preInterventionScore: 50,
          postInterventionScore: 80,
        }),
        makeIntervention({
          status: InterventionStatus.COMPLETED,
          preInterventionScore: 60,
          postInterventionScore: 90,
        }),
      ]);

      const result = await service.summary();
      // (30 + 30) / 2 = 30
      expect(result.avgImprovement).toBe(30);
    });

    it('returns avgImprovement=0 when no scored records exist', async () => {
      mockRepo.find.mockResolvedValue([
        makeIntervention({ status: InterventionStatus.PENDING }),
      ]);

      const result = await service.summary();
      expect(result.avgImprovement).toBe(0);
    });
  });
});

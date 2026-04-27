import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Intervention, InterventionStatus } from '../entities/intervention.entity';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';

@Injectable()
export class InterventionsService {
  constructor(
    @InjectRepository(Intervention)
    private readonly interventionRepository: Repository<Intervention>,
  ) {}

  list(status?: string) {
    if (status) {
      return this.interventionRepository.find({
        where: { status: status as InterventionStatus },
        order: { createdAt: 'DESC' },
      });
    }

    return this.interventionRepository.find({ order: { createdAt: 'DESC' } });
  }

  async create(payload: CreateInterventionDto) {
    if (!payload.enrollmentId || !payload.userId || !payload.courseId || !payload.message) {
      throw new BadRequestException('enrollmentId, userId, courseId and message are required');
    }

    const intervention = this.interventionRepository.create();
    intervention.enrollmentId = payload.enrollmentId;
    intervention.userId = payload.userId;
    intervention.courseId = payload.courseId;
    intervention.type = payload.type;
    intervention.status = payload.status ?? InterventionStatus.PENDING;
    intervention.message = payload.message;
    intervention.recipientEmail = payload.recipientEmail ?? null;
    intervention.assignedBy = payload.assignedBy ?? null;
    intervention.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
    intervention.progress = intervention.status === InterventionStatus.COMPLETED ? 100 : 0;
    intervention.preInterventionScore = payload.preInterventionScore ?? null;
    intervention.sentAt = intervention.status === InterventionStatus.ACTIVE ? new Date() : null;

    return this.interventionRepository.save(intervention);
  }

  async update(id: string, payload: UpdateInterventionDto) {
    const intervention = await this.interventionRepository.findOne({ where: { id } });
    if (!intervention) {
      throw new NotFoundException('Intervention not found');
    }

    if (payload.status !== undefined) {
      intervention.status = payload.status;
      if (payload.status === InterventionStatus.ACTIVE && !intervention.sentAt) {
        intervention.sentAt = new Date();
      }
      if (payload.status === InterventionStatus.COMPLETED) {
        intervention.completedAt = new Date();
        intervention.progress = 100;
      }
    }

    if (payload.progress !== undefined) {
      intervention.progress = Math.max(0, Math.min(payload.progress, 100));
    }

    if (payload.dueDate !== undefined) {
      intervention.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
    }

    if (payload.outcomeNotes !== undefined) {
      intervention.outcomeNotes = payload.outcomeNotes;
    }

    if (payload.postInterventionScore !== undefined) {
      intervention.postInterventionScore = payload.postInterventionScore;
    }

    if (payload.errorMessage !== undefined) {
      intervention.errorMessage = payload.errorMessage;
    }

    return this.interventionRepository.save(intervention);
  }

  async close(id: string, outcomeNotes?: string, postInterventionScore?: number) {
    return this.update(id, {
      status: InterventionStatus.COMPLETED,
      outcomeNotes,
      postInterventionScore,
      progress: 100,
    });
  }

  async summary() {
    const rows = await this.interventionRepository.find();
    const total = rows.length;
    const pending = rows.filter((row) => row.status === InterventionStatus.PENDING).length;
    const active = rows.filter((row) => row.status === InterventionStatus.ACTIVE).length;
    const completed = rows.filter((row) => row.status === InterventionStatus.COMPLETED).length;
    const failed = rows.filter((row) => row.status === InterventionStatus.FAILED).length;

    const scored = rows.filter((row) => row.preInterventionScore !== null && row.postInterventionScore !== null);
    const avgImprovement =
      scored.length > 0
        ? Number(
            (
              scored.reduce(
                (sum, row) =>
                  sum + (Number(row.postInterventionScore) - Number(row.preInterventionScore)),
                0,
              ) / scored.length
            ).toFixed(2),
          )
        : 0;

    return {
      total,
      pending,
      active,
      completed,
      failed,
      successRate: total > 0 ? Number(((completed / total) * 100).toFixed(2)) : 0,
      avgImprovement,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities';

export interface AuditLogEntry {
  userId?: string;
  userEmail?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  status?: string;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(entry: AuditLogEntry): Promise<void> {
    const record = this.repo.create({ status: 'success', ...entry });
    await this.repo.save(record);
  }

  async findAll(limit = 100) {
    return this.repo.find({ order: { createdAt: 'DESC' }, take: limit });
  }

  async findByUser(userId: string, limit = 50) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' }, take: limit });
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RiskRule } from '../entities/risk-rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(RiskRule)
    private readonly ruleRepository: Repository<RiskRule>,
  ) {}

  findAll() {
    return this.ruleRepository.find({ order: { createdAt: 'DESC' } });
  }

  async create(payload: CreateRuleDto) {
    if (!payload.name || !payload.description || !payload.definition) {
      throw new BadRequestException(
        'name, description, and definition are required',
      );
    }

    const existing = await this.ruleRepository.findOne({
      where: { name: payload.name },
    });
    if (existing) {
      throw new BadRequestException('Rule with this name already exists');
    }

    const created = this.ruleRepository.create({
      name: payload.name,
      description: payload.description,
      severity: payload.severity,
      definition: payload.definition,
      isActive: payload.isActive ?? true,
      version: 1,
    });

    return this.ruleRepository.save(created);
  }

  async update(id: string, payload: UpdateRuleDto) {
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Rule not found');
    }

    if (payload.description !== undefined) {
      rule.description = payload.description;
    }
    if (payload.severity !== undefined) {
      rule.severity = payload.severity;
    }
    if (payload.definition !== undefined) {
      rule.definition = payload.definition;
      rule.version += 1;
    }
    if (payload.isActive !== undefined) {
      rule.isActive = payload.isActive;
    }

    return this.ruleRepository.save(rule);
  }

  async setActive(id: string, isActive: boolean) {
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Rule not found');
    }

    rule.isActive = isActive;
    return this.ruleRepository.save(rule);
  }
}

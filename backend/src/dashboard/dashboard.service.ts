import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus, Intervention, InterventionStatus, User } from '../entities';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Intervention)
    private readonly interventionRepository: Repository<Intervention>,
  ) {}

  async getMetrics() {
    const totalEmployees = await this.userRepository.count({
      where: { isActive: true },
    });
    const atRiskCount = await this.enrollmentRepository.count({
      where: { status: EnrollmentStatus.FAILED },
    });
    const activeInterventions = await this.interventionRepository.count({
      where: { status: InterventionStatus.PENDING },
    });
    const completedEnrollments = await this.enrollmentRepository.count({
      where: { status: EnrollmentStatus.COMPLETED },
    });
    const totalEnrollments = await this.enrollmentRepository.count();
    const complianceRate =
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0;

    return {
      totalEmployees,
      atRiskCount,
      activeInterventions,
      complianceRate,
    };
  }
}

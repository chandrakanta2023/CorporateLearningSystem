import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Enrollment } from '../entities/enrollment.entity';
import { Intervention } from '../entities/intervention.entity';
import { ComplianceReport } from '../entities/compliance-report.entity';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Intervention)
    private readonly interventionRepository: Repository<Intervention>,
    @InjectRepository(ComplianceReport)
    private readonly complianceReportRepository: Repository<ComplianceReport>,
  ) {}

  async generateSummaryReport(reportType = 'monthly') {
    const [users, enrollments, interventions] = await Promise.all([
      this.userRepository.find({ where: { isActive: true } }),
      this.enrollmentRepository.find(),
      this.interventionRepository.find(),
    ]);

    const userEnrollmentMap = new Map<string, Enrollment[]>();
    for (const enrollment of enrollments) {
      const rows = userEnrollmentMap.get(enrollment.userId) ?? [];
      rows.push(enrollment);
      userEnrollmentMap.set(enrollment.userId, rows);
    }

    const compliantUsers = users.filter((user) => {
      const rows = userEnrollmentMap.get(user.id) ?? [];
      if (rows.length === 0) {
        return true;
      }
      return rows.every((row) => row.status === 'completed');
    }).length;

    const totalEmployees = users.length;
    const complianceRate = totalEmployees > 0 ? (compliantUsers / totalEmployees) * 100 : 0;

    const activeInterventions = interventions.filter(
      (item) => item.status === 'pending' || item.status === 'active',
    ).length;

    const report = this.complianceReportRepository.create({
      reportType,
      status: 'generated',
      totalEmployees,
      compliantEmployees: compliantUsers,
      complianceRate: Number(complianceRate.toFixed(2)),
      activeInterventions,
      metadata: {
        totalEnrollments: enrollments.length,
        completedEnrollments: enrollments.filter((row) => row.status === 'completed').length,
      },
    });

    const saved = await this.complianceReportRepository.save(report);

    return {
      id: saved.id,
      reportType: saved.reportType,
      generatedAt: saved.generatedAt,
      totalEmployees,
      compliantEmployees: compliantUsers,
      complianceRate: Number(complianceRate.toFixed(2)),
      activeInterventions,
      nonCompliantEmployees: Math.max(0, totalEmployees - compliantUsers),
    };
  }

  async getLatestReports(limit = 20) {
    return this.complianceReportRepository.find({
      order: { generatedAt: 'DESC' },
      take: Math.max(1, Math.min(limit, 100)),
    });
  }

  async exportLatestCsv() {
    const latest = await this.complianceReportRepository.findOne({
      order: { generatedAt: 'DESC' },
    });

    if (!latest) {
      return 'reportId,generatedAt,reportType,totalEmployees,compliantEmployees,complianceRate,activeInterventions\n';
    }

    const header =
      'reportId,generatedAt,reportType,totalEmployees,compliantEmployees,complianceRate,activeInterventions\n';
    const row = [
      latest.id,
      latest.generatedAt.toISOString(),
      latest.reportType,
      latest.totalEmployees,
      latest.compliantEmployees,
      latest.complianceRate,
      latest.activeInterventions,
    ].join(',');

    return `${header}${row}\n`;
  }
}

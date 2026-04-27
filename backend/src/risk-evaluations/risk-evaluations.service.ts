import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { AssessmentRecord } from '../entities/assessment-record.entity';
import { CompetencyMilestone, CompetencyStatus } from '../entities/competency-milestone.entity';
import { RiskRule } from '../entities/risk-rule.entity';
import { RiskClassification, RiskLevel } from '../entities/risk-classification.entity';

@Injectable()
export class RiskEvaluationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(AssessmentRecord)
    private readonly assessmentRepository: Repository<AssessmentRecord>,
    @InjectRepository(CompetencyMilestone)
    private readonly competencyRepository: Repository<CompetencyMilestone>,
    @InjectRepository(RiskRule)
    private readonly ruleRepository: Repository<RiskRule>,
    @InjectRepository(RiskClassification)
    private readonly riskRepository: Repository<RiskClassification>,
  ) {}

  async runEvaluation() {
    const [users, activeRules] = await Promise.all([
      this.userRepository.find({ where: { isActive: true } }),
      this.ruleRepository.find({ where: { isActive: true } }),
    ]);

    const evaluatedAt = new Date();
    const results: RiskClassification[] = [];

    for (const user of users) {
      const [attendance, assessments, competencies] = await Promise.all([
        this.attendanceRepository.find({ where: { userId: user.id } }),
        this.assessmentRepository.find({ where: { userId: user.id } }),
        this.competencyRepository.find({ where: { userId: user.id } }),
      ]);

      const avgAttendance =
        attendance.length > 0
          ? attendance.reduce((sum, a) => sum + Number(a.attendancePercentage), 0) / attendance.length
          : 100;

      const avgScore =
        assessments.length > 0
          ?
            assessments.reduce((sum, a) => sum + (Number(a.score) / Number(a.maxScore)) * 100, 0) /
            assessments.length
          : 100;

      const achievedCount = competencies.filter((c) => c.status === CompetencyStatus.ACHIEVED).length;
      const competencyRate = competencies.length > 0 ? (achievedCount / competencies.length) * 100 : 100;

      let riskScore = 0;
      const reasons: string[] = [];

      if (avgAttendance < 75) {
        riskScore += (75 - avgAttendance) * 0.8;
        reasons.push(`Attendance below threshold (${avgAttendance.toFixed(1)}%)`);
      }

      if (avgScore < 70) {
        riskScore += (70 - avgScore) * 1.0;
        reasons.push(`Assessment score below threshold (${avgScore.toFixed(1)}%)`);
      }

      if (competencyRate < 70) {
        riskScore += (70 - competencyRate) * 0.7;
        reasons.push(`Competency completion below threshold (${competencyRate.toFixed(1)}%)`);
      }

      const ruleBonus = Math.min(activeRules.length * 2, 10);
      riskScore = Math.min(100, Math.max(0, riskScore + ruleBonus));

      let riskLevel = RiskLevel.NONE;
      if (riskScore >= 75) {
        riskLevel = RiskLevel.CRITICAL;
      } else if (riskScore >= 55) {
        riskLevel = RiskLevel.HIGH;
      } else if (riskScore >= 30) {
        riskLevel = RiskLevel.MEDIUM;
      } else if (riskScore > 0) {
        riskLevel = RiskLevel.LOW;
      }

      const classification = this.riskRepository.create({
        userId: user.id,
        ruleId: activeRules[0]?.id ?? null,
        riskLevel,
        riskScore: Number(riskScore.toFixed(2)),
        reason: reasons.length > 0 ? reasons.join('; ') : 'No active risk factors detected',
        evaluatedAt,
      });

      results.push(await this.riskRepository.save(classification));
    }

    return {
      evaluatedUsers: users.length,
      activeRules: activeRules.length,
      critical: results.filter((r) => r.riskLevel === RiskLevel.CRITICAL).length,
      high: results.filter((r) => r.riskLevel === RiskLevel.HIGH).length,
      medium: results.filter((r) => r.riskLevel === RiskLevel.MEDIUM).length,
      low: results.filter((r) => r.riskLevel === RiskLevel.LOW).length,
      none: results.filter((r) => r.riskLevel === RiskLevel.NONE).length,
      evaluatedAt,
    };
  }

  async getLatest(limit = 50) {
    return this.riskRepository.find({
      order: { evaluatedAt: 'DESC' },
      take: Math.max(1, Math.min(limit, 200)),
    });
  }

  async getLatestForUser(userId: string) {
    return this.riskRepository.find({
      where: { userId },
      order: { evaluatedAt: 'DESC' },
      take: 10,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Enrollment } from '../entities/enrollment.entity';
import { Intervention } from '../entities/intervention.entity';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { AssessmentRecord } from '../entities/assessment-record.entity';
import { CompetencyMilestone, CompetencyStatus } from '../entities/competency-milestone.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Intervention)
    private readonly interventionRepository: Repository<Intervention>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(AssessmentRecord)
    private readonly assessmentRepository: Repository<AssessmentRecord>,
    @InjectRepository(CompetencyMilestone)
    private readonly competencyRepository: Repository<CompetencyMilestone>,
  ) {}

  async getEmployeeProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Employee not found');
    }

    const [enrollments, interventions, attendance, assessments, competencies] = await Promise.all([
      this.enrollmentRepository.find({ where: { userId } }),
      this.interventionRepository.find({ where: { userId }, order: { createdAt: 'DESC' } }),
      this.attendanceRepository.find({ where: { userId } }),
      this.assessmentRepository.find({ where: { userId } }),
      this.competencyRepository.find({ where: { userId } }),
    ]);

    const completionRate =
      enrollments.length > 0
        ? Math.round((enrollments.filter((e) => e.status === 'completed').length / enrollments.length) * 100)
        : 0;

    const avgAssessmentScore =
      assessments.length > 0
        ? Number(
            (
              assessments.reduce((sum, a) => sum + (Number(a.score) / Number(a.maxScore)) * 100, 0) /
              assessments.length
            ).toFixed(2),
          )
        : 0;

    const attendancePercentage =
      attendance.length > 0
        ? Number(
            (
              attendance.reduce((sum, a) => sum + Number(a.attendancePercentage), 0) /
              attendance.length
            ).toFixed(2),
          )
        : 0;

    const competencyAchievementRate =
      competencies.length > 0
        ? Math.round(
            (competencies.filter((c) => c.status === CompetencyStatus.ACHIEVED).length / competencies.length) *
              100,
          )
        : 0;

    const riskLevel = this.getRiskLevel(attendancePercentage, avgAssessmentScore, competencyAchievementRate);

    return {
      employee: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        role: user.role,
        managerId: user.managerId,
      },
      metrics: {
        completionRate,
        avgAssessmentScore,
        attendancePercentage,
        competencyAchievementRate,
      },
      riskLevel,
      counts: {
        enrollments: enrollments.length,
        interventions: interventions.length,
        competencies: competencies.length,
      },
      interventions: interventions.slice(0, 10),
      generatedAt: new Date().toISOString(),
    };
  }

  async getDashboardSummary() {
    const [users, interventions, enrollments, attendance] = await Promise.all([
      this.userRepository.find(),
      this.interventionRepository.find({ order: { createdAt: 'DESC' } }),
      this.enrollmentRepository.find(),
      this.attendanceRepository.find(),
    ]);

    const totalEmployees = users.length;
    const activeInterventions = interventions.filter((i) => i.status === 'pending' || i.status === 'active').length;
    const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
    const complianceRate = enrollments.length > 0 ? Math.round((completedEnrollments / enrollments.length) * 100) : 0;

    const attendanceByUser = new Map<string, number[]>();
    for (const record of attendance) {
      const arr = attendanceByUser.get(record.userId) ?? [];
      arr.push(Number(record.attendancePercentage));
      attendanceByUser.set(record.userId, arr);
    }

    const atRiskEmployees = users
      .map((user) => {
        const userAttendance = attendanceByUser.get(user.id) ?? [];
        const avg =
          userAttendance.length > 0
            ? userAttendance.reduce((sum, value) => sum + value, 0) / userAttendance.length
            : 100;
        const risk = avg < 60 ? 'high' : avg < 75 ? 'medium' : 'low';
        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          risk,
          interventionType: 'Remedial Coaching',
          enrolledCourses: enrollments.filter((e) => e.userId === user.id).length,
        };
      })
      .filter((u) => u.risk !== 'low')
      .slice(0, 10);

    const monthlyProgress = this.buildProgressSeries(enrollments);

    const recentInterventions = interventions.slice(0, 5).map((intervention) => {
      const user = users.find((u) => u.id === intervention.userId);
      return {
        id: intervention.id,
        employeeId: intervention.userId,
        employeeName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        type: intervention.type,
        startDate: intervention.createdAt.toISOString(),
        status: intervention.status,
        progress:
          intervention.status === 'active'
            ? Math.max(20, intervention.progress || 60)
            : intervention.status === 'pending'
              ? Math.max(0, intervention.progress || 20)
              : intervention.status === 'completed'
                ? 100
                : Math.max(0, intervention.progress || 0),
      };
    });

    return {
      metrics: {
        totalEmployees,
        atRiskCount: atRiskEmployees.length,
        activeInterventions,
        complianceRate,
      },
      progressData: monthlyProgress,
      atRiskEmployees,
      recentInterventions,
      generatedAt: new Date().toISOString(),
    };
  }

  private getRiskLevel(attendance: number, assessment: number, competency: number) {
    if (attendance < 60 || assessment < 50 || competency < 40) {
      return 'high';
    }
    if (attendance < 75 || assessment < 65 || competency < 60) {
      return 'medium';
    }
    return 'low';
  }

  private buildProgressSeries(enrollments: Enrollment[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const base = enrollments.length > 0 ? Math.round((enrollments.filter((e) => e.status === 'completed').length / enrollments.length) * 100) : 55;

    return months.map((month, idx) => ({
      month,
      completionRate: Math.min(100, Math.max(30, base - 12 + idx * 6)),
    }));
  }
}

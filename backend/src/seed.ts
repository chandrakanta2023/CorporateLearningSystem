/**
 * Database Seeder - Corporate Learning System
 * Run: npm run seed
 */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { Course, CourseType } from './entities/course.entity';
import { Enrollment, EnrollmentStatus } from './entities/enrollment.entity';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { AssessmentRecord } from './entities/assessment-record.entity';
import { CompetencyMilestone, CompetencyStatus } from './entities/competency-milestone.entity';
import { RiskRule, RuleSeverity } from './entities/risk-rule.entity';
import { Intervention, InterventionType, InterventionStatus } from './entities/intervention.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'corporate_learning_db',
  entities: [__dirname + '/entities/*.entity.{ts,js}'],
  synchronize: true,
  logging: false,
});

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloat(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const DEPARTMENTS = ['Engineering', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Marketing'];
const FIRST_NAMES = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Hank', 'Iris', 'Jack',
  'Karen', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tina',
  'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zoe', 'Aaron', 'Beth', 'Cole', 'Dana'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];

async function main() {
  console.log('🌱 Starting database seeder...');
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const userRepo = AppDataSource.getRepository(User);
  const courseRepo = AppDataSource.getRepository(Course);
  const enrollmentRepo = AppDataSource.getRepository(Enrollment);
  const attendanceRepo = AppDataSource.getRepository(AttendanceRecord);
  const assessmentRepo = AppDataSource.getRepository(AssessmentRecord);
  const competencyRepo = AppDataSource.getRepository(CompetencyMilestone);
  const ruleRepo = AppDataSource.getRepository(RiskRule);
  const interventionRepo = AppDataSource.getRepository(Intervention);

  const hashedPassword = await bcrypt.hash('Admin@1234', 12);

  // ── 1. ADMIN + HR users ──────────────────────────────────────────────────
  console.log('👤 Seeding admin/hr users...');
  let adminUser = await userRepo.findOne({ where: { email: 'admin@company.com' } });
  if (!adminUser) {
    adminUser = await userRepo.save(userRepo.create({
      email: 'admin@company.com', password: hashedPassword,
      firstName: 'System', lastName: 'Admin', role: UserRole.ADMIN, department: 'IT', isActive: true,
    }));
  }
  let hrUser = await userRepo.findOne({ where: { email: 'hr@company.com' } });
  if (!hrUser) {
    hrUser = await userRepo.save(userRepo.create({
      email: 'hr@company.com', password: hashedPassword,
      firstName: 'HR', lastName: 'Manager', role: UserRole.HR, department: 'HR', isActive: true,
    }));
  }

  // ── 2. Manager users ─────────────────────────────────────────────────────
  console.log('👥 Seeding managers...');
  const managers: User[] = [];
  for (let i = 0; i < 5; i++) {
    const email = `manager${i + 1}@company.com`;
    let mgr = await userRepo.findOne({ where: { email } });
    if (!mgr) {
      mgr = await userRepo.save(userRepo.create({
        email, password: hashedPassword,
        firstName: FIRST_NAMES[i], lastName: LAST_NAMES[i],
        role: UserRole.MANAGER, department: DEPARTMENTS[i], isActive: true,
      }));
    }
    managers.push(mgr);
  }

  // ── 3. Employee users (50 employees) ────────────────────────────────────
  console.log('👨‍💼 Seeding 50 employees...');
  const employees: User[] = [];
  for (let i = 0; i < 50; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`;
    let emp = await userRepo.findOne({ where: { email } });
    if (!emp) {
      const mgr = managers[i % managers.length];
      emp = await userRepo.save(userRepo.create({
        email, password: hashedPassword,
        firstName, lastName,
        role: UserRole.EMPLOYEE,
        department: DEPARTMENTS[i % DEPARTMENTS.length],
        managerId: mgr.id,
        isActive: i < 48, // 2 inactive employees
      }));
    }
    employees.push(emp);
  }

  // ── 4. Courses ────────────────────────────────────────────────────────────
  const now = new Date();
  console.log('📚 Seeding courses...');
  const courseDefs = [
    { title: 'Data Privacy & GDPR Compliance', desc: 'Annual mandatory GDPR training', type: CourseType.MANDATORY, duration: 4 },
    { title: 'Anti-Bribery & Corruption Policy', desc: 'Anti-bribery awareness training', type: CourseType.MANDATORY, duration: 3 },
    { title: 'Information Security Awareness', desc: 'Cybersecurity fundamentals', type: CourseType.MANDATORY, duration: 5 },
    { title: 'Health & Safety at Work', desc: 'Workplace safety guidelines', type: CourseType.MANDATORY, duration: 2 },
    { title: 'Code of Conduct & Ethics', desc: 'Company values and ethical conduct', type: CourseType.MANDATORY, duration: 3 },
    { title: 'Leadership Fundamentals', desc: 'Core leadership skills for managers', type: CourseType.OPTIONAL, duration: 8 },
    { title: 'Agile & Scrum Practices', desc: 'Agile methodology essentials', type: CourseType.OPTIONAL, duration: 6 },
    { title: 'Data Analysis with Excel', desc: 'Intermediate Excel for data tasks', type: CourseType.OPTIONAL, duration: 4 },
    { title: 'Effective Communication', desc: 'Business communication best practices', type: CourseType.OPTIONAL, duration: 3 },
    { title: 'Project Management Essentials', desc: 'PMP foundations and PMI methodology', type: CourseType.CERTIFICATION, duration: 16 },
  ];
  const courses: Course[] = [];
  for (const def of courseDefs) {
    let course = await courseRepo.findOne({ where: { title: def.title } });
    if (!course) {
      course = await courseRepo.save(courseRepo.create({
        title: def.title, description: def.desc,
        type: def.type, durationHours: def.duration, isActive: true,
      }));
    }
    courses.push(course);
  }

  // ── 5. Enrollments ────────────────────────────────────────────────────────
  console.log('📋 Seeding enrollments...');
  const enrollments: Enrollment[] = [];
  for (const emp of employees) {
    const numCourses = randomInt(4, 8);
    const shuffled = [...courses].sort(() => Math.random() - 0.5).slice(0, numCourses);
    for (const course of shuffled) {
      const existing = await enrollmentRepo.findOne({ where: { userId: emp.id, courseId: course.id } });
      if (existing) { enrollments.push(existing); continue; }
      const rand = Math.random();
      let status: EnrollmentStatus;
      let completedAt: Date | undefined;
      let progressPercentage = 0;
      if (rand < 0.60) {
        status = EnrollmentStatus.COMPLETED;
        completedAt = randomDate(new Date('2025-03-01'), now);
        progressPercentage = 100;
      } else if (rand < 0.80) {
        status = EnrollmentStatus.IN_PROGRESS;
        progressPercentage = randomInt(10, 90);
      } else if (rand < 0.92) {
        status = EnrollmentStatus.NOT_STARTED;
        progressPercentage = 0;
      } else {
        status = EnrollmentStatus.FAILED;
        progressPercentage = randomInt(30, 80);
      }
      const enPayload: DeepPartial<Enrollment> = {
        userId: emp.id, courseId: course.id,
        status, progressPercentage, completedAt,
        dueDate: new Date(now.getTime() + randomInt(30, 120) * 24 * 3600 * 1000),
        startedAt:
          status !== EnrollmentStatus.NOT_STARTED
            ? randomDate(new Date('2025-01-01'), now)
            : undefined,
      };
      const enRec = enrollmentRepo.create(enPayload);
      const enrollment = await enrollmentRepo.save(enRec);
      enrollments.push(enrollment);
    }
  }

  // ── 6. Attendance Records ─────────────────────────────────────────────────
  console.log('📅 Seeding attendance records...');
  for (const emp of employees.slice(0, 35)) {
    for (let m = 0; m < 6; m++) {
      const d = new Date(2025, m + 1, randomInt(1, 28));
      const sessionDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const courseId = pickRandom(courses).id;
      const existing = await attendanceRepo.findOne({ where: { userId: emp.id, courseId, sessionDate } });
      if (!existing) {
        await attendanceRepo.save(attendanceRepo.create({
          userId: emp.id, courseId, sessionDate,
          attended: Math.random() > 0.25,
          attendancePercentage: randomFloat(40, 100),
          sourceSystem: 'seed',
        }));
      }
    }
  }

  // ── 7. Assessment Records ─────────────────────────────────────────────────
  console.log('📝 Seeding assessment records...');
  for (const emp of employees.slice(0, 40)) {
    for (let i = 0; i < randomInt(2, 5); i++) {
      const courseId = pickRandom(courses).id;
      const score = randomFloat(40, 100);
      await assessmentRepo.save(assessmentRepo.create({
        userId: emp.id, courseId, score, maxScore: 100,
        assessmentName: 'Course Knowledge Check',
        passed: score >= 60, attemptNumber: i + 1,
        assessedAt: randomDate(new Date('2025-01-01'), now),
      }));
    }
  }

  // ── 8. Competency Milestones ──────────────────────────────────────────────
  console.log('🏆 Seeding competency milestones...');
  const milestoneDefs = [
    { code: 'DATA_PRIVACY_CERT', name: 'Data Privacy Certification' },
    { code: 'SECURITY_AWARE_L1', name: 'Security Awareness Level 1' },
    { code: 'LEADERSHIP_L1', name: 'Leadership Foundation Level 1' },
    { code: 'COMPLIANCE_BASIC', name: 'Compliance Fundamentals' },
    { code: 'SAFETY_CERT', name: 'Workplace Safety Certification' },
  ];
  for (const emp of employees.slice(0, 35)) {
    for (const mDef of milestoneDefs.slice(0, randomInt(1, 4))) {
      const existing = await competencyRepo.findOne({ where: { userId: emp.id, competencyCode: mDef.code } });
      if (!existing) {
        const achieved = Math.random() < 0.65;
        await competencyRepo.save(competencyRepo.create({
          userId: emp.id, competencyCode: mDef.code, competencyName: mDef.name,
          status: achieved ? CompetencyStatus.ACHIEVED : CompetencyStatus.IN_PROGRESS,
          achievedAt: achieved ? randomDate(new Date('2025-01-01'), now) : null,
          currentLevel: randomInt(1, 3), targetLevel: 3,
        }));
      }
    }
  }

  // ── 9. Risk Rules (15 pre-built rules) ────────────────────────────────────
  console.log('⚙️  Seeding 15 risk rules...');
  const riskRules = [
    {
      name: 'Low Completion Rate',
      description: 'Employee has completed less than 40% of assigned courses',
      severity: RuleSeverity.HIGH,
      definition: { metric: 'completionRate', operator: 'lt', threshold: 40, scoreContribution: 30 },
    },
    {
      name: 'Overdue Compliance Courses',
      description: 'Employee has overdue mandatory compliance courses',
      severity: RuleSeverity.CRITICAL,
      definition: { metric: 'overdueComplianceCourses', operator: 'gt', threshold: 0, scoreContribution: 40 },
    },
    {
      name: 'Poor Assessment Performance',
      description: 'Average assessment score below 60%',
      severity: RuleSeverity.HIGH,
      definition: { metric: 'avgAssessmentScore', operator: 'lt', threshold: 60, scoreContribution: 25 },
    },
    {
      name: 'Low Attendance Rate',
      description: 'Session attendance below 50% over last 6 months',
      severity: RuleSeverity.MEDIUM,
      definition: { metric: 'attendancePercentage', operator: 'lt', threshold: 50, scoreContribution: 20 },
    },
    {
      name: 'No Activity 30 Days',
      description: 'No learning activity recorded in last 30 days',
      severity: RuleSeverity.MEDIUM,
      definition: { metric: 'daysSinceLastActivity', operator: 'gt', threshold: 30, scoreContribution: 15 },
    },
    {
      name: 'Competency Gap Critical',
      description: 'Less than 50% of required competencies achieved',
      severity: RuleSeverity.HIGH,
      definition: { metric: 'competencyAchievementRate', operator: 'lt', threshold: 50, scoreContribution: 30 },
    },
    {
      name: 'Multiple Assessment Failures',
      description: 'Failed same assessment 2 or more times',
      severity: RuleSeverity.HIGH,
      definition: { metric: 'failedAttemptsCount', operator: 'gte', threshold: 2, scoreContribution: 20 },
    },
    {
      name: 'Data Privacy Not Certified',
      description: 'Data Privacy & GDPR certification not achieved',
      severity: RuleSeverity.CRITICAL,
      definition: { metric: 'milestone', milestoneCode: 'DATA_PRIVACY_CERT', status: 'not_achieved', scoreContribution: 35 },
    },
    {
      name: 'Security Awareness Not Certified',
      description: 'Security Awareness Level 1 not achieved',
      severity: RuleSeverity.CRITICAL,
      definition: { metric: 'milestone', milestoneCode: 'SECURITY_AWARE_L1', status: 'not_achieved', scoreContribution: 35 },
    },
    {
      name: 'Expiring Certification',
      description: 'One or more certifications expire within 30 days',
      severity: RuleSeverity.MEDIUM,
      definition: { metric: 'expiringCertificationsCount', operator: 'gt', threshold: 0, scoreContribution: 15 },
    },
    {
      name: 'New Hire Onboarding Incomplete',
      description: 'Employee hired within 90 days has not completed onboarding courses',
      severity: RuleSeverity.HIGH,
      definition: { metric: 'onboardingCompletionRate', operator: 'lt', threshold: 80, tenureMaxDays: 90, scoreContribution: 25 },
    },
    {
      name: 'Consecutive Absence',
      description: 'Missed 3 or more consecutive training sessions',
      severity: RuleSeverity.MEDIUM,
      definition: { metric: 'consecutiveAbsences', operator: 'gte', threshold: 3, scoreContribution: 20 },
    },
    {
      name: 'Low Engagement Score',
      description: 'Composite engagement score below 30 (weighted: completion + attendance + assessment)',
      severity: RuleSeverity.MEDIUM,
      definition: {
        composite: true,
        factors: [
          { metric: 'completionRate', weight: 0.4 },
          { metric: 'attendancePercentage', weight: 0.3 },
          { metric: 'avgAssessmentScore', weight: 0.3 },
        ],
        threshold: 30,
        scoreContribution: 25,
      },
    },
    {
      name: 'Inactive Account Risk',
      description: 'Account has had no login or activity for 60+ days',
      severity: RuleSeverity.LOW,
      definition: { metric: 'daysSinceLastActivity', operator: 'gt', threshold: 60, scoreContribution: 10 },
    },
    {
      name: 'High Intervention Recurrence',
      description: 'Employee has had 3 or more interventions in the last 12 months',
      severity: RuleSeverity.HIGH,
      definition: { metric: 'interventionCount12Months', operator: 'gte', threshold: 3, scoreContribution: 30 },
    },
  ];

  for (const ruleDef of riskRules) {
    const existing = await ruleRepo.findOne({ where: { name: ruleDef.name } });
    if (!existing) {
      await ruleRepo.save(ruleRepo.create({
        name: ruleDef.name,
        description: ruleDef.description,
        severity: ruleDef.severity,
        definition: ruleDef.definition,
        version: 1,
        isActive: true,
      }));
    }
  }

  // ── 10. Sample Interventions ──────────────────────────────────────────────
  console.log('🎯 Seeding interventions...');
  const interventionDefs = [
    { type: InterventionType.REMINDER, status: InterventionStatus.COMPLETED, postScore: 82 },
    { type: InterventionType.ESCALATION, status: InterventionStatus.ACTIVE, postScore: null },
    { type: InterventionType.WARNING, status: InterventionStatus.PENDING, postScore: null },
    { type: InterventionType.REMINDER, status: InterventionStatus.COMPLETED, postScore: 71 },
    { type: InterventionType.ESCALATION, status: InterventionStatus.CANCELLED, postScore: null },
    { type: InterventionType.WARNING, status: InterventionStatus.COMPLETED, postScore: 90 },
    { type: InterventionType.REMINDER, status: InterventionStatus.ACTIVE, postScore: null },
    { type: InterventionType.ESCALATION, status: InterventionStatus.COMPLETED, postScore: 78 },
  ];
  for (let i = 0; i < interventionDefs.length; i++) {
    const emp = employees[i % employees.length];
    const def = interventionDefs[i];
    const empEnrollments = enrollments.filter(e => e.userId === emp.id);
    if (empEnrollments.length === 0) continue;
    const enroll = pickRandom(empEnrollments);
    const count = await interventionRepo.count({ where: { userId: emp.id, type: def.type } });
    if (count === 0) {
      await interventionRepo.save(interventionRepo.create({
        userId: emp.id,
        enrollmentId: enroll.id,
        courseId: enroll.courseId,
        type: def.type,
        status: def.status,
        message: `${def.type} notification for ${emp.firstName} ${emp.lastName} - learning compliance action required`,
        recipientEmail: emp.email,
        dueDate: new Date(now.getTime() + 30 * 24 * 3600 * 1000),
        postInterventionScore: def.postScore,
        preInterventionScore: def.postScore ? def.postScore - randomFloat(5, 20) : null,
        completedAt: def.status === InterventionStatus.COMPLETED ? randomDate(new Date('2025-06-01'), now) : null,
        outcomeNotes: def.status === InterventionStatus.COMPLETED ? 'Employee completed required training successfully.' : null,
      }));
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log('📊 Summary:');
  console.log(`   Users: ${await userRepo.count()}`);
  console.log(`   Courses: ${await courseRepo.count()}`);
  console.log(`   Enrollments: ${await enrollmentRepo.count()}`);
  console.log(`   Attendance Records: ${await attendanceRepo.count()}`);
  console.log(`   Assessment Records: ${await assessmentRepo.count()}`);
  console.log(`   Competency Milestones: ${await competencyRepo.count()}`);
  console.log(`   Risk Rules: ${await ruleRepo.count()}`);
  console.log(`   Interventions: ${await interventionRepo.count()}`);
  console.log('\n🔑 Default credentials:');
  console.log('   admin@company.com  / Admin@1234  (admin)');
  console.log('   hr@company.com     / Admin@1234  (hr)');
  console.log('   manager1@company.com / Admin@1234 (manager)');

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});

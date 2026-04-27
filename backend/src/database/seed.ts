import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { DataSource, In } from 'typeorm';
import {
  Course,
  CourseType,
  Enrollment,
  EnrollmentStatus,
  Intervention,
  InterventionStatus,
  InterventionType,
  User,
  UserRole,
} from '../entities';

config();

const dataSource = new DataSource({
  ...(process.env.DB_TYPE === 'sqljs'
    ? {
        type: 'sqljs' as const,
        autoSave: true,
        location: process.env.DB_SQLJS_PATH || '.data/dev.sqlite',
      }
    : {
        type: 'postgres' as const,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'corporate_learning_db',
      }),
  entities: [User, Course, Enrollment, Intervention],
  synchronize: true,
});

const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Krishna', 'Ishaan',
  'Rohan', 'Kunal', 'Siddharth', 'Rahul', 'Amit', 'Manish', 'Nikhil', 'Pranav',
  'Yash', 'Dhruv', 'Harsh', 'Aniket', 'Lakshya', 'Tanmay', 'Omkar', 'Mihir',
  'Aanya', 'Diya', 'Anaya', 'Ira', 'Saanvi', 'Myra', 'Anika', 'Kavya',
  'Priya', 'Neha', 'Riya', 'Ishita', 'Sneha', 'Pooja', 'Shreya', 'Aditi',
  'Nisha', 'Meera', 'Anjali', 'Tanya', 'Swati', 'Ritu', 'Nandini', 'Payal',
];

const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Gupta', 'Reddy', 'Nair', 'Menon', 'Iyer',
  'Rao', 'Singh', 'Kumar', 'Joshi', 'Bhat', 'Das', 'Sen', 'Chatterjee',
  'Mukherjee', 'Banerjee', 'Kapoor', 'Malhotra', 'Arora', 'Jain', 'Agarwal',
  'Saxena', 'Mishra', 'Pandey', 'Yadav', 'Tiwari', 'Kulkarni', 'Deshmukh',
];

const departments = [
  'Engineering',
  'Sales',
  'Marketing',
  'Finance',
  'Human Resources',
  'Operations',
  'Customer Success',
  'Product',
  'Legal',
  'Procurement',
];

const courseSeed: Array<Pick<Course, 'title' | 'description' | 'type' | 'durationHours' | 'department'>> = [
  {
    title: 'Cybersecurity Basics',
    description: 'Mandatory annual security awareness program',
    type: CourseType.MANDATORY,
    durationHours: 4,
    department: 'All',
  },
  {
    title: 'POSH Awareness and Compliance',
    description: 'Workplace conduct and POSH compliance essentials',
    type: CourseType.MANDATORY,
    durationHours: 3,
    department: 'All',
  },
  {
    title: 'Data Privacy and DPDPA Readiness',
    description: 'Data privacy principles and policy compliance in India',
    type: CourseType.MANDATORY,
    durationHours: 3,
    department: 'All',
  },
  {
    title: 'Advanced Excel for Business Reporting',
    description: 'Practical Excel techniques for dashboards and reporting',
    type: CourseType.OPTIONAL,
    durationHours: 6,
    department: 'Finance',
  },
  {
    title: 'Enterprise Sales Negotiation',
    description: 'Negotiation playbooks for enterprise and strategic deals',
    type: CourseType.CERTIFICATION,
    durationHours: 8,
    department: 'Sales',
  },
  {
    title: 'Leadership Essentials for First-time Managers',
    description: 'Coaching, delegation, and team leadership fundamentals',
    type: CourseType.CERTIFICATION,
    durationHours: 10,
    department: 'All',
  },
  {
    title: 'Agile Product Delivery Fundamentals',
    description: 'Agile methods, sprint planning, and delivery rhythm',
    type: CourseType.OPTIONAL,
    durationHours: 5,
    department: 'Product',
  },
  {
    title: 'Customer Communication Excellence',
    description: 'Structured communication for support and customer success',
    type: CourseType.OPTIONAL,
    durationHours: 4,
    department: 'Customer Success',
  },
  {
    title: 'Financial Controls and Internal Audit Basics',
    description: 'Core controls, reconciliations, and audit readiness',
    type: CourseType.OPTIONAL,
    durationHours: 5,
    department: 'Finance',
  },
  {
    title: 'Modern Software Engineering Practices',
    description: 'Code quality, testing strategy, and release hygiene',
    type: CourseType.CERTIFICATION,
    durationHours: 12,
    department: 'Engineering',
  },
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function pickManyUnique<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < count && copy.length > 0) {
    const idx = randInt(0, copy.length - 1);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');
}

async function seed() {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const courseRepo = dataSource.getRepository(Course);
  const enrollmentRepo = dataSource.getRepository(Enrollment);
  const interventionRepo = dataSource.getRepository(Intervention);

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Ensure admin exists
  const adminEmail = 'admin@company.com';
  let admin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!admin) {
    admin = userRepo.create({
      email: adminEmail,
      password: passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      department: 'L&D',
      isActive: true,
    });
    await userRepo.save(admin);
  }

  // Upsert courses by title
  const existingCourses = await courseRepo.find({
    where: { title: In(courseSeed.map((c) => c.title)) },
  });
  const existingCourseTitles = new Set(existingCourses.map((c) => c.title));

  const newCourses = courseSeed
    .filter((c) => !existingCourseTitles.has(c.title))
    .map((c) =>
      courseRepo.create({
        ...c,
        isActive: true,
      }),
    );

  if (newCourses.length > 0) {
    await courseRepo.save(newCourses);
  }

  const allCourses = await courseRepo.find();

  // Create Indian managers and employees (idempotent by email)
  const targetManagers = 15;
  const targetEmployees = 220;

  const managerEmails: string[] = [];
  const employeeEmails: string[] = [];

  for (let i = 1; i <= targetManagers; i += 1) {
    const firstName = firstNames[(i - 1) % firstNames.length];
    const lastName = lastNames[(i - 1) % lastNames.length];
    managerEmails.push(`manager.${slugify(firstName)}.${slugify(lastName)}.${i}@company.com`);
  }

  for (let i = 1; i <= targetEmployees; i += 1) {
    const firstName = firstNames[(i + 7) % firstNames.length];
    const lastName = lastNames[(i + 11) % lastNames.length];
    employeeEmails.push(`employee.${slugify(firstName)}.${slugify(lastName)}.${i}@company.com`);
  }

  const existingUsers = await userRepo.find({
    where: { email: In([...managerEmails, ...employeeEmails]) },
  });
  const existingUserEmails = new Set(existingUsers.map((u) => u.email));

  const managersToCreate: User[] = [];
  for (let i = 1; i <= targetManagers; i += 1) {
    const email = managerEmails[i - 1];
    if (existingUserEmails.has(email)) continue;
    const firstName = firstNames[(i - 1) % firstNames.length];
    const lastName = lastNames[(i - 1) % lastNames.length];
    const department = departments[(i - 1) % departments.length];

    managersToCreate.push(
      userRepo.create({
        email,
        password: passwordHash,
        firstName,
        lastName,
        role: UserRole.MANAGER,
        department,
        isActive: true,
      }),
    );
  }

  if (managersToCreate.length > 0) {
    await userRepo.save(managersToCreate);
  }

  const managers = await userRepo.find({ where: { email: In(managerEmails) } });

  const employeesToCreate: User[] = [];
  for (let i = 1; i <= targetEmployees; i += 1) {
    const email = employeeEmails[i - 1];
    if (existingUserEmails.has(email)) continue;

    const firstName = firstNames[(i + 7) % firstNames.length];
    const lastName = lastNames[(i + 11) % lastNames.length];
    const department = departments[(i + 3) % departments.length];
    const manager = managers[(i - 1) % managers.length];

    employeesToCreate.push(
      userRepo.create({
        email,
        password: passwordHash,
        firstName,
        lastName,
        role: UserRole.EMPLOYEE,
        department,
        managerId: manager?.id,
        isActive: true,
      }),
    );
  }

  if (employeesToCreate.length > 0) {
    await userRepo.save(employeesToCreate);
  }

  const employees = await userRepo.find({ where: { email: In(employeeEmails) } });

  // Enroll each employee in 3-5 courses (avoid duplicates)
  const allTargetUsers = [admin, ...managers, ...employees].filter(Boolean) as User[];

  const existingEnrollments = await enrollmentRepo.find({
    where: { userId: In(allTargetUsers.map((u) => u.id)) },
  });
  const enrollmentKey = new Set(existingEnrollments.map((e) => `${e.userId}:${e.courseId}`));

  const enrollmentsToCreate: Enrollment[] = [];

  for (const user of allTargetUsers) {
    const courseCount = randInt(3, Math.min(5, allCourses.length));
    const pickedCourses = pickManyUnique(allCourses, courseCount);

    for (const course of pickedCourses) {
      const key = `${user.id}:${course.id}`;
      if (enrollmentKey.has(key)) continue;

      const roll = randInt(1, 100);
      let status = EnrollmentStatus.NOT_STARTED;
      let progress = 0;

      if (roll <= 40) {
        status = EnrollmentStatus.COMPLETED;
        progress = 100;
      } else if (roll <= 80) {
        status = EnrollmentStatus.IN_PROGRESS;
        progress = randInt(15, 95);
      } else if (roll <= 92) {
        status = EnrollmentStatus.NOT_STARTED;
        progress = 0;
      } else {
        status = EnrollmentStatus.FAILED;
        progress = randInt(20, 60);
      }

      enrollmentsToCreate.push(
        enrollmentRepo.create({
          userId: user.id,
          courseId: course.id,
          status,
          progressPercentage: progress,
          startedAt: status === EnrollmentStatus.NOT_STARTED ? undefined : new Date(),
          completedAt: status === EnrollmentStatus.COMPLETED ? new Date() : undefined,
          dueDate: new Date(Date.now() + randInt(7, 90) * 24 * 60 * 60 * 1000),
          remindersSent: randInt(0, 3),
          lastReminderSentAt: randInt(0, 1) ? new Date() : undefined,
        } as Partial<Enrollment>),
      );
      enrollmentKey.add(key);
    }
  }

  if (enrollmentsToCreate.length > 0) {
    await enrollmentRepo.save(enrollmentsToCreate);
  }

  // Create interventions for failed / in-progress enrollments if missing
  const refreshedEnrollments = await enrollmentRepo.find({
    where: { userId: In(allTargetUsers.map((u) => u.id)) },
  });

  const existingInterventions = await interventionRepo.find({
    where: { userId: In(allTargetUsers.map((u) => u.id)) },
  });
  const interventionKey = new Set(
    existingInterventions.map((i) => `${i.enrollmentId}:${i.type}`),
  );

  const userById = new Map(allTargetUsers.map((u) => [u.id, u]));
  const interventionsToCreate: Intervention[] = [];

  for (const e of refreshedEnrollments) {
    if (
      e.status !== EnrollmentStatus.FAILED &&
      e.status !== EnrollmentStatus.IN_PROGRESS
    ) {
      continue;
    }

    const type =
      e.status === EnrollmentStatus.FAILED
        ? InterventionType.WARNING
        : pickOne([InterventionType.REMINDER, InterventionType.ESCALATION]);

    const key = `${e.id}:${type}`;
    if (interventionKey.has(key)) continue;

    const user = userById.get(e.userId);
    interventionsToCreate.push(
      interventionRepo.create({
        enrollmentId: e.id,
        userId: e.userId,
        courseId: e.courseId,
        type,
        status: pickOne([
          InterventionStatus.PENDING,
          InterventionStatus.PENDING,
          InterventionStatus.SENT,
        ]),
        message:
          type === InterventionType.WARNING
            ? 'Learning progress is below threshold. Immediate completion support required.'
            : 'Friendly reminder: please complete your assigned learning modules on time.',
        recipientEmail: user?.email,
        sentAt: randInt(0, 1) ? new Date() : undefined,
      } as Partial<Intervention>),
    );
    interventionKey.add(key);
  }

  if (interventionsToCreate.length > 0) {
    await interventionRepo.save(interventionsToCreate);
  }

  const counts = {
    users: await userRepo.count(),
    managers: await userRepo.count({ where: { role: UserRole.MANAGER } }),
    employees: await userRepo.count({ where: { role: UserRole.EMPLOYEE } }),
    courses: await courseRepo.count(),
    enrollments: await enrollmentRepo.count(),
    interventions: await interventionRepo.count(),
  };

  await dataSource.destroy();
  // eslint-disable-next-line no-console
  console.log('Bulk seed completed. Login: admin@company.com / Password123!');
  // eslint-disable-next-line no-console
  console.log(counts);
}

seed().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});


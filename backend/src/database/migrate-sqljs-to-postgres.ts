import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Course, Enrollment, Intervention, User } from '../entities';
import { getDbEnv } from './db-config';

config();

const sqljsPath = process.env.DB_SQLJS_PATH || '.data/dev.sqlite';

const source = new DataSource({
  type: 'sqljs',
  location: sqljsPath,
  autoSave: false,
  entities: [User, Course, Enrollment, Intervention],
  synchronize: false,
});

const db = getDbEnv();
const target = new DataSource({
  type: 'postgres',
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  entities: [User, Course, Enrollment, Intervention],
  synchronize: true,
});

async function migrateSqljsToPostgres() {
  await source.initialize();
  await target.initialize();

  const sourceUsers = await source.getRepository(User).find();
  const sourceCourses = await source.getRepository(Course).find();
  const sourceEnrollments = await source.getRepository(Enrollment).find();
  const sourceInterventions = await source.getRepository(Intervention).find();

  const userRepo = target.getRepository(User);
  const courseRepo = target.getRepository(Course);
  const enrollmentRepo = target.getRepository(Enrollment);
  const interventionRepo = target.getRepository(Intervention);

  for (const row of sourceUsers) {
    const existing = await userRepo.findOne({ where: { email: row.email } });
    if (!existing) await userRepo.save(row);
  }

  for (const row of sourceCourses) {
    const existing = await courseRepo.findOne({ where: { title: row.title } });
    if (!existing) await courseRepo.save(row);
  }

  for (const row of sourceEnrollments) {
    const existing = await enrollmentRepo.findOne({
      where: { userId: row.userId, courseId: row.courseId },
    });
    if (!existing) await enrollmentRepo.save(row);
  }

  for (const row of sourceInterventions) {
    const existing = await interventionRepo.findOne({
      where: {
        enrollmentId: row.enrollmentId,
        type: row.type,
        createdAt: row.createdAt,
      },
    });
    if (!existing) await interventionRepo.save(row);
  }

  console.log('Migration completed.');

  console.log({
    users: sourceUsers.length,
    courses: sourceCourses.length,
    enrollments: sourceEnrollments.length,
    interventions: sourceInterventions.length,
  });

  await source.destroy();
  await target.destroy();
}

migrateSqljsToPostgres().catch(async (error) => {
  console.error(error);
  if (source.isInitialized) await source.destroy();
  if (target.isInitialized) await target.destroy();
  process.exit(1);
});

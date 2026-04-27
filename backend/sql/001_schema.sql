CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_role_enum') THEN
    CREATE TYPE "users_role_enum" AS ENUM ('admin', 'manager', 'employee');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'courses_type_enum') THEN
    CREATE TYPE "courses_type_enum" AS ENUM ('mandatory', 'optional', 'certification');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollments_status_enum') THEN
    CREATE TYPE "enrollments_status_enum" AS ENUM ('not_started', 'in_progress', 'completed', 'failed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interventions_type_enum') THEN
    CREATE TYPE "interventions_type_enum" AS ENUM ('reminder', 'escalation', 'warning');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interventions_status_enum') THEN
    CREATE TYPE "interventions_status_enum" AS ENUM ('pending', 'sent', 'failed');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" varchar NOT NULL UNIQUE,
  "password" varchar NOT NULL,
  "firstName" varchar NOT NULL,
  "lastName" varchar NOT NULL,
  "role" "users_role_enum" NOT NULL DEFAULT 'employee',
  "department" varchar NULL,
  "managerId" varchar NULL,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "courses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" varchar NOT NULL,
  "description" text NOT NULL,
  "type" "courses_type_enum" NOT NULL DEFAULT 'optional',
  "durationHours" integer NOT NULL DEFAULT 0,
  "isActive" boolean NOT NULL DEFAULT true,
  "deadline" timestamp NULL,
  "department" varchar NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "enrollments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "courseId" uuid NOT NULL,
  "status" "enrollments_status_enum" NOT NULL DEFAULT 'not_started',
  "progressPercentage" integer NOT NULL DEFAULT 0,
  "startedAt" timestamp NULL,
  "completedAt" timestamp NULL,
  "dueDate" timestamp NULL,
  "remindersSent" integer NOT NULL DEFAULT 0,
  "lastReminderSentAt" timestamp NULL,
  "enrolledAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "fk_enrollments_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_enrollments_course" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "interventions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "enrollmentId" varchar NOT NULL,
  "userId" varchar NOT NULL,
  "courseId" varchar NOT NULL,
  "type" "interventions_type_enum" NOT NULL DEFAULT 'reminder',
  "status" "interventions_status_enum" NOT NULL DEFAULT 'pending',
  "message" text NOT NULL,
  "recipientEmail" varchar NULL,
  "sentAt" timestamp NULL,
  "errorMessage" varchar NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" ("role");
CREATE INDEX IF NOT EXISTS "idx_users_department" ON "users" ("department");
CREATE INDEX IF NOT EXISTS "idx_enrollments_user" ON "enrollments" ("userId");
CREATE INDEX IF NOT EXISTS "idx_enrollments_course" ON "enrollments" ("courseId");
CREATE INDEX IF NOT EXISTS "idx_enrollments_status" ON "enrollments" ("status");
CREATE INDEX IF NOT EXISTS "idx_interventions_user" ON "interventions" ("userId");
CREATE INDEX IF NOT EXISTS "idx_interventions_status" ON "interventions" ("status");

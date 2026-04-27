-- Corporate Learning System - PostgreSQL Schema
-- Generated to match TypeORM entity definitions
-- Run against: corporate_learning_db

-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'employee');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE course_type_enum AS ENUM ('mandatory', 'optional', 'certification');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status_enum AS ENUM ('not_started', 'in_progress', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE intervention_type_enum AS ENUM ('reminder', 'escalation', 'warning');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE intervention_status_enum AS ENUM ('pending', 'sent', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- TABLES
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR NOT NULL UNIQUE,
  password      VARCHAR NOT NULL,
  "firstName"   VARCHAR NOT NULL,
  "lastName"    VARCHAR NOT NULL,
  role          user_role_enum NOT NULL DEFAULT 'employee',
  department    VARCHAR,
  "managerId"   VARCHAR,
  "isActive"    BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           VARCHAR NOT NULL,
  description     TEXT NOT NULL,
  type            course_type_enum NOT NULL DEFAULT 'optional',
  "durationHours" INTEGER NOT NULL DEFAULT 0,
  "isActive"      BOOLEAN NOT NULL DEFAULT TRUE,
  deadline        TIMESTAMP,
  department      VARCHAR,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMP NOT NULL DEFAULT now()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId"              UUID NOT NULL,
  "courseId"            UUID NOT NULL,
  status                enrollment_status_enum NOT NULL DEFAULT 'not_started',
  "progressPercentage"  INTEGER NOT NULL DEFAULT 0,
  "startedAt"           TIMESTAMP,
  "completedAt"         TIMESTAMP,
  "dueDate"             TIMESTAMP,
  "remindersSent"       INTEGER NOT NULL DEFAULT 0,
  "lastReminderSentAt"  TIMESTAMP,
  "enrolledAt"          TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"           TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_enrollment_user
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_course
    FOREIGN KEY ("courseId") REFERENCES courses(id) ON DELETE CASCADE
);

-- Interventions table
CREATE TABLE IF NOT EXISTS interventions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "enrollmentId"   UUID NOT NULL,
  "userId"         UUID NOT NULL,
  "courseId"       UUID NOT NULL,
  type             intervention_type_enum NOT NULL DEFAULT 'reminder',
  status           intervention_status_enum NOT NULL DEFAULT 'pending',
  message          TEXT NOT NULL,
  "recipientEmail" VARCHAR,
  "sentAt"         TIMESTAMP,
  "errorMessage"   VARCHAR,
  "createdAt"      TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_intervention_enrollment
    FOREIGN KEY ("enrollmentId") REFERENCES enrollments(id) ON DELETE CASCADE,
  CONSTRAINT fk_intervention_user
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_intervention_course
    FOREIGN KEY ("courseId") REFERENCES courses(id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role         ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department   ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_manager_id   ON users("managerId");

CREATE INDEX IF NOT EXISTS idx_courses_type       ON courses(type);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
CREATE INDEX IF NOT EXISTS idx_courses_is_active  ON courses("isActive");

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id   ON enrollments("userId");
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments("courseId");
CREATE INDEX IF NOT EXISTS idx_enrollments_status    ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_due_date  ON enrollments("dueDate");

CREATE INDEX IF NOT EXISTS idx_interventions_enrollment_id ON interventions("enrollmentId");
CREATE INDEX IF NOT EXISTS idx_interventions_user_id       ON interventions("userId");
CREATE INDEX IF NOT EXISTS idx_interventions_course_id     ON interventions("courseId");
CREATE INDEX IF NOT EXISTS idx_interventions_status        ON interventions(status);
CREATE INDEX IF NOT EXISTS idx_interventions_type          ON interventions(type);

-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

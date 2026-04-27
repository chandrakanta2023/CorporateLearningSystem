-- Default login user (Password123!)
INSERT INTO "users" ("email", "password", "firstName", "lastName", "role", "department", "isActive")
VALUES
  ('admin@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'System', 'Admin', 'admin', 'L&D', true)
ON CONFLICT ("email") DO NOTHING;

-- Managers (Indian names)
INSERT INTO "users" ("email", "password", "firstName", "lastName", "role", "department", "isActive")
VALUES
  ('manager.aarav.sharma@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Aarav', 'Sharma', 'manager', 'Engineering', true),
  ('manager.priya.nair@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Priya', 'Nair', 'manager', 'Sales', true),
  ('manager.rohan.verma@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Rohan', 'Verma', 'manager', 'Finance', true),
  ('manager.meera.iyer@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Meera', 'Iyer', 'manager', 'Human Resources', true),
  ('manager.siddharth.reddy@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Siddharth', 'Reddy', 'manager', 'Product', true)
ON CONFLICT ("email") DO NOTHING;

-- Employees (sample)
INSERT INTO "users" ("email", "password", "firstName", "lastName", "role", "department", "isActive")
VALUES
  ('employee.aanya.gupta@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Aanya', 'Gupta', 'employee', 'Engineering', true),
  ('employee.diya.patel@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Diya', 'Patel', 'employee', 'Engineering', true),
  ('employee.vivaan.kumar@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Vivaan', 'Kumar', 'employee', 'Sales', true),
  ('employee.anika.singh@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Anika', 'Singh', 'employee', 'Sales', true),
  ('employee.krishna.rao@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Krishna', 'Rao', 'employee', 'Finance', true),
  ('employee.neha.jain@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Neha', 'Jain', 'employee', 'Finance', true),
  ('employee.ishaan.banerjee@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Ishaan', 'Banerjee', 'employee', 'Product', true),
  ('employee.saanvi.menon@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Saanvi', 'Menon', 'employee', 'Product', true),
  ('employee.rahul.das@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Rahul', 'Das', 'employee', 'Operations', true),
  ('employee.shreya.chatterjee@company.com', '$2b$10$FdmDIPl.rjkVykcscvU/tuBeB.sr.kdqJkQUVYGqpMbHetQrSy1L2', 'Shreya', 'Chatterjee', 'employee', 'Operations', true)
ON CONFLICT ("email") DO NOTHING;

-- Courses
INSERT INTO "courses" ("title", "description", "type", "durationHours", "department", "isActive")
SELECT * FROM (
  VALUES
    ('Cybersecurity Basics', 'Mandatory annual security awareness program', 'mandatory'::"courses_type_enum", 4, 'All', true),
    ('POSH Awareness and Compliance', 'Workplace conduct and POSH compliance essentials', 'mandatory'::"courses_type_enum", 3, 'All', true),
    ('Data Privacy and DPDPA Readiness', 'Data privacy principles and policy compliance in India', 'mandatory'::"courses_type_enum", 3, 'All', true),
    ('Advanced Excel for Business Reporting', 'Practical Excel techniques for dashboards and reporting', 'optional'::"courses_type_enum", 6, 'Finance', true),
    ('Enterprise Sales Negotiation', 'Negotiation playbooks for enterprise and strategic deals', 'certification'::"courses_type_enum", 8, 'Sales', true),
    ('Leadership Essentials for First-time Managers', 'Coaching, delegation, and team leadership fundamentals', 'certification'::"courses_type_enum", 10, 'All', true),
    ('Agile Product Delivery Fundamentals', 'Agile methods, sprint planning, and delivery rhythm', 'optional'::"courses_type_enum", 5, 'Product', true),
    ('Customer Communication Excellence', 'Structured communication for support and customer success', 'optional'::"courses_type_enum", 4, 'Customer Success', true)
) AS v("title","description","type","durationHours","department","isActive")
WHERE NOT EXISTS (
  SELECT 1 FROM "courses" c WHERE c."title" = v."title"
);

-- Enroll all employees into first 3 courses (idempotent)
INSERT INTO "enrollments" ("userId", "courseId", "status", "progressPercentage", "dueDate", "remindersSent")
SELECT
  u."id",
  c."id",
  CASE
    WHEN random() < 0.40 THEN 'completed'::"enrollments_status_enum"
    WHEN random() < 0.80 THEN 'in_progress'::"enrollments_status_enum"
    ELSE 'not_started'::"enrollments_status_enum"
  END,
  CASE
    WHEN random() < 0.40 THEN 100
    WHEN random() < 0.80 THEN (20 + floor(random() * 70))::int
    ELSE 0
  END,
  now() + ((7 + floor(random() * 45))::int || ' days')::interval,
  (floor(random() * 3))::int
FROM "users" u
CROSS JOIN (
  SELECT "id" FROM "courses" ORDER BY "createdAt" ASC LIMIT 3
) c
WHERE u."role" = 'employee'
  AND NOT EXISTS (
    SELECT 1
    FROM "enrollments" e
    WHERE e."userId" = u."id"
      AND e."courseId" = c."id"
  );

-- Interventions for in-progress/failed enrollments (idempotent by enrollment/type)
INSERT INTO "interventions" ("enrollmentId", "userId", "courseId", "type", "status", "message", "recipientEmail", "sentAt")
SELECT
  e."id"::text,
  e."userId"::text,
  e."courseId"::text,
  CASE
    WHEN e."status" = 'failed'::"enrollments_status_enum" THEN 'warning'::"interventions_type_enum"
    WHEN random() < 0.5 THEN 'reminder'::"interventions_type_enum"
    ELSE 'escalation'::"interventions_type_enum"
  END,
  CASE WHEN random() < 0.7 THEN 'pending'::"interventions_status_enum" ELSE 'sent'::"interventions_status_enum" END,
  CASE
    WHEN e."status" = 'failed'::"enrollments_status_enum"
      THEN 'Learning progress is below threshold. Immediate completion support required.'
    ELSE 'Friendly reminder: please complete your assigned learning modules on time.'
  END,
  u."email",
  CASE WHEN random() < 0.5 THEN now() ELSE NULL END
FROM "enrollments" e
JOIN "users" u ON u."id" = e."userId"
WHERE e."status" IN ('in_progress'::"enrollments_status_enum", 'failed'::"enrollments_status_enum")
  AND NOT EXISTS (
    SELECT 1
    FROM "interventions" i
    WHERE i."enrollmentId" = e."id"::text
  );

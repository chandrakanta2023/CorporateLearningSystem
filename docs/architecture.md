# Corporate Learning System Architecture

## Purpose

Provide a local architecture that supports learning progress tracking, risk evaluation, interventions, and compliance workflows.

## High-Level Architecture

```text
React (Vite) Frontend
  |
  | HTTP (localhost)
  v
NestJS Backend API
  |
  | TypeORM
  v
PostgreSQL Database
```

## Backend Components

- `main.ts`: app bootstrap, CORS, global validation, API prefix (`/api/v1`), Swagger
- `app.module.ts`: config + TypeORM + feature module wiring
- `auth` module: JWT authentication and user profile endpoint
- `users` module: user management with role-based restrictions
- `ingestion` module: attendance, assessment, and competency data ingestion
- `profiles` module: learner profile aggregation
- `rules` module: risk rule CRUD and activation controls
- `risk-evaluations` module: risk scoring execution and retrieval
- `interventions` module: intervention lifecycle and summary metrics
- `compliance` module: compliance report generation and export
- `audit` module: immutable audit log retrieval
- `health` module: runtime and DB connectivity endpoint

## Frontend Components

- `App.tsx`: route-level access control and protected areas
- `pages/Login.tsx`, `pages/Signup.tsx`: authentication flows
- `pages/Dashboard.tsx`: operational overview
- `services/api.ts` and `services/auth.ts`: API client, token handling, session persistence

## Key Design Principles

- Clear separation between UI, API layer, and persistence
- Environment-driven configuration
- Security-first defaults for CORS and CSP in local POC
- Module-based backend with explicit domain boundaries
- Validation-first request handling through DTO classes

## Planned Expansion

- CI pipeline with automated lint/build/test gates
- Migration from `synchronize: true` to managed database migrations
- Stronger non-functional controls (rate limits, helmet, observability dashboards)

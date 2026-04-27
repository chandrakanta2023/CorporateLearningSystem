# Corporate Learning System Architecture (Phase 1)

## Purpose

Provide a local proof-of-concept architecture that demonstrates backend/frontend integration for learning progress, interventions, and compliance workflows.

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

- `main.ts`: app bootstrap, CORS, API prefix (`/api/v1`), health endpoint exclusion
- `app.module.ts`: global config + TypeORM + feature modules
- `health` module: service health and DB connectivity endpoint
- `entities`: domain persistence models (User, Course, Enrollment, Intervention)

## Frontend Components

- `Home` page: landing UI and backend status visualization
- `services/api.ts`: API client setup and health-check method
- `styles/global.css`: shared tokens and base page styles

## Key Design Principles

- Clear separation between UI, API layer, and persistence
- Environment-driven configuration
- Security-first defaults for CORS and CSP in local POC
- Extendable module-based backend structure for future Phase 2 migration

## Planned Expansion (Post-Phase 1)

- Auth module (JWT)
- Risk rules engine
- Intervention workflows
- Compliance reporting modules
- Role-based frontend routing

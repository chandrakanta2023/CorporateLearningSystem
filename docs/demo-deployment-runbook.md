# Demo Deployment Runbook

This project supports two presentation modes:

1. Hosted demo for zero-install access
2. Local fallback demo for offline or backup use

## Recommended Delivery Mode

Use a hosted URL as the primary handoff. That gives the simplest experience for reviewers and stakeholders.

Recommended hosting split:

- Frontend: Vercel, Netlify, or Azure Static Web Apps
- Backend: Render, Railway, Azure App Service, or Fly.io
- Database: Neon, Supabase Postgres, Railway Postgres, or Azure Database for PostgreSQL

### Suggested handoff block

```text
Live demo: https://your-demo-url.example.com
API docs: https://your-api-url.example.com/api/docs
Admin login: admin@company.com
Password: Admin@1234
Local fallback: double-click run-demo.bat after Docker Desktop is installed
```

## One-Click Local Fallback

This repository includes a containerized local demo bundle.

### For Windows

1. Install Docker Desktop once.
2. Double-click `run-demo.bat` from the repository root.
3. Open `http://localhost:8080`.

To stop it, double-click `stop-demo.bat`.

### Services started by one click

- PostgreSQL database
- NestJS backend API on `http://localhost:3000`
- React frontend on `http://localhost:8080`

### Demo credentials

- Email: `admin@company.com`
- Password: `Admin@1234`

## How To Publish Cleanly

## Option A: Best Path

Publish the full stack online and share URLs.

### Steps

1. Provision managed PostgreSQL.
2. Deploy backend with environment variables from `backend/.env.example`.
3. Deploy frontend with `VITE_API_BASE_URL` pointing to the backend URL.
4. Run seed once against the hosted backend/database.
5. Verify login, dashboard, compliance, interventions, and API docs.

## Option B: Backup Path

Zip the repository and provide the Docker-based fallback.

## How To Make It Agent-Based

"Agent-based" should mean clearly scoped intelligent assistants inside the product, not a generic chatbot.

Recommended agents:

1. Risk Monitoring Agent
   - watches learner data and flags at-risk employees
   - triggers evaluation runs and summarizes why a user is at risk

2. Intervention Recommendation Agent
   - suggests the next intervention based on rule severity, course status, and history
   - produces an explanation users can inspect

3. Compliance Reporting Agent
   - generates monthly compliance summaries
   - exports narrative plus CSV evidence

4. Admin Copilot Agent
   - answers operational questions such as overdue courses, high-risk users, and latest interventions
   - uses the existing API and audit trail as system sources

### Practical implementation approach

1. Keep the current backend as the system of record.
2. Add a new `agent-orchestration` module in the backend.
3. Expose agent actions as explicit endpoints, not hidden side effects.
4. Log every agent recommendation in audit records.
5. Show "why this recommendation was made" in the UI.

## Simplification Rules

1. One URL is better than one script.
2. One script is better than three terminals.
3. Docker is better than manual PostgreSQL setup.
4. Demo credentials should be included in the handoff note.
5. Swagger and seeded data should always be available.
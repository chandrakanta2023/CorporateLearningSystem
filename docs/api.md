# API Documentation

Last Updated: April 28, 2026  
Status: Active

## Base Endpoints

- Health endpoint: `GET /health`
- Versioned API base: `/api/v1`
- Swagger/OpenAPI: `/api/docs`

## Implemented Endpoints (Current)

### `GET /health`

Returns runtime and database connectivity status.

Example response:

```json
{
  "status": "ok",
  "timestamp": 1745740800000,
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "type": "PostgreSQL",
    "message": "PostgreSQL 16.1"
  }
}
```

### Auth
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/auth/profile`

### Dashboard
- `GET /api/v1/dashboard/summary`

### Rules
- `GET /api/v1/rules`
- `POST /api/v1/rules`
- `PATCH /api/v1/rules/:id`
- `PATCH /api/v1/rules/:id/activate`
- `PATCH /api/v1/rules/:id/deactivate`

### Ingestion
- `POST /api/v1/ingestion/attendance`
- `POST /api/v1/ingestion/assessments`
- `POST /api/v1/ingestion/competencies`

### Profiles
- `GET /api/v1/profiles/:userId`

### Interventions
- `GET /api/v1/interventions`
- `GET /api/v1/interventions/summary`
- `POST /api/v1/interventions`
- `PATCH /api/v1/interventions/:id`
- `PATCH /api/v1/interventions/:id/close`

### Risk Evaluations
- `POST /api/v1/risk-evaluations/run`
- `GET /api/v1/risk-evaluations/latest`
- `GET /api/v1/risk-evaluations/users/:userId`

### Compliance
- `POST /api/v1/compliance/reports/generate`
- `GET /api/v1/compliance/reports`
- `GET /api/v1/compliance/reports/latest-csv`

### Audit
- `GET /api/v1/audit/logs`

### Users
- `POST /api/v1/users`
- `GET /api/v1/users`
- `GET /api/v1/users/:id`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

## Notes

- Detailed backend endpoint references are also maintained in `backend/API.md`.
- Endpoint authorization is role-protected for sensitive modules (rules, ingestion, compliance, audit, users).

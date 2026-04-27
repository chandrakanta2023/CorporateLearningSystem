# API Documentation (Phase 1)

## Base Endpoints

- Health endpoint: `GET /health`
- Versioned API base: `/api/v1`

## Implemented Endpoint

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

## Planned Modules (Phase 3+)

- `/auth`
- `/users`
- `/courses`
- `/enrollments`
- `/risk-rules`
- `/interventions`
- `/dashboard`
- `/compliance`

## Notes

- Detailed backend endpoint references are also maintained in `backend/API.md`.
- Swagger/OpenAPI will be introduced in a later milestone.

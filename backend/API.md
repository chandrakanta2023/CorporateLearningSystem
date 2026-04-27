# Corporate Learning System - Backend API

## Base URLs
```
Health: http://localhost:3000/health
API:    http://localhost:3000/api/v1
```

## Health Check Endpoints

### GET /health
**Description:** Check if the backend service is running

**Response:**
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

**Status Codes:**
- `200 OK` - Service is healthy

---

## API Endpoints (To be implemented)

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user (Admin only)
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Courses
- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/:id` - Get course by ID
- `POST /api/v1/courses` - Create new course (Admin only)
- `PATCH /api/v1/courses/:id` - Update course (Admin only)
- `DELETE /api/v1/courses/:id` - Delete course (Admin only)

### Progress Tracking
- `GET /api/v1/progress/user/:userId` - Get user progress
- `POST /api/v1/progress` - Update progress
- `GET /api/v1/progress/course/:courseId` - Get course completion stats

### Compliance
- `GET /api/v1/compliance/report` - Get compliance report
- `GET /api/v1/compliance/overdue` - Get overdue assignments
- `POST /api/v1/compliance/reminder` - Send compliance reminder

---

## Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

---

## CORS Configuration

Allowed origins:
- `http://localhost:5173` (Frontend development server)

Configuration source:
- `CORS_ORIGIN` in `.env`

---

## Environment Variables

See `.env.example` for required configuration.

---

**Last Updated:** April 25, 2026

# Corporate Learning System - Backend

NestJS-based REST API backend for the Corporate Learning Progress, Intervention & Compliance Tracking System.

## Prerequisites

- Node.js v20+ LTS (Currently using: v24.15.0)
- npm v10+ (Currently using: v11.12.1)
- PostgreSQL 15+ (To be installed)

## Quick Start

### 1. Install Dependencies
```powershell
cd backend
npm install
```

### 2. Configure Environment
```powershell
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# Default configuration works for local development
```

### 3. Start Development Server
```powershell
npm run start:dev
```

The API will be available at: `http://localhost:3000`

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot-reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier

## API Documentation

See [API.md](./API.md) for complete API documentation.

### Quick Test

Test the health endpoint:
```powershell
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": 1745740800000,
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

## Project Structure

```
backend/
├── src/
│   ├── health/           # Health check module
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── app.controller.ts # Main app controller
│   ├── app.module.ts     # Root module
│   ├── app.service.ts    # Main app service
│   └── main.ts           # Application entry point
├── test/                 # E2E tests
├── .env                  # Environment variables (DO NOT COMMIT)
├── .env.example          # Environment template
├── .gitignore           # Git ignore rules
├── API.md               # API documentation
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Environment Variables

Key environment variables (see `.env.example` for complete list):

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `DB_NAME` | Database name | corporate_learning_db |
| `JWT_SECRET` | JWT secret key | (set a unique production value) |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |

## Features

### Phase 1 (Current)
- ✅ Health check endpoint
- ✅ CORS configuration
- ✅ Environment-based configuration
- ✅ Global API prefix (/api/v1)
- 🔄 JWT Authentication (In Progress)
- 🔄 PostgreSQL + TypeORM integration (In Progress)
- 🔄 User management (In Progress)
- 🔄 Course management (In Progress)
- 🔄 Progress tracking (In Progress)
- 🔄 Compliance reporting (In Progress)

### Phase 2 (Roadmap)
- Docker containerization
- Redis caching
- Keycloak authentication
- Enterprise security features
- Production optimizations

## Development

### Adding a New Module

```powershell
# Generate module, controller, and service
nest g module users
nest g controller users
nest g service users
```

### Code Quality

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing

### Running Tests

```powershell
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Troubleshooting

### Port already in use
```powershell
# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module not found
```powershell
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Database connection error
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database exists: `corporate_learning_db`

## Security Notes

🔒 **Important:**
- Never commit `.env` file to Git
- Set a unique `JWT_SECRET` in production
- Use strong database passwords
- Keep dependencies updated

## License

UNLICENSED - Internal Corporate Use Only

---

**Last Updated:** April 28, 2026  
**Version:** 1.0.0  
**Phase:** Phase 1 - Local POC

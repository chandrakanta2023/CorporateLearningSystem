# Corporate Learning System Backend

NestJS backend for the Corporate Learning Progress, Intervention and Compliance Tracking System.

## Prerequisites

- Node.js 20+ (current environment uses Node.js 24)
- npm 10+
- PostgreSQL 15+

## Setup

1. Install dependencies:

```powershell
cd backend
npm install
```

2. Create environment file:

```powershell
Copy-Item .env.example .env
```

3. Update database credentials in `.env` if needed.

4. Start development server:

```powershell
npm run start:dev
```

## Key Endpoints

- Health check: `GET http://localhost:3000/health`
- Versioned API base: `http://localhost:3000/api/v1`

## Build and Run

```powershell
npm run build
npm run start:prod
```

## Related Docs

- API reference: `API.md`
- Deployment guide: `DEPLOYMENT.md`
- Extended backend notes: `BACKEND_README.md`

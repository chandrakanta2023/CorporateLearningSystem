# Corporate Learning System - Setup Runbook

Last Updated: April 28, 2026  
Status: Active  
Scope: Greenfield implementation, Phase 1 local development (without Docker)

## 1. Purpose

This runbook gives a deterministic setup path so a new contributor can clone the project, initialize data, run services, and validate the system end-to-end.

## 2. Baseline Requirements

- Operating system: Windows 10/11, macOS, or Linux
- Node.js: 20+
- npm: 10+
- PostgreSQL: 15+
- Git: any current stable version
- VS Code: current stable version (recommended)

Current project environment observed in this repository context:

- Node.js v24.x
- npm v11.x
- PostgreSQL 16.x

## 3. Repository Bootstrap

From the repository root, run one of the following approaches.

### 3.1 Guided Setup (Preferred)

Windows PowerShell:

```powershell
.\setup-any-machine.ps1
```

macOS/Linux:

```bash
chmod +x ./setup-any-machine.sh
./setup-any-machine.sh
```

What this does:

- installs backend and frontend dependencies
- creates backend environment file from template if missing
- initializes schema and demo data using the backend seed flow

### 3.2 Manual Setup

Backend:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run seed
npm run start:dev
```

Frontend (new terminal):

```powershell
cd frontend
npm install
npm run dev
```

## 4. Environment Configuration

The backend uses backend/.env. If backend/.env does not exist, create it from backend/.env.example.

Minimum fields to verify:

- DB_HOST
- DB_PORT
- DB_USERNAME
- DB_PASSWORD
- DB_NAME
- JWT_SECRET
- CORS_ORIGIN

If PostgreSQL credentials differ from defaults, update DB_PASSWORD and related DB fields before starting the backend.

## 5. Data Initialization Paths

Use one path only:

1. Seed path (recommended for fresh setups):
   - npm run seed
2. SQLJS import path (only for prototype data import use cases):
   - configure DB_TYPE=postgres and DB_SQLJS_PATH
   - run npm run db:migrate:sqljs-to-postgres

## 6. Service Startup and Health Checks

Expected local endpoints:

- Backend health endpoint: http://localhost:3000/health
- Frontend dev server: http://localhost:5173

Quick backend health check:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/health
```

## 7. Pre-Development Validation Gate

Run these checks before feature work.

Backend:

```powershell
cd backend
npm run lint
npm test -- --runInBand
npm run build
npm run test:e2e
```

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

## 8. Troubleshooting

### 8.1 Node or npm Not Found

- Restart terminal session
- Verify PATH includes Node.js install location
- Re-run node --version and npm --version

### 8.2 PostgreSQL Connection Errors

- Verify PostgreSQL service is running
- Verify backend/.env database credentials
- Verify the target database exists
- Re-run seed command after credential correction

### 8.3 Frontend Cannot Reach Backend

- Ensure backend is running on expected port
- Verify CORS_ORIGIN in backend/.env includes frontend origin
- Verify frontend is using the expected API base URL

### 8.4 Port Already In Use

- Stop conflicting process or change port locally for the active session
- Re-run service startup commands

## 9. Onboarding Sequence After Setup

After setup succeeds, continue in this order:

1. docs/START_HERE.md
2. requirements.md
3. docs/architecture.md
4. docs/requirement-traceability-matrix.md
5. TODOlist.md

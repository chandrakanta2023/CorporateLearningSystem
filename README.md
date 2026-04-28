# Corporate Learning System - Phase 1 POC

Progress, Intervention and Compliance Tracking System.

## Getting Started

Use one of these paths when opening the repository for the first time.

### Run The Application

For the fastest local startup on Windows:

```powershell
.\run-demo.bat
```

This starts the frontend, backend, and database using Docker.

After startup:

- Frontend: `http://localhost:8080`
- Backend health: `http://localhost:3000/health`
- API docs: `http://localhost:3000/api/docs`
- Demo login: `admin@company.com` / `Admin@1234`

Prerequisite: Docker Desktop must be installed and running.

### Read The Project

If you want the standard onboarding path, read these in order:

1. `README.md`
2. `docs/START_HERE.md`
3. `docs/demo-deployment-runbook.md`

## Overview

This repository contains a local, non-Docker Phase 1 proof-of-concept implementation based on the project requirements:

- Backend: NestJS + TypeScript + PostgreSQL (TypeORM)
- Frontend: React + TypeScript + Vite
- Goal: establish a working foundation with backend/frontend connectivity, health checks, and initial project documentation

## Demo Deployment

Best delivery mode for a shared demo:

1. Publish a hosted demo URL
2. Keep the local Docker fallback in this repo as backup

For the local one-click fallback on Windows:

```powershell
.\run-demo.ps1
```

This starts PostgreSQL, the backend API, and the frontend in containers.

- Frontend: `http://localhost:8080`
- Backend health: `http://localhost:3000/health`
- API docs: `http://localhost:3000/api/docs`
- Demo login: `admin@company.com` / `Admin@1234`

Full handoff guidance: `docs/demo-deployment-runbook.md`

If Docker Desktop is not running, start Docker Desktop first and then run `run-demo.bat` or `run-demo.ps1`.

## Prerequisites

- Node.js 20+ (current environment uses Node.js 24)
- npm 10+
- PostgreSQL 15+
- VS Code (recommended)

## Quick Start

1. Configure local environment paths (optional helper):

```powershell
.\setup-env.ps1
```

2. Prepare database (optional helper):

```powershell
.\setup-database.ps1
```

3. Start backend:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run start:dev
```

4. Start frontend (new terminal):

```powershell
cd frontend
npm install
npm run dev
```

Frontend deterministic startup on port 5173 (Windows):

```powershell
# From repository root
$ports = 5173,5174
$pids = Get-NetTCPConnection -LocalPort $ports -State Listen -ErrorAction SilentlyContinue |
	Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { Stop-Process -Id $pids -Force }

cd frontend
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

5. Verify:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:3000/health`

## One-Command Setup (Any Machine)

### Windows (PowerShell)

```powershell
.\setup-any-machine.ps1
```

### macOS/Linux

```bash
chmod +x ./setup-any-machine.sh
./setup-any-machine.sh
```

This will:
- install backend/frontend dependencies
- create backend `.env` from template (if missing)
- run the canonical backend seed flow (`npm run seed`) to initialize schema and demo data

## One-Click Local Demo

If you want others to run the application with minimal setup, use the Docker-based fallback instead of manual Node/PostgreSQL installation.

Windows:

```powershell
.\run-demo.ps1
```

Stop it with:

```powershell
.\stop-demo.ps1
```

## Database Initialization

Primary setup on new machines uses the canonical seed flow (`backend/src/seed.ts`) for schema + demo data initialization.

If you have local prototype `sqljs` data and want to import it into PostgreSQL:

1. Ensure `backend/.env` points to PostgreSQL (`DB_TYPE=postgres`)
2. Keep `DB_SQLJS_PATH` set to source file path (default `.data/dev.sqlite`)
3. Run:

```powershell
cd backend
npm run db:migrate:sqljs-to-postgres
```

After the import completes, start backend/frontend normally.

## Project Structure

```text
backend/                 # NestJS API
frontend/                # React app
docs/                    # Setup, architecture, API, security docs
TODOlist.md              # Phase-by-phase implementation checklist
requirements.md          # PRD and requirements baseline
```

## Phase 1 Status

Implemented foundation includes:

- Backend health endpoint with DB connectivity status
- CORS configuration for local frontend origin
- Environment template and config loading
- Frontend landing page with backend health display
- Basic CSP policy in frontend HTML

## Documentation Index

Primary onboarding:

- Start here: docs/START_HERE.md
- Docs governance index: docs/README.md

- Setup guide: `docs/setup.md`
- Database setup: `docs/database-setup.md`
- Architecture: `docs/architecture.md`
- API overview: `docs/api.md`
- Security notes: `docs/security.md`
- Security checklist: `docs/security-checklist.md`
- Reference docs: `docs/reference/`
- Archived planning docs: `docs/archive/`
- Backend docs: `backend/README.md`, `backend/API.md`, `backend/DEPLOYMENT.md`
- Frontend docs: `frontend/README.md`, `frontend/STRUCTURE.md`, `frontend/DEPLOYMENT.md`

## Documentation Governance

- docs/START_HERE.md is the primary onboarding path.
- requirements.md is the business baseline.
- docs/requirement-traceability-matrix.md tracks requirement-to-implementation coverage.
- docs/archive/NEXT_STEPS.md is archival context only and should not be used as the primary current-state source.

## Next Scope

Follow Phase 1 items in `TODOlist.md` for:

- final manual verification tasks
- Git initialization and workflow docs
- additional security and deployment hardening

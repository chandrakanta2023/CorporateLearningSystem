# Corporate Learning System - Phase 1 POC

Progress, Intervention and Compliance Tracking System.

## Overview

This repository contains a local, non-Docker Phase 1 proof-of-concept implementation based on the project requirements:

- Backend: NestJS + TypeScript + PostgreSQL (TypeORM)
- Frontend: React + TypeScript + Vite
- Goal: establish a working foundation with backend/frontend connectivity, health checks, and initial project documentation

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

5. Verify:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:3000/health`

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

- Setup guide: `docs/setup.md`
- Database setup: `docs/database-setup.md`
- Architecture: `docs/architecture.md`
- API overview: `docs/api.md`
- Security notes: `docs/security.md`
- Security checklist: `docs/security-checklist.md`
- Backend docs: `backend/README.md`, `backend/API.md`, `backend/DEPLOYMENT.md`
- Frontend docs: `frontend/README.md`, `frontend/STRUCTURE.md`, `frontend/DEPLOYMENT.md`

## Next Scope

Follow Phase 1 items in `TODOlist.md` for:

- final manual verification tasks
- Git initialization and workflow docs
- additional security and deployment hardening

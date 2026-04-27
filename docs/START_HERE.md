# Start Here - Corporate Learning System

Last Updated: April 28, 2026  
Status: Active

This document is the primary onboarding path for architects, business analysts, developers, and coding agents.

## 1. Read Order (Authoritative Path)

Follow this sequence:

1. README.md
2. requirements.md
3. docs/architecture.md
4. docs/api.md
5. docs/security.md
6. docs/requirement-traceability-matrix.md
7. TODOlist.md

## 2. Environment Setup

From repository root:

Windows PowerShell (guided setup):

```powershell
.\setup-any-machine.ps1
```

Manual setup:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run seed
npm run start:dev
```

In a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

## 3. Validation Checklist (Run Before Development)

Backend checks:

```powershell
cd backend
npm run lint
npm test -- --runInBand
npm run build
npm run test:e2e
```

Frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

## 4. Source of Truth by Purpose

- Product and business scope: requirements.md
- Current architecture decisions: docs/architecture.md
- API surface and contracts: docs/api.md and backend/API.md
- Security baseline and controls: docs/security.md and docs/security-checklist.md
- Requirement coverage and delivery gaps: docs/requirement-traceability-matrix.md
- Strategic phase planning reference: docs/reference/techstack.md
- Execution backlog and implementation tasks: TODOlist.md

## 5. Working Mode (Spec-Driven)

When implementing any feature:

1. Confirm requirement in requirements.md.
2. Confirm acceptance/evidence path in docs/requirement-traceability-matrix.md.
3. Implement backend and frontend changes.
4. Add or update tests.
5. Run validation checklist in this file.
6. Update traceability and TODO status.

## 6. Document Governance

- Keep this file as the first entry for all new contributors.
- Keep README.md concise and link to this file.
- Keep status documents synchronized with actual code and test outcomes.
- Do not use historical release logs unless explicitly needed for external release governance.

## 7. Documentation Maturity Matrix

Use this matrix to identify which documents are authoritative for decisions and execution.

| Document | Maturity | Primary Use |
|---|---|---|
| README.md | Authoritative Entry Point | Repository overview and onboarding redirect |
| docs/START_HERE.md | Authoritative Runbook | Step-by-step onboarding and validation workflow |
| requirements.md | Authoritative Specification | Business scope, requirements baseline, and success criteria |
| docs/architecture.md | Authoritative Architecture | Technical structure, module boundaries, and delivery roadmap |
| docs/api.md | Supporting Contract Summary | API orientation and endpoint overview |
| backend/API.md | Authoritative Backend API Detail | Backend route-level API reference |
| docs/security.md | Supporting Security Narrative | Security approach and implementation posture |
| docs/security-checklist.md | Authoritative Security Checklist | Operational security verification checklist |
| docs/requirement-traceability-matrix.md | Authoritative Delivery Traceability | Requirement-to-implementation coverage and gaps |
| TODOlist.md | Authoritative Delivery Backlog | Planned implementation tasks and execution order |
| docs/archive/NEXT_STEPS.md | Archived Context | Historical planning snapshot only |

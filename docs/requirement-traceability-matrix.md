# Corporate Learning System - Requirement Traceability Matrix

Date: 2026-04-27
Scope: Problem statement + PRD must-have features + architecture review expectations
Assessment Basis: Current codebase and documentation state

## 1. Executive Snapshot

- Overall delivery stage: Foundation-complete, capability-incomplete POC
- Current completion estimate against must-have business capabilities: 25-35%
- Strongest area: UI scaffolding and base data model
- Weakest area: Production business logic (ingestion, risk engine, intervention workflow, compliance reporting)

## 2. Traceability Matrix (Must-Have Features)

| ID | Requirement | Current Status | Evidence (Existing) | Gap | Next Action | Owner | Target |
|---|---|---|---|---|---|---|---|
| R1 | Data ingestion APIs for attendance, assessment, competency milestones | Not started | `backend/src/health/health.controller.ts`, `backend/API.md` | No ingestion entities/controllers/services, no OpenAPI contract for ingestion | Implement ingestion module with DTO validation, bulk + realtime endpoints | Backend Lead | Sprint 1 |
| R2 | Employee learning profile aggregation | Not started | `backend/src/entities/*.entity.ts`, `schema.sql` | No profile aggregation service/API, no historical metrics endpoint | Create profile service and `GET /api/v1/profiles/:employeeId` with trend metrics | Backend Lead | Sprint 1 |
| R3 | Configurable risk rules engine (JSON) | Not started | `frontend/src/pages/RiskRules.tsx` (UI only) | No rule schema, versioning, execution scheduler, rule test harness | Add rules domain (`risk_rules`, `rule_versions`, evaluator job) + CRUD APIs | Architect + Backend Lead | Sprint 1-2 |
| R4 | At-risk classification | Mock only | `frontend/src/services/mockData.ts` | No backend scoring logic or persisted risk levels | Implement classification pipeline and risk score table | Backend Lead | Sprint 2 |
| R5 | Intervention lifecycle tracking | Partial | `backend/src/entities/intervention.entity.ts`, `schema.sql`, `frontend/src/components/Dashboard/InterventionsList.tsx` | No assignment workflow APIs, no outcome capture, no SLA tracking | Build intervention workflow APIs + outcome model + status transitions | Backend + Product | Sprint 2 |
| R6 | Compliance-ready reporting | Mock only | `frontend/src/pages/Compliance.tsx`, `frontend/src/pages/Reports.tsx` | No report engine, scheduling, audit/version control, export APIs | Implement report generation service (CSV/PDF), report history and scheduler | Backend Lead | Sprint 2-3 |
| R7 | Role-specific dashboards and analytics | Partial | `frontend/src/pages/Dashboard.tsx`, `frontend/src/components/Layout/MainLayout.tsx` | Data is mocked, no role-based routing/access | Add React Router + role-aware navigation + live API integration | Frontend Lead | Sprint 2 |

## 3. Problem Statement Parameter Mapping

| Parameter | Current State | Gap | Priority |
|---|---|---|---|
| Rule realism | Not measurable | No executable rule engine and no rule outcomes | P0 |
| Competency-level progression handling | Not implemented | Missing competency milestone model and progression logic | P0 |
| Practical usefulness for trainers/L&D admins | Partial mock UX | No real workflows, no alerts, no assignment engine | P0 |
| Separation of concerns (data/rules/reporting) | Partially defined | Domain modules not yet implemented | P1 |

## 4. Architecture Review Role Coverage (High Level)

| Architect Role | Current Readiness | Key Missing Evidence |
|---|---|---|
| Educational/Learning Strategy | Medium | Outcome linkage and intervention impact evidence |
| Data Architect | Medium | Attendance/assessment/milestone ingestion and lineage |
| Rules Engine Architect | Low | Rule schema, evaluator performance, version/audit |
| Integration Architect | Low | Multi-source connectors, sync reliability metrics |
| Privacy/Security Architect | Low-Medium | Auth/RBAC, encryption policy evidence, security test reports |
| Performance/Scalability Architect | Low | Load/perf benchmark artifacts |
| Workflow/Automation Architect | Low | Intervention workflow automation + notifications |
| Reporting/Compliance Architect | Low | Automated report generation and validation artifacts |
| UX Architect | Medium | Route-level role journeys and usability/accessibility evidence |
| Technical Leader/Educator | Medium | Training and KT package tied to completed feature set |

## 5. 3-Sprint Solid Plan

### Sprint 1 (Core Data + Profile + Rule Foundations)
1. Build ingestion APIs for attendance, assessments, competency milestones.
2. Implement profile aggregation endpoint with core KPIs.
3. Define JSON rule schema and create rules CRUD + versioning.
4. Deliver OpenAPI documentation for all new endpoints.

Exit Criteria:
- Ingest sample dataset and retrieve aggregated employee profile from API.
- Create and activate at least 5 rules from API/DB.

### Sprint 2 (Risk Execution + Interventions + Frontend Integration)
1. Implement rule evaluation job and risk classification persistence.
2. Build intervention assignment and outcome workflows.
3. Replace dashboard mock data with live APIs.
4. Add React Router and real navigation flows.

Exit Criteria:
- End-to-end flow works: ingest -> classify -> assign intervention -> dashboard reflects live state.

### Sprint 3 (Compliance Reporting + Hardening + Evidence Pack)
1. Implement compliance report generation/scheduling and exports.
2. Add authentication/RBAC and audit logging for critical actions.
3. Add test suites (unit/integration/e2e) for core flows.
4. Produce performance, reliability, and security evidence artifacts.

Exit Criteria:
- Judge-ready evidence pack assembled for scoring sheet.

## 6. KPI and Evidence Targets

| KPI | Target | Evidence Artifact |
|---|---|---|
| Profile API response | P95 < 500ms | k6/Artillery report |
| Dashboard load | <2s | Lighthouse + browser perf report |
| Rule execution | <2 min for 1000 employees | job benchmark report |
| Data sync reliability | >99.9% | ingestion job success metrics |
| Compliance report generation | <5 min for 10k employees | report benchmark + sample exports |
| Test coverage | >80% critical modules | coverage report |

## 7. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Continuing with mock-only UI | High | API-first delivery with mock replacement milestone in Sprint 2 |
| Scope drift between school and corporate terminology in review docs | Medium | Standardize terminology and update evaluation docs before formal review |
| Missing non-functional evidence (perf/security/reliability) | High | Reserve Sprint 3 for hardening and measurable evidence generation |

## 8. Immediate Next 7 Working Days

1. Finalize domain schema changes for attendance/assessment/competency.
2. Implement ingestion endpoints with DTO validation.
3. Deliver employee profile aggregation endpoint.
4. Add initial rule schema + rule CRUD API.
5. Hook dashboard summary cards to real profile/risk API.

Done Definition for Week 1:
- No dashboard summary metric sourced from static mock values.
- At least one API-driven risk classification visible in UI.
- OpenAPI spec updated and reviewable.

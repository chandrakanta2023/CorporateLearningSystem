# Technology Stack - Corporate Learning System

**Project:** Corporate Learning Progress, Intervention & Compliance Tracking System  
**Last Updated:** April 25, 2026  
**Deployment Strategy:** Two-Phase Approach

---

## Table of Contents
1. [Overview](#overview)
2. [Phase 1: Local POC (Without Docker)](#phase-1-local-poc-without-docker)
3. [Phase 2: Production Ready (With Docker)](#phase-2-production-ready-with-docker)
4. [Phase Comparison](#phase-comparison)
5. [Migration Guide](#migration-guide)

---

## Overview

This document outlines a **two-phase implementation strategy** for the Corporate Learning System:

- **Phase 1 (POC):** Quick proof-of-concept running entirely on localhost without Docker
- **Phase 2 (Production):** Full production-ready deployment with Docker, cloud hosting, and enterprise features

Both phases maintain **$0 monthly cost** using open-source technologies and free-tier cloud services.

---

---

# Phase 1: Local POC (Without Docker)

**Target:** Quick proof-of-concept for validation and testing  
**Timeline:** 1-2 weeks development  
**Environment:** Single developer machine (localhost)  
**Cost:** $0 (no cloud, no external services)  
**Credit Card Required:** ❌ None

---

## Phase 1 - Technology Stack

### **1. Hosting & Infrastructure**

#### Your Local Machine (Windows/macOS/Linux)
- **Purpose:** Development and testing environment
- **Cost:** $0 (use existing hardware)
- **Requirements:**
  - RAM: 8GB minimum (16GB recommended)
  - Disk: 5GB free space
  - OS: Windows 7+, macOS 10.15+, or Linux
- **Setup:** No installation needed
- **Use Case:** Run all services locally for POC validation

---

### **2. Database Layer**

#### PostgreSQL 15+
- **Purpose:** Primary relational database with JSONB support
- **Cost:** $0 (self-hosted)
- **Open Source:** ✅ Yes (PostgreSQL License - MIT-like)
- **Installation:** [Windows Installer](https://www.postgresql.org/download/windows/) (~200MB)
- **Why Chosen:**
  - No Docker required - runs as Windows/macOS service
  - Hybrid storage: Regular columns + JSONB for risk rules
  - Enterprise-grade reliability
  - Eliminates need for separate NoSQL database
- **Configuration:**
  - Port: 5432
  - Database: `corporate_learning`
  - User: `postgres`
  - Password: `postgres` (development only)
- **Features Used:**
  - Regular tables for users, courses, interventions
  - JSONB columns for complex rule definitions
  - GIN indexes for fast JSON queries
- **Use Case:** Store all application data, risk rules, compliance records

#### ~~Redis~~ - **SKIPPED in Phase 1**
- **Alternative:** In-memory caching using Node.js native objects
- **Session Storage:** Use `express-session` with MemoryStore
- **Job Queue:** Use `node-cron` for scheduled tasks (simpler than Bull)
- **Why Skip:** Reduces setup complexity for POC; adequate performance for testing

---

### **3. Backend Stack**

#### Node.js 20 LTS
- **Purpose:** JavaScript runtime environment
- **Cost:** $0
- **Open Source:** ✅ Yes (MIT License)
- **Installation:** [nodejs.org](https://nodejs.org) Windows/macOS installer (~50MB)
- **Version:** v20.x.x (LTS until April 2026)
- **Features:**
  - Event-driven, non-blocking I/O
  - Native async/await support
  - V8 JavaScript engine
  - Excellent JSON handling (perfect for JSONB)
- **Use Case:** Runtime for NestJS backend API

#### NestJS 10+
- **Purpose:** Enterprise Node.js framework
- **Cost:** $0
- **Open Source:** ✅ Yes (MIT License)
- **Installation:** `npm install -g @nestjs/cli`
- **Why Chosen:**
  - TypeScript-first (better type safety than Express.js)
  - Built-in Swagger documentation
  - Modular architecture (easy to scale to Phase 2)
  - Dependency injection
  - Integrated validation, scheduling
- **Key Modules for Phase 1:**
  - `@nestjs/typeorm` - Database ORM
  - `@nestjs/jwt` - Authentication
  - `@nestjs/passport` - Auth strategies
  - `@nestjs/config` - Environment configuration
  - `@nestjs/schedule` - Cron jobs
- **Use Case:** RESTful API backend, business logic, risk rules engine

#### TypeScript 5+
- **Purpose:** Type-safe JavaScript
- **Cost:** $0
- **Open Source:** ✅ Yes (Apache 2.0)
- **Installation:** Included with NestJS/React projects
- **Benefits:**
  - Compile-time error detection
  - Better IDE autocomplete
  - Improved code maintainability
  - Shared types between frontend/backend
- **Use Case:** Used in both backend and frontend code

---

### **4. Frontend Stack**

#### React 18+
- **Purpose:** UI framework
- **Cost:** $0
- **Open Source:** ✅ Yes (MIT License)
- **Installation:** `npm create vite@latest -- --template react-ts`
- **Why Chosen:**
  - Industry standard (large talent pool)
  - Component-based architecture
  - Virtual DOM for performance
  - Perfect for data-heavy dashboards
- **Use Case:** Interactive dashboards, forms, data tables

#### Vite (Development Server)
- **Purpose:** Fast development server and build tool
- **Cost:** $0
- **Open Source:** ✅ Yes (MIT License)
- **Installation:** Included with React project setup
- **Features:**
  - Instant hot module replacement (HMR)
  - Lightning-fast cold starts
  - Optimized production builds
  - Serves on `localhost:5173`
- **Use Case:** Development server for React frontend

#### Ant Design 5+
- **Purpose:** Enterprise UI component library
- **Cost:** $0
- **Open Source:** ✅ Yes (MIT License)
- **Installation:** `npm install antd`
- **Features:**
  - 60+ high-quality React components
  - Advanced Table component (sorting, filtering, pagination)
  - Form validation out-of-the-box
  - Professional design language
  - Responsive grid system
- **Why Chosen:**
  - Perfect for data-heavy enterprise applications
  - Reduces development time (pre-built components)
  - Consistent corporate UI
- **Use Case:** Admin dashboards, data tables, forms, modals

#### Apache ECharts (via @ant-design/charts)
- **Purpose:** Data visualization
- **Cost:** $0
- **Open Source:** ✅ Yes (Apache 2.0)
- **Installation:** `npm install @ant-design/charts echarts`
- **Features:**
  - 20+ chart types (line, bar, pie, gauge, heatmap, Gantt)
  - Interactive visualizations
  - Canvas/SVG rendering
  - Native Ant Design integration
- **Use Case:**
  - Progress trend charts
  - Risk distribution visualization
  - Compliance deadline timelines
  - Department-wise completion rates

---

### **5. Authentication**

#### JWT (JSON Web Tokens) with Passport.js
- **Purpose:** Stateless authentication
- **Cost:** $0
- **Open Source:** ✅ Yes (MIT License)
- **Installation:** `npm install @nestjs/jwt @nestjs/passport passport passport-jwt`
- **Why Choose JWT over Keycloak for Phase 1:**
  - No separate service to run (Keycloak is heavy)
  - Simple email + password login
  - Adequate for POC with <100 test users
  - Easy to migrate to Keycloak in Phase 2
- **Features:**
  - Token-based authentication
  - Role-based access control (RBAC)
  - Password hashing with bcrypt
- **Roles Supported:**
  - L&D Admin
  - Trainer
  - Manager
  - HR/Compliance
- **Use Case:** User authentication and authorization

---

### **6. Supporting Services**

#### Email - Console Logging
- **Purpose:** Email notification simulation
- **Cost:** $0
- **Open Source:** ✅ Yes (built-in)
- **Implementation:** `console.log()` or file logging
- **Why This Approach:**
  - No SMTP setup required
  - No external dependencies
  - Perfect for testing email templates and logic
  - Can see all email content in terminal/logs
- **Example Output:**
```
[EMAIL] To: user@company.com
[EMAIL] Subject: Learning Progress Alert
[EMAIL] Body: You have 3 courses due this week...
```
- **Use Case:** 
  - Test alert notifications
  - Verify intervention assignment emails
  - Debug email templates

#### PDF Generation - Puppeteer
- **Purpose:** Generate compliance reports
- **Cost:** $0
- **Open Source:** ✅ Yes (Apache 2.0 - by Google)
- **Installation:** `npm install puppeteer`
- **Features:**
  - Headless Chrome rendering
  - Perfect HTML/CSS to PDF conversion
  - Can render React components
  - Works without Docker
- **Note:** Downloads Chromium (~170MB) automatically on first install
- **Use Case:**
  - Compliance reports
  - Learning progress certificates
  - Executive summaries

---

## Phase 1 - Architecture

```
┌───────────────────────────────────────────────────────────┐
│               Your Local Machine (Localhost)               │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │   PostgreSQL 15 (Windows/macOS Service)            │   │
│  │   Port: 5432                                        │   │
│  │   Database: corporate_learning                      │   │
│  └──────────────────────┬─────────────────────────────┘   │
│                         │                                  │
│  ┌──────────────────────▼─────────────────────────────┐   │
│  │   NestJS Backend API                               │   │
│  │   Port: 3000                                        │   │
│  │   • TypeORM + PostgreSQL                           │   │
│  │   • JWT Authentication (Passport.js)               │   │
│  │   • In-memory caching (no Redis)                   │   │
│  │   • Console email logs (no SMTP)                   │   │
│  │   • Puppeteer (PDF generation)                     │   │
│  │   • node-cron (scheduled tasks)                    │   │
│  │   • Swagger UI (API docs at /api)                  │   │
│  └──────────────────────┬─────────────────────────────┘   │
│                         │ REST API                         │
│                         │ (axios calls)                    │
│  ┌──────────────────────▼─────────────────────────────┐   │
│  │   React Frontend (Vite Dev Server)                 │   │
│  │   Port: 5173                                        │   │
│  │   • React 18 + TypeScript                          │   │
│  │   • Ant Design 5 (UI components)                   │   │
│  │   • Apache ECharts (visualizations)                │   │
│  │   • React Router (navigation)                      │   │
│  │   • Axios (API client)                             │   │
│  └──────────────────────┬─────────────────────────────┘   │
│                         │                                  │
└─────────────────────────┼──────────────────────────────────┘
                          │
                          ▼
                    Browser Access
              http://localhost:5173
```

**Services Running:** 3
- PostgreSQL (background service)
- NestJS backend (`npm run start:dev` in Terminal 1)
- React frontend (`npm run dev` in Terminal 2)

**Memory Usage:** ~1.5 GB  
**Startup Time:** 5-10 seconds  
**External Dependencies:** None (100% localhost)

---

## Phase 1 - Setup Instructions

### **Prerequisites Installation**

```powershell
# 1. Install Node.js 20 LTS
# Download from https://nodejs.org
# Choose: Windows Installer (.msi) or macOS Installer (.pkg)
# Verify:
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x

# 2. Install PostgreSQL 15
# Download from https://www.postgresql.org/download/
# During installation:
#   - Port: 5432
#   - Superuser password: postgres
#   - Locale: Default
# Verify:
psql --version   # Should show PostgreSQL 15.x

# 3. Install Git (optional but recommended)
# Download from https://git-scm.com
```

### **Backend Setup**

```powershell
# Step 1: Install NestJS CLI globally
npm install -g @nestjs/cli

# Step 2: Create backend project
nest new corporate-learning-backend
cd corporate-learning-backend

# Step 3: Install dependencies
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @nestjs/config
npm install @nestjs/swagger
npm install @nestjs/schedule
npm install class-validator class-transformer
npm install bcrypt
npm install puppeteer

# Step 3.1: Install dev dependencies
npm install -D @types/passport-jwt @types/bcrypt

# Step 4: Create database
psql -U postgres
CREATE DATABASE corporate_learning;
\q

# Step 5: Start development server
npm run start:dev
# Backend runs on http://localhost:3000
# Swagger docs at http://localhost:3000/api
```

### **Frontend Setup**

```powershell
# Step 1: Create React project with Vite
npm create vite@latest corporate-learning-frontend -- --template react-ts
cd corporate-learning-frontend

# Step 2: Install dependencies
npm install antd @ant-design/charts @ant-design/icons
npm install echarts
npm install axios
npm install react-router-dom
npm install dayjs

# Step 2.1: Install dev dependencies
npm install -D @types/node

# Step 3: Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### **Running the Application**

```powershell
# Terminal 1 - Backend
cd corporate-learning-backend
npm run start:dev
# Keep this terminal open

# Terminal 2 - Frontend
cd corporate-learning-frontend  
npm run dev
# Keep this terminal open

# Access application in browser:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# API Docs: http://localhost:3000/api
```

---

## Phase 1 - Technology Summary

| Category | Technology | Cost | Open Source | Credit Card | Installation |
|----------|-----------|------|-------------|-------------|--------------|
| **Hosting** | Localhost | $0 | N/A | ❌ No | None (use your PC) |
| **Database** | PostgreSQL 15+ | $0 | ✅ MIT-like | ❌ No | Windows/macOS installer |
| **Cache** | In-memory (Node.js) | $0 | ✅ Built-in | ❌ No | None (native) |
| **Backend Runtime** | Node.js 20 LTS | $0 | ✅ MIT | ❌ No | nodejs.org installer |
| **Backend Framework** | NestJS 10+ | $0 | ✅ MIT | ❌ No | `npm install` |
| **Language** | TypeScript 5+ | $0 | ✅ Apache 2.0 | ❌ No | Included with projects |
| **Frontend Framework** | React 18+ | $0 | ✅ MIT | ❌ No | `npm create vite` |
| **Dev Server** | Vite | $0 | ✅ MIT | ❌ No | Built into React setup |
| **UI Library** | Ant Design 5+ | $0 | ✅ MIT | ❌ No | `npm install` |
| **Charts** | Apache ECharts | $0 | ✅ Apache 2.0 | ❌ No | `npm install` |
| **Authentication** | JWT + Passport.js | $0 | ✅ MIT | ❌ No | `npm install` |
| **Email** | Console Logging | $0 | ✅ Built-in | ❌ No | None (console.log) |
| **PDF** | Puppeteer | $0 | ✅ Apache 2.0 | ❌ No | `npm install` |

### **Phase 1 Totals**
- **Monthly Cost:** $0
- **Technologies:** 13
- **Open Source:** 13/13 (100%) ✅
- **Credit Cards Required:** 0 ✅
- **Setup Time:** ~30 minutes
- **Disk Space:** ~5 GB
- **RAM Required:** 8 GB minimum

---

## Phase 1 - What's Included ✅

- ✅ Risk Rules Engine (15 pre-built rules)
- ✅ Data Ingestion (manual upload + API)
- ✅ Intervention Tracking (create, assign, monitor)
- ✅ Compliance Reporting (PDF export)
- ✅ User Authentication (JWT-based)
- ✅ Role-based Access Control (4 roles)
- ✅ Dashboards (progress charts, analytics)
- ✅ Email Notifications (console logs for testing)
- ✅ API Documentation (Swagger UI)
- ✅ Data Visualization (ECharts)

## Phase 1 - What's Deferred ⏸️

- ⏸️ Enterprise SSO (Keycloak) → Use simple JWT login
- ⏸️ Redis Caching → Use in-memory caching
- ⏸️ Real Email Sending → Console logs for testing
- ⏸️ Docker Containerization → Native installation
- ⏸️ Cloud Deployment → Localhost only
- ⏸️ CI/CD Pipeline → Manual deployment
- ⏸️ Load Balancing → Single instance
- ⏸️ Advanced Job Queue → Simple cron jobs

**Phase 1 delivers 100% of core features for POC validation!**

---

---

# Phase 2: Production Ready (With Docker)

**Target:** Production deployment with enterprise features  
**Timeline:** 1-2 months development + deployment  
**Environment:** Cloud-hosted or on-premises  
**Cost:** $0 (using free tier cloud services)  
**Credit Card Required:** ⚠️ 1-2 services (account verification only, never charged)

---

## Phase 2 - Technology Stack

### **1. Hosting & Infrastructure**

#### Oracle Cloud Infrastructure (OCI) - Always Free Tier
- **Purpose:** Cloud hosting for all Docker containers
- **Cost:** $0 (Always Free - **no expiration ever**)
- **Open Source:** ❌ Proprietary platform (but free hosting)
- **Credit Card:** ✅ Required for account verification (never charged on free tier)
- **Features:**
  - 4 ARM-based Ampere A1 cores (3,000 OCPU hours/month)
  - 24 GB RAM (enough for 5+ Docker containers)
  - 200 GB Block Storage
  - 10 TB outbound data transfer/month
  - 2 Public IP addresses
  - Always Free (no 12-month expiration like AWS/GCP/Azure)
- **Why Chosen:**
  - Only major cloud provider with truly "always free" tier
  - Sufficient resources for 50K employees (Phase 1 scale)
  - No surprise billing
- **Alternative:** Self-hosted on-premises server (if cloud is not allowed)
- **Use Case:** Host all Docker containers, database, caching, auth services

---

### **2. Containerization & Orchestration**

#### Docker Engine
- **Purpose:** Application containerization
- **Cost:** $0 (Docker Engine Community Edition)
- **Open Source:** ✅ Yes (Apache 2.0)
- **Installation:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) for dev, Docker Engine for server
- **Requirements:** Windows 10/11 (WSL2), macOS 10.15+, or Linux
- **Features:**
  - Isolated service containers
  - Consistent environments (dev/staging/prod identical)
  - Easy version management and rollback
  - Resource limits and monitoring
- **Why Chosen:**
  - Industry standard for containerization
  - Ensures "works on my machine" → "works everywhere"
  - Simplified deployment to Oracle Cloud
- **Use Case:** Package PostgreSQL, Redis, Keycloak, Backend, Frontend into containers

#### Docker Compose
- **Purpose:** Multi-container orchestration
- **Cost:** $0 (included with Docker)
- **Open Source:** ✅ Yes (Apache 2.0)
- **Features:**
  - Single YAML file configuration
  - Service dependency management (start order)
  - Network isolation between containers
  - Volume management for data persistence
  - One-command start/stop (`docker-compose up/down`)
- **Why Chosen:**
  - Perfect for single-server deployments (vs Kubernetes overkill)
  - Simple YAML configuration
  - Adequate for Phase 2 scale (50K employees)
- **Alternative:** Kubernetes (only if scaling beyond 100K users)
- **Use Case:** Deploy and manage 5 Docker containers together

---

### **3. Database & Caching Layer**

#### PostgreSQL 15+
- **Purpose:** Primary relational database with hybrid JSONB storage
- **Cost:** $0 (self-hosted in Docker)
- **Open Source:** ✅ Yes (PostgreSQL License - MIT-like)
- **Docker Image:** `postgres:15-alpine` (official, ~80MB)
- **Architecture:**
  - Regular columns for searchable fields (users, courses, interventions)
  - JSONB columns for complex rule definitions (15 risk rules)
  - GIN indexes for fast JSON queries
  - Full-text search capabilities
- **Why Chosen:**
  - Advanced JSON support eliminates need for MongoDB
  - Battle-tested reliability (25+ years)
  - Excellent performance for enterprise workloads
  - JSONB approach: 1 SQL query vs 7-10 for pure relational
- **Configuration:**
  - Port: 5432
  - Max connections: 100
  - Shared buffers: 256MB
  - Persistent volume for data
- **Use Case:** Store all application data, risk rules, compliance records

#### Redis 7+
- **Purpose:** High-performance caching, session storage, job queue
- **Cost:** $0 (self-hosted in Docker)
- **Open Source:** ✅ Yes (BSD 3-Clause License)
- **Docker Image:** `redis:7-alpine` (official, ~30MB)
- **Features:**
  - Sub-millisecond response times (<1ms)
  - In-memory data store (10-50x faster than PostgreSQL for cached data)
  - Pub/Sub messaging
  - Job queue via Bull/BullMQ
  - Session storage
- **Why Chosen:**
  - 5-10x faster than PostgreSQL for cached queries
  - Native job queue for async tasks (email notifications, PDF generation)
  - Lightweight memory footprint (~100-500MB)
  - Industry standard for caching
- **Use Cases:**
  - Cache frequently accessed data (course catalogs, user profiles)
  - Store user sessions (JWT refresh tokens)
  - Job queue for background tasks (email, PDF, data processing)
  - Real-time notifications (Pub/Sub)

---

### **4. Backend Stack**

#### Node.js 20 LTS
- **Purpose:** JavaScript runtime environment
- **Cost:** $0
- **Open Source:** ✅ Yes (MIT License)
- **Docker Image:** `node:20-alpine` (official, ~50MB base)
- **Same as Phase 1** - application code unchanged
- **Use Case:** Runtime for NestJS backend API in Docker container

#### NestJS 10+
- **Purpose:** Enterprise Node.js framework
- **Cost:** $0
- **Open Source:** ✅ Yes (MIT License)
- **Same as Phase 1** - codebase migrates directly
- **Additional Modules for Phase 2:**
  - `@nestjs/bull` - Redis-based job queue
  - `@nestjs/mailer` - Real email sending
  - `ioredis` - Redis client
- **Use Case:** RESTful API backend, business logic, risk rules engine

#### TypeScript 5+
- **Purpose:** Type-safe JavaScript
- **Cost:** $0
- **Open Source:** ✅ Yes (Apache 2.0)
- **Same as Phase 1** - no code changes needed
- **Use Case:** Backend + Frontend development

---

### **5. Frontend Stack**

#### React 18+
- **Purpose:** UI framework
- **Cost:** $0
- **Open Source:** ✅ Yes (MIT License)
- **Deployment:** Production build served by Nginx
- **Same as Phase 1** - components reused 100%
- **Use Case:** Interactive dashboards, forms, data tables

#### Nginx
- **Purpose:** Web server and reverse proxy
- **Cost:** $0
- **Open Source:** ✅ Yes (BSD 2-Clause License)
- **Docker Image:** `nginx:alpine` (official, ~25MB)
- **Features:**
  - High-performance static file serving
  - Reverse proxy for backend API
  - SSL/TLS termination (HTTPS support)
  - Gzip compression
  - Load balancing (future)
  - Rate limiting
- **Why Chosen:**
  - Industry-standard web server
  - Lightweight and blazing fast
  - Perfect for serving React production build
  - Can handle 10,000+ concurrent connections
- **Configuration:**
  - Serve React static files on port 80/443
  - Proxy `/api/*` requests to NestJS backend
  - Enable gzip compression
  - Set proper cache headers
- **Use Case:** Serve React frontend, proxy API requests

#### Ant Design 5+ & Apache ECharts
- **Same as Phase 1** - no changes
- Components and charts work identically
- Production build includes all optimizations

---

### **6. Authentication & Identity**

#### Keycloak 23+
- **Purpose:** Enterprise Identity and Access Management (IAM) / Single Sign-On (SSO)
- **Cost:** $0 (self-hosted in Docker)
- **Open Source:** ✅ Yes (Apache 2.0 License)
- **Docker Image:** `quay.io/keycloak/keycloak:23.0` (official, ~400MB)
- **Features:**
  - **SAML 2.0** and **OAuth 2.0 / OIDC** support
  - **LDAP/Active Directory integration** (critical for enterprises)
  - **Multi-factor authentication (MFA)**
  - Social login (Google, Microsoft, LinkedIn)
  - User federation (sync with corporate directories)
  - Role-based access control (RBAC)
  - Admin console UI (manage users, roles, policies)
  - Token management (JWT, refresh tokens)
- **Why Chosen Over Phase 1 JWT:**
  - **Enterprise SSO** - integrate with corporate Active Directory/LDAP
  - **No password management** - users log in with existing corporate credentials
  - **Centralized identity** - single source of truth for authentication
  - **Compliance** - meets enterprise security requirements
  - **MFA support** - adds extra security layer
  - **Most complete open-source SSO** (vs Auth0, Okta which are paid)
- **Migration from Phase 1:**
  - Replace Passport JWT with Keycloak OIDC adapter
  - Import existing users or federate with AD/LDAP
  - Roles map directly (L&D Admin, Trainer, Manager, HR)
- **Configuration:**
  - Realm: `corporate-learning`
  - Admin console: `http://domain:8080/admin`
  - Client: `learning-system-frontend`
  - Logout redirect: configured
- **Use Case:**
  - Enterprise single sign-on (SSO)
  - Role management (4 roles: L&D Admin, Trainer, Manager, HR)
  - Corporate AD/LDAP integration
  - MFA for sensitive operations

---

### **7. Supporting Services**

#### Email - Brevo (formerly Sendinblue)
- **Purpose:** Transactional email service
- **Cost:** $0 for first 300 emails/day (~9,000/month)
- **Open Source:** ❌ No (Commercial SaaS with free tier)
- **Credit Card:** ⚠️ May be required for verification (not always)
- **Features:**
  - SMTP relay + REST API
  - Email templates
  - Delivery tracking
  - Professional deliverability (better than self-hosted)
  - EU-based (GDPR compliant)
- **Why Chosen:**
  - Higher free tier than SendGrid (100/day)
  - Simple SMTP integration with NestJS Mailer
  - Reliable delivery (vs self-hosted SMTP which often goes to spam)
  - Can scale to paid tier if needed ($25/month for 10K emails)
- **Alternative for Local Testing:** MailDev (Docker container, no signup)
```yaml
maildev:
  image: maildev/maildev
  ports:
    - "1080:1080"  # Web UI
    - "1025:1025"  # SMTP
```
- **Use Case:**
  - Alert notifications (at-risk learners)
  - Intervention assignment emails
  - Compliance deadline reminders
  - System notifications

#### PDF Generation - Puppeteer
- **Same as Phase 1** - runs inside Docker container
- **Docker Note:** Add Chromium dependencies to Dockerfile
- **Cost:** $0
- **Open Source:** ✅ Yes (Apache 2.0)
- **Use Case:** Compliance reports, certificates, summaries

---

### **8. CI/CD Pipeline**

#### GitHub Actions
- **Purpose:** Continuous Integration / Continuous Deployment
- **Cost:** $0 for first 2,000 minutes/month (free tier)
- **Open Source:** ❌ No (Proprietary SaaS with free tier)
- **Credit Card:** ⚠️ Optional (only if exceeding free tier)
- **Features:**
  - YAML-based workflow configuration
  - Automated testing (unit + integration)
  - Docker image building
  - SSH deployment to Oracle Cloud
  - Secrets management (API keys, passwords)
  - Matrix builds (test multiple Node versions)
- **Workflow:**
  1. Push code to `main` branch
  2. Run tests (Jest, Supertest)
  3. Build Docker images (backend, frontend)
  4. Push images to Docker Hub (free tier)
  5. SSH to Oracle Cloud server
  6. Pull new images
  7. Restart containers (`docker-compose up -d`)
- **Alternative:** GitLab CI/CD (self-hosted runner, unlimited builds)
- **Use Case:** Automated testing and deployment on every git push

---

## Phase 2 - Architecture

```
┌─────────────────────────────────────────────────────────────┐
│          Oracle Cloud Free Tier (or On-Premises Server)     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Docker Compose Environment                 │ │
│  │                                                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │ │
│  │  │PostgreSQL│  │  Redis   │  │ Keycloak │  │MailDev │ │ │
│  │  │   15     │  │   7      │  │   23     │  │(local) │ │ │
│  │  │:5432     │  │:6379     │  │:8080     │  │:1025   │ │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘ │ │
│  │       │             │              │             │      │ │
│  │       └─────────────┼──────────────┼─────────────┘      │ │
│  │                     │              │                    │ │
│  │              ┌──────▼──────────────▼────┐               │ │
│  │              │   NestJS Backend API     │               │ │
│  │              │   (Node.js:3000)         │               │ │
│  │              │                          │               │ │
│  │              │  • TypeORM + PostgreSQL  │               │ │
│  │              │  • Redis caching (ioredis)│              │ │
│  │              │  • Bull job queue        │               │ │
│  │              │  • Keycloak OIDC client  │               │ │
│  │              │  • NestJS Mailer (Brevo) │               │ │
│  │              │  • Puppeteer PDF         │               │ │
│  │              │  • Swagger UI (/api)     │               │ │
│  │              └──────┬───────────────────┘               │ │
│  │                     │ REST API                          │ │
│  │                     │ (proxied by Nginx)                │ │
│  │              ┌──────▼───────────────────┐               │ │
│  │              │   React + Ant Design     │               │ │
│  │              │   (Nginx:80/443)         │               │ │
│  │              │                          │               │ │
│  │              │  • Static file serving   │               │ │
│  │              │  • Gzip compression      │               │ │
│  │              │  • SSL/TLS termination   │               │ │
│  │              │  • Reverse proxy to API  │               │ │
│  │              └──────┬───────────────────┘               │ │
│  └─────────────────────┼───────────────────────────────────┘ │
└────────────────────────┼──────────────────────────────────────┘
                         │ HTTPS
                         │
                         ▼
                  Users (Internet)
                  (SSO via Keycloak)
                         ▲
                         │
                   GitHub Actions
                  (Auto-deploy on push)
```

**Services Running:** 5+ containers
- PostgreSQL (database)
- Redis (cache + job queue)
- Keycloak (authentication/SSO)
- NestJS Backend (API)
- Nginx (web server + reverse proxy)
- MailDev (optional, local email testing)

**Memory Usage:** ~5-6 GB  
**Startup Time:** 30-60 seconds  
**External Services:** Brevo (email), GitHub Actions (CI/CD)

---

## Phase 2 - Setup Instructions

### **Step 1: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: corp-learning-db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: corporate_learning
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - corp-learning-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache & Job Queue
  redis:
    image: redis:7-alpine
    container_name: corp-learning-redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - corp-learning-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Keycloak SSO
  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    container_name: corp-learning-keycloak
    restart: always
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: postgres
      KC_DB_PASSWORD: ${DB_PASSWORD}
    command: start-dev
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - corp-learning-network

  # MailDev (Local Email Testing)  
  maildev:
    image: maildev/maildev
    container_name: corp-learning-maildev
    restart: always
    ports:
      - "1080:1080"  # Web UI
      - "1025:1025"  # SMTP Server
    networks:
      - corp-learning-network

  # NestJS Backend API
  backend:
    build: ./backend
    container_name: corp-learning-backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: corporate_learning
      REDIS_HOST: redis
      REDIS_PORT: 6379
      KEYCLOAK_URL: http://keycloak:8080
      SMTP_HOST: maildev  # or Brevo SMTP
      SMTP_PORT: 1025
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - corp-learning-network
    volumes:
      - ./backend/uploads:/app/uploads

  # React Frontend (Nginx)
  frontend:
    build: ./frontend
    container_name: corp-learning-frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - corp-learning-network
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

volumes:
  postgres_data:
  redis_data:

networks:
  corp-learning-network:
    driver: bridge
```

### **Step 2: Deploy to Oracle Cloud**

```bash
# 1. SSH to Oracle Cloud instance
ssh ubuntu@<your-oracle-cloud-ip>

# 2. Install Docker & Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker

# 3. Clone repository
git clone <your-repo-url>
cd corporate-learning-system

# 4. Create .env file
nano .env
# Add:
# DB_PASSWORD=your-secure-password
# KEYCLOAK_ADMIN_PASSWORD=admin-password

# 5. Start all services
docker-compose up -d

# 6. Check status
docker-compose ps
docker-compose logs -f

# 7. Access services:
# Frontend: http://<your-ip>
# Backend API: http://<your-ip>:3000
# Keycloak Admin: http://<your-ip>:8080/admin
# MailDev: http://<your-ip>:1080
```

---

## Phase 2 - Technology Summary

| Category | Technology | Cost | Open Source | Credit Card | Deployment |
|----------|-----------|------|-------------|-------------|------------|
| **Hosting** | Oracle Cloud Free Tier | $0 | ❌ Platform | ✅ Yes | Cloud VM |
| **Containerization** | Docker + Compose | $0 | ✅ Apache 2.0 | ❌ No | Containers |
| **Database** | PostgreSQL 15+ | $0 | ✅ MIT-like | ❌ No | Docker image |
| **Cache/Queue** | Redis 7+ | $0 | ✅ BSD | ❌ No | Docker image |
| **Backend Runtime** | Node.js 20 LTS | $0 | ✅ MIT | ❌ No | Docker image |
| **Backend Framework** | NestJS 10+ | $0 | ✅ MIT | ❌ No | In container |
| **Language** | TypeScript 5+ | $0 | ✅ Apache 2.0 | ❌ No | In container |
| **Frontend** | React 18+ | $0 | ✅ MIT | ❌ No | Docker image |
| **UI Library** | Ant Design 5+ | $0 | ✅ MIT | ❌ No | npm package |
| **Charts** | Apache ECharts | $0 | ✅ Apache 2.0 | ❌ No | npm package |
| **Web Server** | Nginx | $0 | ✅ BSD | ❌ No | Docker image |
| **Authentication** | Keycloak 23+ | $0 | ✅ Apache 2.0 | ❌ No | Docker image |
| **Email (local)** | MailDev | $0 | ✅ MIT | ❌ No | Docker image |
| **Email (prod)** | Brevo | $0 (300/day) | ❌ SaaS | ⚠️ Maybe | SaaS API |
| **PDF** | Puppeteer | $0 | ✅ Apache 2.0 | ❌ No | npm package |
| **CI/CD** | GitHub Actions | $0 (2K min) | ❌ SaaS | ⚠️ Optional | Cloud service |

### **Phase 2 Totals**
- **Monthly Cost:** $0
- **Technologies:** 16
- **Open Source:** 13/16 (81%) ✅
- **Credit Cards Required:** 1-3 (optional services)
- **Setup Time:** ~2-3 hours (first time)
- **Disk Space:** ~15 GB
- **RAM Required:** 16 GB recommended

---

## Phase 2 - What's Added ✅

**Compared to Phase 1, Phase 2 adds:**

- ✅ **Enterprise SSO** (Keycloak) - LDAP/AD integration, MFA
- ✅ **Redis Caching** - 10-50x faster data access
- ✅ **Job Queue** (Bull) - Async email, PDF, data processing
- ✅ **Real Email Sending** (Brevo/SMTP)
- ✅ **Docker Containers** - Consistent environments
- ✅ **Cloud Deployment** - Internet-accessible
- ✅ **CI/CD Pipeline** - Automated testing and deployment
- ✅ **Production Web Server** (Nginx) - SSL, compression, proxy
- ✅ **Scalability** - Can handle 50K+ employees
- ✅ **High Availability** - Container restart policies
- ✅ **Better Performance** - Redis caching, Nginx optimization
- ✅ **Enterprise Security** - Keycloak MFA, SSL/TLS
- ✅ **Monitoring Ready** - Health checks, logging

**Phase 2 is production-ready for enterprise deployment!**

---
- **Purpose:** Cloud hosting for all application services
- **Cost:** $0 (Always Free - no expiration)
- **Open Source:** Proprietary platform (but hosting is free)
- **Features:**
  - 4 ARM-based Ampere A1 cores (3,000 OCPU hours/month)
  - 24 GB RAM
  - 200 GB Block Storage
  - 10 TB outbound data transfer/month
  - Public IP addresses
- **Why Chosen:** Only major cloud provider with truly "always free" tier (no 12-month expiration like AWS/GCP/Azure)
- **Use Case:** Single-server deployment for Phase 1 (up to 50K employees)

---

## Database & Caching Layer

### PostgreSQL 15+
---

# Phase Comparison

## Side-by-Side Comparison

| Aspect | **Phase 1 (POC)** | **Phase 2 (Production)** |
|--------|-------------------|--------------------------|
| **Target** | Proof of concept | Production deployment |
| **Timeline** | 1-2 weeks | 1-2 months |
| **Environment** | Localhost only | Cloud or on-premises |
| **Setup Time** | ~30 minutes | ~2-3 hours (first time) |
| **Complexity** | ⭐⭐ Low | ⭐⭐⭐⭐ Medium-High |
| **Technologies** | 13 | 16 |
| **Open Source %** | 100% (13/13) | 81% (13/16) |
| **Monthly Cost** | $0 | $0 |
| **Credit Cards** | 0 required | 1-3 optional |
| **Disk Space** | ~5 GB | ~15 GB |
| **RAM Usage** | ~1.5 GB | ~5-6 GB |
| **RAM Required** | 8 GB minimum | 16 GB recommended |
| **Startup Time** | 5-10 seconds | 30-60 seconds |
| **Services** | 3 (DB, Backend, Frontend) | 5+ containers |
| **Windows Support** | ✅ Native (any version) | ⚠️ Requires WSL2 (Win 10/11) |
| **Internet Dependency** | Initial download only | Cloud hosting + deployment |
| **Best For** | Solo dev, Learning, Quick POC | Team collab, Production, Enterprise |

---

## Feature Comparison

| Feature | Phase 1 | Phase 2 |
|---------|---------|---------|
| **Risk Rules Engine** | ✅ Full (15 rules) | ✅ Full (15 rules) |
| **Data Ingestion** | ✅ Manual + API | ✅ Manual + API + Scheduled |
| **Intervention Tracking** | ✅ Full | ✅ Full |
| **Compliance Reporting** | ✅ PDF Export | ✅ PDF Export + Scheduled |
| **User Authentication** | ✅ JWT (simple) | ✅ Keycloak SSO (enterprise) |
| **LDAP/AD Integration** | ❌ No | ✅ Yes (via Keycloak) |
| **Multi-Factor Auth (MFA)** | ❌ No | ✅ Yes (via Keycloak) |
| **Single Sign-On (SSO)** | ❌ No | ✅ Yes (SAML, OAuth 2.0) |
| **Role-Based Access** | ✅ 4 roles | ✅ 4 roles (centralized) |
| **Dashboards & Charts** | ✅ Full | ✅ Full |
| **Email Notifications** | ⚠️ Console logs | ✅ Real emails (Brevo/SMTP) |
| **PDF Generation** | ✅ Puppeteer | ✅ Puppeteer (in container) |
| **Caching** | ⚠️ In-memory (Node.js) | ✅ Redis (high-performance) |
| **Job Queue** | ⚠️ Simple cron | ✅ Bull (Redis-based) |
| **API Documentation** | ✅ Swagger UI | ✅ Swagger UI |
| **Data Visualization** | ✅ ECharts | ✅ ECharts |
| **Performance** | Good (localhost) | Excellent (optimized) |
| **Scalability** | 1-50 users | 50K+ employees |
| **High Availability** | ❌ Single instance | ✅ Container restart |
| **SSL/TLS (HTTPS)** | ❌ HTTP only | ✅ Nginx SSL termination |
| **CI/CD Pipeline** | ❌ Manual deployment | ✅ GitHub Actions |
| **Consistent Environments** | ⚠️ Dev differs from prod | ✅ Docker (identical) |
| **Team Onboarding** | Medium (install 3-4 tools) | Easy (`docker-compose up`) |
| **Production Ready** | ❌ No | ✅ Yes |

---

## Technology Choices

| Component | Phase 1 Choice | Phase 2 Choice | Reason for Change |
|-----------|----------------|----------------|-------------------|
| **Hosting** | Localhost | Oracle Cloud Free Tier | Internet accessibility, production environment |
| **Deployment** | Native installation | Docker containers | Consistent environments, easy scaling |
| **Database** | PostgreSQL (service) | PostgreSQL (container) | Same DB, just containerized |
| **Caching** | In-memory (Node.js) | Redis | 10-50x faster, persistent sessions, job queue |
| **Authentication** | JWT + Passport.js | Keycloak | Enterprise SSO, LDAP/AD, MFA support |
| **Email** | Console logs | Brevo SMTP | Real email delivery for users |
| **Web Server** | Vite dev server | Nginx | Production-grade, SSL, compression, reverse proxy |
| **Job Processing** | node-cron | Bull (Redis) | Advanced queue, retries, monitoring |
| **CI/CD** | None | GitHub Actions | Automated testing and deployment |

---

## Cost Comparison

| Service | Phase 1 Cost | Phase 2 Cost | Notes |
|---------|--------------|--------------|-------|
| **Infrastructure** | $0 (localhost) | $0 (Oracle Always Free) | No change |
| **Database** | $0 (local install) | $0 (Docker container) | No change |
| **Caching** | $0 (in-memory) | $0 (Redis Docker) | No change |
| **Authentication** | $0 (JWT) | $0 (Keycloak Docker) | No change |
| **Email** | $0 (console) | $0 (Brevo free: 300/day) | Phase 2 sends real emails |
| **CI/CD** | $0 (none) | $0 (GitHub Actions: 2K min) | Phase 2 automates deployment |
| **Docker** | N/A | $0 (Docker CE) | Open-source |
| **SSL Certificate** | N/A | $0 (Let's Encrypt) | Free SSL |
| **Total Monthly** | **$0** | **$0** | Both completely free! ✅ |

---

## When to Use Each Phase

### **Use Phase 1 (POC) When:**
- ✅ Building quick proof-of-concept (1-2 weeks)
- ✅ Solo developer or learning the stack
- ✅ Want minimal setup complexity
- ✅ Testing core features and business logic
- ✅ Limited RAM (<8GB) or older Windows (7/8)
- ✅ Don't need SSO/LDAP integration yet
- ✅ Presenting to internal stakeholders only
- ✅ Validating requirements before full build

### **Use Phase 2 (Production) When:**
- ✅ Deploying to production for real users
- ✅ Team of 2+ developers (needs consistent env)
- ✅ Need enterprise SSO (LDAP/AD integration)
- ✅ Require real email notifications
- ✅ Want high performance (Redis caching)
- ✅ Need automated CI/CD pipeline
- ✅ Supporting 50K+ employees
- ✅ Require HTTPS/SSL security
- ✅ Want Docker containerization benefits
- ✅ Planning long-term production deployment

---

# Migration Guide

## Phase 1 → Phase 2 Migration

**Good News:** Your Phase 1 code migrates to Phase 2 with minimal changes! The application logic remains 95% identical.

### **Migration Timeline**
- **Preparation:** 4-8 hours
- **Docker Setup:** 2-3 hours
- **Keycloak Configuration:** 2-3 hours
- **Testing:** 1-2 days
- **Total:** 2-3 days for experienced developer

---

### **Step-by-Step Migration**

#### **1. Code Changes (Backend)**

**Update Environment Variables**
```typescript
// Phase 1: .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/corporate_learning
JWT_SECRET=your-secret-key

// Phase 2: .env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/corporate_learning
REDIS_HOST=redis
REDIS_PORT=6379
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=corporate-learning
KEYCLOAK_CLIENT_ID=learning-system-backend
SMTP_HOST=smtp.brevo.com  # or maildev for testing
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASSWORD=your-brevo-api-key
```

**Add Redis Caching**
```bash
npm install ioredis @nestjs/bull bull
```

```typescript
// app.module.ts - Add Redis
import { BullModule } from '@nestjs/bull';
import { Redis } from 'ioredis';

@Module({
  imports: [
    // Add Redis connection
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    // Add job queues
    BullModule.registerQueue({
      name: 'email',
    }),
    BullModule.registerQueue({
      name: 'pdf',
    }),
    // ... other modules
  ],
})
```

**Replace JWT with Keycloak**
```bash
npm install keycloak-connect nest-keycloak-connect
```

```typescript
// auth.module.ts - Replace Passport JWT
import { KeycloakConnectModule } from 'nest-keycloak-connect';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      secret: process.env.KEYCLOAK_CLIENT_SECRET,
    }),
  ],
})
```

**Update Authentication Guards**
```typescript
// Before (Phase 1): JWT Guard
import { JwtAuthGuard } from './jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}

// After (Phase 2): Keycloak Guard
import { AuthGuard, RoleGuard } from 'nest-keycloak-connect';

@UseGuards(AuthGuard, RoleGuard)
@Roles({ roles: ['L&D_Admin'] })
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

**Add Email Service (Real SMTP)**
```bash
npm install @nestjs/mailer nodemailer
```

```typescript
// email.service.ts
import { MailerService } from '@nestjs/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendInterventionAlert(user: User, intervention: Intervention) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Learning Intervention Assigned',
      template: './intervention-alert',
      context: {
        name: user.name,
        intervention: intervention.title,
      },
    });
  }
}
```

#### **2. Code Changes (Frontend)**

**Update API Base URL**
```typescript
// Phase 1: config.ts
export const API_BASE_URL = 'http://localhost:3000';

// Phase 2: config.ts (for production)
export const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
```

**Add Keycloak Authentication**
```bash
npm install keycloak-js
```

```typescript
// keycloak.ts
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://your-domain:8080',
  realm: 'corporate-learning',
  clientId: 'learning-system-frontend',
});

export default keycloak;
```

```typescript
// App.tsx - Initialize Keycloak
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <YourApp />
    </ReactKeycloakProvider>
  );
}
```

#### **3. Create Dockerfiles**

**Backend Dockerfile**
```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
```

**Frontend Dockerfile**
```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **4. Create docker-compose.yml**

See [Phase 2 - Setup Instructions](#phase-2---setup-instructions) for complete `docker-compose.yml`

#### **5. Data Migration**

**Export Phase 1 Data**
```bash
# Export from local PostgreSQL
pg_dump -U postgres corporate_learning > phase1_dump.sql
```

**Import to Phase 2**
```bash
# Copy to Docker container
docker cp phase1_dump.sql corp-learning-db:/tmp/

# Import into container
docker exec -it corp-learning-db psql -U postgres corporate_learning < /tmp/phase1_dump.sql
```

**Migrate Users to Keycloak**
```typescript
// Create script to import users into Keycloak
// Use Keycloak Admin REST API
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

const kcAdminClient = new KeycloakAdminClient({
  baseUrl: 'http://keycloak:8080',
  realmName: 'corporate-learning',
});

// Authenticate
await kcAdminClient.auth({
  username: 'admin',
  password: 'admin',
  grantType: 'password',
  clientId: 'admin-cli',
});

// Import users from Phase 1 database
const users = await getUsersFromPhase1DB();
for (const user of users) {
  await kcAdminClient.users.create({
    username: user.email,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    enabled: true,
    emailVerified: true,
  });
}
```

#### **6. Configure Keycloak**

1. **Access Keycloak Admin Console**
   - URL: `http://your-domain:8080/admin`
   - Login: admin / admin

2. **Create Realm**
   - Click "Add realm"
   - Name: `corporate-learning`

3. **Create Client (Backend)**
   - Client ID: `learning-system-backend`
   - Client Protocol: `openid-connect`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://your-domain:3000/*`

4. **Create Client (Frontend)**
   - Client ID: `learning-system-frontend`
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: `http://your-domain/*`
   - Web Origins: `http://your-domain`

5. **Create Roles**
   - L&D_Admin
   - Trainer
   - Manager
   - HR_Compliance

6. **Configure LDAP (if using corporate directory)**
   - User Federation → Add provider → LDAP
   - Enter LDAP/AD connection details
   - Map roles to LDAP groups

#### **7. Testing Phase 2**

```bash
# 1. Start all services locally
docker-compose up -d

# 2. Check all containers are running
docker-compose ps

# 3. View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# 4. Test services
curl http://localhost:3000/health  # Backend health check
curl http://localhost:80           # Frontend
curl http://localhost:8080         # Keycloak

# 5. Test Keycloak SSO login
# Open browser: http://localhost
# Should redirect to Keycloak login

# 6. Test Redis caching
docker exec -it corp-learning-redis redis-cli
> KEYS *
> GET some-cache-key

# 7. Test email (MailDev)
# Open: http://localhost:1080
# Trigger email in app, check MailDev UI

# 8. Test PDF generation
# Generate report in app, verify download
```

#### **8. Deploy to Oracle Cloud**

See [Phase 2 - Setup Instructions](#step-2-deploy-to-oracle-cloud) for deployment commands

---

### **Migration Checklist**

**Backend:**
- [ ] Update environment variables (DB host: `postgres`, add Redis, Keycloak)
- [ ] Install Redis packages (`ioredis`, `@nestjs/bull`, `bull`)
- [ ] Replace JWT auth with Keycloak (`nest-keycloak-connect`)
- [ ] Update auth guards (Passport → Keycloak)
- [ ] Add real email service (`@nestjs/mailer`)
- [ ] Create backend Dockerfile
- [ ] Test locally with Docker

**Frontend:**
- [ ] Update API base URL (environment variable)
- [ ] Install Keycloak JS (`keycloak-js`, `@react-keycloak/web`)
- [ ] Replace login component (redirect to Keycloak)
- [ ] Update auth context/providers
- [ ] Create frontend Dockerfile
- [ ] Create nginx.conf
- [ ] Test production build

**Infrastructure:**
- [ ] Create docker-compose.yml (5+ services)
- [ ] Create .env file with secrets
- [ ] Set up Oracle Cloud account
- [ ] Create VM instance (Always Free tier)
- [ ] Install Docker on VM
- [ ] Configure firewall (ports 80, 443, 8080)
- [ ] Set up domain name (optional)
- [ ] Configure SSL/TLS with Let's Encrypt

**Data:**
- [ ] Export Phase 1 database
- [ ] Import to Phase 2 PostgreSQL container
- [ ] Migrate users to Keycloak
- [ ] Test data integrity

**Keycloak:**
- [ ] Create realm (`corporate-learning`)
- [ ] Create backend client (confidential)
- [ ] Create frontend client (public)
- [ ] Create 4 roles
- [ ] Import users or configure LDAP
- [ ] Test SSO login flow

**Testing:**
- [ ] Test all core features (ingestion, rules, interventions, reports)
- [ ] Test authentication (Keycloak SSO, logout, roles)
- [ ] Test email notifications (real delivery)
- [ ] Test PDF generation
- [ ] Test caching (Redis performance)
- [ ] Load testing (50+ concurrent users)
- [ ] Security testing (SSL, auth, CSRF)

**CI/CD:**
- [ ] Create GitHub repository
- [ ] Create GitHub Actions workflow
- [ ] Configure secrets (SSH keys, passwords)
- [ ] Test automated deployment
- [ ] Set up monitoring/alerts (optional)

---

### **Zero-Downtime Migration Strategy**

If you have Phase 1 already running with users:

1. **Parallel Deployment**
   - Keep Phase 1 running on localhost
   - Deploy Phase 2 to Oracle Cloud (different domain)
   - Run both in parallel

2. **Data Sync**
   - Set up daily database sync (Phase 1 → Phase 2)
   - Or use database replication

3. **User Migration**
   - Migrate users in batches (by department)
   - Export user data from Phase 1 → Import to Keycloak
   - Test with 10 users, then 100, then all

4. **Cutover**
   - Schedule cutover window (e.g., weekend)
   - Final data sync
   - Switch DNS/URL to Phase 2
   - Keep Phase 1 as backup for 1 week

5. **Rollback Plan**
   - If issues found, switch back to Phase 1
   - Fix Phase 2 issues
   - Retry cutover next weekend

---

## Recommended Path

```
Week 1-2: Phase 1 Development
    ↓
Week 3: Phase 1 Testing & Validation
    ↓
Week 4: Migration Preparation (Dockerfiles, docker-compose.yml)
    ↓
Week 5: Phase 2 Local Testing (Docker Compose on dev machine)
    ↓
Week 6: Oracle Cloud Setup & Deployment
    ↓
Week 7: Keycloak Configuration & User Migration
    ↓
Week 8: Production Testing & Cutover
```

**Total Timeline:** 8 weeks from start to production ✅

---
- **Why Chosen:**
  - 5-10x faster than PostgreSQL for cached queries
  - Native job queue for async tasks (email notifications, PDF generation)
  - Lightweight memory footprint
- **Use Case:** Cache frequently accessed data, manage background jobs, store user sessions

---

## Backend Stack

### Node.js 20 LTS
- **Purpose:** JavaScript runtime environment
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (MIT License)
- **Features:**
  - Event-driven, non-blocking I/O
  - V8 JavaScript engine (high performance)
  - Long-term support until April 2026
  - Excellent async/await support
- **Why Chosen:**
  - Fast development cycle
  - Native JSON handling (perfect for JSONB data)
  - Huge npm ecosystem
  - Lightweight compared to Java/Spring Boot
- **Use Case:** Backend API runtime

### NestJS 10+
- **Purpose:** Enterprise-grade Node.js framework
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (MIT License)
- **Features:**
  - TypeScript-first framework
  - Built-in Swagger/OpenAPI documentation
  - Modular architecture
  - Dependency injection
  - Native support for REST, GraphQL, WebSockets
- **Why Chosen:**
  - Structured architecture (vs Express.js)
  - Automatic API documentation
  - Enterprise-ready patterns
  - Excellent TypeScript support
  - Built-in modules for Auth, Validation, Scheduling
- **Use Case:** RESTful API backend, business logic layer

### TypeScript 5+
- **Purpose:** Type-safe JavaScript superset
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (Apache 2.0 License)
- **Benefits:**
  - Compile-time type checking
  - Better IDE autocomplete
  - Reduced runtime errors
  - Improved code maintainability
- **Why Chosen:** Industry standard for enterprise applications
- **Use Case:** Both backend (NestJS) and frontend (React) development

---

## Frontend Stack

### React 18+
- **Purpose:** Component-based UI framework
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (MIT License)
- **Features:**
  - Declarative component model
  - Virtual DOM for performance
  - Concurrent rendering
  - Server-side rendering support
  - Huge ecosystem
- **Why Chosen:**
  - Most popular frontend framework (industry standard)
  - Excellent TypeScript support
  - Perfect for data-heavy dashboards
  - Large talent pool
- **Use Case:** Build interactive dashboards, forms, and reports

### Ant Design 5+
- **Purpose:** Enterprise UI component library
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (MIT License)
- **Features:**
  - 60+ high-quality React components
  - Professional design language
  - Excellent table/form components
  - Built-in responsive grid
  - Customizable theming
- **Why Chosen:**
  - Perfect for data-heavy enterprise applications
  - Advanced Table component (sorting, filtering, pagination)
  - Form validation out-of-the-box
  - Consistent with corporate UI standards
- **Use Case:** Build admin dashboards, data tables, forms, modals

### Apache ECharts (via @ant-design/charts)
- **Purpose:** Data visualization and charts library
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (Apache 2.0 License)
- **Features:**
  - 20+ chart types (line, bar, pie, gauge, heatmap, Gantt)
  - Interactive visualizations (zoom, tooltips, drill-down)
  - Canvas/SVG rendering
  - Mobile responsive
  - Seamless Ant Design integration
- **Why Chosen:**
  - Native integration with Ant Design ecosystem
  - Production-ready performance (millions of data points)
  - Rich chart types for learning analytics
  - Automatic theme matching
- **Use Case:** 
  - Progress trend charts
  - Risk distribution visualization
  - Compliance deadline timelines
  - Department-wise completion rates

---

## Authentication & Identity

### Keycloak 23+
- **Purpose:** Identity and Access Management (IAM) / Single Sign-On (SSO)
- **Cost:** $0 (Self-hosted on Oracle Cloud)
- **Open Source:** ✅ Yes (Apache 2.0 License)
- **Features:**
  - SAML 2.0 and OAuth 2.0 / OIDC support
  - LDAP/Active Directory integration
  - Multi-factor authentication (MFA)
  - Social login (Google, Microsoft, etc.)
  - User federation
  - Role-based access control (RBAC)
  - Admin console UI
- **Why Chosen:**
  - Most complete open-source SSO solution
  - Enterprise-grade security
  - Easy integration with existing corporate AD/LDAP
  - No vendor lock-in (vs Auth0, Okta)
  - Self-hosted = full data control
- **Use Case:** 
  - Single sign-on for all users
  - Role management (L&D Admin, Trainer, Manager, HR)
  - Corporate authentication integration

---

## Supporting Services

### Brevo (formerly Sendinblue)
- **Purpose:** Transactional email service
- **Cost:** $0 for first 300 emails/day (~9,000/month)
- **Open Source:** ❌ No (Commercial SaaS with free tier)
- **Features:**
  - SMTP relay + REST API
  - Email templates
  - Delivery tracking
  - Professional deliverability
  - EU-based (GDPR compliant)
- **Why Chosen:**
  - Higher free tier than SendGrid (100/day)
  - Simple SMTP integration with NestJS Mailer
  - Professional deliverability (better than self-hosted SMTP)
  - Can scale to paid tier if needed
- **Use Case:**
  - Alert notifications (at-risk learners)
  - Intervention assignment emails
  - Compliance deadline reminders
  - System notifications

### Puppeteer
- **Purpose:** Headless browser for PDF generation
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (Apache 2.0 License - by Google Chrome team)
- **Features:**
  - Headless Chrome rendering
  - Perfect HTML/CSS rendering
  - Chart/graph support
  - Configurable page layouts
  - Screenshot capabilities
- **Why Chosen:**
  - Best quality PDF output (true Chrome rendering)
  - Can render React components directly to PDF
  - Perfect for complex reports with Ant Design tables/charts
  - Industry standard for server-side PDF generation
- **Use Case:**
  - Compliance reports (PDF export)
  - Learning progress certificates
  - Executive summaries
  - Audit trail documentation

---

## Containerization & Deployment

### Docker
- **Purpose:** Application containerization
- **Cost:** $0 (Free - Docker Engine Community Edition)
- **Open Source:** ✅ Yes (Apache 2.0 License)
- **Features:**
  - Consistent environments (dev/staging/production)
  - Isolated service containers
  - Easy versioning and rollback
  - Resource limit controls
- **Why Chosen:**
  - Industry standard for containerization
  - Simplifies deployment to Oracle Cloud
  - Ensures consistency across environments
- **Use Case:** Package all 5 services (PostgreSQL, Redis, Keycloak, Backend, Frontend)

### Docker Compose
- **Purpose:** Multi-container orchestration
- **Cost:** $0 (Free - included with Docker)
- **Open Source:** ✅ Yes (Apache 2.0 License)
- **Features:**
  - Single YAML configuration file
  - Service dependency management
  - Network isolation
  - Volume management
  - Easy start/stop/restart
- **Why Chosen:**
  - Perfect for single-server deployments
  - Simple YAML configuration vs Kubernetes complexity
  - Adequate for Phase 1 scale (50K employees)
  - No orchestration overhead
- **Use Case:** Deploy and manage 5 Docker containers on Oracle Cloud VM

### Nginx (via Docker image)
- **Purpose:** Web server and reverse proxy
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (BSD 2-Clause License)
- **Features:**
  - High-performance static file serving
  - Reverse proxy for backend API
  - SSL/TLS termination
  - Gzip compression
  - Load balancing (future)
- **Why Chosen:**
  - Industry-standard web server
  - Lightweight and fast
  - Perfect for serving React production build
  - Built into official Nginx Docker images
- **Use Case:** Serve React frontend, proxy API requests to NestJS backend

---

## CI/CD Pipeline

### GitHub Actions
- **Purpose:** Continuous Integration / Continuous Deployment
- **Cost:** $0 for first 2,000 minutes/month (free tier)
- **Open Source:** ❌ No (Proprietary - but free tier available)
- **Features:**
  - YAML-based workflow configuration
  - Marketplace with 13,000+ actions
  - Docker support
  - Matrix builds (multi-environment testing)
  - Secrets management
  - SSH deployment support
- **Why Chosen:**
  - Easiest setup (if using GitHub)
  - Generous free tier (2,000 minutes = ~33 hours)
  - Excellent Docker integration
  - Built-in GitHub integration
  - Sufficient for small team deployments
- **Workflow:**
  1. Run tests (unit + integration)
  2. Build Docker images
  3. SSH to Oracle Cloud server
  4. Pull images and restart containers
- **Use Case:** Automated testing and deployment on every git push

---

## Development Tools (Optional - Not Production)

### Swagger UI (via NestJS @nestjs/swagger)
- **Purpose:** API documentation and testing
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (Apache 2.0 License)
- **Features:**
  - Auto-generated from NestJS decorators
  - Interactive API testing
  - Schema documentation
  - Try-it-out functionality
- **Why Chosen:** Built into NestJS, zero configuration needed
- **Use Case:** API documentation for developers

### pgAdmin 4 (Optional)
- **Purpose:** PostgreSQL database administration
- **Cost:** $0 (Free)
- **Open Source:** ✅ Yes (PostgreSQL License)
- **Features:**
  - Web-based database management
  - Query editor
  - Visual schema designer
  - Database backup/restore
- **Why Chosen:** Industry-standard PostgreSQL GUI
- **Use Case:** Database administration and debugging

---

## Deployment Options: Docker vs No Docker

### **Comparison Overview**

| Aspect | **Without Docker (Local POC)** | **With Docker (Production-Ready)** |
|--------|-------------------------------|-------------------------------------|
| **Setup Time** | ~30 minutes | ~45-60 minutes |
| **Complexity** | ⭐⭐ Low | ⭐⭐⭐⭐ Medium |
| **RAM Usage** | ~1-2 GB | ~4-6 GB |
| **Startup Time** | 5-10 seconds | 30-60 seconds |
| **Windows Support** | ✅ Native (any version) | ⚠️ Requires WSL2 (Win 10/11) |
| **Production Similarity** | ⚠️ Different environment | ✅ Identical to production |
| **Team Onboarding** | Medium (install 3-4 tools) | Easy (`docker-compose up`) |
| **Best For** | Quick POC, Solo development | Team collaboration, Production |

---

## Summary: Without Docker Setup (Local POC)

**Recommended for:** Quick proof-of-concept, solo developers, minimal setup

| Category | Technology | Cost | Open Source | Required Credit Card | Installation Method |
|----------|-----------|------|-------------|---------------------|---------------------|
| **Hosting** | Localhost (Your Machine) | $0 | N/A | ❌ No | Native |
| **Database** | PostgreSQL 15+ | $0 | ✅ MIT-like | ❌ No | [Windows Installer](https://www.postgresql.org/download/windows/) (~200MB) |
| **Cache** | ⚠️ **Skipped** (use in-memory) | $0 | N/A | ❌ No | Not needed for POC |
| **Backend Runtime** | Node.js 20 LTS | $0 | ✅ MIT | ❌ No | [nodejs.org](https://nodejs.org) (~50MB) |
| **Backend Framework** | NestJS 10+ | $0 | ✅ MIT | ❌ No | `npm install -g @nestjs/cli` |
| **Language** | TypeScript 5+ | $0 | ✅ Apache 2.0 | ❌ No | Included with Node.js |
| **Frontend** | React 18+ (Vite) | $0 | ✅ MIT | ❌ No | `npm create vite@latest` |
| **UI Components** | Ant Design 5+ | $0 | ✅ MIT | ❌ No | `npm install antd` |
| **Charts** | Apache ECharts | $0 | ✅ Apache 2.0 | ❌ No | `npm install echarts` |
| **Authentication** | JWT (Passport.js) | $0 | ✅ MIT | ❌ No | `npm install @nestjs/jwt` |
| **Email** | Console Logging | $0 | N/A | ❌ No | Built-in (console.log) |
| **PDF Generation** | Puppeteer | $0 | ✅ Apache 2.0 | ❌ No | `npm install puppeteer` |
| **Web Server** | Vite Dev Server | $0 | ✅ MIT | ❌ No | Built into Vite |
| **Version Control** | Git (optional) | $0 | ✅ GPL | ❌ No | [git-scm.com](https://git-scm.com) |

### **Without Docker - Total Cost Breakdown**

**Monthly Recurring Costs:**
- Hosting: **$0** (Your local machine)
- Database: **$0** (PostgreSQL installed locally)
- All services: **$0** (No cloud services)

**One-Time Setup:**
- Internet bandwidth: ~500MB (download installers + npm packages)
- Disk space: ~5GB (PostgreSQL + Node.js + dependencies)

**Credit Card Required:** ❌ **ZERO services require payment details**

**Grand Total: $0/month** ✅  
**Setup Complexity:** ⭐⭐ Low  
**Best For:** POC, Learning, Solo Development

---

## Summary: With Docker Setup (Production-Ready)

**Recommended for:** Team collaboration, staging/production deployment, consistent environments

| Category | Technology | Cost | Open Source | Required Credit Card | Installation Method |
|----------|-----------|------|-------------|---------------------|---------------------|
| **Hosting** | Oracle Cloud Free Tier | $0 | ❌ (Platform) | ✅ Yes (verification) | [cloud.oracle.com](https://cloud.oracle.com) |
| **Database** | PostgreSQL 15+ | $0 | ✅ MIT-like | ❌ No | Docker image (official) |
| **Cache** | Redis 7+ | $0 | ✅ BSD | ❌ No | Docker image (official) |
| **Backend Runtime** | Node.js 20 LTS | $0 | ✅ MIT | ❌ No | Docker image (official) |
| **Backend Framework** | NestJS 10+ | $0 | ✅ MIT | ❌ No | npm install in Dockerfile |
| **Language** | TypeScript 5+ | $0 | ✅ Apache 2.0 | ❌ No | npm install in Dockerfile |
| **Frontend** | React 18+ | $0 | ✅ MIT | ❌ No | Docker image (Node.js) |
| **UI Components** | Ant Design 5+ | $0 | ✅ MIT | ❌ No | npm install in Dockerfile |
| **Charts** | Apache ECharts | $0 | ✅ Apache 2.0 | ❌ No | npm install in Dockerfile |
| **Authentication** | Keycloak 23+ | $0 | ✅ Apache 2.0 | ❌ No | Docker image (official) |
| **Email** | Brevo (or MailDev for local) | $0 (300/day) | ❌ SaaS / ✅ OSS | ⚠️ Brevo: Yes / MailDev: No | SaaS signup / Docker image |
| **PDF Generation** | Puppeteer | $0 | ✅ Apache 2.0 | ❌ No | npm install in Dockerfile |
| **Containerization** | Docker + Compose | $0 | ✅ Apache 2.0 | ❌ No | [docker.com](https://docker.com) (~1GB) |
| **Web Server** | Nginx | $0 | ✅ BSD | ❌ No | Docker image (official) |
| **CI/CD** | GitHub Actions | $0 (2K min/mo) | ❌ SaaS | ⚠️ Optional | GitHub account |

### **With Docker - Total Cost Breakdown**

**Monthly Recurring Costs:**
- Infrastructure: **$0** (Oracle Always Free)
- Database: **$0** (Self-hosted PostgreSQL)
- Caching: **$0** (Self-hosted Redis)
- Authentication: **$0** (Self-hosted Keycloak)
- Email: **$0** (Brevo free tier: 300/day OR MailDev local)
- CI/CD: **$0** (GitHub Actions free tier: 2,000 min/month)

**One-Time Setup:**
- Docker Desktop: ~1GB download
- Docker images: ~2-3GB (PostgreSQL, Redis, Keycloak, Node, Nginx)
- Internet bandwidth: ~4-5GB total

**Credit Card Required:** 
- ✅ Oracle Cloud (account verification only, never charged on free tier)
- ⚠️ Brevo (optional - use MailDev instead for local testing)
- ⚠️ GitHub (optional - only if exceeding free tier)

**Grand Total: $0/month** ✅  
**Setup Complexity:** ⭐⭐⭐⭐ Medium  
**Best For:** Production, Team Collaboration, Consistent Environments

---

## Quick Decision Guide

### **Choose "Without Docker" if:**
- ✅ Building quick POC (1-2 weeks)
- ✅ Solo developer / learning
- ✅ Want minimal setup complexity
- ✅ Have limited RAM (<8GB)
- ✅ Windows 7/8 (no WSL2 support)
- ✅ Don't need Redis/Keycloak initially

### **Choose "With Docker" if:**
- ✅ Building production-ready system
- ✅ Team of 2+ developers
- ✅ Want identical dev/prod environments
- ✅ Need all services (Redis, Keycloak, email testing)
- ✅ Have 16GB+ RAM
- ✅ Planning to deploy to cloud

### **Technology Breakdown Summary**

| Metric | Without Docker | With Docker |
|--------|----------------|-------------|
| **Total Technologies** | 14 | 15 |
| **Open Source Count** | 13 out of 14 (93%) | 12 out of 15 (80%) |
| **Require Credit Card** | 0 | 1-3 (optional) |
| **Monthly Cost** | $0 | $0 |
| **Disk Space Required** | ~5 GB | ~10 GB |
| **RAM Recommended** | 8 GB | 16 GB |
| **Internet Required** | Initial download only | Initial + deployment |

---

# Scaling Considerations

## Phase 1 Scaling (POC)
**Target:** 1-50 users for testing  
**Current Setup:** Localhost, single developer machine

**When Phase 1 Becomes Insufficient:**
- ⚠️ More than 50 concurrent users (localhost can't handle load)
- ⚠️ Need internet access for external stakeholders
- ⚠️ Need real email notifications
- ⚠️ Team collaboration required (multiple developers)
- ⚠️ Need LDAP/AD integration for corporate SSO

**Action:** Migrate to Phase 2 ✅

---

## Phase 2 Scaling (Production)
**Target:** 50K+ employees on Oracle Cloud Free Tier  
**Current Setup:** Docker Compose, single server

### **Free Tier Limits**

| Service | Free Tier Limit | Sufficient For | Upgrade Trigger |
|---------|----------------|----------------|-----------------|
| **Oracle Cloud** | Always Free (no limit) | 50-100K employees | Need more than 24GB RAM |
| **Brevo Email** | 300 emails/day (~9K/month) | 500-1,000 interventions/month | Exceeding 300/day |
| **GitHub Actions** | 2,000 minutes/month | ~30-40 deployments/month | Frequent deployments |
| **Docker Compose** | N/A (single server) | 50K employees (Phase 1) | Need horizontal scaling |

### **When to Scale Beyond Free Tier**

**Scenario 1: High Email Volume** (>300/day)
- **Trigger:** More than 1,000 interventions assigned per day
- **Solution:** Upgrade Brevo to Lite Plan ($25/month for 10K emails/day)
- **Cost:** $25/month

**Scenario 2: More Compute Power** (>24GB RAM)
- **Trigger:** More than 100K active employees
- **Solution:** Add paid Oracle Cloud VMs or migrate to multiple servers
- **Cost:** ~$10-50/month per additional VM

**Scenario 3: High Availability** (Redundancy required)
- **Trigger:** System becomes business-critical, can't afford downtime
- **Solution:** Migrate from Docker Compose → Kubernetes (multi-server)
- **Setup:** 3+ nodes (1 master + 2 workers)
- **Cost:** Additional VM costs only (~$30-100/month for 3 VMs)

**Scenario 4: Frequent Deployments** (>40/month)
- **Trigger:** CI/CD minutes exceeded (2,000/month limit)
- **Solution:** Self-hosted GitLab CI runner or pay for extra minutes
- **Cost:** $0 (self-hosted) or $0.008/minute (GitHub)

### **Scaling Path**

```
Phase 1 (POC)
  1-50 users, localhost
  $0/month
      ↓
Phase 2 (Production)
  50-100K employees, Oracle Free Tier
  $0/month
      ↓
Phase 3 (Scale-Up) - If needed
  100-500K employees, paid VMs + Kubernetes
  ~$50-200/month
      ↓
Phase 4 (Enterprise) - If needed
  500K+ employees, multi-region, HA
  ~$500-2000/month (commercial hosting)
```

**Most organizations stay in Phase 2 indefinitely!** ✅

---

# License Compliance

All open-source software used in this stack has **enterprise-friendly permissive licenses**:

## License Breakdown

| License Type | Technologies | Commercial Use | Attribution Required |
|--------------|--------------|----------------|---------------------|
| **MIT** | Node.js, NestJS, React, Vite, Ant Design, Passport, JWT, MailDev | ✅ Yes | ⚠️ Recommended |
| **Apache 2.0** | TypeScript, Keycloak, ECharts, Puppeteer, Docker | ✅ Yes | ⚠️ Recommended |
| **BSD (2/3-Clause)** | PostgreSQL, Redis, Nginx | ✅ Yes | ⚠️ Recommended |

## Key Points

✅ **No Copyleft Licenses** (GPL/AGPL) - No requirement to open-source your code  
✅ **Commercial Use Allowed** - Can be used in corporate environments  
✅ **Modification Allowed** - Can customize and extend  
✅ **Distribution Allowed** - Can deploy internally or externally  
⚠️ **Attribution Recommended** - Include license notices (best practice)

## License Compliance Checklist

For production deployment, include these files in your repository:

- [ ] `LICENSE.md` - Your application license
- [ ] `THIRD_PARTY_LICENSES.md` - List all open-source dependencies
- [ ] `NOTICE.md` - Required attributions (especially Apache 2.0)

**All licenses used are compatible with corporate/commercial use.** ✅

---

# Final Summary

## Technology Stack Overview

### **Phase 1: Local POC (Without Docker)**
```yaml
Environment: Localhost (Windows/macOS/Linux)
Cost: $0/month
Setup Time: 30 minutes
Complexity: ⭐⭐ Low
Best For: Quick POC, Solo Dev, Learning

Stack:
  - PostgreSQL 15 (local install)
  - Node.js 20 + NestJS 10
  - React 18 + Ant Design 5 + ECharts
  - JWT Authentication
  - Console Email Logging
  - Puppeteer PDF
  
Services: 3 (DB, Backend, Frontend)
RAM: ~1.5 GB
Credit Cards: 0
Open Source: 100% (13/13)
```

### **Phase 2: Production (With Docker)**
```yaml
Environment: Oracle Cloud Free Tier
Cost: $0/month
Setup Time: 2-3 hours
Complexity: ⭐⭐⭐⭐ Medium-High
Best For: Production, Team Dev, Enterprise

Stack:
  - Docker + Docker Compose
  - PostgreSQL 15 (container)
  - Redis 7 (container)
  - Keycloak 23 (container)
  - Node.js 20 + NestJS 10 (container)
  - React 18 + Ant Design 5 + ECharts
  - Nginx (container)
  - Brevo Email (or MailDev)
  - Puppeteer PDF
  - GitHub Actions CI/CD
  
Services: 5+ containers
RAM: ~5-6 GB
Credit Cards: 1-3(optional)
Open Source: 81% (13/16)
```

---

## Decision Matrix

**Choose Phase 1 if:**
- Building POC in 1-2 weeks ✅
- Solo developer
- Testing features and requirements
- Windows 7/8 or limited RAM (<8GB)
- No Docker experience

**Choose Phase 2 if:**
- Deploying to production ✅
- Team of 2+ developers
- Need enterprise SSO (LDAP/AD)
- Supporting 50K+ real employees
- Require HTTPS, high performance, CI/CD

**Start Phase 1 → Migrate to Phase 2:**
- Best approach for learning and validation ✅
- Migration takes 2-3 days
- 95% code reusability

---

## Quick Stats Comparison

| Metric | Phase 1 | Phase 2 |
|--------|---------|---------|
| **Monthly Cost** | $0 | $0 |
| **Setup Time** | 30 min | 2-3 hrs |
| **RAM Usage** | 1.5 GB | 5-6 GB |
| **Services** | 3 | 5+ |
| **Technologies** | 13 | 16 |
| **Open Source %** | 100% | 81% |
| **Credit Cards** | 0 | 1-3 (optional) |
| **Capacity** | 50 users | 50K+ employees |
| **Startup Time** | 5-10 sec | 30-60 sec |
| **Production Ready** | ❌ No | ✅ Yes |

---

## Recommended Implementation Path

```
Week 1-2: Develop Phase 1 (localhost, no Docker)
    ↓
Week 3: Test & validate with stakeholders
    ↓  
Week 4: Prepare migration (create Dockerfiles)
    ↓
Week 5: Deploy Phase 2 locally (test Docker setup)
    ↓
Week 6: Deploy to Oracle Cloud
    ↓
Week 7: Configure Keycloak, migrate users
    ↓
Week 8: Production testing & go-live
```

**Total: 8 weeks from start to production** ✅

---

## Key Takeaways

1. **$0 Total Cost** - Both phases are completely free
2. **100% Open Source Core** - All critical components are open-source
3. **No Credit Cards for Phase 1** - Perfect for POC without any signups
4. **Enterprise-Ready Phase 2** - SSO, caching, real emails, CI/CD
5. **Easy Migration** - 95% code reusability between phases
6. **Scalable** - Supports 50K+ employees on free tier
7. **Production-Grade** - Docker, Nginx, Keycloak, Redis
8. **Compliance-Friendly** - All permissive licenses (MIT, Apache 2.0, BSD)

---

**Document Version:** 2.0  
**Created:** April 25, 2026  
**Updated:** April 25, 2026 (Two-Phase Restructure)  
**Authors:** Solution Architecture Team  
**Next Review:** Post Phase 1 POC Completion

---

## Support & Resources

### **Phase 1 Resources**
- Node.js Download: https://nodejs.org
- PostgreSQL Download: https://www.postgresql.org/download/
- NestJS Documentation: https://docs.nestjs.com
- React Documentation: https://react.dev
- Ant Design Components: https://ant.design/components/

### **Phase 2 Resources**
- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Oracle Cloud Free Tier: https://cloud.oracle.com/free
- Keycloak Documentation: https://www.keycloak.org/docs/latest/
- GitHub Actions: https://docs.github.com/en/actions
- Brevo (Email): https://www.brevo.com

### **Learning Resources**
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- PostgreSQL Tutorial: https://www.postgresqltutorial.com
- Docker Tutorial: https://docs.docker.com/get-started/
- Keycloak Getting Started: https://www.keycloak.org/guides

---

## Appendix: Project Structure

```
corporate-learning-system/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication (JWT/Keycloak)
│   │   │   ├── users/         # User management
│   │   │   ├── courses/       # Course data
│   │   │   ├── risk-rules/    # Risk rules engine
│   │   │   ├── interventions/ # Intervention tracking
│   │   │   ├── compliance/    # Compliance reports
│   │   │   ├── email/         # Email service
│   │   │   └── pdf/           # PDF generation
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile             # Phase 2 only
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard/
│   │   │   ├── RiskRules/
│   │   │   ├── Interventions/
│   │   │   ├── Compliance/
│   │   │   └── Reports/
│   │   ├── services/          # API clients
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile             # Phase 2 only
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml         # Phase 2 only
├── .env.example              # Environment variables template
├── README.md
└── techstack.md              # This document

```

---

**END OF DOCUMENT**

│  │              │  • Static files        │                 │ │
│  │              │  • Reverse proxy       │                 │ │
│  │              └──────┬─────────────────┘                 │ │
│  └─────────────────────┼───────────────────────────────────┘ │
└────────────────────────┼──────────────────────────────────────┘
                         │
                         ▼
                    Users (SSO)
                         ▲
                         │
                   GitHub Actions
                  (Deploy on Push)
```

**Services:** 5 containers (PostgreSQL, Redis, Keycloak, Backend, Frontend)  
**Optional:** MailDev (email testing)  
**Memory:** ~5 GB  
**Startup:** 30-60 seconds

---

## Final Recommendations

### **For Your Use Case:**

| Scenario | Recommended Approach | Reason |
|----------|---------------------|---------|
| **Quick POC (1-2 weeks)** | ⭐ **Without Docker** | Minimal setup, fast iteration, solo development |
| **Team POC (2-4 weeks)** | ⭐⭐ **With Docker** | Consistent environments, easy onboarding |
| **Production Deployment** | ⭐⭐⭐ **With Docker + Oracle Cloud** | Scalable, enterprise-ready, zero cost |
| **Learning NestJS/React** | ⭐ **Without Docker** | Simple debugging, clear mental model |
| **Full Feature Set** | ⭐⭐⭐ **With Docker** | Redis, Keycloak, email testing included |

### **Migration Path:**
```
Start: Without Docker (POC) 
  ↓ (2-3 days to migrate)
Intermediate: With Docker (Local)
  ↓ (1 day to deploy)
Production: With Docker (Oracle Cloud)
```

You can start with **Without Docker** and migrate to Docker later when needed. The application code remains identical.

---

**Document Version:** 2.0  
**Created:** April 25, 2026  
**Updated:** April 25, 2026 (Added Without Docker option)  
**Next Review:** Post Phase 1 Deployment

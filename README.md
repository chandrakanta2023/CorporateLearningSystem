# Corporate Learning System - Phase 1 POC

**Progress, Intervention & Compliance Tracking System**

A complete full-stack application for tracking employee learning progress, automating interventions, and generating compliance reports.

---

## 🎯 Project Overview

This is a **Phase 1 Local POC (Proof of Concept)** implementation using 100% open-source technologies with zero cost.

### Key Features
- 📊 Real-time progress tracking
- 🎯 Automated intervention system
- 📋 Compliance reporting
- 👥 Role-based user management
- 🔒 JWT authentication
- 📈 Analytics dashboard

---

## 🚀 Quick Start

### Prerequisites
- ✅ Node.js v24.15.0 (Configured via `setup-env.ps1`)
- ✅ npm v11.12.1
- ✅ PostgreSQL 16.1 (Installed and running)
- ⚠️ **Action Required:** Create database (run `setup-database.ps1`)
- ⚠️ Git (To be installed - optional)

### Environment Setup

1. **Configure Development Environment**
   ```powershell
   # Run setup script to configure Node.js v24 and PostgreSQL paths
   .\setup-env.ps1
   ```

2. **Create Database** ⚠️ **REQUIRED**
   ```powershell
   # Run this script and enter your PostgreSQL password
   .\setup-database.ps1
   ```

3. **Update Database Credentials**
   ```powershell
   # Edit backend\.env and set your PostgreSQL password:
   DB_PASSWORD=your_actual_password
   ```

4. **Start Backend API**
   ```powershell
   cd backend
   npm run start:dev
   ```
   Backend will run on: `http://localhost:3000`  
   **Will auto-create database tables on first start!**

5. **Start Frontend** (New terminal)
   ```powershell
   cd frontend
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173`

6. **Verify Connection**
   - Open brentities/          # TypeORM database entities
│   │   │   ├── user.entity.ts       # User model (admin, manager, employee)
│   │   │   ├── course.entity.ts     # Course model (mandatory, optional, certification)
│   │   │   ├── enrollment.entity.ts # User-Course enrollment & progress
│   │   │   └── intervention.entity.ts # Automated reminders/escalations
│   │   ├── health/            # Health check module (includes DB status)
│   │   ├── app.module.ts      # Root module (ConfigModule, TypeORM, HealthModule)
│   │   └── main.ts            # App entry (CORS, global prefix configured)
│   ├── .env                   # Environment variables (DB credentials here!)

---

## 📁 Project Structure

```
Corporate_Learning_System/
│
├── backend/                    # NestJS API Server
│   ├── src/
│   │   ├── health/            # Health check module
│   │   ├── app.module.ts      # Root module (ConfigModule, HealthModule)
│   │   └── main.ts            # App entry (CORS, global prefix configured)
│   ├── .env                   # Environment variables
│   ├── API.md                 # API documentation
│   └── BACKEND_README.md      # Backend documentation
│
├── frontend/                   # React + Vite Frontend
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts         # Axios instance + API methods
│   ├── setup.md               # Installation guide
│   └── database-setup.md      # Database configuration guide
│
├── setup-env.ps1              # Environment setup script (Node.js + PostgreSQL PATH)
├── setup-database.ps1         # Database creation script (run this!)
├── POSTGRESQL_SETUP_SUMMARY.md # PostgreSQL configuration summary
├── .vscode/                    # VS Code configuration
│   ├── settings.json          # Node.js PATH + workspace settings
│   └── extensions.json        # Recommended extensions
│
├── setup-env.ps1              # Environment setup script
├── techstack.md               # Technology stack documentation (2400+ lines)
├── TODOlist.md                # Implementation checklist (145 tasks)
└── README.md                  # This file
```

---

## 🛠️ Technology Stack

### Backend
- **Framework:** NestJS 11
- **Runtime:** Node.js 24.15.0
- **Language:** TypeScript 5
- **Database:** PostgreSQL 15 (pending setup)
- **ORM:** TypeORM (to be co6.1 ✓
- **ORM:** TypeORM ✓
- **Auth:** JWT + Passport.js (to be implemented)
- **API Style:** RESTful with `/api/v1` prefix

**Database Entities:**
- User (admin, manager, employee roles)
- Course (mandatory, optional, certification)
- Enrollment (progress tracking & status)
- Intervention (automated reminders)
### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 8
- **Language:** TypeScript 5
- **HTTP Client:** Axios 1.7+
- **Styling:** CSS3 with CSS Variables
- **UI Library:** Ant Design 5 (to be added)
- **Charts:** Apache ECharts (to be added)

### Development Tools
- **Node.js:** v24.15.0 (LTS)
- **Package Manager:** npm 11.12.1
- **IDE:** VS Code with recommended extensions
- **Linting:** ESLint + Prettier
- **Testing:** Jest (configured)

**Total Technologies:** 13 | **Cost:** $0 | **Credit Cards Required:** 0
 + 1.2)
- ✅ Node.js v24.15.0 configured
- ✅ PostgreSQL 16.1 installed and verified
- ✅ NestJS CLI installed globally
- ✅ Backend project initialized
- ✅ TypeORM + PostgreSQL driver installed
- ✅ Database entities created (User, Course, Enrollment, Intervention)
- ✅ Database connection configured
- ✅ Health check endpoint (`/api/v1/health`) with DB status ✓
- ✅ Main API endpoint: `/api/v1` ✓
- ✅ CORS configured for frontend
- ✅ Environment variables setup
- ✅ F**Database creation** (script ready - needs execution)
- 🔄 Git installation
- 🔄 User authentication module
- 🔄 Course management module

### Pending (Next Milestones)
- ⏳ User management (CRUD)
- ⏳ Course management (CRUD)
- ⏳ Progress tracking system  
- ⏳ Compliance reporting
- ⏳ Email notifications (console-based)
- ⏳ Ant Design UI integration
- ⏳ Apache ECharts dashboards

**Progress:** 15/145 tasks completed (10.3
- 🔄 PostgreSQL installation
- 🔄 Git installation
- 🔄 Database schema design
- 🔄 User authentication module
- 🔄 Course management module

### Pending (Next Milestones)
- ⏳ TypeORM integration
- ⏳ User management (CRUD)
- ⏳ Course management (CRUD)
- ⏳ Progress tracking system
- ⏳ Compliance reporting
- ⏳ Email notifications (console-based)
- ⏳ Ant Design UI integration
- ⏳ Apache ECharts dashboards

**Progress:** 8/145 tasks completed (5.5%)

---

## 📊 API Endpoints

### Health Check
```
GET /api/v1/health,
  "database": {
    "status": "connected",
    "type": "PostgreSQL",
    "message": "PostgreSQL 16.1"
  }
```
Returns:
```json
{
  "status": "ok",
  "timestamp": 1777105911512,
  "uptime": 36.58,
  "environment": "development",
  "version": "1.0.0"
}
```

### Coming Soon
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/users` - List users
- `GET /api/v1/courses` - List courses
- `GET /api/v1/progress/:userId` - Get user progress
- `GET /api/v1/compliance/report` - Compliance report

See [backend/API.md](backend/API.md) for complete API documentation.

---

## 🔧 Configuration Files

### Backend Environment (`.env`)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=corporate_learning_db
JWT_SECRET=dev-secret-key-12345
CORS_ORIGIN=http://localhost:5173
```

### VS Code Settings (`.vscode/settings.json`)
- Node.js PATH automatically configured
- ESLint and Prettier enabled
- Format on save enabled

---
PostgreSQL Setup:** [POSTGRESQL_SETUP_SUMMARY.md](POSTGRESQL_SETUP_SUMMARY.md) - **READ THIS FIRST!**
- **Database Configuration:** [docs/database-setup.md](docs/database-setup.md)
- **
## 📚 Documentation

- **Technology Stack:** [techstack.md](techstack.md) - Complete two-phase strategy
- **Implementation Plan:** [TODOlist.md](TODOlist.md) - 145 tasks with role markers
- **Backend API:** [backend/API.md](backend/API.md) - API endpoints
- **Backend Docs:** [backend/BACKEND_README.md](backend/BACKEND_README.md)
- **Frontend Docs:** [frontend/FRONTEND_README.md](frontend/FRONTEND_README.md)
- **Setup Guide:** [docs/setup.md](docs/setup.md) - Installation instructions

---

## 🎓 Development Workflow

1. **Make Changes**
   - Backend: Edit files in `backend/src/` → Hot-reload automatically
   - Frontend: Edit files in `frontend/src/` → HMR updates instantly

2. **Test Changes**
   - Backend: `http://localhost:3000/api/v1/health`
   - Frontend: `http://localhost:5173`

3. **Check for Errors**
   - Backend console shows compile/runtime errors
   - Frontend browser console shows errors
   - VS Code shows TypeScript errors inline

4. **Commit Changes** (after Git installation)
   ```powershell
   git add .
   git commit -m "Description of changes"
   ```

---

## 🚨 Troubleshooting

### Backend won't start
- Check if port 3000 is available
- Verify Node.js v24 is active: `node --version`
- Check `.env` file exists

### Frontend won't start
- Check if port 5173 is available
- Verify npm dependencies installed: `cd frontend && npm install`

### Backend connection error on frontend
- Ensure backend is running: `http://localhost:3000/api/v1/health`
- Check CORS settings in `backend/src/main.ts`
- Verify no firewall blocking localhost

### PostgreSQL connection error
- PostgreSQL not yet installed (Phase 1 pending task)
- Will be needed for database operations
- Health check works without PostgreSQL
Complete Database Setup** ⚠️ **REQUIRED**
   ```powershell
   # Run database creation script
   .\setup-database.ps1
   
   # Update backend/.env with your PostgreSQL password
   # Edit: DB_PASSWORD=your_password
   
   # Restart backend server
   cd backend
   npm run start:dev
   ```

2. **Verify Tables Created**
   - Backend will auto-create: users, courses, enrollments, interventions
   - Check health endpoint: http://localhost:3000/api/v1/health
   - Database status should show "connected"

3. **Install Git** (Optional but recommended)
   - Download: https://git-scm.com/download/windows
   - Initialize repository: `git init`

4. **Continue Implementation**
   - Follow [TODOlist.md](TODOlist.md) for remaining tasks
   - Install Ant Design: `cd frontend && npm install antd`
   - Implement user authentication
   - Create CRUD endpoints

---

## 🚀 Quick Start (After Database Setup)

```powershell
# Terminal 1: Backend
.\setup-env.ps1
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Open browser
http://localhost:5173
```ackend && npm install @nestjs/typeorm typeorm pg`

4. **Complete Milestone 1.2**
   - Implement user authentication
   - Create database schema
   - Add JWT middleware

---

## 🔒 Security Notes

- `.env` file is gitignored (never commit!)
- JWT secret should be changed in production
- CORS restricted to `localhost:5173` only
- PostgreSQL credentials should be strong in production

---

## 📄 License

UNLICENSED - Internal Corporate Use Only

---

## 👥 Support

For issues or questions:
1. Check [TODOlist.md](TODOlist.md) for known tasks
2. Review [techstack.md](techstack.md) for architecture decisions
3. Consult API documentation in [backend/API.md](backend/API.md)

---

**Built with ❤️ using 100% Open Source Technologies**

**Phase 1 Target:** 1-2 weeks | **Phase 2 Target:** TBD  
**Last Updated:** April 25, 2026 | **Version:** 1.0.0

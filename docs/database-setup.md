# Database Configuration Instructions

## Step 1: Run Database Setup Script

Execute the following command to create the database:

```powershell
.\setup-database.ps1
```

This script will:
- Prompt for your PostgreSQL password
- Create the `corporate_learning_db` database
- Verify the connection

## Step 2: Update Backend Environment Variables

Edit `backend/.env` and set your PostgreSQL password:

```env
DB_PASSWORD=your_actual_postgres_password
```

## Step 3: Start Backend Server

The backend will automatically:
- Connect to PostgreSQL
- Create all required tables (Users, Courses, Enrollments, Interventions)
- Run database migrations

```powershell
cd backend
npm run start:dev
```

## Database Schema

The system will create the following tables:

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `firstName`, `lastName`
- `role` (admin, manager, employee)
- `department`
- `managerId`
- `isActive`
- Timestamps

### Courses Table
- `id` (UUID, Primary Key)
- `title`, `description`
- `type` (mandatory, optional, certification)
- `durationHours`
- `deadline`
- `department`
- `isActive`
- Timestamps

### Enrollments Table
- `id` (UUID, Primary Key)
- `userId`, `courseId` (Foreign Keys)
- `status` (not_started, in_progress, completed, failed)
- `progressPercentage`
- `startedAt`, `completedAt`, `dueDate`
- `remindersSent`, `lastReminderSentAt`
- Timestamps

### Interventions Table
- `id` (UUID, Primary Key)
- `enrollmentId`, `userId`, `courseId`
- `type` (reminder, escalation, warning)
- `status` (pending, sent, failed)
- `message`, `recipientEmail`
- `sentAt`, `errorMessage`
- Timestamps

## Verification

Check the health endpoint to verify database connection:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "database": {
    "status": "connected",
    "type": "PostgreSQL",
    "message": "PostgreSQL <detected-version>"
  }
}
```

## Troubleshooting

### Connection Failed
- Verify PostgreSQL service is running: `Get-Service | Where-Object { $_.Name -match 'postgresql-x64-' }`
- Check credentials in `.env` file
- Ensure database exists: Run `setup-database.ps1`

### Authentication Failed
- Verify password in `.env` matches PostgreSQL installation
- Default user is `postgres`

### Tables Not Created
- Check `NODE_ENV=development` in `.env`
- Verify `synchronize: true` in TypeORM config (development only)
- Check backend console for migration errors

## Manual Database Access

Connect to PostgreSQL manually:

```powershell
$env:PGPASSWORD='your_password'
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d corporate_learning_db
```

List tables:
```sql
\dt
```

Check users table:
```sql
SELECT * FROM users;
```

---

Last Updated: April 25, 2026

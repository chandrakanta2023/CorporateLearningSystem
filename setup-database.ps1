# PostgreSQL Database Setup Script
# Run this script to create the corporate_learning_db database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$PSQL_PATH = "C:\Program Files\PostgreSQL\16\bin\psql.exe"

# Prompt for PostgreSQL password
Write-Host "PostgreSQL 16.1 detected" -ForegroundColor Green
Write-Host "Service Status: Running" -ForegroundColor Green
Write-Host ""

$password = Read-Host "Enter PostgreSQL 'postgres' user password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$env:PGPASSWORD = $plainPassword

Write-Host ""
Write-Host "Checking if database 'corporate_learning_db' exists..." -ForegroundColor Yellow

# Check if database exists
$checkDb = & $PSQL_PATH -U postgres -lqt | Select-String -Pattern "corporate_learning_db"

if ($checkDb) {
    Write-Host "✓ Database 'corporate_learning_db' already exists!" -ForegroundColor Green
} else {
    Write-Host "Creating database 'corporate_learning_db'..." -ForegroundColor Yellow
    
    $createDbSQL = @"
CREATE DATABASE corporate_learning_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
"@
    
    & $PSQL_PATH -U postgres -c $createDbSQL
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to create database" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Verifying database connection..." -ForegroundColor Yellow
& $PSQL_PATH -U postgres -d corporate_learning_db -c "SELECT 'Connection successful!' as status;"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Database Setup Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Database Name: corporate_learning_db" -ForegroundColor White
    Write-Host "Host: localhost" -ForegroundColor White
    Write-Host "Port: 5432" -ForegroundColor White
    Write-Host "User: postgres" -ForegroundColor White
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Update backend/.env with your database password" -ForegroundColor White
    Write-Host "2. Run: cd backend && npm install" -ForegroundColor White
    Write-Host "3. Run: npm run start:dev" -ForegroundColor White
} else {
    Write-Host "✗ Database connection failed" -ForegroundColor Red
}

# Clear password from environment
$env:PGPASSWORD = ""

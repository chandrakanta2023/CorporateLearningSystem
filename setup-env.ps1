# Corporate Learning System - Development Environment Setup
# This script configures the development environment to use Node.js v24.15.0

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Corporate Learning System - Dev Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Node.js Configuration
$NODE_PATH = "C:\Technothon\node-v24.15.0-win-x64"

# PostgreSQL Configuration
$PGSQL_PATH = "C:\Program Files\PostgreSQL\16\bin"

# Add Node.js and PostgreSQL to PATH for this session
$env:PATH = "$NODE_PATH;$PGSQL_PATH;$env:PATH"

# Verify versions
Write-Host "✓ Node.js Version:" -ForegroundColor Green
node --version
Write-Host ""

Write-Host "✓ npm Version:" -ForegroundColor Green
npm --version
Write-Host ""

# Check PostgreSQL
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = &"$PGSQL_PATH\psql.exe" --version 2>$null
    if ($pgVersion) {
        Write-Host "✓ PostgreSQL: $pgVersion" -ForegroundColor Green
        $pgService = Get-Service -Name "postgresql-x64-16" -ErrorAction SilentlyContinue
        if ($pgService -and $pgService.Status -eq 'Running') {
            Write-Host "✓ PostgreSQL Service: Running" -ForegroundColor Green
        } else {
            Write-Host "⚠ PostgreSQL Service: Not running" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "✗ PostgreSQL: Not installed or not in PATH" -ForegroundColor Red
    Write-Host "  Install from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
}
Write-Host ""

# Check Git
Write-Host "Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✓ Git: $gitVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Git: Not installed or not in PATH" -ForegroundColor Red
    Write-Host "  Install from: https://git-scm.com/download/windows" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Environment Ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Install missing dependencies (if any)" -ForegroundColor White
Write-Host "2. Run: cd backend && npm install" -ForegroundColor White
Write-Host "3. Run: cd frontend && npm install" -ForegroundColor White
Write-Host ""

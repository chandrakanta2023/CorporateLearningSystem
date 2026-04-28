$ErrorActionPreference = 'Stop'

Write-Host 'Starting Corporate Learning System local demo...' -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error 'Docker Desktop is required for the one-click local demo mode.'
  exit 1
}

cmd /c "docker info >nul 2>nul"
if ($LASTEXITCODE -ne 0) {
  Write-Error 'Docker Desktop is installed but not running. Start Docker Desktop, wait until the engine is ready, then run this script again.'
  exit 1
}

docker compose -f docker-compose.demo.yml up --build -d

if ($LASTEXITCODE -ne 0) {
  Write-Error 'Local demo failed to start.'
  exit $LASTEXITCODE
}

Write-Host ''
Write-Host 'Local demo is starting.' -ForegroundColor Green
Write-Host 'Frontend: http://localhost:8080' -ForegroundColor White
Write-Host 'Backend health: http://localhost:3000/health' -ForegroundColor White
Write-Host 'API docs: http://localhost:3000/api/docs' -ForegroundColor White
Write-Host 'Demo login: admin@company.com / Admin@1234' -ForegroundColor White

Start-Process 'http://localhost:8080'
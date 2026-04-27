Write-Host "Corporate Learning System setup starting..." -ForegroundColor Cyan

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js is not installed or not in PATH."
  exit 1
}

if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "npm is not installed or not in PATH."
  exit 1
}

Set-Location backend
if (!(Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Created backend/.env from template. Update DB_PASSWORD if needed." -ForegroundColor Yellow
}

npm install
npm run seed

Set-Location ..

Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Start backend:  cd backend; npm run start:dev"
Write-Host "Start frontend: cd frontend; npm run dev"

Write-Host "Corporate Learning System setup starting..." -ForegroundColor Cyan

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js is not installed or not in PATH."
  exit 1
}

if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "npm is not installed or not in PATH."
  exit 1
}

$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlCmd) {
  $psqlPath = $psqlCmd.Source
} elseif (Test-Path "C:\Program Files\PostgreSQL\16\bin\psql.exe") {
  $psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
} else {
  Write-Error "PostgreSQL client (psql) is not installed or not in PATH."
  exit 1
}

Set-Location backend
if (!(Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Created backend/.env from template. Update DB_PASSWORD if needed." -ForegroundColor Yellow
}

npm install
npm run db:init

$cfg = @{}
Get-Content .env | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { return }
  $parts = $line.Split("=", 2)
  if ($parts.Length -eq 2) {
    $cfg[$parts[0]] = $parts[1]
  }
}

$dbHost = $cfg["DB_HOST"]
$dbPort = $cfg["DB_PORT"]
$dbUser = $cfg["DB_USERNAME"]
$dbPass = $cfg["DB_PASSWORD"]
$dbName = $cfg["DB_NAME"]

$env:PGPASSWORD = $dbPass
& $psqlPath -h $dbHost -p $dbPort -U $dbUser -d $dbName -f ".\\sql\\001_schema.sql"
& $psqlPath -h $dbHost -p $dbPort -U $dbUser -d $dbName -f ".\\sql\\002_seed_data.sql"
Set-Location ..

Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Start backend:  cd backend; npm run start:dev"
Write-Host "Start frontend: cd frontend; npm run dev"

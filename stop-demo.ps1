$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error 'Docker Desktop is required to stop the local demo containers.'
  exit 1
}

cmd /c "docker info >nul 2>nul"
if ($LASTEXITCODE -ne 0) {
  Write-Error 'Docker Desktop is installed but not running. Start Docker Desktop before stopping the local demo containers.'
  exit 1
}

docker compose -f docker-compose.demo.yml down
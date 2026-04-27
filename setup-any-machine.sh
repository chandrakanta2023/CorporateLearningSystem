#!/usr/bin/env bash
set -euo pipefail

echo "Corporate Learning System setup starting..."

command -v node >/dev/null 2>&1 || { echo "Node.js is not installed/in PATH"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is not installed/in PATH"; exit 1; }
PSQL_BIN="$(command -v psql || true)"
if [ -z "$PSQL_BIN" ] && [ -x "/c/Program Files/PostgreSQL/16/bin/psql.exe" ]; then
  PSQL_BIN="/c/Program Files/PostgreSQL/16/bin/psql.exe"
fi
[ -n "$PSQL_BIN" ] || { echo "psql is not installed/in PATH"; exit 1; }

cd backend
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created backend/.env from template. Update DB_PASSWORD if needed."
fi

npm install
npm run db:init

DB_HOST=$(grep '^DB_HOST=' .env | cut -d'=' -f2-)
DB_PORT=$(grep '^DB_PORT=' .env | cut -d'=' -f2-)
DB_USERNAME=$(grep '^DB_USERNAME=' .env | cut -d'=' -f2-)
DB_PASSWORD=$(grep '^DB_PASSWORD=' .env | cut -d'=' -f2-)
DB_NAME=$(grep '^DB_NAME=' .env | cut -d'=' -f2-)

PGPASSWORD="$DB_PASSWORD" "$PSQL_BIN" -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -f "./sql/001_schema.sql"
PGPASSWORD="$DB_PASSWORD" "$PSQL_BIN" -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -f "./sql/002_seed_data.sql"
cd ..

cd frontend
npm install
cd ..

echo ""
echo "Setup complete."
echo "Start backend:  cd backend && npm run start:dev"
echo "Start frontend: cd frontend && npm run dev"

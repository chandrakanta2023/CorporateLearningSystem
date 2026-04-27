#!/usr/bin/env bash
set -euo pipefail

echo "Corporate Learning System setup starting..."

command -v node >/dev/null 2>&1 || { echo "Node.js is not installed/in PATH"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is not installed/in PATH"; exit 1; }

cd backend
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created backend/.env from template. Update DB_PASSWORD if needed."
fi

npm install
npm run seed
cd ..

cd frontend
npm install
cd ..

echo ""
echo "Setup complete."
echo "Start backend:  cd backend && npm run start:dev"
echo "Start frontend: cd frontend && npm run dev"

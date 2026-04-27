# Backend Deployment Commands (Phase 1 Local POC)

## Production Build Check

From the backend directory:

```powershell
npm install
npm run build
npm run start:prod
```

Expected:

- App starts on port set by `PORT` in `.env` (default `3000`)
- Health endpoint responds: `http://localhost:3000/health`

## Required Environment Variables

Use `.env.example` as the template:

- `NODE_ENV`
- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `CORS_ORIGIN`

## Quick Validation

```powershell
curl http://localhost:3000/health
```

A healthy response should include:

- `status: ok`
- `timestamp`
- `database.status`

## Notes

- For local POC, database credentials are local development values.
- Do not commit `.env`.
- Keep `NODE_ENV=production` when running `start:prod`.

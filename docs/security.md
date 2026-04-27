# Security Notes (Phase 1)

## Current Controls

- Backend CORS configured to allow local frontend origin (`http://localhost:5173`)
- Frontend Content Security Policy meta policy in `frontend/index.html`
- Environment variables externalized via `.env` / `.env.example`
- `.env` ignored in root `.gitignore`

## Authentication

- JWT-based authentication is planned but not fully implemented in Phase 1 foundation.
- Public routes currently include health checks.

## Secret Management

- Never commit `.env` files.
- Use unique secrets per environment.
- Rotate secrets if exposed.

Generate a strong JWT secret locally:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Future Hardening Items

- Helmet headers
- Global validation pipes and DTO validation
- Rate limiting for authentication routes
- Role-based endpoint guards
- HTTPS configuration for deployed environments

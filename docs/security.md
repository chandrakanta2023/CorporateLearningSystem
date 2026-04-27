# Security Notes

## Current Controls

- Backend CORS configured for local frontend dev/preview origins with env override support
- Frontend Content Security Policy meta policy in `frontend/index.html`
- Global `ValidationPipe` enabled with `whitelist`, `forbidNonWhitelisted`, and `transform`
- JWT authentication with bearer tokens
- Role-based authorization guards for privileged endpoints
- Swagger configured with bearer auth support
- Environment variables externalized via `.env` / `.env.example`
- `.env` ignored in root `.gitignore`

## Authentication

- Implemented in `auth` module (`/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/profile`).
- Public routes are intentionally limited (for example: `GET /health`, login/register).

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
- Rate limiting for authentication routes
- HTTPS configuration for deployed environments
- Secret rotation process and audit policy retention controls

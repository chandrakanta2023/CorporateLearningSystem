# Security Checklist

## Development Checklist

- [ ] `.env` exists locally and is not committed
- [ ] No hardcoded passwords or secrets in source files
- [ ] CORS origin restricted for local/dev use
- [ ] CSP configured in frontend HTML
- [ ] Dependency vulnerabilities reviewed (`npm audit`)

## API Checklist

- [ ] Input validation on all POST/PATCH endpoints
- [ ] Authentication enforced on protected endpoints
- [ ] Role checks for sensitive actions
- [ ] Error responses do not leak sensitive internals

## Deployment Checklist

- [ ] `NODE_ENV=production`
- [ ] Strong JWT secret configured (32+ bytes)
- [ ] Database user uses least privilege
- [ ] HTTPS enabled in deployed environment
- [ ] Logs monitored for auth and access anomalies

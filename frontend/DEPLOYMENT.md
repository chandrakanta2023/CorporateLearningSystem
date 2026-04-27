# Frontend Build and Deployment (Phase 1 Local POC)

## Build Commands

From the frontend directory:

```powershell
npm install
npm run build
npm run preview
```

Preview server defaults to `http://localhost:4173`.

## Environment Variables

Optional build/runtime variable:

- `VITE_API_BASE_URL` (default: `http://localhost:3000`)

Example `.env` for frontend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Security Headers

The app includes a Content Security Policy in `index.html` with:

- `default-src 'self'`
- restricted `script-src`
- restricted `connect-src` for localhost backend/dev websocket

## Verification Checklist

- Build succeeds with no TypeScript errors.
- Home page loads and renders system status.
- Health check reaches backend at `GET /health`.
- Browser console contains no CSP violations for expected local flows.

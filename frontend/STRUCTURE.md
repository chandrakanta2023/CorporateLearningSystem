# Frontend Page Structure (Phase 1)

## Current Structure

```text
src/
  App.tsx                    # Root component
  App.css                    # Home page component styles
  main.tsx                   # App bootstrap
  pages/
    Home.tsx                 # Phase 1 landing page
  services/
    api.ts                   # Axios instance + health API client
  styles/
    global.css               # Global styles and design tokens
```

## Home Page Sections

- Header: product title, subtitle, version/build label
- System Status: backend/DB health block
- Phase 1 Features: four capability cards
- Technology Stack: frontend/backend/database/API summary
- Footer: POC metadata

## Data Flow

1. `Home.tsx` calls `healthApi.check()` on load.
2. Health check is repeated every 30 seconds.
3. UI displays loading, success, or error state.
4. API client reads backend host from `VITE_API_BASE_URL` when provided.

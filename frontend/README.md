# Corporate Learning System Frontend

React + TypeScript + Vite frontend for the Corporate Learning System Phase 1 POC.

## Prerequisites

- Node.js 20+
- npm 10+
- Backend running at `http://localhost:3000`

## Setup

1. Install dependencies:

```powershell
cd frontend
npm install
```

2. Start development server:

```powershell
npm run dev
```

3. Open `http://localhost:5173`.

## Environment Variables

Optional:

- `VITE_API_BASE_URL` (default: `http://localhost:3000`)

## Ant Design Setup

Ant Design is installed for Phase 2 UI implementation.

- Packages: `antd`, `@ant-design/icons`
- Base styles: `import 'antd/dist/reset.css'` in `src/main.tsx`
- Theme tokens are configured through `ConfigProvider` in `src/main.tsx`

## Build and Preview

```powershell
npm run build
npm run preview
```

## Related Docs

- UI structure: `STRUCTURE.md`
- Deployment guide: `DEPLOYMENT.md`
- Extended frontend notes: `FRONTEND_README.md`

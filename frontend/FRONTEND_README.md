# Corporate Learning System - Frontend

React + TypeScript + Vite frontend for the Corporate Learning System.

## Quick Start

### 1. Install Dependencies
```powershell
cd frontend
npm install
```

### 2. Start Development Server
```powershell
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Lint code with ESLint

## Features

### Phase 1 (Current)
- ✅ Backend health check integration
- ✅ Real-time status monitoring
- ✅ Responsive design
- ✅ Error handling
- ✅ Custom Corporate Learning branding
- 🔄 User authentication (Coming soon)
- 🔄 Progress tracking dashboard (Coming soon)
- 🔄 Compliance reporting (Coming soon)

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/        # Images, icons
│   ├── services/      # API services
│   │   └── api.ts     # Axios instance + API methods
│   ├── App.tsx        # Main app component
│   ├── App.css        # Main styles
│   ├── index.css      # Global styles
│   └── main.tsx       # Entry point
├── index.html         # HTML template
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
└── vite.config.ts     # Vite config
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api/v1`.

### Health Check
Automatically checks backend health every 30 seconds:
```typescript
import { healthApi } from './services/api';

const health = await healthApi.check();
// Returns: { status, timestamp, uptime, environment, version }
```

## Environment Requirements

- Node.js v20+ LTS
- npm v10+
- Backend running on `http://localhost:3000`

## Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite 8
- **Language:** TypeScript 5
- **HTTP Client:** Axios
- **Styling:** CSS3 with CSS Variables

## Development

### Hot Module Replacement (HMR)
Vite provides fast HMR - changes appear instantly without full page reload.

### ESLint Configuration
The project uses ESLint for code quality. Run `npm run lint` to check for issues.

## Production Build

```powershell
npm run build
```

Output will be in `dist/` folder. Deploy the contents to any static hosting service.

### Preview Production Build
```powershell
npm run preview
```

## Troubleshooting

### Backend Connection Error
- Ensure backend is running: `http://localhost:3000`
- Check CORS is enabled in backend
- Verify no firewall blocking localhost:3000

### Port 5173 already in use
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process
taskkill /PID <PID> /F
```

## Security

- CORS configured for localhost development
- Environment variables for API URL (production ready)
- No sensitive data in frontend code

## Future Delivery Roadmap (Phase 2)

- Ant Design UI library integration
- Apache ECharts for data visualization
- JWT authentication
- Role-based routing
- Real-time notifications
- Dashboard analytics

---

**Last Updated:** April 28, 2026  
**Version:** 1.0.0  
**Phase:** Phase 1 - Local POC

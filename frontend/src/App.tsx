import { Suspense, lazy, type ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { isAuthenticated } from './services/auth';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const RiskRules = lazy(() => import('./pages/RiskRules'));
const Interventions = lazy(() => import('./pages/Interventions'));
const Compliance = lazy(() => import('./pages/Compliance'));
const Reports = lazy(() => import('./pages/Reports'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));

function RequireAuth({ children }: { children: ReactElement }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppPage({ children }: { children: ReactElement }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AppPage><Login /></AppPage>} />
      <Route path="/signup" element={<AppPage><Signup /></AppPage>} />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />}
      />
      <Route path="/dashboard" element={<RequireAuth><AppPage><Dashboard /></AppPage></RequireAuth>} />
      <Route path="/risk-rules" element={<RequireAuth><AppPage><RiskRules /></AppPage></RequireAuth>} />
      <Route path="/interventions" element={<RequireAuth><AppPage><Interventions /></AppPage></RequireAuth>} />
      <Route path="/compliance" element={<RequireAuth><AppPage><Compliance /></AppPage></RequireAuth>} />
      <Route path="/reports" element={<RequireAuth><AppPage><Reports /></AppPage></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><AppPage><Profile /></AppPage></RequireAuth>} />
    </Routes>
  );
}

export default App;

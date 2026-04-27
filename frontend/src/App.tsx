import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RiskRules from './pages/RiskRules';
import Interventions from './pages/Interventions';
import Compliance from './pages/Compliance';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { isAuthenticated } from './services/auth';

function RequireAuth({ children }: { children: ReactElement }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />}
      />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/risk-rules" element={<RequireAuth><RiskRules /></RequireAuth>} />
      <Route path="/interventions" element={<RequireAuth><Interventions /></RequireAuth>} />
      <Route path="/compliance" element={<RequireAuth><Compliance /></RequireAuth>} />
      <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
    </Routes>
  );
}

export default App;

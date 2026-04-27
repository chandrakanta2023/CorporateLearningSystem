import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RiskRules from './pages/RiskRules';
import Interventions from './pages/Interventions';
import Compliance from './pages/Compliance';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/risk-rules" element={<RiskRules />} />
        <Route path="/interventions" element={<Interventions />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './modules/dashboard/Dashboard';
import FitnessDashboard from './modules/fitness/FitnessDashboard';
import ProjectsDashboard from './modules/projects/ProjectsDashboard';
import SocialFeed from './modules/social/SocialFeed';
import FinancialDashboard from './modules/finance/FinancialDashboard';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fitness" element={<FitnessDashboard />} />
          <Route path="/projects" element={<ProjectsDashboard />} />
          <Route path="/social" element={<SocialFeed />} />
          <Route path="/finance" element={<FinancialDashboard />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

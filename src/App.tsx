import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './modules/dashboard/Dashboard';
import FitnessDashboard from './modules/fitness/FitnessDashboard';
import ExerciseLibrary from './modules/fitness/ExerciseLibrary';
import WorkoutSession from './modules/fitness/WorkoutSession';
import WorkoutPlanner from './modules/fitness/WorkoutPlanner';
import ProjectsDashboard from './modules/projects/ProjectsDashboard';
import ProjectBoard from './modules/projects/ProjectBoard';
import PerformanceAnalytics from './modules/projects/PerformanceAnalytics';
import FinancialDashboard from './modules/finance/FinancialDashboard';
import AddTransaction from './modules/finance/AddTransaction';
import CalendarView from './modules/calendar/CalendarView';
import NotesManagement from './modules/notes/NotesManagement';
import Login from './modules/auth/Login';
import Register from './modules/auth/Register';
import ReportsDashboard from './modules/reports/ReportsDashboard';
import { AuthProvider, useAuth } from './store/AuthContext';
import { UIProvider } from './store/UIContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black italic tracking-tighter text-2xl animate-pulse">Loading MyPlan...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Routes wrapped in Layout */}
            <Route path="/*" element={
              <PrivateRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/fitness" element={<FitnessDashboard />} />
                    <Route path="/fitness/exercises" element={<ExerciseLibrary />} />
                    <Route path="/fitness/create-plan" element={<WorkoutPlanner />} />
                    <Route path="/fitness/session/:id" element={<WorkoutSession />} />
                    <Route path="/projects" element={<ProjectsDashboard />} />
                    <Route path="/projects/analytics" element={<PerformanceAnalytics />} />
                    <Route path="/projects/:id" element={<ProjectBoard />} />
                    <Route path="/finance" element={<FinancialDashboard />} />
                    <Route path="/finance/add" element={<AddTransaction />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/notes" element={<NotesManagement />} />
                    <Route path="/reports" element={<ReportsDashboard />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;

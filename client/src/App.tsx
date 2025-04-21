import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import EmployerDashboard from './components/dashboard/EmployerDashboard';
import CandidateSwipe from './components/swipe/CandidateSwipe';

// Role-based Route component
const RoleBasedRoute = ({ children, allowedRoles }: { 
  children: React.ReactNode; 
  allowedRoles: ('employee' | 'employer')[] 
}) => {
  const userRole = authService.getRole();
  
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={authService.getDashboardPath()} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Role-based Routes */}
        <Route
          path="/employee-dashboard"
          element={
            <RoleBasedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/employer-dashboard"
          element={
            <RoleBasedRoute allowedRoles={['employer']}>
              <EmployerDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/employer/candidates"
          element={
            <RoleBasedRoute allowedRoles={['employer']}>
              <CandidateSwipe />
            </RoleBasedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployeeProfileForm from './components/profile/EmployeeProfileForm';
import EmployerProfileForm from './components/profile/EmployerProfileForm';
import EmployeeLayout from './components/layout/EmployeeLayout';
import EmployerLayout from './components/layout/EmployerLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import { EmployerDashboard } from './pages/EmployerDashboard';

const PrivateRoute: React.FC<{ 
  children: React.ReactNode;
  role?: 'employee' | 'employer';
}> = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />

              {/* Employee Routes */}
              <Route
                path="/employee/*"
                element={
                  <PrivateRoute role="employee">
                    <EmployeeLayout>
                      <div className="container mx-auto px-4 py-8">
                        <Routes>
                          <Route path="dashboard" element={<div className="bg-white rounded-lg shadow p-6">Employee Dashboard</div>} />
                          <Route path="profile" element={<EmployeeProfileForm />} />
                          <Route path="jobs" element={<div className="bg-white rounded-lg shadow p-6">Jobs</div>} />
                          <Route path="matches" element={<div className="bg-white rounded-lg shadow p-6">Matches</div>} />
                          <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
                        </Routes>
                      </div>
                    </EmployeeLayout>
                  </PrivateRoute>
                }
              />

              {/* Employer Routes */}
              <Route
                path="/employer/*"
                element={
                  <PrivateRoute role="employer">
                    <EmployerLayout>
                      <div className="container mx-auto px-4 py-8">
                        <Routes>
                          <Route path="dashboard" element={<EmployerDashboard />} />
                          <Route path="profile" element={<EmployerProfileForm />} />
                          <Route path="jobs" element={<div className="bg-white rounded-lg shadow p-6">Jobs</div>} />
                          <Route path="candidates" element={<div className="bg-white rounded-lg shadow p-6">Candidates</div>} />
                          <Route path="*" element={<Navigate to="/employer/dashboard" replace />} />
                        </Routes>
                      </div>
                    </EmployerLayout>
                  </PrivateRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </ErrorBoundary>
  );
};

export default App;

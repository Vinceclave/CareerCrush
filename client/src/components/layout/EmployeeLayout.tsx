import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmployeeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-black font-semibold' : 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/employee/dashboard" className="text-xl font-bold text-black">
                  CareerCrush
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/employee/dashboard"
                  className={`${isActive('/employee/dashboard')} inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/employee/profile"
                  className={`${isActive('/employee/profile')} inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700`}
                >
                  Profile
                </Link>
                <Link
                  to="/employee/jobs"
                  className={`${isActive('/employee/jobs')} inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700`}
                >
                  Jobs
                </Link>
                <Link
                  to="/employee/matches"
                  className={`${isActive('/employee/matches')} inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700`}
                >
                  Matches
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default EmployeeLayout; 
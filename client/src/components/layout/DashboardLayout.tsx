import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Bell, User, Briefcase, Search, Settings, Users, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CandidateSwiper } from '../CandidateSwiper';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isEmployee = user?.role === 'employee';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getNavItems = () => {
    if (isEmployee) {
      return [
        { path: '/employee/dashboard', icon: <Briefcase className="w-4 h-4 mr-2" />, label: 'Dashboard' },
        { path: '/employee/jobs', icon: <Search className="w-4 h-4 mr-2" />, label: 'Find Jobs' },
        { path: '/employee/matches', icon: <Users className="w-4 h-4 mr-2" />, label: 'Matches' },
        { path: '/employee/profile', icon: <User className="w-4 h-4 mr-2" />, label: 'Profile' },
        { path: '/employee/settings', icon: <Settings className="w-4 h-4 mr-2" />, label: 'Settings' }
      ];
    } else {
      return [
        { path: '/employer/dashboard', icon: <Briefcase className="w-4 h-4 mr-2" />, label: 'Dashboard' },
        { path: '/employer/jobs', icon: <Building2 className="w-4 h-4 mr-2" />, label: 'Jobs' },
        { path: '/employer/candidates', icon: <Users className="w-4 h-4 mr-2" />, label: 'Candidates' },
        { path: '/employer/profile', icon: <User className="w-4 h-4 mr-2" />, label: 'Profile' },
        { path: '/employer/settings', icon: <Settings className="w-4 h-4 mr-2" />, label: 'Settings' }
      ];
    }
  };

  // Render the appropriate content based on the current route
  const renderContent = () => {
    if (location.pathname === '/employer/candidates') {
      return <CandidateSwiper />;
    }
    return <Outlet />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link 
                  to={`/${user?.role}/dashboard`} 
                  className="text-2xl font-bold text-indigo-600"
                >
                  CareerCrush
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {getNavItems().map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      isActive(item.path)
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-400 hover:text-gray-500 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>

              {/* Profile dropdown */}
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                  <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
} 
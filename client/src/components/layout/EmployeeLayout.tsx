import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) 
      ? 'border-indigo-500 text-gray-900' 
      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';
  };

  React.useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/employee/dashboard" className="text-xl font-bold cursor-pointer transition-transform hover:scale-105">
                <span className="text-black">Career</span><span className="text-indigo-500">.crush</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/employee/dashboard"
                  className={`${isActive('/employee/dashboard')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/employee/profile"
                  className={`${isActive('/employee/profile')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out`}
                >
                  Profile
                </Link>
                <Link
                  to="/employee/jobs"
                  className={`${isActive('/employee/jobs')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out`}
                >
                  Jobs
                </Link>
                <Link
                  to="/employee/applications"
                  className={`${isActive('/employee/applications')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out`}
                >
                  Applications
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:scale-105 transform"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Add CSS styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        /* Scroll reveal animations */
        .scroll-reveal {
          opacity: 0;
          transition: all 1s ease-out;
        }
        
        .fadeFromBottom {
          transform: translateY(50px);
        }
        
        .fadeFromLeft {
          transform: translateX(-50px);
        }
        
        .fadeFromRight {
          transform: translateX(50px);
        }
        
        .fadeIn {
          opacity: 0;
        }
        
        .delay-200 {
          transition-delay: 0.2s;
        }
        
        .delay-400 {
          transition-delay: 0.4s;
        }
        
        /* Show element when in viewport */
        .scroll-reveal.show {
          opacity: 1;
          transform: translate(0, 0);
        }
      `}</style>
    </div>
  );
} 
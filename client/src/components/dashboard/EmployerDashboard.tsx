import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

interface User {
  email: string;
  role: 'employee' | 'employer';
}

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'employer') {
          navigate('/login');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();

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
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">CareerCrush</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  authService.logout();
                  navigate('/login');
                }}
                className="ml-4 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900">Welcome, {user?.email}</h2>
          <p className="mt-2 text-gray-600">Manage your job listings and candidates</p>
          
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Post Jobs</h3>
                <p className="mt-1 text-sm text-gray-500">Create and manage job listings</p>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
                    Post New Job
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Applicants</h3>
                <p className="mt-1 text-sm text-gray-500">Review and manage job applications</p>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
                    View Applicants
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Company Profile</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your company information</p>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
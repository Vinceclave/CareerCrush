import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

interface User {
  email: string;
  role: 'employee' | 'employer';
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'employee') {
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
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/employee/profile"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/employee/jobs"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Jobs
                </Link>
                <Link
                  to="/employee/applications"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Applications
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={() => {
                  authService.logout();
                  navigate('/login');
                }}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:scale-105 transform"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 animate-fadeIn">Welcome, {user?.email}</h2>
          <p className="mt-2 text-gray-600 animate-fadeIn animation-delay-200">Find your next opportunity</p>
          
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:bg-indigo-50 scroll-reveal fadeFromLeft">
              <h3 className="text-lg font-medium text-gray-900 text-center">Job Applications</h3>
              <p className="mt-2 text-gray-500 text-center mb-4">
                View and manage your job applications. Track your progress and stay organized.
              </p>
              <div className="mt-4 flex justify-center">
                <Link
                  to="/employee/applications"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  View Applications
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:bg-indigo-50 scroll-reveal fadeFromBottom delay-200">
              <h3 className="text-lg font-medium text-gray-900 text-center">Profile</h3>
              <p className="mt-2 text-gray-500 text-center mb-4">
                Update your professional profile. Keep your information current to attract employers.
              </p>
              <div className="mt-4 flex justify-center">
                <Link
                  to="/employee/profile"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:bg-indigo-50 scroll-reveal fadeFromRight">
              <h3 className="text-lg font-medium text-gray-900 text-center">Job Search</h3>
              <p className="mt-2 text-gray-500 text-center mb-4">
                Find new job opportunities that match your skills and preferences.
              </p>
              <div className="mt-4 flex justify-center">
                <Link
                  to="/employee/jobs"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Search Jobs
                </Link>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="mt-12 bg-indigo-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out scroll-reveal fadeIn">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">AI-Powered Resume Analysis</h2>
              <p className="text-center text-gray-700 mb-6">
                Upload your resume and receive instant feedback and scoring to help you stand out to employers.
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="bg-white p-5 rounded-md shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 scroll-reveal fadeFromLeft delay-200">
                  <h3 className="text-lg font-medium text-indigo-600 mb-2">Resume Scoring</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Get objective feedback on your resume</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Identify areas for improvement</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-5 rounded-md shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 scroll-reveal fadeFromRight delay-200">
                  <h3 className="text-lg font-medium text-indigo-600 mb-2">Get Noticed</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Stand out based on qualifications</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Increase your interview chances</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Link
                  to="/employee/resume"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Upload Resume
                </Link>
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
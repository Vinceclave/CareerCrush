import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
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
              <span className="text-xl font-bold cursor-pointer transition-transform hover:scale-105">
                <span className="text-black">Career</span><span className="text-indigo-500">.crush</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:scale-105 transform"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl animate-fadeIn">
            Connecting top talent with great employers
          </h1>
          <p className="mt-6 text-lg text-gray-500 animate-fadeIn animation-delay-200">
            Hire Fast. Hire Smart. Hire Right.
          </p>
          <div className="mt-8 animate-fadeIn animation-delay-400">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-900 scroll-reveal fadeFromBottom">For Job Seekers & Employers</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:bg-indigo-50 scroll-reveal fadeFromLeft">
              <h3 className="text-lg font-medium text-gray-900 text-center">Streamlined Hiring</h3>
              <p className="mt-2 text-gray-500 text-center">
                Job seekers apply with one click, while employers find perfectly matched candidates without wading through irrelevant resumes.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:bg-indigo-50 scroll-reveal fadeFromBottom delay-200">
              <h3 className="text-lg font-medium text-gray-900 text-center">Smart Matching</h3>
              <p className="mt-2 text-gray-500 text-center">
                Candidates discover opportunities that match their skills. Employers connect with pre-qualified talent that fits their company culture.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:bg-indigo-50 scroll-reveal fadeFromRight">
              <h3 className="text-lg font-medium text-gray-900 text-center">Efficient Process</h3>
              <p className="mt-2 text-gray-500 text-center">
                Applicants track their progress while hiring managers manage their talent pipeline in one centralized, intuitive dashboard.
              </p>
            </div>
          </div>
          
          {/* AI Resume Scoring Section */}
          <div className="mt-16 bg-indigo-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out scroll-reveal fadeIn">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">AI-Powered Resume Scoring</h2>
              <p className="text-center text-gray-700 mb-6">
                Our advanced AI technology automatically evaluates and scores candidate resumes, saving employers countless hours in the screening process.
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="bg-white p-5 rounded-md shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 scroll-reveal fadeFromLeft delay-200">
                  <h3 className="text-lg font-medium text-indigo-600 mb-2">For Employers</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Instantly identify top candidates with objective scoring</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Reduce bias in the hiring process with standardized evaluation</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Cut screening time by up to 75% with automated evaluation</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-5 rounded-md shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 scroll-reveal fadeFromRight delay-200">
                  <h3 className="text-lg font-medium text-indigo-600 mb-2">For Job Seekers</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Get fair consideration based on skills and experience</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Receive instant feedback on resume strength and suggestions</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 transition-transform duration-300 ease-in-out group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="group-hover:text-indigo-600 transition-colors duration-300 ease-in-out">Stand out based on qualifications, not connections</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS styles */}
      <style>
        {`
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
        `}
      </style>
    </div>
  );
} 
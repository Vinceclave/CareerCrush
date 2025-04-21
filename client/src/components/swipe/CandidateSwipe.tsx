import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

interface User {
  email: string;
  role: 'employee' | 'employer';
  companyName?: string;
}

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string[];
  education: string[];
  bio: string;
  skills: string[];
  avatar: string;
  resumeScore: number;
}

export default function CandidateSwipe() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAcceptNotification, setShowAcceptNotification] = useState(false);
  
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
  }, [navigate]);
  
  useEffect(() => {
    // Fetch candidates from API
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/candidates');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCandidates(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to load candidates. Please try again later.');
        // Fallback to mock data in case API fails
        setCandidates([
          {
            id: '1',
            name: 'Alex Johnson',
            title: 'Frontend Developer',
            location: 'San Francisco, CA',
            experience: [
              'Senior Frontend Developer at TechCorp (2019-Present)',
              'Frontend Developer at WebSolutions (2017-2019)'
            ],
            education: [
              'B.S. Computer Science, Stanford University (2013-2017)'
            ],
            bio: 'Passionate frontend developer with strong React and TypeScript skills. Experience in building responsive, accessible web applications.',
            skills: ['React', 'TypeScript', 'HTML/CSS', 'Redux', 'Jest'],
            avatar: 'https://via.placeholder.com/150?text=AJ',
            resumeScore: 92
          },
          {
            id: '2',
            name: 'Jordan Smith',
            title: 'Full Stack Engineer',
            location: 'New York, NY',
            experience: [
              'Full Stack Developer at StartupXYZ (2020-Present)',
              'Backend Engineer at TechGiant (2018-2020)'
            ],
            education: [
              'M.S. Software Engineering, MIT (2016-2018)',
              'B.S. Computer Science, Cornell University (2012-2016)'
            ],
            bio: 'Full stack developer experienced in modern JavaScript frameworks and backend technologies. Strong problem-solving skills and team player.',
            skills: ['Node.js', 'React', 'MongoDB', 'Express', 'Docker'],
            avatar: 'https://via.placeholder.com/150?text=JS',
            resumeScore: 88
          },
          {
            id: '3',
            name: 'Taylor Chen',
            title: 'UX/UI Designer',
            location: 'Austin, TX',
            experience: [
              'Lead UI Designer at CreativeAgency (2020-Present)',
              'UI/UX Designer at TechStartup (2018-2020)'
            ],
            education: [
              'B.F.A. Digital Design, Rhode Island School of Design (2014-2018)'
            ],
            bio: 'Creative designer with a passion for building intuitive and engaging user experiences. Skilled in translating business requirements into elegant designs.',
            skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research', 'Prototyping'],
            avatar: 'https://via.placeholder.com/150?text=TC',
            resumeScore: 85
          },
          {
            id: '4',
            name: 'Morgan Williams',
            title: 'DevOps Engineer',
            location: 'Seattle, WA',
            experience: [
              'DevOps Engineer at CloudTech (2019-Present)',
              'Systems Administrator at TechSolutions (2017-2019)'
            ],
            education: [
              'M.S. Computer Science, University of Washington (2015-2017)',
              'B.S. Information Technology, Oregon State University (2011-2015)'
            ],
            bio: 'Experienced DevOps engineer focused on automating infrastructure and streamlining deployment processes. Passionate about building scalable and reliable systems.',
            skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
            avatar: 'https://via.placeholder.com/150?text=MW',
            resumeScore: 90
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);
  
  // Handle accept candidate action
  const handleAccept = async () => {
    if (!candidates.length || currentCandidateIndex >= candidates.length) return;
    
    const currentCandidate = candidates[currentCandidateIndex];
    
    try {
      // API call to mark candidate as accepted
      const response = await fetch(`/api/candidates/${currentCandidate.id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          employerId: user?.email,
          companyName: user?.companyName
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      console.log('Accepted candidate:', currentCandidate);
      
      // Show acceptance notification
      setShowAcceptNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowAcceptNotification(false);
        // Move to next candidate
        if (currentCandidateIndex < candidates.length - 1) {
          setCurrentCandidateIndex(currentCandidateIndex + 1);
        }
      }, 3000);
      
    } catch (err) {
      console.error('Error accepting candidate:', err);
      // Still move to next candidate even if API call fails
      if (currentCandidateIndex < candidates.length - 1) {
        setCurrentCandidateIndex(currentCandidateIndex + 1);
      }
    }
  };
  
  // Handle reject candidate action
  const handleReject = async () => {
    if (!candidates.length || currentCandidateIndex >= candidates.length) return;
    
    const currentCandidate = candidates[currentCandidateIndex];
    
    try {
      // API call to mark candidate as rejected
      const response = await fetch(`/api/candidates/${currentCandidate.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employerId: user?.email }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      console.log('Rejected candidate:', currentCandidate);
      
      // Move to next candidate
      if (currentCandidateIndex < candidates.length - 1) {
        setCurrentCandidateIndex(currentCandidateIndex + 1);
      }
    } catch (err) {
      console.error('Error rejecting candidate:', err);
      // Still move to next candidate even if API call fails
      if (currentCandidateIndex < candidates.length - 1) {
        setCurrentCandidateIndex(currentCandidateIndex + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold cursor-pointer">
                <span className="text-black">Career</span><span className="text-purple-600">Crush</span>
              </span>
            </div>
            <div className="flex items-center">
              <Link to="/employer-dashboard" className="mr-4 text-purple-600 hover:text-purple-800 font-medium">
                Dashboard
              </Link>
              <span className="mr-4 text-gray-700">{user?.email}</span>
              <button
                onClick={() => {
                  authService.logout();
                  navigate('/login');
                }}
                className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Match</h1>
          <p className="text-lg text-gray-600">
            Swipe right for candidates you're interested in, left for those you're not
          </p>
        </div>
        
        {/* Candidate Swipe Interface */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading candidates...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
              <svg className="h-16 w-16 text-red-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-500">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm"
              >
                Try Again
              </button>
            </div>
          ) : candidates.length > 0 && currentCandidateIndex < candidates.length ? (
            <div className="relative">
              {/* Accept notification */}
              {showAcceptNotification && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-md text-center transition-opacity duration-300">
                  <div className="flex justify-center items-center">
                    <svg className="h-5 w-5 text-green-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>You've shown interest in this candidate! An email notification has been sent.</span>
                  </div>
                </div>
              )}
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img 
                        src={candidates[currentCandidateIndex].avatar} 
                        alt={candidates[currentCandidateIndex].name} 
                        className="h-20 w-20 rounded-full object-cover border-2 border-purple-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidates[currentCandidateIndex].name)}&background=purple&color=fff`;
                        }}
                      />
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold text-gray-900">{candidates[currentCandidateIndex].name}</h2>
                        <p className="text-purple-600 font-medium">{candidates[currentCandidateIndex].title}</p>
                        <div className="flex items-center mt-1">
                          <svg className="h-4 w-4 text-gray-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-gray-600">{candidates[currentCandidateIndex].location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 px-4 py-2 rounded-full">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-purple-800 mr-1">Resume Score:</span>
                        <span className="text-xl font-bold text-purple-700">{candidates[currentCandidateIndex].resumeScore}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Summary</h3>
                    <p className="text-gray-700">{candidates[currentCandidateIndex].bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <svg className="h-5 w-5 text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Experience
                      </h3>
                      <ul className="space-y-2">
                        {candidates[currentCandidateIndex].experience.map((exp, idx) => (
                          <li key={idx} className="pl-4 border-l-2 border-purple-200 py-1">
                            <p className="text-gray-800">{exp}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <svg className="h-5 w-5 text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                        Education
                      </h3>
                      <ul className="space-y-2">
                        {candidates[currentCandidateIndex].education.map((edu, idx) => (
                          <li key={idx} className="pl-4 border-l-2 border-purple-200 py-1">
                            <p className="text-gray-800">{edu}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidates[currentCandidateIndex].skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center space-x-10">
                    <button
                      onClick={handleReject}
                      className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 hover:bg-red-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      aria-label="Decline candidate"
                    >
                      <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={handleAccept}
                      className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 hover:bg-green-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      aria-label="Accept candidate"
                    >
                      <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      {currentCandidateIndex + 1} of {candidates.length} potential candidates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
              <svg className="h-16 w-16 text-purple-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No more candidates</h3>
              <p className="text-gray-500">We're busy finding more talent that matches your requirements!</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm"
                >
                  Refresh Candidates
                </button>
                <Link 
                  to="/employer-dashboard"
                  className="px-4 py-2 text-sm text-purple-600 bg-white border border-purple-600 hover:bg-purple-50 rounded-md shadow-sm"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white mt-12 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CareerCrush. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 
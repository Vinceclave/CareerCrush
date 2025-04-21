import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dummyMatches, Match } from '../../data/dummyData';

export default function EmployeeMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>(dummyMatches);
  const [directMatches, setDirectMatches] = useState<Match[]>([]);
  const [algorithmMatches, setAlgorithmMatches] = useState<Match[]>([]);

  useEffect(() => {
    // Separate direct matches from algorithm matches
    const direct = matches.filter(match => match.isDirectMatch);
    const algorithm = matches.filter(match => !match.isDirectMatch);
    
    setDirectMatches(direct);
    setAlgorithmMatches(algorithm);
  }, [matches]);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleApply = (match: Match) => {
    // In a real application, this would send an application to the employer
    console.log(`Applying to ${match.company} for ${match.jobTitle}`);
    if (match.employerEmail) {
      console.log(`Employer email: ${match.employerEmail}`);
    }
  };

  const handleRequestInterview = (match: Match) => {
    // In a real application, this would request an interview with the employer
    console.log(`Requesting interview with ${match.company} for ${match.jobTitle}`);
    if (match.employerEmail) {
      console.log(`Employer email: ${match.employerEmail}`);
    }
  };

  const handleSave = (match: Match) => {
    // In a real application, this would save the job to the user's saved jobs
    console.log(`Saving job: ${match.jobTitle} at ${match.company}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Job Matches</h1>
          <p className="mt-2 text-gray-600">
            We've found {matches.length} jobs that match your profile
            {directMatches.length > 0 && `, including ${directMatches.length} direct matches from employers`}
          </p>
        </div>

        {/* Direct Matches Section */}
        {directMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Direct Matches from Employers</h2>
            <div className="space-y-6">
              {directMatches.map((match) => (
                <div key={match.id} className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-indigo-500">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{match.jobTitle}</h2>
                        <p className="mt-1 text-gray-600">{match.company}</p>
                        {match.employerEmail && (
                          <p className="mt-1 text-sm text-indigo-600">
                            Direct match from: {match.employerEmail}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(match.matchScore)}`}>
                          {match.matchScore}% Match
                        </div>
                        <div className="mt-2 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          Direct Match
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-gray-500">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {match.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {match.type}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {match.salary}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900">Description</h3>
                      <p className="mt-1 text-gray-600">{match.description}</p>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900">Requirements</h3>
                      <ul className="mt-2 list-disc list-inside text-gray-600">
                        {match.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => handleRequestInterview(match)}
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Request Interview
                      </button>
                      <button 
                        onClick={() => handleSave(match)}
                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                      >
                        Save Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Algorithm Matches Section */}
        {algorithmMatches.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Matches</h2>
            <div className="space-y-6">
              {algorithmMatches.map((match) => (
                <div key={match.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{match.jobTitle}</h2>
                        <p className="mt-1 text-gray-600">{match.company}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(match.matchScore)}`}>
                        {match.matchScore}% Match
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-gray-500">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {match.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {match.type}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {match.salary}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900">Description</h3>
                      <p className="mt-1 text-gray-600">{match.description}</p>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900">Requirements</h3>
                      <ul className="mt-2 list-disc list-inside text-gray-600">
                        {match.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => handleApply(match)}
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Apply Now
                      </button>
                      <button 
                        onClick={() => handleSave(match)}
                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                      >
                        Save Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
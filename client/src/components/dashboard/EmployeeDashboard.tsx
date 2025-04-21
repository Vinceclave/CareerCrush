import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { dummyDashboardStats } from '../../data/dummyData';
import { format } from 'date-fns';
import { Briefcase, User, Search } from 'lucide-react';

interface User {
  email: string;
  role: 'employee' | 'employer';
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { jobApplications, interviews, profileViews, recentActivity } = dummyDashboardStats;

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
        console.error('Auth error:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return '📝';
      case 'interview':
        return '🤝';
      case 'profile_view':
        return '👀';
      case 'match':
        return '✨';
      default:
        return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900">Welcome, {user?.email}</h2>
          <p className="mt-2 text-gray-600">Find your next opportunity</p>
          
          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-indigo-900">Job Applications</h2>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{jobApplications}</p>
              <p className="mt-1 text-sm text-indigo-500">Total applications submitted</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-green-900">Interviews</h2>
              <p className="mt-2 text-3xl font-bold text-green-600">{interviews}</p>
              <p className="mt-1 text-sm text-green-500">Upcoming interviews</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-purple-900">Profile Views</h2>
              <p className="mt-2 text-3xl font-bold text-purple-600">{profileViews}</p>
              <p className="mt-1 text-sm text-purple-500">Employer profile views</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Briefcase className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Job Applications</h3>
                    <p className="mt-1 text-sm text-gray-500">View and manage your job applications</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => navigate('/employee/jobs')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Applications
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your professional profile</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => navigate('/employee/profile')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <Search className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Job Search</h3>
                    <p className="mt-1 text-sm text-gray-500">Find new job opportunities</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => navigate('/employee/matches')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Search Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="bg-white shadow rounded-lg p-4 flex items-start space-x-4">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
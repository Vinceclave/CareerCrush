import { dummyDashboardStats } from '../data/dummyData';
import { format } from 'date-fns';

export default function Dashboard() {
  const { jobApplications, interviews, profileViews, recentActivity } = dummyDashboardStats;

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
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Your Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
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

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
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
  );
} 
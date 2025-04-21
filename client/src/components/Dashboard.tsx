export default function Dashboard() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Your Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-lg font-medium text-indigo-900">Job Applications</h2>
          <p className="mt-2 text-3xl font-bold text-indigo-600">0</p>
          <p className="mt-1 text-sm text-indigo-500">Total applications submitted</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-lg font-medium text-green-900">Interviews</h2>
          <p className="mt-2 text-3xl font-bold text-green-600">0</p>
          <p className="mt-1 text-sm text-green-500">Upcoming interviews</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-lg font-medium text-purple-900">Profile Views</h2>
          <p className="mt-2 text-3xl font-bold text-purple-600">0</p>
          <p className="mt-1 text-sm text-purple-500">Employer profile views</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-500 text-center">No recent activity to show</p>
        </div>
      </div>
    </div>
  );
} 
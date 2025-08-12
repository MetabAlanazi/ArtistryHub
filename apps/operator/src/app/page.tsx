export default function OperatorDashboard() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Operator Dashboard
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Welcome to ArtistryHub Operator Portal
          </h2>
          <p className="text-gray-600">
            This is the operator management interface for ArtistryHub.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Order Management</h3>
              <p className="text-blue-700 text-sm">Manage customer orders</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Inventory</h3>
              <p className="text-green-700 text-sm">Track product inventory</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Analytics</h3>
              <p className="text-purple-700 text-sm">View business metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


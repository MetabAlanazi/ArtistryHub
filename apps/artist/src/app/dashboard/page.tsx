export default function ArtistDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Artist Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
            <p className="text-3xl font-bold text-gray-900">$2,450</p>
            <p className="text-green-600 text-sm">+18% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Products Sold</h3>
            <p className="text-3xl font-bold text-gray-900">23</p>
            <p className="text-green-600 text-sm">+12% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Active Products</h3>
            <p className="text-3xl font-bold text-gray-900">15</p>
            <p className="text-blue-600 text-sm">3 pending approval</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Sunset Landscape</p>
                  <p className="text-sm text-gray-500">Sold to john.doe@example.com</p>
                </div>
                <span className="text-green-600 font-semibold">$150</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Abstract Waves</p>
                  <p className="text-sm text-gray-500">Sold to jane.smith@example.com</p>
                </div>
                <span className="text-green-600 font-semibold">$200</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-900">Mountain Vista</p>
                  <p className="text-sm text-gray-500">Sold to bob.wilson@example.com</p>
                </div>
                <span className="text-green-600 font-semibold">$175</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100">
                Upload New Product
              </button>
              <button className="w-full text-left p-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100">
                View Analytics
              </button>
              <button className="w-full text-left p-3 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100">
                Manage Products
              </button>
              <button className="w-full text-left p-3 rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100">
                Withdraw Earnings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

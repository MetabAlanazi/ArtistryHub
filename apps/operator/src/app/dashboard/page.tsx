export default function OperatorDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Operator Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
            <p className="text-3xl font-bold text-red-600">12</p>
            <p className="text-red-600 text-sm">Requires attention</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Today's Orders</h3>
            <p className="text-3xl font-bold text-gray-900">45</p>
            <p className="text-green-600 text-sm">+8 from yesterday</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Customer Support</h3>
            <p className="text-3xl font-bold text-orange-600">8</p>
            <p className="text-orange-600 text-sm">Open tickets</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Quality Score</h3>
            <p className="text-3xl font-bold text-green-600">94%</p>
            <p className="text-green-600 text-sm">Above target</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Approvals</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Sunset Landscape</p>
                  <p className="text-sm text-gray-500">Artist: John Smith</p>
                </div>
                <span className="text-green-600 font-semibold">Approved</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Abstract Waves</p>
                  <p className="text-sm text-gray-500">Artist: Jane Doe</p>
                </div>
                <span className="text-green-600 font-semibold">Approved</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-900">Mountain Vista</p>
                  <p className="text-sm text-gray-500">Artist: Bob Wilson</p>
                </div>
                <span className="text-yellow-600 font-semibold">Pending</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Tickets</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">#1234 - Payment Issue</p>
                  <p className="text-sm text-gray-500">High Priority</p>
                </div>
                <span className="text-red-600 font-semibold">Open</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">#1235 - Product Question</p>
                  <p className="text-sm text-gray-500">Medium Priority</p>
                </div>
                <span className="text-blue-600 font-semibold">In Progress</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-900">#1236 - Shipping Delay</p>
                  <p className="text-sm text-gray-500">Low Priority</p>
                </div>
                <span className="text-green-600 font-semibold">Resolved</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-md bg-red-50 text-red-700 hover:bg-red-100 border border-red-200">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">12</div>
                <div className="text-sm">Pending Approvals</div>
              </div>
            </button>
            <button className="p-4 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">45</div>
                <div className="text-sm">Today's Orders</div>
              </div>
            </button>
            <button className="p-4 rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">8</div>
                <div className="text-sm">Support Tickets</div>
              </div>
            </button>
            <button className="p-4 rounded-md bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">94%</div>
                <div className="text-sm">Quality Score</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

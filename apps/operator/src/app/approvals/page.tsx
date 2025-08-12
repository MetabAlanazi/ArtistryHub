export default function OperatorApprovalsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Approvals</h1>
        
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Pending Approvals (12)</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  Filter
                </button>
                <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  Sort
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Sunset</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Sunset Landscape</h3>
                      <p className="text-gray-600">Beautiful oil painting of a sunset over mountains</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Artist: John Smith</span>
                        <span>Category: Landscapes</span>
                        <span>Price: $150</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Reject
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                        Request Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Waves</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Abstract Waves</h3>
                      <p className="text-gray-600">Modern abstract painting with flowing lines</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Artist: Jane Doe</span>
                        <span>Category: Abstract</span>
                        <span>Price: $200</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Reject
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                        Request Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Mountain</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Mountain Vista</h3>
                      <p className="text-gray-600">Scenic watercolor of mountain ranges</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Artist: Bob Wilson</span>
                        <span>Category: Landscapes</span>
                        <span>Price: $175</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Reject
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                        Request Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Urban</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Urban Night</h3>
                      <p className="text-gray-600">Cityscape painting with neon lights</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Artist: Alice Johnson</span>
                        <span>Category: Urban</span>
                        <span>Price: $225</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Reject
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                        Request Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

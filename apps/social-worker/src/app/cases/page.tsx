export default function SocialWorkerCasesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Case Management</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Create New Case
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">All Cases (24)</h2>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
                <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  Filter
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Case #SW-001</h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Active</span>
                  </div>
                  <p className="text-gray-600 mb-3">Family support case focusing on housing assistance for a family of four</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Client:</span> Sarah Johnson
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> Housing
                    </div>
                    <div>
                      <span className="font-medium">Opened:</span> Dec 1, 2024
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> High
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100">
                    Update
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Case #SW-002</h3>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>
                  </div>
                  <p className="text-gray-600 mb-3">Youth mentoring program providing career guidance and skill development</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Client:</span> Mike Chen
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> Youth
                    </div>
                    <div>
                      <span className="font-medium">Opened:</span> Nov 15, 2024
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> Medium
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100">
                    Archive
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Case #SW-003</h3>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                  </div>
                  <p className="text-gray-600 mb-3">Elderly care case addressing social isolation and community integration</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Client:</span> Margaret Davis
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> Elderly
                    </div>
                    <div>
                      <span className="font-medium">Opened:</span> Dec 10, 2024
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> Medium
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100">
                    Update
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Case #SW-004</h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Active</span>
                  </div>
                  <p className="text-gray-600 mb-3">Mental health support case for young adult with anxiety and depression</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Client:</span> Alex Rodriguez
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> Mental Health
                    </div>
                    <div>
                      <span className="font-medium">Opened:</span> Dec 5, 2024
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> High
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                    View Details
                  </button>
                  <button className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

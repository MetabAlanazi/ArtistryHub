export default function SocialWorkerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Social Worker Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Active Cases</h3>
            <p className="text-3xl font-bold text-blue-600">24</p>
            <p className="text-blue-600 text-sm">3 require attention</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-green-600 text-sm">New cases assigned</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Completed Cases</h3>
            <p className="text-3xl font-bold text-green-600">156</p>
            <p className="text-green-600 text-sm">+12 this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <p className="text-3xl font-bold text-green-600">87%</p>
            <p className="text-green-600 text-sm">Above target</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Cases</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Case #SW-001</p>
                  <p className="text-sm text-gray-500">Family support - Housing assistance</p>
                </div>
                <span className="text-blue-600 font-semibold">Active</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">Case #SW-002</p>
                  <p className="text-sm text-gray-500">Youth mentoring - Career guidance</p>
                </div>
                <span className="text-green-600 font-semibold">Completed</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-900">Case #SW-003</p>
                  <p className="text-sm text-gray-500">Elderly care - Social isolation</p>
                </div>
                <span className="text-yellow-600 font-semibold">Pending</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100">
                Create New Case
              </button>
              <button className="w-full text-left p-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100">
                Schedule Visit
              </button>
              <button className="w-full text-left p-3 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100">
                Update Case Notes
              </button>
              <button className="w-full text-left p-3 rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100">
                Request Resources
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Home Visit</p>
                  <p className="text-sm text-gray-500">Today, 2:00 PM</p>
                  <p className="text-sm text-gray-500">Case #SW-001</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Phone Consultation</p>
                  <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
                  <p className="text-sm text-gray-500">Case #SW-004</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Office Meeting</p>
                  <p className="text-sm text-gray-500">Dec 20, 3:00 PM</p>
                  <p className="text-sm text-gray-500">Case #SW-005</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

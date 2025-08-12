export default function ArtistEarningsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Earnings & Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
            <p className="text-3xl font-bold text-gray-900">$2,450</p>
            <p className="text-green-600 text-sm">+18% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <p className="text-3xl font-bold text-gray-900">$450</p>
            <p className="text-green-600 text-sm">+25% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Available for Withdrawal</h3>
            <p className="text-3xl font-bold text-gray-900">$1,200</p>
            <p className="text-blue-600 text-sm">Ready to withdraw</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Commission Rate</h3>
            <p className="text-3xl font-bold text-gray-900">15%</p>
            <p className="text-gray-600 text-sm">Platform fee</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Sunset Landscape</span>
                <span className="text-green-600 font-semibold">$150</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Abstract Waves</span>
                <span className="text-green-600 font-semibold">$200</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Mountain Vista</span>
                <span className="text-green-600 font-semibold">$175</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Urban Night</span>
                <span className="text-green-600 font-semibold">$225</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Ocean Depths</span>
                <span className="text-green-600 font-semibold">$180</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal History</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="text-gray-700">Bank Transfer</p>
                  <p className="text-sm text-gray-500">Completed on Dec 15, 2024</p>
                </div>
                <span className="text-green-600 font-semibold">$500</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="text-gray-700">PayPal</p>
                  <p className="text-sm text-gray-500">Completed on Nov 30, 2024</p>
                </div>
                <span className="text-green-600 font-semibold">$300</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-gray-700">Bank Transfer</p>
                  <p className="text-sm text-gray-500">Completed on Oct 15, 2024</p>
                </div>
                <span className="text-green-600 font-semibold">$400</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Withdraw Earnings</h3>
            <span className="text-sm text-gray-500">Available: $1,200</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input 
                type="number" 
                placeholder="Enter amount" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Bank Transfer</option>
                <option>PayPal</option>
                <option>Stripe</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

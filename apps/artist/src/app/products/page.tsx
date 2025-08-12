export default function ArtistProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Upload New Product
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-lg font-medium">Sunset Landscape</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Sunset Landscape</h3>
              <p className="text-gray-600 text-sm mb-3">Beautiful oil painting of a sunset over mountains</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-600 font-semibold">$150</span>
                <span className="text-sm text-gray-500">Status: Active</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100">
                  Remove
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-white text-lg font-medium">Abstract Waves</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Abstract Waves</h3>
              <p className="text-gray-600 text-sm mb-3">Modern abstract painting with flowing lines</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-600 font-semibold">$200</span>
                <span className="text-sm text-gray-500">Status: Active</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100">
                  Remove
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-white text-lg font-medium">Mountain Vista</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Mountain Vista</h3>
              <p className="text-gray-600 text-sm mb-3">Scenic watercolor of mountain ranges</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-600 font-semibold">$175</span>
                <span className="text-sm text-gray-500">Status: Pending</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100">
                  Remove
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
              <span className="text-white text-lg font-medium">Urban Night</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Urban Night</h3>
              <p className="text-gray-600 text-sm mb-3">Cityscape painting with neon lights</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-600 font-semibold">$225</span>
                <span className="text-sm text-gray-500">Status: Active</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100">
                  Remove
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-lg font-medium">Ocean Depths</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Ocean Depths</span>
              <p className="text-gray-600 text-sm mb-3">Deep sea acrylic painting</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-600 font-semibold">$180</span>
                <span className="text-sm text-gray-500">Status: Active</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100">
                  Remove
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center">
              <span className="text-white text-lg font-medium">Forest Path</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Forest Path</h3>
              <p className="text-gray-600 text-sm mb-3">Peaceful forest scene in oils</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-600 font-semibold">$160</span>
                <span className="text-sm text-gray-500">Status: Pending</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

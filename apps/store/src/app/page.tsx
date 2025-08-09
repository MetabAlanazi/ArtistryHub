export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">ArtistryHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/auth/signin" className="text-gray-700 hover:text-indigo-600 font-medium">
                Sign in
              </a>
              <a href="/auth/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ArtistryHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover beautiful art from talented artists
          </p>
          <div className="space-x-4">
            <a href="/auth/signin" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium">
              Sign In
            </a>
            <a href="/auth/signup" className="inline-block bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 font-medium">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}


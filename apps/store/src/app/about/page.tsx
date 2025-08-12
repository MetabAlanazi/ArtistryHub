export default function StoreAboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              About ArtistryHub
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Connecting talented artists with art lovers worldwide through our curated marketplace.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              ArtistryHub is dedicated to empowering artists by providing them with a platform to showcase and sell their unique creations. We believe that art should be accessible to everyone, and every artist deserves recognition for their talent and creativity.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our platform connects passionate artists with art enthusiasts, creating a community where creativity thrives and beautiful pieces find their perfect homes.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10,000+</div>
                <div className="text-sm text-gray-600">Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50,000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <div className="w-full h-96 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">ArtistryHub Gallery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose ArtistryHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">Every artwork is carefully curated and quality-checked by our expert team.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Artists</h3>
              <p className="text-gray-600">Direct support to artists with fair pricing and transparent commission structures.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unique Pieces</h3>
              <p className="text-gray-600">Discover one-of-a-kind artworks that tell unique stories and add character to your space.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Join Our Community</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you're an artist looking to share your creativity or an art lover seeking unique pieces, ArtistryHub is the perfect place for you. Join thousands of others who have already discovered the joy of connecting through art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
              Start Shopping
            </button>
            <button className="px-8 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">
              Become an Artist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

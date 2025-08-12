export default function StoreHelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Help Center
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Find answers to frequently asked questions and get the support you need.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How do I place an order?</h3>
                <p className="text-gray-600 mb-4">
                  Placing an order is simple! Browse our collection of artworks, click on any piece you love, and click the "Add to Cart" button. Once you've added all your desired items, proceed to checkout where you can review your order and complete your purchase.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Tip:</strong> Make sure you're logged into your account for a faster checkout experience and to track your order history.
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What payment methods do you accept?</h3>
                <p className="text-gray-600 mb-4">
                  We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through our trusted payment partners.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Credit/Debit Cards</li>
                  <li>PayPal</li>
                  <li>Apple Pay</li>
                  <li>Google Pay</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How long does shipping take?</h3>
                <p className="text-gray-600 mb-4">
                  Shipping times vary depending on your location and the shipping method you choose. Standard shipping typically takes 5-7 business days, while express shipping can deliver your artwork in 2-3 business days.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="font-medium text-blue-900">Standard Shipping</h4>
                    <p className="text-sm text-blue-700">5-7 business days</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md">
                    <h4 className="font-medium text-green-900">Express Shipping</h4>
                    <p className="text-sm text-green-700">2-3 business days</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What is your return policy?</h3>
                <p className="text-gray-600 mb-4">
                  We want you to love your artwork! If you're not completely satisfied with your purchase, you can return it within 30 days of delivery for a full refund or exchange. The artwork must be returned in its original condition and packaging.
                </p>
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Custom or commissioned pieces may have different return policies. Please contact our support team for specific details.
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How do I become an artist on ArtistryHub?</h3>
                <p className="text-gray-600 mb-4">
                  We're always looking for talented artists to join our platform! To apply, simply click on "Become an Artist" in the footer, fill out our application form, and submit samples of your work. Our team will review your application and get back to you within 5-7 business days.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="block text-blue-600 hover:text-blue-800">Order Tracking</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Shipping Information</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Return Policy</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Size Guide</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Care Instructions</a>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">support@artistryhub.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Live Chat
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">Account Setup</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">Payment Issues</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">Shipping Delays</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">Artwork Care</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">Artist Guidelines</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

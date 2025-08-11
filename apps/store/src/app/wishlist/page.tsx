import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login?next=/wishlist')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">❤️ My Wishlist</h1>
              <p className="text-gray-600 mb-8">
                Welcome back, {session.user?.name || 'User'}! Here you can save and organize your favorite products.
              </p>
              
              {/* Placeholder for wishlist items */}
              <div className="bg-gray-50 rounded-lg p-8 mb-6">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Wishlist is Empty</h3>
                <p className="text-gray-500 mb-4">
                  Start adding products to your wishlist by browsing our collection!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Products
                </Link>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Need help? <Link href="/profile" className="text-blue-600 hover:text-blue-800">Contact support</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


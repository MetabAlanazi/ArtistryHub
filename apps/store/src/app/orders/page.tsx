import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login?next=/orders')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">📋 My Orders</h1>
              <p className="text-gray-600 mb-8">
                Welcome back, {session.user?.name || 'User'}! Here you can view and track your orders.
              </p>
              
              {/* Placeholder for orders list */}
              <div className="bg-gray-50 rounded-lg p-8 mb-6">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-4">
                  You haven't placed any orders yet. Start shopping to see your orders here!
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


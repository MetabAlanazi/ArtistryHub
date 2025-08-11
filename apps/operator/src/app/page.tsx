import { Suspense } from 'react'
import OperatorDashboard from '@/components/operator-dashboard'
import { getCurrentUser } from '@/lib/auth'

export default async function OperatorHomePage() {
  const user = await getCurrentUser()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting Section */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">
            Welcome{user?.name ? `, ${user.name}` : ''} 👋
          </h1>
          <p className="text-gray-600">
            {user
              ? 'You are signed in. Explore your workspace using the navbar.'
              : 'Please sign in to access your dashboard.'}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage orders, fulfillment, and support tickets
        </p>
      </div>

      <Suspense fallback={<div>Loading dashboard...</div>}>
        <OperatorDashboard />
      </Suspense>
    </div>
  )
}




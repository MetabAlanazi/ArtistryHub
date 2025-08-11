import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/dashboard-stats'
import { RecentOrders } from '@/components/recent-orders'
import { ProductApprovals } from '@/components/product-approvals'
import { getCurrentUser } from '@/lib/auth'

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?next=/')
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your art commerce platform
        </p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Suspense fallback={<div>Loading orders...</div>}>
          <RecentOrders />
        </Suspense>
        <Suspense fallback={<div>Loading approvals...</div>}>
          <ProductApprovals />
        </Suspense>
      </div>
    </div>
  )
}


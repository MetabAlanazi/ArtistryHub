'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?redirect=/dashboard')
    }
  }, [status, router])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome{session?.user?.name ? `, ${session.user.name}` : ''} 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Admin Dashboard - Manage your art commerce platform
              </p>
            </div>
                               <div className="flex items-center space-x-4">
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                       {(session?.user as any)?.role || 'User'}
                     </span>
                   </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">1,234</p>
            <p className="text-green-600 text-sm">+12% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">567</p>
            <p className="text-green-600 text-sm">+8% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">$45,678</p>
            <p className="text-green-600 text-sm">+15% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Products</h3>
            <p className="text-3xl font-bold text-gray-900">890</p>
            <p className="text-green-600 text-sm">+5% from last month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="font-medium text-blue-900">Manage Users</div>
                <div className="text-sm text-blue-700">Add, edit, or remove platform users</div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="font-medium text-green-900">Review Products</div>
                <div className="text-sm text-green-700">Approve or reject artist submissions</div>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="font-medium text-purple-900">View Analytics</div>
                <div className="text-sm text-purple-700">Platform performance insights</div>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">New user registration: john.doe@example.com</span>
                <span className="text-gray-500 text-sm">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Product approved: "Sunset Landscape" by Artist123</span>
                <span className="text-gray-500 text-sm">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">New order placed: Order #12345</span>
                <span className="text-gray-500 text-sm">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

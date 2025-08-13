'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useHealthCheck } from '@/hooks/useHealthCheck'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { healthData, loading: healthLoading, getServiceStatus } = useHealthCheck(true, 60000) // Check every minute

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
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-600" />
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
      <div className="bg-white shadow border-b border-gray-200">
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">1,234</p>
            <p className="text-gray-600 text-sm">+12% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">567</p>
            <p className="text-gray-600 text-sm">+8% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">$45,678</p>
            <p className="text-gray-600 text-sm">+15% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Products</h3>
            <p className="text-3xl font-bold text-gray-900">890</p>
            <p className="text-gray-600 text-sm">+5% from last month</p>
          </div>
        </div>

        {/* Health Status Widget */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          {healthLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Checking services...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    getServiceStatus('database') === 'healthy' ? 'bg-green-500' : 
                    getServiceStatus('database') === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="text-sm font-medium text-gray-900">Database</div>
                  <div className={`text-xs ${
                    getServiceStatus('database') === 'healthy' ? 'text-green-600' : 
                    getServiceStatus('database') === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getServiceStatus('database') === 'healthy' ? 'Healthy' : 
                     getServiceStatus('database') === 'degraded' ? 'Degraded' : 'Unhealthy'}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    getServiceStatus('bff') === 'healthy' ? 'bg-green-500' : 
                    getServiceStatus('bff') === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="text-sm font-medium text-gray-900">BFF</div>
                  <div className={`text-xs ${
                    getServiceStatus('bff') === 'healthy' ? 'text-green-600' : 
                    getServiceStatus('bff') === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getServiceStatus('bff') === 'healthy' ? 'Healthy' : 
                     getServiceStatus('bff') === 'degraded' ? 'Degraded' : 'Unhealthy'}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    getServiceStatus('minio') === 'healthy' ? 'bg-green-500' : 
                    getServiceStatus('minio') === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="text-sm font-medium text-gray-900">MinIO</div>
                  <div className={`text-xs ${
                    getServiceStatus('minio') === 'healthy' ? 'text-green-600' : 
                    getServiceStatus('minio') === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getServiceStatus('minio') === 'healthy' ? 'Healthy' : 
                     getServiceStatus('minio') === 'degraded' ? 'Degraded' : 'Unhealthy'}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    getServiceStatus('auth') === 'healthy' ? 'bg-green-500' : 
                    getServiceStatus('auth') === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="text-sm font-medium text-gray-900">Auth</div>
                  <div className={`text-xs ${
                    getServiceStatus('auth') === 'healthy' ? 'text-green-600' : 
                    getServiceStatus('auth') === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getServiceStatus('auth') === 'healthy' ? 'Healthy' : 
                     getServiceStatus('auth') === 'degraded' ? 'Degraded' : 'Unhealthy'}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="/system/health" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Detailed Health Dashboard →
                </a>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Manage Users</div>
                <div className="text-sm text-gray-700">Add, edit, or remove platform users</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Review Products</div>
                <div className="text-sm text-gray-700">Approve or reject artist submissions</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">View Analytics</div>
                <div className="text-sm text-gray-700">Platform performance insights</div>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-gray-700">New user registration: john.doe@example.com</span>
                <span className="text-gray-500 text-sm">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-gray-700">Product approved: "Sunset Landscape" by Artist123</span>
                <span className="text-gray-500 text-sm">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
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

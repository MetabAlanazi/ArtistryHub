'use client'

import { getCurrentUser } from '../../lib/auth'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Role-based app access
  const getRoleBasedApps = () => {
    switch (user.role) {
      case 'admin':
        return [
          {
            title: 'Admin Panel',
            description: 'Manage users, products, and system settings',
            href: 'http://localhost:3001',
            color: 'bg-red-600 hover:bg-red-700',
            icon: '👑'
          }
        ]
      case 'artist':
        return [
          {
            title: 'Artist Dashboard',
            description: 'Manage your artwork and commissions',
            href: 'http://localhost:3002',
            color: 'bg-purple-600 hover:bg-purple-700',
            icon: '🎨'
          }
        ]
      case 'operator':
        return [
          {
            title: 'Operator Panel',
            description: 'Handle orders and customer support',
            href: 'http://localhost:3003',
            color: 'bg-blue-600 hover:bg-blue-700',
            icon: '⚙️'
          }
        ]
      case 'social_worker':
        return [
          {
            title: 'Social Worker Portal',
            description: 'Access community resources and events',
            href: 'http://localhost:3004',
            color: 'bg-green-600 hover:bg-green-700',
            icon: '🤝'
          }
        ]
      default:
        return []
    }
  }

  const roleApps = getRoleBasedApps()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                {(user.name ?? 'U').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name || 'User'}</h1>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Role-based Quick Access */}
        {roleApps.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Access to Your Apps
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {roleApps.map((app) => (
                <a
                  key={app.href}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-4 rounded-lg border transition-all hover:shadow-md ${app.color} text-white`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <h3 className="font-semibold">{app.title}</h3>
                      <p className="text-sm opacity-90">{app.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={user.name || ''}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                value={user.role}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

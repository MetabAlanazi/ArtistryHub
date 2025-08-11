'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function RoleDashboard() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  const getRoleContent = () => {
    switch (session.user.role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Manage the entire ArtistryHub platform',
          actions: [
            { label: 'User Management', href: 'http://localhost:3001/users', color: 'bg-red-600' },
            { label: 'System Settings', href: 'http://localhost:3001/settings', color: 'bg-red-700' },
            { label: 'Analytics', href: 'http://localhost:3001/analytics', color: 'bg-red-800' }
          ],
          icon: '👑',
          color: 'text-red-600'
        }
      case 'artist':
        return {
          title: 'Artist Workspace',
          description: 'Manage your artwork and commissions',
          actions: [
            { label: 'My Artwork', href: 'http://localhost:3002/artwork', color: 'bg-purple-600' },
            { label: 'Commissions', href: 'http://localhost:3002/commissions', color: 'bg-purple-700' },
            { label: 'Portfolio', href: 'http://localhost:3002/portfolio', color: 'bg-purple-800' }
          ],
          icon: '🎨',
          color: 'text-purple-600'
        }
      case 'operator':
        return {
          title: 'Operator Control Panel',
          description: 'Handle orders and customer support',
          actions: [
            { label: 'Order Management', href: 'http://localhost:3003/orders', color: 'bg-blue-600' },
            { label: 'Customer Support', href: 'http://localhost:3003/support', color: 'bg-blue-700' },
            { label: 'Inventory', href: 'http://localhost:3003/inventory', color: 'bg-blue-800' }
          ],
          icon: '⚙️',
          color: 'text-blue-600'
        }
      case 'social_worker':
        return {
          title: 'Social Worker Portal',
          description: 'Access community resources and events',
          actions: [
            { label: 'Community Events', href: 'http://localhost:3004/events', color: 'bg-green-600' },
            { label: 'Resources', href: 'http://localhost:3004/resources', color: 'bg-green-700' },
            { label: 'Case Management', href: 'http://localhost:3004/cases', color: 'bg-green-800' }
          ],
          icon: '🤝',
          color: 'text-green-600'
        }
      case 'customer':
        return {
          title: 'Customer Dashboard',
          description: 'Browse products and manage your orders',
          actions: [
            { label: 'My Orders', href: '/orders', color: 'bg-gray-600' },
            { label: 'Wishlist', href: '/wishlist', color: 'bg-gray-700' },
            { label: 'Browse Products', href: '/', color: 'bg-gray-800' }
          ],
          icon: '🛍️',
          color: 'text-gray-600'
        }
      default:
        return null
    }
  }

  const content = getRoleContent()

  if (!content) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-3xl">{content.icon}</span>
        <div>
          <h2 className={`text-xl font-bold ${content.color}`}>
            {content.title}
          </h2>
          <p className="text-gray-600">{content.description}</p>
        </div>
      </div>
      
      <div className="grid gap-3 md:grid-cols-3">
        {content.actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : undefined}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`${action.color} text-white px-4 py-2 rounded-lg text-center hover:opacity-90 transition-opacity`}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { PrismaClient } from '@artistry-hub/db'
import { formatSAR } from '@artistry-hub/utils'
import { 
  Package, 
  Truck, 
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const prisma = new PrismaClient()

async function getOperatorDashboard() {
  const [
    pendingOrders,
    inProgressFulfillments,
    openTickets,
    urgentTickets
  ] = await Promise.all([
    prisma.order.count({
      where: { status: 'PAID' }
    }),
    prisma.fulfillment.count({
      where: { 
        status: { in: ['ALLOCATED', 'PACKED'] }
      }
    }),
    prisma.supportTicket.count({
      where: { status: 'OPEN' }
    }),
    prisma.supportTicket.count({
      where: { 
        status: 'OPEN',
        priority: { in: ['HIGH', 'CRITICAL'] }
      }
    })
  ])

  return {
    pendingOrders,
    inProgressFulfillments,
    openTickets,
    urgentTickets
  }
}

export function OperatorDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['operator-dashboard'],
    queryFn: getOperatorDashboard,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Failed to load dashboard
      </div>
    )
  }

  const statCards = [
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'In Progress Fulfillment',
      value: stats?.inProgressFulfillments || 0,
      icon: Truck,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Open Support Tickets',
      value: stats?.openTickets || 0,
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Urgent Tickets',
      value: stats?.urgentTickets || 0,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-sm font-medium">Process Orders</span>
              </div>
              <span className="text-xs text-primary-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Truck className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium">Manage Fulfillment</span>
              </div>
              <span className="text-xs text-gray-600">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium">Support Tickets</span>
              </div>
              <span className="text-xs text-gray-600">→</span>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Order shipped</p>
                <p className="text-xs text-gray-500">Order #12345678</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Order allocated</p>
                <p className="text-xs text-gray-500">Order #12345679</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Urgent ticket opened</p>
                <p className="text-xs text-gray-500">Missing item in order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




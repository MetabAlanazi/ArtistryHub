'use client'

import { useQuery } from '@tanstack/react-query'
import { formatSAR, formatDateTime } from '@artistry-hub/utils'
import { PrismaClient } from '@artistry-hub/db'
import { Eye, Package } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getRecentOrders() {
  return prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      payment: true,
      items: {
        include: {
          order: true
        }
      }
    }
  })
}

export function RecentOrders() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: getRecentOrders,
  })

  if (isLoading) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="text-center text-red-600">
          Failed to load recent orders
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <Link href="/orders" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {orders?.slice(0, 5).map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order #{order.id.slice(-8)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatSAR(order.totalCents)}
              </p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}




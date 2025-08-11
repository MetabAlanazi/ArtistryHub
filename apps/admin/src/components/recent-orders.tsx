'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@artistry-hub/ui'
import { bffEndpoints } from '@artistry-hub/client-bff'
import type { OrderSchema } from '@artistry-hub/client-bff'

export default function RecentOrders() {
  const [orders, setOrders] = useState<OrderSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        // Call BFF instead of direct Prisma
        const response = await bffEndpoints.orders.getAll()
        
        if (response.success && response.data?.orders) {
          // Take only the first 5 orders for recent display
          setOrders(response.data.orders.slice(0, 5))
        } else {
          setError(response.error || 'Failed to fetch orders')
        }
      } catch (err) {
        setError('Failed to fetch recent orders')
        console.error('Error fetching recent orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No recent orders</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${(order.totalCents / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}




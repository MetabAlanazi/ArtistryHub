'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@artistry-hub/ui'
import { bffEndpoints } from '@artistry-hub/client-bff'
import type { OrderSchema } from '@artistry-hub/client-bff'

export default function OperatorDashboard() {
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
          setOrders(response.data.orders)
        } else {
          setError(response.error || 'Failed to fetch orders')
        }
      } catch (err) {
        setError('Failed to fetch orders')
        console.error('Error fetching orders:', err)
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
          <CardTitle>Pending Orders</CardTitle>
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
          <CardTitle>Pending Orders</CardTitle>
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
        <CardTitle>Pending Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No pending orders</div>
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
                  <div className="flex space-x-2 mt-2">
                    <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                      Process
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                      Ship
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}









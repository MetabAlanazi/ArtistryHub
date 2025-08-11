'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@artistry-hub/ui'
import { bffEndpoints } from '@artistry-hub/client-bff'
import type { ProductSchema } from '@artistry-hub/client-bff'

export default function ArtistDashboard() {
  const [products, setProducts] = useState<ProductSchema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Call BFF instead of direct Prisma
        const response = await bffEndpoints.products.getAll()
        
        if (response.success && response.data?.products) {
          setProducts(response.data.products)
        } else {
          setError(response.error || 'Failed to fetch products')
        }
      } catch (err) {
        setError('Failed to fetch products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Products</CardTitle>
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
          <CardTitle>My Products</CardTitle>
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
        <CardTitle>My Products</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No products found</div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-gray-600">{product.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 capitalize">{product.status}</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                      View
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









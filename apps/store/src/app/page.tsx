import { Suspense } from 'react'
import { FeaturedProducts } from '@/components/featured-products'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'
import { getCurrentUser } from '@/lib/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Greeting Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      </div>

      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Categories />
        <Suspense fallback={<div>Loading products...</div>}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </div>
  )
}


import { Suspense } from 'react'
import { FeaturedProducts } from '@/components/featured-products'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
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


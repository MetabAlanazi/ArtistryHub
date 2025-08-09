import Link from 'next/link'
import Image from 'next/image'

// Simple SAR formatting function
function formatSAR(cents: number): string {
  return `SAR ${(cents / 100).toFixed(2)}`
}

interface ProductCardProps {
  product: {
    id: string
    title: string
    description?: string
    images: string[]
    artistRef: {
      displayName: string
    } | null
    variants: {
      priceCents: number
    }[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const mainVariant = product.variants[0]
  const isInStock = true // Mock - always in stock for demo

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="card overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-gray-200">
          {product.images && Array.isArray(product.images) && product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform"
            />
          )}
          {!isInStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
          {product.artistRef && (
            <p className="text-sm text-gray-600 mt-1">
              by {product.artistRef.displayName}
            </p>
          )}
          {mainVariant && (
            <p className="text-lg font-bold text-primary-600 mt-2">
              {formatSAR(mainVariant.priceCents)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

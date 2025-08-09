import Link from 'next/link'
import { Paintbrush, Image, Trophy } from 'lucide-react'

const categories = [
  {
    name: 'Paintings',
    href: '/products?type=painting',
    icon: Paintbrush,
    description: 'Original artwork from talented artists',
  },
  {
    name: 'Posters',
    href: '/products?type=poster',
    icon: Image,
    description: 'High-quality prints and posters',
  },
  {
    name: 'Collectibles',
    href: '/products?type=collectible',
    icon: Trophy,
    description: 'Rare art collectibles and memorabilia',
  },
]

export function Categories() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
              <category.icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {category.name}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

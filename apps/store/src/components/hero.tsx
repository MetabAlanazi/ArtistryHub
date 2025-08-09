import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Discover Beautiful Art
          </h1>
          <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
            Explore our curated collection of paintings, posters, and furniture from talented artists across Saudi Arabia.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/products"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Shop Now
            </Link>
            <Link
              href="/artists"
              className="text-sm font-semibold leading-6 text-white"
            >
              Meet Our Artists <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


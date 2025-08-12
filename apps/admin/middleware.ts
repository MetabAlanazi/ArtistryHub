import { adminMiddleware } from '@artistry-hub/auth'

export default adminMiddleware

export const config = {
  matcher: [
    /*
     * Match only routes that need middleware processing:
     * - Protected admin pages (users, products, orders, analytics)
     * - Dashboard routes
     * - Exclude static assets, API routes, and auth pages
     */
    '/users/:path*',
    '/products/:path*',
    '/orders/:path*',
    '/analytics/:path*',
    '/dashboard/:path*',
    '/settings/:path*'
  ]
}

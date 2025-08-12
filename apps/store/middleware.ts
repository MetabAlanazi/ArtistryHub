export { storeMiddleware as middleware } from '@artistry-hub/auth'

export const config = {
  matcher: [
    /*
     * Match only routes that need middleware processing:
     * - Protected pages (orders, wishlist, profile, checkout)
     * - Dashboard routes
     * - Exclude static assets, API routes, and public pages
     */
    '/orders/:path*',
    '/wishlist/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/artist/:path*',
    '/operator/:path*',
    '/social-worker/:path*'
  ]
}

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // If user is authenticated, check role-based redirects
    if (token?.role) {
      // Redirect based on role if they're on the wrong app
      switch (token.role) {
        case 'admin':
          if (pathname.startsWith('/admin') && !pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('http://localhost:3001', req.url))
          }
          break
        case 'artist':
          if (!pathname.startsWith('/artist') && !pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL('http://localhost:3002', req.url))
          }
          break
        case 'operator':
          if (!pathname.startsWith('/operator') && !pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL('http://localhost:3003', req.url))
          }
          break
        case 'customer':
          // Customers can access the store
          break
        default:
          break
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)'
  ]
}


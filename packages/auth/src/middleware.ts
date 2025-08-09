import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: any } }) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Check if user is active
    if (token.status !== 'ACTIVE') {
      return NextResponse.redirect(new URL('/auth/account-suspended', req.url))
    }

    // Admin routes - only admin can access
    if (pathname.startsWith('/admin')) {
      if (token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url))
      }
    }

    // Artist routes - only artist or admin can access
    if (pathname.startsWith('/artist')) {
      if (token.role !== 'ARTIST' && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url))
      }
    }

    // Operator routes - only operator or admin can access
    if (pathname.startsWith('/operator')) {
      if (token.role !== 'OPERATOR' && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url))
      }
    }

    // Customer routes - all authenticated users can access
    if (pathname.startsWith('/profile') || pathname.startsWith('/orders')) {
      // Allow all authenticated users
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
    '/admin/:path*',
    '/artist/:path*', 
    '/operator/:path*',
    '/profile/:path*',
    '/orders/:path*'
  ]
}

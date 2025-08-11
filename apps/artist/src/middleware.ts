import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
// import { SessionManager } from '@artistry-hub/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for auth-related paths, API routes, and login
  if (pathname.startsWith('/api/') || pathname.startsWith('/login')) {
    return NextResponse.next()
  }
  
  // Check for authentication token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  // If no token and trying to access protected route, redirect to login
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // TODO: Re-enable SessionManager after fixing import issues
  // If authenticated, check role-based access and redirects
  if (token && token.role) {
    const userRole = token.role as string
    
    // Basic role check - only artist and admin users can access artist app
    if (!['artist', 'admin'].includes(userRole)) {
      // Redirect non-artist users to store (temporary solution)
      console.log(`🚫 ${userRole} user accessing artist app, redirecting to store`)
      return NextResponse.redirect(new URL('http://localhost:3000'))
    }
    
    // If authenticated and trying to access login page, redirect to dashboard
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}

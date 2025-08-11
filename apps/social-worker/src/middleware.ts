import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { SessionManager } from '@artistry-hub/auth'

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
  
  // If authenticated, check role-based access and redirects
  if (token && token.role) {
    const userRole = token.role as string
    
    // Check if user should be redirected to their primary app
    const redirectCheck = SessionManager.shouldRedirect(userRole, 'socialWorker')
    
    if (redirectCheck.shouldRedirect && redirectCheck.redirectUrl) {
      console.log(`🔄 Redirecting ${userRole} user from social worker app to primary app: ${redirectCheck.redirectUrl}`)
      
      // Add the current path as a callback URL
      const redirectUrl = redirectCheck.redirectUrl + pathname
      return NextResponse.redirect(new URL(redirectUrl))
    }
    
    // If user is in social worker app but doesn't have social_worker or admin role, redirect to their primary app
    if (!['social_worker', 'admin'].includes(userRole)) {
      const primaryAppUrl = SessionManager.getPrimaryAppUrl(userRole)
      console.log(`🚫 ${userRole} user accessing social worker app, redirecting to: ${primaryAppUrl}`)
      return NextResponse.redirect(new URL(primaryAppUrl))
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

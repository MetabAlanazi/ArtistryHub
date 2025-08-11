import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionStrict } from './helpers'
import type { UserRole } from './types'

export interface MiddlewareConfig {
  allowRoles?: UserRole[]
  publicRoutes?: string[]
  redirectTo?: string
  requireAuth?: boolean
}

export const authMiddlewareFactory = (config: MiddlewareConfig = {}) => {
  const {
    allowRoles = [],
    publicRoutes = [],
    redirectTo = '/login',
    requireAuth = true
  } = config

  return async (request: NextRequest) => {
    const { pathname } = request.nextUrl

    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // Allow static files and API health checks
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/public') ||
      pathname.startsWith('/api/health')
    ) {
      return NextResponse.next()
    }

    // Check authentication
    const session = await getServerSessionStrict(request)
    
    if (!session && requireAuth) {
      // Redirect to login for page requests
      if (!pathname.startsWith('/api/')) {
        const url = request.nextUrl.clone()
        url.pathname = redirectTo
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }
      
      // Return 401 for API requests
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check role requirements
    if (session && allowRoles.length > 0 && !allowRoles.includes(session.user.role)) {
      if (!pathname.startsWith('/api/')) {
        // Redirect to unauthorized page for page requests
        const url = request.nextUrl.clone()
        url.pathname = '/unauthorized'
        return NextResponse.redirect(url)
      }
      
      // Return 403 for API requests
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.next()
  }
}

// Pre-configured middlewares for different app types
export const adminMiddleware = authMiddlewareFactory({
  allowRoles: ['admin'],
  requireAuth: true,
  redirectTo: '/login'
})

export const artistMiddleware = authMiddlewareFactory({
  allowRoles: ['artist', 'admin'],
  requireAuth: true,
  redirectTo: '/login'
})

export const operatorMiddleware = authMiddlewareFactory({
  allowRoles: ['operator', 'admin'],
  requireAuth: true,
  redirectTo: '/login'
})

export const storeMiddleware = authMiddlewareFactory({
  allowRoles: ['customer', 'artist', 'admin'],
  requireAuth: false, // Allow public browsing
  publicRoutes: ['/', '/store', '/products', '/categories']
})

export const socialWorkerMiddleware = authMiddlewareFactory({
  allowRoles: ['social_worker', 'admin'],
  requireAuth: true,
  redirectTo: '/login'
})

// Export types
export type { UserRole }

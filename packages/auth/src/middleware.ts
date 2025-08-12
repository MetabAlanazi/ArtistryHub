import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from './session-manager'
import type { UserRole, AuthConfig } from './types'

// App configurations
const appConfigs = {
  store: {
    appName: 'store',
    appUrl: process.env.STORE_APP_URL || 'http://localhost:3000',
    loginUrl: process.env.CENTRAL_LOGIN_URL || process.env.STORE_APP_URL + '/auth/login' || 'http://localhost:3000/auth/login',
    allowedRoles: ['customer', 'artist', 'admin', 'operator', 'social_worker', 'service'] as UserRole[],
    sessionTimeout: 15
  },
  admin: {
    appName: 'admin',
    appUrl: process.env.ADMIN_APP_URL || 'http://localhost:3001',
    loginUrl: process.env.CENTRAL_LOGIN_URL || process.env.ADMIN_APP_URL + '/auth/login' || 'http://localhost:3001/auth/login',
    allowedRoles: ['admin'] as UserRole[],
    sessionTimeout: 15
  },
  artist: {
    appName: 'artist',
    appUrl: process.env.ARTIST_APP_URL || 'http://localhost:3002',
    loginUrl: process.env.CENTRAL_LOGIN_URL || process.env.ARTIST_APP_URL + '/auth/login' || 'http://localhost:3002/auth/login',
    allowedRoles: ['artist', 'admin'] as UserRole[],
    sessionTimeout: 15
  },
  operator: {
    appName: 'operator',
    appUrl: process.env.OPERATOR_APP_URL || 'http://localhost:3003',
    loginUrl: process.env.CENTRAL_LOGIN_URL || process.env.OPERATOR_APP_URL + '/auth/login' || 'http://localhost:3003/auth/login',
    allowedRoles: ['operator', 'admin'] as UserRole[],
    sessionTimeout: 15
  },
  'social-worker': {
    appName: 'social-worker',
    appUrl: process.env.SOCIAL_WORKER_APP_URL || 'http://localhost:3004',
    loginUrl: process.env.CENTRAL_LOGIN_URL || process.env.SOCIAL_WORKER_APP_URL + '/auth/login' || 'http://localhost:3004/auth/login',
    allowedRoles: ['social_worker', 'admin'] as UserRole[],
    sessionTimeout: 15
  }
}

// Get app config from hostname
function getAppConfig(request: NextRequest): AuthConfig | null {
  const hostname = request.headers.get('host') || ''
  
  // Use environment-based detection first
  if (hostname.includes('store') || hostname.includes('3000')) {
    return appConfigs.store
  } else if (hostname.includes('admin') || hostname.includes('3001')) {
    return appConfigs.admin
  } else if (hostname.includes('artist') || hostname.includes('3002')) {
    return appConfigs.artist
  } else if (hostname.includes('operator') || hostname.includes('3003')) {
    return appConfigs.operator
  } else if (hostname.includes('social-worker') || hostname.includes('3004')) {
    return appConfigs['social-worker']
  }
  
  // Fallback to store app
  return appConfigs.store
}

// Extract token from request
function extractToken(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check cookies
  const accessToken = request.cookies.get('access_token')?.value
  if (accessToken) {
    return accessToken
  }

  return null
}

// Create protected route middleware
export function createProtectedMiddleware(requiredRoles?: UserRole[]) {
  return function protectedMiddleware(request: NextRequest): NextResponse | null {
    const appConfig = getAppConfig(request)
    if (!appConfig) {
      return NextResponse.redirect(new URL('/error', request.url))
    }

    // Skip middleware for public routes
    const publicRoutes = ['/auth/login', '/auth/register', '/api/auth', '/_next', '/static', '/favicon.ico']
    const pathname = request.nextUrl.pathname

    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return null
    }

    // Extract and validate token
    const token = extractToken(request)
    if (!token) {
      // No token, redirect to central login
      const loginUrl = new URL(appConfig.loginUrl)
      loginUrl.searchParams.set('redirect', request.url)
      loginUrl.searchParams.set('app', appConfig.appName)
      return NextResponse.redirect(loginUrl)
    }

    // Validate session
    const validation = sessionManager.validateSession(token, requiredRoles)
    if (!validation.isValid) {
      if (validation.requiresReauth) {
        // Token expired or invalid, redirect to login
        const loginUrl = new URL(appConfig.loginUrl)
        loginUrl.searchParams.set('redirect', request.url)
        loginUrl.searchParams.set('app', appConfig.appName)
        loginUrl.searchParams.set('reauth', 'true')
        return NextResponse.redirect(loginUrl)
      } else {
        // Insufficient permissions
        return NextResponse.json(
          { error: 'Access denied', details: validation.error },
          { status: 403 }
        )
      }
    }

    // Session is valid, continue
    return null
  }
}

// Create role-based middleware
export function createRoleMiddleware(requiredRoles: UserRole[]) {
  return createProtectedMiddleware(requiredRoles)
}

// Create admin-only middleware
export const adminMiddleware = createRoleMiddleware(['admin'])

// Create artist middleware
export const artistMiddleware = createRoleMiddleware(['artist', 'admin'])

// Create operator middleware
export const operatorMiddleware = createRoleMiddleware(['operator', 'admin'])

// Create social worker middleware
export const socialWorkerMiddleware = createRoleMiddleware(['social_worker', 'admin'])

// Create customer middleware
export const customerMiddleware = createRoleMiddleware(['customer', 'artist', 'admin', 'operator', 'social_worker'])

// Default protected middleware (any authenticated user)
export const protectedMiddleware = createProtectedMiddleware()

// Export app configs for use in other modules
export { appConfigs }

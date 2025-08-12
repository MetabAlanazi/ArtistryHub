import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from './session-manager'
import type { UserRole, AuthConfig } from './types'

// Configuration for different apps
const APP_CONFIGS: Record<string, AuthConfig> = {
  store: {
    appName: 'store',
    appUrl: process.env.STORE_APP_URL || 'http://localhost:3000',
    loginUrl: process.env.CENTRAL_LOGIN_URL || 'http://localhost:3000/auth/login',
    allowedRoles: ['customer', 'artist', 'admin', 'operator', 'social_worker', 'service'],
    sessionTimeout: 15
  },
  admin: {
    appName: 'admin',
    appUrl: process.env.ADMIN_APP_URL || 'http://localhost:3001',
    loginUrl: process.env.CENTRAL_LOGIN_URL || 'http://localhost:3000/auth/login',
    allowedRoles: ['admin'],
    sessionTimeout: 15
  },
  artist: {
    appName: 'artist',
    appUrl: process.env.ARTIST_APP_URL || 'http://localhost:3002',
    loginUrl: process.env.CENTRAL_LOGIN_URL || 'http://localhost:3000/auth/login',
    allowedRoles: ['artist', 'admin'],
    sessionTimeout: 15
  },
  operator: {
    appName: 'operator',
    appUrl: process.env.OPERATOR_APP_URL || 'http://localhost:3003',
    loginUrl: process.env.CENTRAL_LOGIN_URL || 'http://localhost:3000/auth/login',
    allowedRoles: ['operator', 'admin'],
    sessionTimeout: 15
  },
  'social-worker': {
    appName: 'social-worker',
    appUrl: process.env.SOCIAL_WORKER_APP_URL || 'http://localhost:3004',
    loginUrl: process.env.CENTRAL_LOGIN_URL || 'http://localhost:3000/auth/login',
    allowedRoles: ['social_worker', 'admin'],
    sessionTimeout: 15
  }
}

// Get app config from hostname
function getAppConfig(request: NextRequest): AuthConfig | null {
  const hostname = request.headers.get('host') || ''

  if (hostname.includes('localhost:3000') || hostname.includes('store')) {
    return APP_CONFIGS.store || null
  } else if (hostname.includes('localhost:3001') || hostname.includes('admin')) {
    return APP_CONFIGS.admin || null
  } else if (hostname.includes('localhost:3002') || hostname.includes('artist')) {
    return APP_CONFIGS.artist || null
  } else if (hostname.includes('localhost:3003') || hostname.includes('operator')) {
    return APP_CONFIGS.operator || null
  } else if (hostname.includes('localhost:3004') || hostname.includes('social-worker')) {
    return APP_CONFIGS['social-worker'] || null
  }

  return null
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
export { APP_CONFIGS }

import { NextRequest, NextResponse } from 'next/server'
import { SessionManager } from './session-manager'
import type { UserRole } from './types'

export interface MiddlewareConfig {
  appName: string
  allowRoles?: UserRole[]
  publicRoutes?: string[]
  loginRoute?: string
  requireAuth?: boolean
  enableSSO?: boolean
  enableAudit?: boolean
}

export interface MiddlewareResult {
  shouldContinue: boolean
  response?: NextResponse
  user?: any
  redirectUrl?: string
}

/**
 * Enhanced Middleware Factory for Enterprise SSO
 * Implements proper session validation, role-based access control, and audit logging
 */
export class EnhancedMiddlewareFactory {
  private config: MiddlewareConfig

  constructor(config: MiddlewareConfig) {
    this.config = {
      requireAuth: true,
      enableSSO: true,
      enableAudit: true,
      loginRoute: '/login',
      ...config
    }
  }

  /**
   * Create middleware function for the app
   */
  createMiddleware() {
    return async (request: NextRequest): Promise<NextResponse | undefined> => {
      const { pathname } = request.nextUrl

      // Skip middleware for static assets and health checks
      if (this.shouldSkipMiddleware(pathname)) {
        return NextResponse.next()
      }

      // Check if route is public
      if (this.isPublicRoute(pathname)) {
        return NextResponse.next()
      }

      // Get user from session
      const user = await SessionManager.getUserFromRequest(request)
      
      // Handle unauthenticated users
      if (!user) {
        return this.handleUnauthenticated(request, pathname)
      }

      // Validate user permissions
      const permissionCheck = await this.validateUserPermissions(user, pathname)
      if (!permissionCheck.shouldContinue) {
        return permissionCheck.response
      }

      // Check if user should be redirected to their primary app
      const redirectCheck = this.checkAppRedirect(user, pathname)
      if (redirectCheck.shouldRedirect) {
        return this.createRedirectResponse(redirectCheck.redirectUrl!, pathname)
      }

      // Log successful access if audit is enabled
      if (this.config.enableAudit) {
        await this.logAccessEvent(user, pathname, request)
      }

      // Continue with request
      return NextResponse.next()
    }
  }

  /**
   * Check if middleware should be skipped for this path
   */
  private shouldSkipMiddleware(pathname: string): boolean {
    return (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/api/health') ||
      pathname.startsWith('/api/auth')
    )
  }

  /**
   * Check if route is public
   */
  private isPublicRoute(pathname: string): boolean {
    if (!this.config.publicRoutes) return false
    
    return this.config.publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route)
    )
  }

  /**
   * Handle unauthenticated users
   */
  private handleUnauthenticated(request: NextRequest, pathname: string): NextResponse {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    // For page routes, redirect to login with callback URL
    const loginUrl = new URL(this.config.loginRoute!, request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    
    return NextResponse.redirect(loginUrl)
  }

  /**
   * Validate user permissions for the requested path
   */
  private async validateUserPermissions(user: any, pathname: string): Promise<MiddlewareResult> {
    // Check if user has required role for this app
    if (this.config.allowRoles && !this.config.allowRoles.includes(user.role)) {
      const redirectUrl = SessionManager.getPrimaryAppUrl(user.role)
      
      // Log access denied event
      if (this.config.enableAudit) {
        await SessionManager.logSecurityEvent('access_denied', user.id, {
          appName: this.config.appName,
          userRole: user.role,
          requiredRoles: this.config.allowRoles,
          path: pathname,
          reason: 'Insufficient role permissions'
        })
      }

      return {
        shouldContinue: false,
        response: this.createRedirectResponse(redirectUrl, pathname)
      }
    }

    // Check if user has access to this specific app
    if (!SessionManager.hasAppAccess(user.role, this.config.appName)) {
      const redirectUrl = SessionManager.getPrimaryAppUrl(user.role)
      
      // Log access denied event
      if (this.config.enableAudit) {
        await SessionManager.logSecurityEvent('access_denied', user.id, {
          appName: this.config.appName,
          userRole: user.role,
          path: pathname,
          reason: 'App access denied'
        })
      }

      return {
        shouldContinue: false,
        response: this.createRedirectResponse(redirectUrl, pathname)
      }
    }

    return { shouldContinue: true, user }
  }

  /**
   * Check if user should be redirected to their primary app
   */
  private checkAppRedirect(user: any, pathname: string): { shouldRedirect: boolean; redirectUrl?: string } {
    // Don't redirect if user is already in their primary app
    const primaryApp = SessionManager.getPrimaryAppUrl(user.role)
    const currentAppUrl = this.getCurrentAppUrl()
    
    if (primaryApp === currentAppUrl) {
      return { shouldRedirect: false }
    }

    // Check if user should be redirected
    return SessionManager.shouldRedirect(user.role, this.config.appName)
  }

  /**
   * Create redirect response with proper callback URL handling
   */
  private createRedirectResponse(targetUrl: string, currentPath: string): NextResponse {
    // If current path is not root, add it as callback
    let redirectUrl = targetUrl
    if (currentPath !== '/' && currentPath !== '/login') {
      redirectUrl = `${targetUrl}${currentPath}`
    }

    console.log(`🔄 Redirecting user to primary app: ${redirectUrl}`)
    return NextResponse.redirect(new URL(redirectUrl))
  }

  /**
   * Get current app URL
   */
  private getCurrentAppUrl(): string {
    const appConfig = SessionManager['APP_CONFIGS'][this.config.appName]
    return appConfig?.url || 'http://localhost:3000'
  }

  /**
   * Log access event for audit purposes
   */
  private async logAccessEvent(user: any, pathname: string, request: NextRequest): Promise<void> {
    try {
      // Only log significant access events, not every page load
      if (this.isSignificantPath(pathname)) {
        await SessionManager.logSecurityEvent('access_granted', user.id, {
          appName: this.config.appName,
          userRole: user.role,
          path: pathname,
          ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        })
      }
    } catch (error) {
      console.error('Failed to log access event:', error)
    }
  }

  /**
   * Check if path is significant enough to log
   */
  private isSignificantPath(pathname: string): boolean {
    const significantPatterns = [
      '/dashboard',
      '/admin',
      '/profile',
      '/settings',
      '/orders',
      '/products',
      '/users'
    ]

    return significantPatterns.some(pattern => pathname.startsWith(pattern))
  }
}

/**
 * Pre-configured middleware instances for different app types
 */
export const createStoreMiddleware = () => new EnhancedMiddlewareFactory({
  appName: 'store',
  allowRoles: ['customer', 'artist', 'admin', 'operator', 'social_worker', 'service'],
  publicRoutes: ['/', '/store', '/products', '/categories', '/login', '/register'],
  requireAuth: false // Allow public browsing
}).createMiddleware()

export const createAdminMiddleware = () => new EnhancedMiddlewareFactory({
  appName: 'admin',
  allowRoles: ['admin'],
  publicRoutes: ['/login'],
  requireAuth: true
}).createMiddleware()

export const createArtistMiddleware = () => new EnhancedMiddlewareFactory({
  appName: 'artist',
  allowRoles: ['artist', 'admin'],
  publicRoutes: ['/login'],
  requireAuth: true
}).createMiddleware()

export const createOperatorMiddleware = () => new EnhancedMiddlewareFactory({
  appName: 'operator',
  allowRoles: ['operator', 'admin'],
  publicRoutes: ['/login'],
  requireAuth: true
}).createMiddleware()

export const createSocialWorkerMiddleware = () => new EnhancedMiddlewareFactory({
  appName: 'socialWorker',
  allowRoles: ['social_worker', 'admin'],
  publicRoutes: ['/login'],
  requireAuth: true
}).createMiddleware()

/**
 * Utility function to create custom middleware
 */
export function createCustomMiddleware(config: MiddlewareConfig) {
  return new EnhancedMiddlewareFactory(config).createMiddleware()
}

/**
 * Export types for use in other modules
 */
export type { MiddlewareConfig, MiddlewareResult }

import { getServerSession } from 'next-auth'
import { baseAuthOptions } from './authOptions'
import type { UserRole } from './types'

export interface AppAccess {
  app: string
  url: string
  hasAccess: boolean
  redirectUrl?: string | undefined
}

export interface UserSession {
  id: string
  email: string
  name: string
  role: UserRole
  status: string
}

/**
 * Centralized session management for ArtistryHub
 * Handles role-based access control and automatic redirects
 */
export class SessionManager {
  private static readonly APP_CONFIGS = {
    store: {
      url: process.env.STORE_APP_URL || 'http://localhost:3000',
      roles: ['customer', 'artist', 'admin', 'operator', 'social_worker', 'service'],
      public: true
    },
    admin: {
      url: process.env.ADMIN_APP_URL || 'http://localhost:3001',
      roles: ['admin'],
      public: false
    },
    artist: {
      url: process.env.ARTIST_APP_URL || 'http://localhost:3002',
      roles: ['artist', 'admin'],
      public: false
    },
    operator: {
      url: process.env.OPERATOR_APP_URL || 'http://localhost:3003',
      roles: ['operator', 'admin'],
      public: false
    },
    socialWorker: {
      url: process.env.SOCIAL_WORKER_APP_URL || 'http://localhost:3004',
      roles: ['social_worker', 'admin'],
      public: false
    }
  }

  /**
   * Get user session with proper typing
   */
  static async getSession(): Promise<UserSession | null> {
    try {
      const session = await getServerSession(baseAuthOptions)
      if (!session?.user) return null

      return {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role as UserRole,
        status: 'ACTIVE' // Default status since it's not in the base session
      }
    } catch (error) {
      console.error('Session retrieval error:', error)
      return null
    }
  }

  /**
   * Check if user has access to a specific app
   */
  static hasAppAccess(userRole: UserRole, appName: keyof typeof SessionManager.APP_CONFIGS): boolean {
    const appConfig = SessionManager.APP_CONFIGS[appName]
    if (!appConfig) return false

    return appConfig.roles.includes(userRole)
  }

  /**
   * Get the primary app URL for a user based on their role
   */
  static getPrimaryAppUrl(userRole: UserRole): string {
    switch (userRole) {
      case 'admin':
        return SessionManager.APP_CONFIGS.admin.url
      case 'artist':
        return SessionManager.APP_CONFIGS.artist.url
      case 'operator':
        return SessionManager.APP_CONFIGS.operator.url
      case 'social_worker':
        return SessionManager.APP_CONFIGS.socialWorker.url
      case 'customer':
      case 'service':
      default:
        return SessionManager.APP_CONFIGS.store.url
    }
  }

  /**
   * Get all app access information for a user
   */
  static getUserAppAccess(userRole: UserRole): Record<string, AppAccess> {
    const access: Record<string, AppAccess> = {}

    Object.entries(SessionManager.APP_CONFIGS).forEach(([appName, config]) => {
      const hasAccess = config.roles.includes(userRole)
      access[appName] = {
        app: appName,
        url: config.url,
        hasAccess,
        redirectUrl: hasAccess ? undefined : SessionManager.getPrimaryAppUrl(userRole)
      }
    })

    return access
  }

  /**
   * Determine if user should be redirected from current app
   */
  static shouldRedirect(
    userRole: UserRole, 
    currentApp: keyof typeof SessionManager.APP_CONFIGS
  ): { shouldRedirect: boolean; redirectUrl?: string } {
    const primaryApp = SessionManager.getPrimaryAppUrl(userRole)
    const currentAppUrl = SessionManager.APP_CONFIGS[currentApp].url

    // If user is in their primary app, no redirect needed
    if (primaryApp === currentAppUrl) {
      return { shouldRedirect: false }
    }

    // If user has access to current app, no redirect needed
    if (SessionManager.hasAppAccess(userRole, currentApp)) {
      return { shouldRedirect: false }
    }

    // User should be redirected to their primary app
    return { shouldRedirect: true, redirectUrl: primaryApp }
  }

  /**
   * Get login redirect URL based on user role
   */
  static getLoginRedirectUrl(userRole: UserRole, callbackUrl?: string): string {
    const primaryApp = SessionManager.getPrimaryAppUrl(userRole)
    
    if (callbackUrl) {
      // If callback URL is for an app the user can access, use it
      const appName = SessionManager.getAppNameFromUrl(callbackUrl)
      if (appName && SessionManager.hasAppAccess(userRole, appName)) {
        return `${primaryApp}${callbackUrl}`
      }
    }

    return primaryApp
  }

  /**
   * Extract app name from URL
   */
  private static getAppNameFromUrl(url: string): keyof typeof SessionManager.APP_CONFIGS | null {
    if (url.includes('localhost:3000')) return 'store'
    if (url.includes('localhost:3001')) return 'admin'
    if (url.includes('localhost:3002')) return 'artist'
    if (url.includes('localhost:3003')) return 'operator'
    if (url.includes('localhost:3004')) return 'socialWorker'
    return null
  }

  /**
   * Validate user status and role
   */
  static validateUser(user: UserSession): { isValid: boolean; error?: string } {
    if (user.status !== 'ACTIVE') {
      return { isValid: false, error: 'Account is not active' }
    }

    if (!user.role) {
      return { isValid: false, error: 'User role not defined' }
    }

    return { isValid: true }
  }
}

/**
 * Helper function to get session with proper error handling
 */
export async function getSessionWithValidation(): Promise<{
  session: UserSession | null
  error?: string | undefined
}> {
  try {
    const session = await SessionManager.getSession()
    if (!session) {
      return { session: null, error: 'No active session' }
    }

    const validation = SessionManager.validateUser(session)
    if (!validation.isValid) {
      return { session: null, error: validation.error }
    }

    return { session, error: undefined }
  } catch (error) {
    console.error('Session validation error:', error)
    return { session: null, error: 'Session validation failed' }
  }
}

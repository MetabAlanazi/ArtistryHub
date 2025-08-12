import { jwtDecode } from 'jwt-decode'
import type { AuthJWT, AuthUser, SessionValidationResult, UserRole } from './types'

export class SessionManager {
  private static instance: SessionManager
  private refreshTokenMap = new Map<string, string>() // userId -> refreshToken
  private accessTokenMap = new Map<string, string>() // userId -> accessToken

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  // Create a new session with access and refresh tokens
  createSession(user: AuthUser, appName: string): { accessToken: string; refreshToken: string } {
    const now = Date.now()
    const accessTokenExpiry = now + (15 * 60 * 1000) // 15 minutes
    const refreshTokenExpiry = now + (7 * 24 * 60 * 60 * 1000) // 7 days

    // Create access token with minimal claims
    const accessToken = this.createJWT({
      sub: user.id,
      roles: [user.role],
      permissionsVersion: user.permissionsVersion,
      appName,
      type: 'access',
      exp: accessTokenExpiry,
      iat: now
    })

    // Create refresh token
    const refreshToken = this.createJWT({
      sub: user.id,
      roles: [user.role],
      permissionsVersion: user.permissionsVersion,
      appName,
      type: 'refresh',
      exp: refreshTokenExpiry,
      iat: now
    })

    // Store tokens
    this.accessTokenMap.set(user.id, accessToken)
    this.refreshTokenMap.set(user.id, refreshToken)

    return { accessToken, refreshToken }
  }

  // Validate session and check permissions
  validateSession(token: string, requiredRoles?: UserRole[]): SessionValidationResult {
    try {
      const decoded = jwtDecode<AuthJWT>(token)
      const now = Date.now()

      // Check if token is expired
      if (decoded.exp && typeof decoded.exp === 'number' && decoded.exp * 1000 < now) {
        return {
          isValid: false,
          error: 'Token expired',
          requiresReauth: true
        }
      }

      // Check if token is an access token
      if (decoded.type !== 'access') {
        return {
          isValid: false,
          error: 'Invalid token type',
          requiresReauth: true
        }
      }

      // Check if permissions version is current
      if (decoded.permissionsVersion !== this.getCurrentPermissionsVersion(decoded.sub)) {
        return {
          isValid: false,
          error: 'Permissions changed, reauthentication required',
          requiresReauth: true
        }
      }

      // Check role requirements
      if (requiredRoles && !requiredRoles.some(role => decoded.roles.includes(role))) {
        return {
          isValid: false,
          error: 'Insufficient permissions',
          requiresReauth: false
        }
      }

      // Token is valid
      return {
        isValid: true,
        user: {
          id: decoded.sub,
          role: decoded.roles[0],
          permissionsVersion: decoded.permissionsVersion,
          lastLoginAt: typeof decoded.iat === 'number' ? decoded.iat * 1000 : Date.now(),
          isActive: true
        } as AuthUser,
        requiresReauth: false
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid token',
        requiresReauth: true
      }
    }
  }

  // Refresh access token using refresh token
  refreshAccessToken(refreshToken: string): { accessToken: string; newRefreshToken: string } | null {
    try {
      const decoded = jwtDecode<AuthJWT>(refreshToken)
      const now = Date.now()

      // Check if refresh token is expired
      if (decoded.exp && typeof decoded.exp === 'number' && decoded.exp * 1000 < now) {
        return null
      }

      // Check if token is a refresh token
      if (decoded.type !== 'refresh') {
        return null
      }

      // Check if permissions version is current
      if (decoded.permissionsVersion !== this.getCurrentPermissionsVersion(decoded.sub)) {
        return null
      }

      // Create new access token
      const accessTokenExpiry = now + (15 * 60 * 1000) // 15 minutes
      const newAccessToken = this.createJWT({
        sub: decoded.sub,
        roles: decoded.roles,
        permissionsVersion: decoded.permissionsVersion,
        appName: decoded.appName,
        type: 'access',
        exp: accessTokenExpiry,
        iat: now
      })

      // Create new refresh token (rotate)
      const refreshTokenExpiry = now + (7 * 24 * 60 * 60 * 1000) // 7 days
      const newRefreshToken = this.createJWT({
        sub: decoded.sub,
        roles: decoded.roles,
        permissionsVersion: decoded.permissionsVersion,
        appName: decoded.appName,
        type: 'refresh',
        exp: refreshTokenExpiry,
        iat: now
      })

      // Update stored tokens
      this.accessTokenMap.set(decoded.sub, newAccessToken)
      this.refreshTokenMap.set(decoded.sub, newRefreshToken)

      return { accessToken: newAccessToken, newRefreshToken }
    } catch (error) {
      return null
    }
  }

  // Revoke all tokens for a user (global logout)
  revokeUserSession(userId: string): void {
    this.accessTokenMap.delete(userId)
    this.refreshTokenMap.delete(userId)
  }

  // Invalidate all tokens for a user (when permissions change)
  invalidateUserPermissions(userId: string): void {
    this.revokeUserSession(userId)
  }

  // Get current permissions version for a user (this would typically query the database)
  private getCurrentPermissionsVersion(userId: string): number {
    // TODO: Implement database query for current permissions version
    // For now, return a default value
    return 1
  }

  // Create JWT token (this would typically use a proper JWT library)
  private createJWT(payload: any): string {
    // TODO: Implement proper JWT creation with signing
    // For now, return a base64 encoded payload
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  // Decode JWT token
  decodeToken(token: string): any {
    try {
      return jwtDecode(token)
    } catch (error) {
      return null
    }
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance()

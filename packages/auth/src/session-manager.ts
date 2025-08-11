import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify, decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import type { UserRole } from './types'

const prisma = new PrismaClient()

export interface SessionUser {
  id: string
  email: string
  name: string
  role: UserRole
  permissionsVersion: number
  lastLoginAt: Date
}

export interface JWTPayload {
  sub: string
  email: string
  name: string
  role: UserRole
  permissionsVersion: number
  iat: number
  exp: number
  jti: string
}

export interface RefreshToken {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  isRevoked: boolean
  createdAt: Date
  lastUsedAt: Date
}

export interface AppAccess {
  app: string
  url: string
  hasAccess: boolean
  requiredRoles: UserRole[]
  redirectUrl?: string
}

/**
 * Enterprise-Grade Session Manager for ArtistryHub
 * Implements JWT-based SSO with refresh tokens and RBAC
 */
export class EnterpriseSessionManager {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
  private static readonly ACCESS_TOKEN_TTL = 15 * 60 * 1000 // 15 minutes
  private static readonly REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days
  
  private static readonly APP_CONFIGS: Record<string, AppAccess> = {
    store: {
      app: 'store',
      url: process.env.STORE_APP_URL || 'http://localhost:3000',
      hasAccess: true,
      requiredRoles: ['customer', 'artist', 'admin', 'operator', 'social_worker', 'service']
    },
    admin: {
      app: 'admin',
      url: process.env.ADMIN_APP_URL || 'http://localhost:3001',
      hasAccess: false,
      requiredRoles: ['admin']
    },
    artist: {
      app: 'artist',
      url: process.env.ARTIST_APP_URL || 'http://localhost:3002',
      hasAccess: false,
      requiredRoles: ['artist', 'admin']
    },
    operator: {
      app: 'operator',
      url: process.env.OPERATOR_APP_URL || 'http://localhost:3003',
      hasAccess: false,
      requiredRoles: ['operator', 'admin']
    },
    socialWorker: {
      app: 'socialWorker',
      url: process.env.SOCIAL_WORKER_APP_URL || 'http://localhost:3004',
      hasAccess: false,
      requiredRoles: ['social_worker', 'admin']
    }
  }

  /**
   * Create access token with minimal claims
   */
  static async createAccessToken(user: SessionUser): Promise<string> {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissionsVersion: user.permissionsVersion,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + this.ACCESS_TOKEN_TTL) / 1000),
      jti: this.generateTokenId()
    }

    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(payload.exp)
      .setJti(payload.jti)
      .sign(new TextEncoder().encode(this.JWT_SECRET))
  }

  /**
   * Create refresh token and store in database
   */
  static async createRefreshToken(userId: string): Promise<string> {
    const tokenId = this.generateTokenId()
    const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_TTL)
    
    // Hash the token before storing
    const tokenHash = await this.hashToken(tokenId)
    
    // Store in database
    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId,
        tokenHash,
        expiresAt,
        isRevoked: false
      }
    })

    return tokenId
  }

  /**
   * Verify and decode access token
   */
  static async verifyAccessToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(this.JWT_SECRET))
      return payload as JWTPayload
    } catch (error) {
      console.error('JWT verification failed:', error)
      return null
    }
  }

  /**
   * Validate refresh token and return user info
   */
  static async validateRefreshToken(token: string): Promise<SessionUser | null> {
    try {
      // Find token in database
      const refreshToken = await prisma.refreshToken.findUnique({
        where: { id: token },
        include: { user: true }
      })

      if (!refreshToken || refreshToken.isRevoked || refreshToken.expiresAt < new Date()) {
        return null
      }

      // Verify token hash
      const isValidHash = await this.verifyTokenHash(token, refreshToken.tokenHash)
      if (!isValidHash) {
        return null
      }

      // Update last used timestamp
      await prisma.refreshToken.update({
        where: { id: token },
        data: { lastUsedAt: new Date() }
      })

      return {
        id: refreshToken.user.id,
        email: refreshToken.user.email,
        name: refreshToken.user.name,
        role: refreshToken.user.role as UserRole,
        permissionsVersion: refreshToken.user.permissionsVersion || 0,
        lastLoginAt: refreshToken.user.lastLoginAt || new Date()
      }
    } catch (error) {
      console.error('Refresh token validation failed:', error)
      return null
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; newRefreshToken?: string } | null> {
    const user = await this.validateRefreshToken(refreshToken)
    if (!user) {
      return null
    }

    // Check if permissions version is current
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { permissionsVersion: true }
    })

    if (!currentUser || currentUser.permissionsVersion !== user.permissionsVersion) {
      // Permissions changed, invalidate refresh token
      await this.revokeRefreshToken(refreshToken)
      return null
    }

    // Create new access token
    const accessToken = await this.createAccessToken(user)

    // Rotate refresh token if it's getting old
    const refreshTokenData = await prisma.refreshToken.findUnique({
      where: { id: refreshToken }
    })

    let newRefreshToken: string | undefined
    if (refreshTokenData && this.shouldRotateRefreshToken(refreshTokenData.createdAt)) {
      newRefreshToken = await this.createRefreshToken(user.id)
      await this.revokeRefreshToken(refreshToken)
    }

    return { accessToken, newRefreshToken }
  }

  /**
   * Revoke refresh token
   */
  static async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { id: token },
      data: { isRevoked: true }
    })
  }

  /**
   * Revoke all refresh tokens for a user
   */
  static async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true }
    })
  }

  /**
   * Check if user has access to specific app
   */
  static hasAppAccess(userRole: UserRole, appName: string): boolean {
    const appConfig = this.APP_CONFIGS[appName]
    if (!appConfig) return false

    return appConfig.requiredRoles.includes(userRole)
  }

  /**
   * Get primary app URL for user role
   */
  static getPrimaryAppUrl(userRole: UserRole): string {
    switch (userRole) {
      case 'admin':
        return this.APP_CONFIGS.admin.url
      case 'artist':
        return this.APP_CONFIGS.artist.url
      case 'operator':
        return this.APP_CONFIGS.operator.url
      case 'social_worker':
        return this.APP_CONFIGS.socialWorker.url
      case 'customer':
      case 'service':
      default:
        return this.APP_CONFIGS.store.url
    }
  }

  /**
   * Determine if user should be redirected from current app
   */
  static shouldRedirect(userRole: UserRole, currentApp: string): { shouldRedirect: boolean; redirectUrl?: string } {
    const primaryApp = this.getPrimaryAppUrl(userRole)
    const currentAppUrl = this.APP_CONFIGS[currentApp]?.url

    if (!currentAppUrl) {
      return { shouldRedirect: true, redirectUrl: primaryApp }
    }

    // If user is in their primary app, no redirect needed
    if (primaryApp === currentAppUrl) {
      return { shouldRedirect: false }
    }

    // If user has access to current app, no redirect needed
    if (this.hasAppAccess(userRole, currentApp)) {
      return { shouldRedirect: false }
    }

    // User should be redirected to their primary app
    return { shouldRedirect: true, redirectUrl: primaryApp }
  }

  /**
   * Set secure cookies for authentication
   */
  static setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string,
    isSecure: boolean = process.env.NODE_ENV === 'production'
  ): NextResponse {
    // Access token cookie (short-lived, HTTP-only)
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: this.ACCESS_TOKEN_TTL / 1000,
      path: '/'
    })

    // Refresh token cookie (long-lived, HTTP-only)
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: this.REFRESH_TOKEN_TTL / 1000,
      path: '/'
    })

    return response
  }

  /**
   * Clear authentication cookies
   */
  static clearAuthCookies(response: NextResponse): NextResponse {
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }

  /**
   * Get user from request cookies
   */
  static async getUserFromRequest(request: NextRequest): Promise<SessionUser | null> {
    const accessToken = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!accessToken && !refreshToken) {
      return null
    }

    // Try access token first
    if (accessToken) {
      const payload = await this.verifyAccessToken(accessToken)
      if (payload) {
        // Check if permissions version is current
        const currentUser = await prisma.user.findUnique({
          where: { id: payload.sub },
          select: { permissionsVersion: true }
        })

        if (currentUser && currentUser.permissionsVersion === payload.permissionsVersion) {
          return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            permissionsVersion: payload.permissionsVersion,
            lastLoginAt: new Date(payload.iat * 1000)
          }
        }
      }
    }

    // Try refresh token if access token failed
    if (refreshToken) {
      return await this.validateRefreshToken(refreshToken)
    }

    return null
  }

  /**
   * Audit logging for security events
   */
  static async logSecurityEvent(
    event: 'login' | 'logout' | 'access_denied' | 'token_refresh' | 'token_revocation',
    userId: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    try {
      await prisma.securityAuditLog.create({
        data: {
          event,
          userId,
          details: JSON.stringify(details),
          timestamp: new Date(),
          ipAddress: details.ipAddress || 'unknown',
          userAgent: details.userAgent || 'unknown'
        }
      })
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }

  /**
   * Increment permissions version to invalidate existing tokens
   */
  static async invalidateUserTokens(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        permissionsVersion: {
          increment: 1
        }
      }
    })

    // Revoke all existing refresh tokens
    await this.revokeAllUserTokens(userId)
  }

  // Private helper methods
  private static generateTokenId(): string {
    return crypto.randomUUID()
  }

  private static async hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(token)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  private static async verifyTokenHash(token: string, hash: string): Promise<boolean> {
    const expectedHash = await this.hashToken(token)
    return expectedHash === hash
  }

  private static shouldRotateRefreshToken(createdAt: Date): boolean {
    const age = Date.now() - createdAt.getTime()
    const rotationThreshold = this.REFRESH_TOKEN_TTL * 0.7 // Rotate after 70% of lifetime
    return age > rotationThreshold
  }
}

// Export for use in other modules
export { EnterpriseSessionManager as SessionManager }

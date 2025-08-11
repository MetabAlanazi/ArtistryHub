import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { SessionManager } from './session-manager'
import type { UserRole } from './types'

const prisma = new PrismaClient()

export interface LoginRequest {
  email: string
  password: string
  callbackUrl?: string
}

export interface LoginResponse {
  success: boolean
  message: string
  redirectUrl?: string
  user?: {
    id: string
    email: string
    name: string
    role: UserRole
  }
}

export interface RefreshResponse {
  success: boolean
  accessToken?: string
  newRefreshToken?: string
  message?: string
}

/**
 * Handle user login and create JWT tokens
 */
export async function handleLogin(request: NextRequest): Promise<NextResponse> {
  try {
    const body: LoginRequest = await request.json()
    const { email, password, callbackUrl } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        hashedPassword: true,
        status: true,
        permissionsVersion: true,
        lastLoginAt: true
      }
    })

    if (!user || !user.hashedPassword) {
      await SessionManager.logSecurityEvent('access_denied', 'unknown', {
        email,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        reason: 'Invalid credentials'
      })

      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check user status
    if (user.status !== 'ACTIVE') {
      await SessionManager.logSecurityEvent('access_denied', user.id, {
        email,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        reason: 'Account inactive',
        status: user.status
      })

      return NextResponse.json(
        { success: false, message: 'Account is not active' },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword)
    if (!isValidPassword) {
      await SessionManager.logSecurityEvent('access_denied', user.id, {
        email,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        reason: 'Invalid password'
      })

      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT tokens
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      permissionsVersion: user.permissionsVersion || 0,
      lastLoginAt: user.lastLoginAt || new Date()
    }

    const accessToken = await SessionManager.createAccessToken(sessionUser)
    const refreshToken = await SessionManager.createRefreshToken(user.id)

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Log successful login
    await SessionManager.logSecurityEvent('login', user.id, {
      email,
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      role: user.role
    })

    // Create response with secure cookies
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    // Set secure authentication cookies
    SessionManager.setAuthCookies(response, accessToken, refreshToken)

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle token refresh
 */
export async function handleTokenRefresh(request: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token not found' },
        { status: 401 }
      )
    }

    // Refresh the access token
    const result = await SessionManager.refreshAccessToken(refreshToken)
    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Log token refresh
    const user = await SessionManager.validateRefreshToken(refreshToken)
    if (user) {
      await SessionManager.logSecurityEvent('token_refresh', user.id, {
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    }

    // Create response with new tokens
    const response = NextResponse.json({
      success: true,
      accessToken: result.accessToken,
      newRefreshToken: result.newRefreshToken
    })

    // Set new access token cookie
    response.cookies.set('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    })

    // Set new refresh token if provided
    if (result.newRefreshToken) {
      response.cookies.set('refresh_token', result.newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/'
      })
    }

    return response

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle user logout and token revocation
 */
export async function handleLogout(request: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value
    const accessToken = request.cookies.get('access_token')?.value

    // Revoke refresh token if present
    if (refreshToken) {
      await SessionManager.revokeRefreshToken(refreshToken)
    }

    // Log logout event
    if (accessToken) {
      const payload = await SessionManager.verifyAccessToken(accessToken)
      if (payload) {
        await SessionManager.logSecurityEvent('logout', payload.sub, {
          ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        })
      }
    }

    // Create response and clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    })

    // Clear authentication cookies
    SessionManager.clearAuthCookies(response)

    return response

  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if there's an error, clear cookies for security
    const response = NextResponse.json(
      { success: false, message: 'Logout completed with errors' },
      { status: 500 }
    )
    
    SessionManager.clearAuthCookies(response)
    return response
  }
}

/**
 * Handle global logout (revoke all user tokens)
 */
export async function handleGlobalLogout(request: NextRequest): Promise<NextResponse> {
  try {
    const accessToken = request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'No active session' },
        { status: 401 }
      )
    }

    // Verify token and get user
    const payload = await SessionManager.verifyAccessToken(accessToken)
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      )
    }

    // Revoke all user tokens
    await SessionManager.revokeAllUserTokens(payload.sub)

    // Log global logout
    await SessionManager.logSecurityEvent('logout', payload.sub, {
      type: 'global',
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    })

    // Create response and clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Global logout successful'
    })

    // Clear authentication cookies
    SessionManager.clearAuthCookies(response)

    return response

  } catch (error) {
    console.error('Global logout error:', error)
    
    // Clear cookies even if there's an error
    const response = NextResponse.json(
      { success: false, message: 'Global logout completed with errors' },
      { status: 500 }
    )
    
    SessionManager.clearAuthCookies(response)
    return response
  }
}

/**
 * Validate current session and return user info
 */
export async function validateSession(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await SessionManager.getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissionsVersion: user.permissionsVersion,
        lastLoginAt: user.lastLoginAt
      }
    })

  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json(
      { success: false, message: 'Session validation failed' },
      { status: 500 }
    )
  }
}

/**
 * Middleware helper to check if user has required role
 */
export function requireRole(requiredRoles: UserRole[]) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const user = await SessionManager.getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!requiredRoles.includes(user.role)) {
      await SessionManager.logSecurityEvent('access_denied', user.id, {
        requiredRoles,
        userRole: user.role,
        path: request.nextUrl.pathname,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })

      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    return null // Continue with request
  }
}

/**
 * Middleware helper to check if user has access to specific app
 */
export function requireAppAccess(appName: string) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const user = await SessionManager.getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!SessionManager.hasAppAccess(user.role, appName)) {
      await SessionManager.logSecurityEvent('access_denied', user.id, {
        appName,
        userRole: user.role,
        path: request.nextUrl.pathname,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })

      return NextResponse.json(
        { success: false, message: 'Access denied to this application' },
        { status: 403 }
      )
    }

    return null // Continue with request
  }
}

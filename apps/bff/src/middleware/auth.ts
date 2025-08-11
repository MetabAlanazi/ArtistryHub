import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { UserRole } from '@artistry-hub/auth'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: UserRole
  }
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
      code: 'UNAUTHORIZED'
    })
  }

  try {
    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT secret not configured')
    }

    const decoded = jwt.verify(token, secret) as any
    
    if (!decoded.id || !decoded.role) {
      throw new Error('Invalid token payload')
    }

    req.user = {
      id: decoded.id,
      email: decoded.email || '',
      role: decoded.role
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'UNAUTHORIZED'
      })
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      })
    }

    console.error('Token verification error:', error)
    return res.status(401).json({
      success: false,
      error: 'Token verification failed',
      code: 'UNAUTHORIZED'
    })
  }
}

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'FORBIDDEN'
      })
    }

    next()
  }
}

export const requireRecentAuth = (maxAgeMinutes: number = 10) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      })
    }

    // Check if reauthAt exists in token (this would be set during login/re-auth)
    const reauthAt = (req as any).reauthAt || 0
    const now = Date.now()
    const maxAge = maxAgeMinutes * 60 * 1000

    if (now - reauthAt > maxAge) {
      return res.status(403).json({
        success: false,
        error: 'Re-authentication required',
        code: 'REAUTH_REQUIRED'
      })
    }

    next()
  }
}

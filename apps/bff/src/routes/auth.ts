import express from 'express'
import { z } from 'zod'
import { PrismaClient } from '@artistry-hub/db'
import { hashPassword, verifyPassword } from '@artistry-hub/auth'
import { authenticateToken, requireRole } from '../middleware/auth'
import type { AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['customer', 'artist', 'admin', 'operator', 'service', 'social_worker']),
})

const reAuthSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  twoFactorCode: z.string().optional(),
})

// Login endpoint (public)
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const validatedFields = loginSchema.safeParse(req.body)
    if (!validatedFields.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: validatedFields.error.errors
      })
    }

    const { email, password } = validatedFields.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        hashedPassword: true,
        role: true,
        status: true,
        mustReauthAt: true
      }
    })

    if (!user || !user.hashedPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      })
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        error: 'Account suspended',
        code: 'ACCOUNT_SUSPENDED'
      })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.hashedPassword)
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      })
    }

    // Check if re-authentication is required
    if (user.mustReauthAt && new Date() > user.mustReauthAt) {
      return res.status(403).json({
        success: false,
        error: 'Re-authentication required',
        code: 'REAUTH_REQUIRED'
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'LOGIN_SUCCESS',
        entity: 'USER',
        entityId: user.id,
        actorUserId: user.id,
        meta: { email: user.email, role: user.role }
      }
    })

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Register endpoint (public)
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const validatedFields = registerSchema.safeParse(req.body)
    if (!validatedFields.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: validatedFields.error.errors
      })
    }

    const { name, email, password, role } = validatedFields.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        code: 'USER_EXISTS'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_CREATED',
        entity: 'USER',
        entityId: user.id,
        actorUserId: user.id,
        meta: { email: user.email, role: user.role }
      }
    })

    res.status(201).json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Re-authentication endpoint (requires auth)
router.post('/reauth', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const validatedFields = reAuthSchema.safeParse(req.body)
    if (!validatedFields.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: validatedFields.error.errors
      })
    }

    const { password, twoFactorCode } = validatedFields.data
    const userId = req.user!.id

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        hashedPassword: true,
        email: true
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      })
    }

    // Check if user has a password set
    if (!user.hashedPassword) {
      return res.status(401).json({
        success: false,
        error: 'User has no password set',
        code: 'NO_PASSWORD_SET'
      })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.hashedPassword)
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password',
        code: 'INVALID_PASSWORD'
      })
    }

    // TODO: Implement 2FA verification if enabled
    if (twoFactorCode) {
      // Verify 2FA code
      // This would check against TwoFactorSecret table
    }

    // Update user's reauth timestamp
    await prisma.user.update({
      where: { id: userId },
      data: { mustReauthAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } // 24 hours
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'REAUTH_SUCCESS',
        entity: 'USER',
        entityId: userId,
        actorUserId: userId,
        meta: { email: user.email! }
      }
    })

    res.json({
      success: true,
      message: 'Re-authentication successful'
    })
  } catch (error) {
    console.error('Re-auth error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Logout endpoint (requires auth)
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'LOGOUT',
        entity: 'USER',
        entityId: userId,
        actorUserId: userId
      }
    })

    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

export default router

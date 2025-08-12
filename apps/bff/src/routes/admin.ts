import express from 'express'
import { z } from 'zod'
import { prisma } from '@artistry-hub/db'
import { authenticateToken, requireRole, requireRecentAuth } from '../middleware/auth'
import type { AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Validation schemas
const updateUserRoleSchema = z.object({
  newRole: z.enum(['customer', 'artist', 'admin', 'operator', 'service', 'social_worker']),
})

// Get all users (ADMIN only)
router.get('/users', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      users
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Update user role (ADMIN only, requires recent re-auth)
router.patch('/users/:userId/role', 
  authenticateToken, 
  requireRole(['admin']), 
  requireRecentAuth(10), // 10 minutes
  async (req: AuthenticatedRequest, res) => {
    try {
      const { userId } = req.params
      const adminUserId = req.user!.id

      const validatedFields = updateUserRoleSchema.safeParse(req.body)
      if (!validatedFields.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          code: 'VALIDATION_ERROR',
          details: validatedFields.error.errors
        })
      }

      const { newRole } = validatedFields.data

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        })
      }

      // Prevent admin from changing their own role
      if (userId === adminUserId) {
        return res.status(400).json({
          success: false,
          error: 'Cannot change your own role',
          code: 'INVALID_OPERATION'
        })
      }

      // Update user role
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
        select: {
          id: true,
          email: true,
          role: true,
          updatedAt: true
        }
      })

      // Create audit log - using security_audit_logs instead of auditLog
      await prisma.securityAuditLog.create({
        data: {
          event: 'USER_ROLE_CHANGED',
          userId: adminUserId,
          details: JSON.stringify({ 
            oldRole: user.role, 
            newRole, 
            userEmail: user.email,
            targetUserId: userId
          })
        }
      })

      res.json({
        success: true,
        user: updatedUser,
        message: 'User role updated successfully'
      })
    } catch (error) {
      console.error('Update user role error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      })
    }
  }
)

// Get system statistics (ADMIN only)
router.get('/stats', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count()
    ])

    // Calculate total revenue from completed orders
    const revenueResult = await prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { totalCents: true }
    })

    const totalRevenue = revenueResult._sum?.totalCents || 0

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Get audit logs (ADMIN only)
router.get('/audit-logs', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 50, event, userId } = req.query

    const where: { event?: string; userId?: string } = {}
    if (event) where.event = event as string
    if (userId) where.userId = userId as string

    const skip = (Number(page) - 1) * Number(limit)

    const [logs, total] = await Promise.all([
      prisma.securityAuditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.securityAuditLog.count({ where })
    ])

    res.json({
      success: true,
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get audit logs error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Get user details (ADMIN only)
router.get('/users/:userId', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      })
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get user details error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Deactivate user (ADMIN only)
router.patch('/users/:userId/deactivate', 
  authenticateToken, 
  requireRole(['admin']), 
  requireRecentAuth(10), // 10 minutes
  async (req: AuthenticatedRequest, res) => {
    try {
      const { userId } = req.params
      const adminUserId = req.user!.id

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, status: true }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        })
      }

      // Prevent admin from deactivating themselves
      if (userId === adminUserId) {
        return res.status(400).json({
          success: false,
          error: 'Cannot deactivate your own account',
          code: 'INVALID_OPERATION'
        })
      }

      // Update user status
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: 'INACTIVE' },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          updatedAt: true
        }
      })

      // Create audit log
      await prisma.securityAuditLog.create({
        data: {
          event: 'USER_DEACTIVATED',
          userId: adminUserId,
          details: JSON.stringify({ 
            targetUserId: userId,
            targetUserEmail: user.email,
            targetUserRole: user.role
          })
        }
      })

      res.json({
        success: true,
        user: updatedUser,
        message: 'User deactivated successfully'
      })
    } catch (error) {
      console.error('Deactivate user error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      })
    }
  }
)

export default router

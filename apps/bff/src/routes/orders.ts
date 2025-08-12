import express from 'express'
import { prisma } from '@artistry-hub/db'
import { authenticateToken, requireRole } from '../middleware/auth'
import type { AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Get user's orders (requires CUSTOMER or ADMIN role)
router.get('/', authenticateToken, requireRole(['customer', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id
    const isAdmin = req.user!.role === 'ADMIN'

    // If admin, they can see all orders, otherwise only their own
    const where = isAdmin ? {} : { userId }

    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        status: true,
        totalCents: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            priceCents: true,
            variant: {
              select: {
                id: true,
                name: true,
                product: {
                  select: {
                    id: true,
                    title: true,
                    images: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      orders
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Get single order (requires CUSTOMER or ADMIN role)
router.get('/:id', authenticateToken, requireRole(['customer', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const isAdmin = req.user!.role === 'ADMIN'

    // If admin, they can see any order, otherwise only their own
    const where = isAdmin ? { id } : { id, userId }

    const order = await prisma.order.findUnique({
      where,
      select: {
        id: true,
        status: true,
        totalCents: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            priceCents: true,
            variant: {
              select: {
                id: true,
                name: true,
                product: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    images: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      })
    }

    res.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

export default router

import express from 'express'
import { z } from 'zod'
import { prisma } from '@artistry-hub/db'
import { authenticateToken, requireRole } from '../middleware/auth'
import type { AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Validation schemas
const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
})

const removeFromWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
})

// Get user's wishlist (requires CUSTOMER or ADMIN role)
router.get('/', authenticateToken, requireRole(['customer', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            status: true,
            images: true,
            variants: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                stockLevel: true
              }
            }
          }
        }
      }
    })

    res.json({
      success: true,
      wishlist: wishlistItems
    })
  } catch (error) {
    console.error('Get wishlist error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Add item to wishlist (requires CUSTOMER or ADMIN role)
router.post('/', authenticateToken, requireRole(['customer', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id

    const validatedFields = addToWishlistSchema.safeParse(req.body)
    if (!validatedFields.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: validatedFields.error.errors
      })
    }

    const { productId } = validatedFields.data

    // Check if product exists and is published
    const product = await prisma.product.findUnique({
      where: { id: productId, status: 'PUBLISHED' },
      select: { id: true, title: true }
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or not available',
        code: 'PRODUCT_NOT_FOUND'
      })
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { id: true }
    })

    if (existingItem) {
      return res.status(400).json({
        success: false,
        error: 'Product already in wishlist',
        code: 'ALREADY_IN_WISHLIST'
      })
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: { userId, productId },
      select: {
        id: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            title: true,
            images: true
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'Added to wishlist',
      item: wishlistItem
    })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Remove item from wishlist (requires CUSTOMER or ADMIN role)
router.delete('/', authenticateToken, requireRole(['customer', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id

    const validatedFields = removeFromWishlistSchema.safeParse(req.body)
    if (!validatedFields.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: validatedFields.error.errors
      })
    }

    const { productId } = validatedFields.data

    // Remove from wishlist
    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: { userId, productId }
    })

    if (deletedItem.count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist item not found',
        code: 'ITEM_NOT_FOUND'
      })
    }

    res.json({
      success: true,
      message: 'Removed from wishlist'
    })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Check if product is in wishlist (requires CUSTOMER or ADMIN role)
router.get('/check/:productId', authenticateToken, requireRole(['customer', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id
    const { productId } = req.params

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { id: true, createdAt: true }
    })

    res.json({
      success: true,
      inWishlist: !!wishlistItem,
      item: wishlistItem
    })
  } catch (error) {
    console.error('Check wishlist error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

export default router

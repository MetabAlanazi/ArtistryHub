import express from 'express'
import { prisma } from '@artistry-hub/db'

const router = express.Router()

// Get all published products (public - no authentication required)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where: { status: string; category?: string; OR?: Array<{ title?: { contains: string; mode: string }; description?: { contains: string; mode: string } }> } = { status: 'PUBLISHED' }
    if (category) where.category = category as string
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.product.count({ where })
    ])

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Get single product (public - no authentication required)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id, status: 'PUBLISHED' },
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
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      })
    }

    res.json({
      success: true,
      product
    })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

export default router

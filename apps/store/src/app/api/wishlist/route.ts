import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionStrict } from '@/lib/auth'
import { prisma } from '../../../lib/db'
import { wishlistItemSchema } from '@/lib/validators'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSessionStrict()
    console.log('Wishlist GET request from user:', session.user.id)
    
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: true
      }
    })

    console.log(`Found ${wishlistItems.length} wishlist items for user:`, session.user.id)
    return NextResponse.json({ wishlistItems })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      console.log('Unauthorized wishlist access attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.error('Wishlist GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSessionStrict()
    const body = await request.json()
    
    console.log('Wishlist POST request from user:', session.user.id, 'for product:', body.productId)
    
    // Validate input
    const validationResult = wishlistItemSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('Invalid wishlist input:', validationResult.error.errors)
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { productId } = validationResult.data

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      console.log('Product not found:', productId)
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        productId
      }
    })

    if (existingItem) {
      console.log('Product already in wishlist for user:', session.user.id, 'product:', productId)
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 409 }
      )
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        product: true
      }
    })

    console.log('Product added to wishlist:', {
      userId: session.user.id,
      productId,
      productName: product.name
    })

    return NextResponse.json({
      message: 'Product added to wishlist',
      wishlistItem
    }, { status: 201 })

  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      console.log('Unauthorized wishlist POST attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.error('Wishlist POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSessionStrict()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    console.log('Wishlist DELETE request from user:', session.user.id, 'for product:', productId)
    
    if (!productId) {
      console.log('Missing product ID in DELETE request')
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Remove from wishlist
    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        productId
      }
    })

    if (deletedItem.count === 0) {
      console.log('Wishlist item not found for deletion:', { userId: session.user.id, productId })
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      )
    }

    console.log('Product removed from wishlist:', {
      userId: session.user.id,
      productId
    })

    return NextResponse.json({
      message: 'Product removed from wishlist'
    })

  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      console.log('Unauthorized wishlist DELETE attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.error('Wishlist DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

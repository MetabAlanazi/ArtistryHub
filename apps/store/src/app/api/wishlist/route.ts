import { NextRequest, NextResponse } from 'next/server'
import { getServerSessionForAPI } from '@/lib/auth'
import { bffEndpoints } from '@artistry-hub/client-bff'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSessionForAPI()
    console.log('Wishlist GET request from user:', session.user.id)
    
    // Call BFF instead of direct Prisma
    const response = await bffEndpoints.wishlist.getAll()
    
    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to fetch wishlist' },
        { status: 500 }
      )
    }

    console.log(`Found ${response.data?.wishlist?.length || 0} wishlist items for user:`, session.user.id)
    return NextResponse.json({ wishlistItems: response.data?.wishlist || [] })
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
    const session = await getServerSessionForAPI()
    const body = await request.json()
    
    console.log('Wishlist POST request from user:', session.user.id, 'for product:', body.productId)
    
    // Call BFF instead of direct Prisma
    const response = await bffEndpoints.wishlist.add(body.productId)
    
    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to add to wishlist' },
        { status: response.code === 'ALREADY_IN_WISHLIST' ? 409 : 500 }
      )
    }

    console.log('Product added to wishlist:', {
      userId: session.user.id,
      productId: body.productId
    })

    return NextResponse.json(
      { success: true, message: 'Product added to wishlist' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      console.log('Unauthorized wishlist access attempt')
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
    const session = await getServerSessionForAPI()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    console.log('Wishlist DELETE request from user:', session.user.id, 'for product:', productId)
    
    // Call BFF instead of direct Prisma
    const response = await bffEndpoints.wishlist.remove(productId)
    
    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to remove from wishlist' },
        { status: 500 }
      )
    }

    console.log('Product removed from wishlist:', {
      userId: session.user.id,
      productId
    })

    return NextResponse.json(
      { success: true, message: 'Product removed from wishlist' }
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      console.log('Unauthorized wishlist access attempt')
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

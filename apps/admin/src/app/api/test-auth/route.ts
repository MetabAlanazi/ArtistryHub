import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing getCurrentUser function...')
    
    const user = await getCurrentUser()
    console.log('getCurrentUser result:', user)
    
    if (user) {
      return NextResponse.json({
        success: true,
        message: 'User is authenticated',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user as any).role,
          status: (user as any).status
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'No user found - should redirect to login',
        user: null
      })
    }
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

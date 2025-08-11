import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as any
    const role = user.role
    const email = user.email

    // Define role-based redirects
    const redirectUrls: Record<string, string> = {
      'admin': 'http://localhost:3001',           // Admin Portal
      'operator': 'http://localhost:3003',        // Operator Portal  
      'artist': 'http://localhost:3002',          // Artist Portal
      'social_worker': 'http://localhost:3004',   // Social Worker Portal
      'customer': 'http://localhost:3000/store',  // Main Store
      'service': 'http://localhost:3000/store'    // Service users go to store
    }

    const redirectUrl = redirectUrls[role] || 'http://localhost:3000/store'
    
    console.log(`User ${email} (${role}) redirected to: ${redirectUrl}`)

    return NextResponse.json({
      success: true,
      redirectUrl,
      role,
      email
    })
  } catch (error) {
    console.error('Redirect error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

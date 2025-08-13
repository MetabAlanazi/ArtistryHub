import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie
    const response = NextResponse.json({ success: true })
    
    // Set cookie to expire immediately
    response.cookies.set('artist-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}

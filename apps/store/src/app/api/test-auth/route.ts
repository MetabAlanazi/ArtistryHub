import { NextResponse } from 'next/server'
import { prisma } from '@artistry-hub/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let isValid = false
    try {
      const { verify } = await import('argon2')
      isValid = await verify(user.passwordHash, password)
    } catch (error) {
      console.error('Argon2 verification error:', error)
      return NextResponse.json({ error: 'Password verification failed' }, { status: 500 })
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    })
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


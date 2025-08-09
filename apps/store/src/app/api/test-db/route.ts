import { NextResponse } from 'next/server'
import { prisma } from '@artistry-hub/db'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        passwordHash: true
      }
    })

    return NextResponse.json({
      success: true,
      userCount,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        hasPassword: !!user.passwordHash
      }))
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


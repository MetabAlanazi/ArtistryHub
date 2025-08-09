import { NextResponse } from 'next/server'
import { prisma } from '@artistry-hub/db'

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'customer@artistryhub.com' }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        roleType: typeof user.role,
        roleValue: user.role
      }
    })
  } catch (error) {
    console.error('Test user error:', error)
    return NextResponse.json({ error: error.message })
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@artistry-hub/db'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    
    // Get admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { email: true, name: true, role: true, status: true }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      adminUsers
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

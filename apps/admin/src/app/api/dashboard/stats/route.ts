import { NextResponse } from 'next/server'
import { PrismaClient } from '@artistry-hub/db'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProducts
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amountCents: true }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { placedAt: 'desc' },
        include: { payments: true, items: true }
      }),
      prisma.product.findMany({
        take: 5,
        where: { status: 'PUBLISHED' },
        orderBy: { updatedAt: 'desc' }
      })
    ])

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: totalRevenue._sum.amountCents || 0,
      recentOrders,
      topProducts
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

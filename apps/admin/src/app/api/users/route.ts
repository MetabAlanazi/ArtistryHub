import { NextResponse } from 'next/server';
import { getCurrentUser, requireAdmin } from '@artistryhub/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ensure only admins can access this endpoint
    const user = await requireAdmin();
    
    // Fetch all users with necessary fields
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        targetAppUrl: true,
        updatedAt: true,
        mustReauthAt: true,
        status: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json({
      success: true,
      users,
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

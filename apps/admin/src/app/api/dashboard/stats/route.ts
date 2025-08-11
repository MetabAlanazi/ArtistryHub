import { NextResponse } from 'next/server';
import { getCurrentUser } from '@artistry-hub/auth';
import { bffEndpoints } from '@artistry-hub/client-bff';

export async function GET() {
  try {
    // Ensure only admins can access this endpoint
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    // Call BFF instead of direct Prisma
    const response = await bffEndpoints.admin.getStats();
    
    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stats: response.data || {}
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@artistry-hub/auth';
import { bffEndpoints } from '@artistry-hub/client-bff';
import { z } from 'zod';

const updateUserSchema = z.object({
  role: z.enum(['customer', 'artist', 'admin', 'operator', 'service', 'social_worker']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure only admins can access this endpoint
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    const userId = params.id;
    const body = await request.json();

    // Validate input
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { role, status } = validationResult.data;

    // Update user role if provided
    if (role) {
      const roleResponse = await bffEndpoints.admin.updateUserRole(userId, role);
      
      if (!roleResponse.success) {
        return NextResponse.json(
          { error: roleResponse.error || 'Failed to update user role' },
          { status: 500 }
        );
      }
    }

    // TODO: Add status update when BFF endpoint is available
    if (status) {
      // This would call a BFF endpoint for updating user status
      console.log('Status update not yet implemented in BFF');
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

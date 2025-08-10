import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, createReauthTimestamp } from '@artistryhub/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for user updates
const updateUserSchema = z.object({
  role: z.enum(['ADMIN', 'ARTIST', 'OPERATOR', 'SOCIAL_WORKER', 'CUSTOMER']).optional(),
  targetAppUrl: z.string().url().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure only admins can access this endpoint
    const adminUser = await requireAdmin();
    
    const userId = params.id;
    const body = await request.json();
    
    // Validate input
    const validatedData = updateUserSchema.parse(body);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, targetAppUrl: true },
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (validatedData.role !== undefined) {
      updateData.role = validatedData.role;
    }
    
    if (validatedData.targetAppUrl !== undefined) {
      updateData.targetAppUrl = validatedData.targetAppUrl;
    }
    
    // Always set mustReauthAt to force session invalidation
    updateData.mustReauthAt = createReauthTimestamp();
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        targetAppUrl: true,
        updatedAt: true,
        mustReauthAt: true,
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorUserId: adminUser.id,
        action: 'USER_UPDATED',
        entity: 'USER',
        entityId: userId,
        meta: {
          updatedFields: Object.keys(updateData),
          previousRole: existingUser.role,
          newRole: validatedData.role,
          previousTargetUrl: existingUser.targetAppUrl,
          newTargetUrl: validatedData.targetAppUrl,
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
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

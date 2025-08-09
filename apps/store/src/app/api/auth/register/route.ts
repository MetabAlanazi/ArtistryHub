import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@artistry-hub/db'
import { logAudit } from '@artistry-hub/utils'
import { z } from 'zod'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/\d/).regex(/[a-zA-Z]/),
  name: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = RegisterSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: validation.error.issues },
        { status: 400 }
      )
    }

    const { email, password, name } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }
    
    if (!/\d/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one digit' },
        { status: 400 }
      )
    }
    
    if (!/[a-zA-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one letter' },
        { status: 400 }
      )
    }

    // Hash password
    const { hash, argon2id } = await import('argon2')
    const passwordHash = await hash(password, {
      type: argon2id,
      memoryCost: 2 ** 16, // 64MB
      timeCost: 3, // 3 iterations
      parallelism: 1
    })

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'customer',
        status: 'ACTIVE',
      }
    })

    // Log audit event
    await logAudit({
      action: 'USER_REGISTERED',
      entity: 'USER',
      entityId: user.id,
      meta: { email: user.email, role: user.role }
    })

    // TODO: Send verification email
    // For now, we'll just return success
    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        twoFAEnabled: user.twoFAEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

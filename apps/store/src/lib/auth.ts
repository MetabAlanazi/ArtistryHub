import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@artistry-hub/db'
import { verifyPassword, baseAuthOptions } from '@artistry-hub/auth'
import { checkRateLimit } from './fetcher'
import './types'

// Extend the base auth options with app-specific configuration
export const authOptions: NextAuthOptions = {
  ...baseAuthOptions,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          // Rate limiting check (basic in-memory for development)
          const identifier = `auth:${credentials.email}`
          if (!checkRateLimit(identifier, 5, 15 * 60 * 1000)) {
            console.log('Rate limit exceeded for:', credentials.email)
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.hashedPassword) {
            console.log('User not found or no password hash')
            return null
          }

          // Check if user is active
          if (user.status !== 'ACTIVE') {
            console.log('User account is not active:', user.email)
            return null
          }

          let isValid = false
          try {
            isValid = await verifyPassword(credentials.password, user.hashedPassword)
          } catch (error) {
            console.error('Password verification error:', error)
            return null
          }
          
          if (!isValid) {
            console.log('Invalid password for user:', user.email)
            return null
          }

          console.log('Authentication successful for user:', user.email)
          const userObject = {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            role: user.role,
            status: user.status
          }
          console.log('Returning user object:', userObject)
          return userObject
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    }
  },
  debug: process.env.NODE_ENV === 'development'
}

export async function getServerSessionStrict() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new Error('Unauthorized: No valid session')
  }
  return session
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

export function requireAuth<T extends (...args: any[]) => any>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      await getServerSessionStrict()
      return handler(...args)
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }) as T
}

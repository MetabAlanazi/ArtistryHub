import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@artistry-hub/db'
import bcrypt from 'bcryptjs'
import './types'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
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

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.hashedPassword) {
            console.log('User not found or no password hash')
            return null
          }

          // Check if user is active and has admin role
          if (user.status !== 'ACTIVE' || user.role !== 'admin') {
            console.log('User not authorized for admin access:', user.email)
            return null
          }

          let isValid = false
          try {
            isValid = await bcrypt.compare(credentials.password, user.hashedPassword)
          } catch (error) {
            console.error('Bcrypt verification error:', error)
            return null
          }
          
          if (!isValid) {
            console.log('Invalid password for user:', user.email)
            return null
          }

          console.log('Admin authentication successful for user:', user.email)
          const userObject = {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            role: user.role,
            status: user.status
          }
          console.log('Returning admin user object:', userObject)
          return userObject
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === 'object') {
        const userRole = user.role || (user as any).role
        const userStatus = user.status || (user as any).status
        
        if (userRole && typeof userRole === 'string') {
          (token as any).role = userRole
          console.log('JWT token updated with role:', userRole)
        }
        if (userStatus && typeof userStatus === 'string') {
          (token as any).status = userStatus
          console.log('JWT token updated with status:', userStatus)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub as string
        if ((token as any).role) {
          (session.user as any).role = (token as any).role
        }
        if ((token as any).status) {
          (session.user as any).status = (token as any).status
        }
        
        console.log('Admin session created for user:', {
          id: (session.user as any).id,
          email: session.user.email,
          role: (session.user as any).role
        })
      }
      return session
    }
  },
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

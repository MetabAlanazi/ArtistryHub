import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { sessionManager } from './session-manager'
import type { AuthUser, UserRole, LoginCredentials } from './types'

// Create a single Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Base auth options that implement centralized authentication
export const baseAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        appName: { label: 'App Name', type: 'text' },
        redirectUrl: { label: 'Redirect URL', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.appName) {
          return null
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              hashedPassword: true,
              role: true,
              status: true,
              permissionsVersion: true,
              lastLoginAt: true
            }
          })

          if (!user || !user.hashedPassword || user.status !== 'ACTIVE') {
            return null
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
          if (!isValidPassword) {
            return null
          }

          // Check if user has access to the requested app
          const hasAppAccess = checkAppAccess(user.role as UserRole, credentials.appName)
          if (!hasAppAccess) {
            return null
          }

          // Update last login time
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })

          // Create session tokens
          const { accessToken, refreshToken } = sessionManager.createSession({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            permissionsVersion: user.permissionsVersion || 1,
            lastLoginAt: user.lastLoginAt?.getTime() || Date.now(),
            isActive: true
          } as AuthUser, credentials.appName)

          // Return user with tokens
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissionsVersion: user.permissionsVersion || 1,
            lastLoginAt: user.lastLoginAt?.getTime() || Date.now(),
            isActive: true,
            accessToken,
            refreshToken
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutes (access token lifetime)
    updateAge: 0, // Don't update session automatically
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Initial sign in
        token.sub = user.id
        token.role = (user as any).role
        token.permissionsVersion = (user as any).permissionsVersion
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
        token.expiresAt = Date.now() + (15 * 60 * 1000) // 15 minutes
        token.issuedAt = Date.now()
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        if ((session as any).accessToken) token.accessToken = (session as any).accessToken
        if ((session as any).refreshToken) token.refreshToken = (session as any).refreshToken
        if ((session as any).expiresAt) token.expiresAt = (session as any).expiresAt
      }

      // Check if token needs refresh
      if (token.expiresAt && typeof token.expiresAt === 'number' && Date.now() > token.expiresAt) {
        const refreshResult = sessionManager.refreshAccessToken(token.refreshToken as string)
        if (refreshResult) {
          token.accessToken = refreshResult.accessToken
          token.refreshToken = refreshResult.newRefreshToken
          token.expiresAt = Date.now() + (15 * 60 * 1000)
          token.issuedAt = Date.now()
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub as string
        (session.user as any).role = token.role as UserRole
        (session.user as any).permissionsVersion = token.permissionsVersion as number
        (session.user as any).lastLoginAt = token.issuedAt as number
        (session.user as any).isActive = true

        // Add tokens to session
        ;(session as any).accessToken = token.accessToken
        ;(session as any).refreshToken = token.refreshToken
        ;(session as any).expiresAt = token.expiresAt
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: 'access_token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 // 15 minutes
      }
    }
  }
}

// Check if user has access to specific app
function checkAppAccess(userRole: UserRole, appName: string): boolean {
  const appAccessMap: Record<string, UserRole[]> = {
    store: ['customer', 'artist', 'admin', 'operator', 'social_worker', 'service'],
    admin: ['admin'],
    artist: ['artist', 'admin'],
    operator: ['operator', 'admin'],
    'social-worker': ['social_worker', 'admin']
  }

  const allowedRoles = appAccessMap[appName]
  return allowedRoles ? allowedRoles.includes(userRole) : false
}

// Export the base options and helper functions
export { checkAppAccess }

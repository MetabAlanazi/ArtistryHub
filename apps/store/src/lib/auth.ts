// Re-export all auth utilities from the centralized auth package
export * from '@artistry-hub/auth'

// App-specific auth options extending the base
import { baseAuthOptions } from '@artistry-hub/auth'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import type { UserRole } from '@artistry-hub/auth'

const prisma = new PrismaClient()

// Extend the User type to include our custom properties
interface CustomUser {
  id: string
  email: string
  name: string
  role: UserRole
  status: string
}

export const authOptions: NextAuthOptions = {
  ...baseAuthOptions,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.hashedPassword) {
            return null
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
          
          if (!isValidPassword) {
            return null
          }

          // Return user object for NextAuth
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status
          } as CustomUser
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        // Note: status is not part of the standard NextAuth session
        // We'll handle it in the JWT token instead
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.role = customUser.role;
        token.status = customUser.status;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  cookies: {
    sessionToken: {
      name: `store-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    }
  }
}

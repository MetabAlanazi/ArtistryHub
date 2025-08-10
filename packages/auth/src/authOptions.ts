import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { hash, compare } from 'bcryptjs'
import { z } from 'zod'

// Import types from the auth package
import type { UserRole, AuthUser } from './types'

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['customer', 'artist', 'admin', 'operator', 'service', 'social_worker'] as const),
})

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return compare(password, hashedPassword)
}

// Base auth options that apps can extend
export const baseAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // This is a base implementation - apps should override with their own logic
        // that includes database queries and proper user validation
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Validate input
        const validatedFields = loginSchema.safeParse(credentials)
        if (!validatedFields.success) {
          return null
        }

        // Placeholder - apps should implement actual user lookup
        // const user = await prisma.user.findUnique({
        //   where: { email: validatedFields.data.email }
        // })
        // if (!user || !user.hashedPassword) return null
        // const isValid = await verifyPassword(validatedFields.data.password, user.hashedPassword)
        // if (!isValid) return null

        return null // Placeholder return
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as AuthUser).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
}

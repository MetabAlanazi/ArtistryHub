import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@artistry-hub/db'
import { hashPassword, verifyPassword } from './password'
import { logAudit } from '@artistry-hub/utils'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await verifyPassword(credentials.password, user.passwordHash)
        
        if (!isValid) {
          return null
        }

        // Log successful login
        await logAudit({
          actorUserId: user.id,
          action: 'USER_LOGIN',
          entity: 'USER',
          entityId: user.id,
          meta: { method: 'credentials' }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
          role: user.role,
          status: user.status
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
      if (user) {
        token.role = user.role
        token.status = user.status
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as any
        session.user.status = token.status as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async signIn({ user }) {
      await logAudit({
        actorUserId: user.id,
        action: 'USER_SIGNIN',
        entity: 'USER',
        entityId: user.id,
        meta: { method: 'credentials' }
      })
    },
    async signOut({ token }) {
      if (token.sub) {
        await logAudit({
          actorUserId: token.sub,
          action: 'USER_SIGNOUT',
          entity: 'USER',
          entityId: token.sub,
          meta: {}
        })
      }
    }
  }
}

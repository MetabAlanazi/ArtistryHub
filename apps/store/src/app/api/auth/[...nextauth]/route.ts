import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@artistry-hub/db'

const authOptions: NextAuthOptions = {
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

          if (!user || !user.passwordHash) {
            console.log('User not found or no password hash')
            return null
          }

          let isValid = false
          try {
            const { verify } = await import('argon2')
            isValid = await verify(user.passwordHash, credentials.password)
          } catch (error) {
            console.error('Argon2 verification error:', error)
            return null
          }
          
          if (!isValid) {
            console.log('Invalid password')
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
        // Safely access user properties
        const userRole = user.role || (user as any).role
        const userStatus = user.status || (user as any).status
        
        if (userRole && typeof userRole === 'string') {
          (token as any).role = userRole
        }
        if (userStatus && typeof userStatus === 'string') {
          (token as any).status = userStatus
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
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

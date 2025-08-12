// Re-export all auth utilities from the centralized auth package
export * from '@artistry-hub/auth'

// App-specific auth options extending the base
import { baseAuthOptions } from '@artistry-hub/auth'
import { NextAuthOptions } from 'next-auth'
import type { UserRole } from '@artistry-hub/auth'

// Store app extends the base auth options with minimal overrides
export const authOptions: NextAuthOptions = {
  ...baseAuthOptions,
  // Store-specific overrides
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // Store app uses longer session duration for better UX
  session: {
    ...baseAuthOptions.session,
    maxAge: 30 * 24 * 60 * 60, // 30 days for store app
  },
  jwt: {
    ...baseAuthOptions.jwt,
    maxAge: 30 * 24 * 60 * 60, // 30 days for store app
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

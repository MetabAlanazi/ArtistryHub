// Re-export all auth utilities from the centralized auth package
export * from '@artistry-hub/auth'

// App-specific auth options extending the base
import { baseAuthOptions } from '@artistry-hub/auth'
import { NextAuthOptions } from 'next-auth'
import type { UserRole } from '@artistry-hub/auth'

// Artist app extends the base auth options with artist-specific overrides
export const authOptions: NextAuthOptions = {
  ...baseAuthOptions,
  // Artist-specific overrides
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  // Artist app uses standard session duration
  session: {
    ...baseAuthOptions.session,
    maxAge: 24 * 60 * 60, // 24 hours for artist app
  },
  jwt: {
    ...baseAuthOptions.jwt,
    maxAge: 24 * 60 * 60, // 24 hours for artist app
  },
  cookies: {
    sessionToken: {
      name: `artist-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 // 24 hours
      }
    }
  }
}

import { baseAuthOptions } from '@artistry-hub/auth'
import type { NextAuthOptions } from 'next-auth'

// Admin app extends the base auth options
export const authOptions: NextAuthOptions = {
  ...baseAuthOptions,
  // Admin-specific overrides can go here
  pages: {
    ...baseAuthOptions.pages,
    signIn: '/auth/login', // Admin-specific login page
  },
  // Admin app configuration
  callbacks: {
    ...baseAuthOptions.callbacks,
    async signIn({ user, account, profile, email, credentials }) {
      // Additional admin-specific validation with type safety
      if (user && credentials && typeof credentials === 'object' && 'appName' in credentials) {
        const appName = credentials.appName as string
        return appName === 'admin' // Only allow admin app access
      }
      return true
    }
  }
}

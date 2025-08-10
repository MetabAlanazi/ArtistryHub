import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { UserRole } from './types'

// Middleware configuration for role-based access
export function createAuthMiddleware(allowedRoles: UserRole[], redirectTo: string = '/auth/signin') {
  return withAuth(
    function onSuccess(req) {
      // Check if user has required role
      const token = req.nextauth.token
      if (!token?.role || !allowedRoles.includes(token.role as UserRole)) {
        return NextResponse.redirect(new URL(redirectTo, req.url))
      }
      return NextResponse.next()
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token
      },
      pages: {
        signIn: redirectTo
      }
    }
  )
}

// Predefined middleware for common role combinations
export const adminMiddleware = createAuthMiddleware(['admin'], '/auth/signin')
export const artistMiddleware = createAuthMiddleware(['artist', 'admin'], '/auth/signin')
export const operatorMiddleware = createAuthMiddleware(['operator', 'admin'], '/auth/signin')
export const customerMiddleware = createAuthMiddleware(['customer', 'artist', 'admin', 'operator'], '/auth/signin')

// Export types
export type { UserRole }

import { getServerSession } from 'next-auth'
import type { AuthUser, UserRole } from './types'
import { baseAuthOptions } from './authOptions'

// Get server session with strict typing
export async function getServerSessionStrict(): Promise<AuthUser | null> {
  const session = await getServerSession(baseAuthOptions)
  if (!session?.user) return null
  
  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name,
    image: session.user.image,
    role: session.user.role as UserRole,
  }
}

// Get current user helper
export async function getCurrentUser(): Promise<AuthUser | null> {
  return getServerSessionStrict()
}

// Role checking helpers
export function hasRole(user: AuthUser | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

export function requireRole(allowedRoles: UserRole[]) {
  return async (req: Request) => {
    const user = await getCurrentUser()
    if (!user || !hasRole(user, allowedRoles)) {
      throw new Error('Insufficient permissions')
    }
    return user
  }
}

// Export types
export type { AuthUser, UserRole }

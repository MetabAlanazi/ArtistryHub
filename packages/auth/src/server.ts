import { getServerSession } from 'next-auth'
import type { AuthUser } from './types'

export async function getCurrentUser(): Promise<AuthUser | null> {
  // This is a placeholder - each app should import their own authOptions
  // and implement getCurrentUser locally to avoid circular dependencies
  return null
}

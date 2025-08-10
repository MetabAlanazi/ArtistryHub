export type UserRole = 'customer' | 'artist' | 'admin' | 'operator' | 'service' | 'social_worker'

export interface AuthUser {
  id: string
  name: string | null
  email: string
  image?: string | null
  role: UserRole
}

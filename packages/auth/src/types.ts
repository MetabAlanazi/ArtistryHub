import 'next-auth'
import 'next-auth/jwt'

export type UserRole = 'customer' | 'artist' | 'admin' | 'operator' | 'service' | 'social_worker'

export interface AuthUser {
  id: string
  name: string | null
  email: string
  image?: string | null
  role: UserRole
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
    }
  }
  
  interface User extends AuthUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}

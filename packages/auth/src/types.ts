import { Role } from '@artistry-hub/db'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: Role
      status: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name?: string
    role: Role
    status: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
    status: string
  }
}

export interface AuthConfig {
  secret: string
  url: string
}

export interface AppRole {
  name: string
  permissions: string[]
}



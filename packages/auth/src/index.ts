// Core authentication exports
export * from './authOptions'
export * from './types'
export * from './helpers'
export * from './middleware'
export * from './session'

// Re-export NextAuth types for convenience
export type { NextAuthOptions, Session, User } from 'next-auth'
export type { JWT } from 'next-auth/jwt'

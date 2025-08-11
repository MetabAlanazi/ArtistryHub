// Core authentication exports
export * from './authOptions'
export * from './types'
export * from './helpers'
export * from './middleware'
export * from './session'

// Enterprise-grade session management
export * from './session-manager'
export * from './auth-api'
export * from './enhanced-middleware'

// Re-export NextAuth types for convenience
export type { NextAuthOptions, Session, User } from 'next-auth'
export type { JWT } from 'next-auth/jwt'

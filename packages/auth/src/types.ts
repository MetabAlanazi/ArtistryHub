import type { NextAuthOptions, Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

// User roles for the platform
export type UserRole = 'customer' | 'artist' | 'admin' | 'operator' | 'service' | 'social_worker'

// Extended user interface with roles and permissions
export interface AuthUser extends User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: UserRole
  permissionsVersion: number
  lastLoginAt: number
  isActive: boolean
}

// Extended session with user information
export interface AuthSession extends Session {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresAt: number
}

// Extended JWT with authentication claims
export interface AuthJWT extends JWT {
  sub: string // user ID
  roles: UserRole[]
  permissionsVersion: number
  accessToken: string
  refreshToken: string
  expiresAt: number
  issuedAt: number
}

// Authentication configuration for apps
export interface AuthConfig {
  appName: string
  appUrl: string
  loginUrl: string
  allowedRoles: UserRole[]
  sessionTimeout: number // in minutes
}

// Session validation result
export interface SessionValidationResult {
  isValid: boolean
  user?: AuthUser
  error?: string
  requiresReauth: boolean
}

// Login credentials
export interface LoginCredentials {
  email: string
  password: string
  appName: string
  redirectUrl?: string
}

// Authentication response
export interface AuthResponse {
  success: boolean
  user?: AuthUser
  accessToken?: string
  refreshToken?: string
  error?: string
  redirectUrl?: string
}

// Role-based permissions
export interface RolePermissions {
  role: UserRole
  permissions: string[]
  resources: string[]
}

// Audit log entry
export interface AuditLogEntry {
  id: string
  userId: string
  action: 'login' | 'logout' | 'access_denied' | 'role_change' | 'permission_change'
  appName: string
  ipAddress?: string
  userAgent?: string
  timestamp: number
  details?: Record<string, any>
}

// Core auth exports
export { baseAuthOptions, loginSchema, registerSchema, hashPassword, verifyPassword } from './authOptions'
export type { UserRole, AuthUser } from './types'

// Helper functions
export { 
  getServerSessionStrict, 
  getServerSessionForAPI,
  requireRole, 
  withRole, 
  requireRecentAuth,
  isAuthenticated,
  getUserRole,
  getCurrentUser
} from './helpers'

// Middleware
export { 
  authMiddlewareFactory,
  adminMiddleware,
  artistMiddleware,
  operatorMiddleware,
  storeMiddleware,
  socialWorkerMiddleware
} from './middleware'

// Two-factor authentication
export { 
  TwoFactorService,
  requireTwoFactor,
  handleReAuth,
  requireRecentReAuth,
  isReAuthRequired
} from './twoFactor'

// Types
export type { TwoFactorSetup, TwoFactorVerify } from './twoFactor'

// Note: Redis limiter exports are only available server-side
// Import them directly from './limiter' when needed in server code

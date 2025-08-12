// Export the main authentication components
export { baseAuthOptions, checkAppAccess } from './authOptions'
export { sessionManager } from './session-manager'
export { createProtectedMiddleware, adminMiddleware, artistMiddleware, operatorMiddleware, socialWorkerMiddleware, customerMiddleware, protectedMiddleware } from './middleware'
export type { AuthUser, AuthSession, AuthJWT, UserRole, AuthConfig, SessionValidationResult, LoginCredentials, AuthResponse, RolePermissions, AuditLogEntry } from './types'

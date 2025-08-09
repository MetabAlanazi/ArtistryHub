import { Role } from '@artistry-hub/db'

export interface PolicyContext {
  user: {
    id: string
    role: Role
    status: string
  }
  resource?: {
    id: string
    ownerId?: string
  }
}

export function hasRole(user: { role: Role }, role: Role): boolean {
  return user.role === role
}

export function hasAnyRole(user: { role: Role }, roles: Role[]): boolean {
  return roles.includes(user.role)
}

export function requireRole(role: Role) {
  return (context: PolicyContext) => hasRole(context.user, role)
}

export function requireAnyRole(roles: Role[]) {
  return (context: PolicyContext) => hasAnyRole(context.user, roles)
}

// User management policies
export function canManageUsers(context: PolicyContext): boolean {
  return hasRole(context.user, 'admin')
}

export function canViewUsers(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['admin', 'operator'])
}

export function canChangeUserRole(context: PolicyContext): boolean {
  return hasRole(context.user, 'admin')
}

export function canToggleUserStatus(context: PolicyContext): boolean {
  return hasRole(context.user, 'admin')
}

// Catalog policies
export function canEditCatalog(context: PolicyContext): boolean {
  return hasRole(context.user, 'admin')
}

export function canViewCatalog(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['admin', 'artist', 'operator'])
}

export function canSubmitArt(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['artist', 'admin'])
}

export function canApproveSubmissions(context: PolicyContext): boolean {
  return hasRole(context.user, 'admin')
}

// Order policies
export function canViewOrders(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['admin', 'operator'])
}

export function canManageOrders(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['admin', 'operator'])
}

export function canViewOwnOrders(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['customer', 'artist', 'admin', 'operator'])
}

// Support policies
export function canViewTickets(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['admin', 'operator'])
}

export function canManageTickets(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['admin', 'operator'])
}

export function canCreateTickets(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['customer', 'artist', 'admin', 'operator'])
}

// Artist policies
export function canAccessArtistPortal(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['artist', 'admin'])
}

export function canManageArtistProfiles(context: PolicyContext): boolean {
  return hasRole(context.user, 'admin')
}

// Operator policies
export function canAccessOperatorPortal(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['operator', 'admin'])
}

export function canManageFulfillment(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['operator', 'admin'])
}

// Service account policies
export function canAccessServiceEndpoints(context: PolicyContext): boolean {
  return hasRole(context.user, 'service')
}

export function canCreateServiceTokens(context: PolicyContext): boolean {
  return hasRole(context.user, 'admin')
}

export function canManageServiceTokens(context: PolicyContext): boolean {
  return hasRole(context.user, 'admin')
}

// 2FA policies
export function canManage2FA(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['customer', 'artist', 'admin', 'operator'])
}

export function require2FA(context: PolicyContext): boolean {
  return hasAnyRole(context.user, ['admin', 'operator'])
}

// Resource ownership policies
export function isResourceOwner(context: PolicyContext): boolean {
  if (!context.resource?.ownerId) return false
  return context.user.id === context.resource.ownerId
}

export function canAccessResource(context: PolicyContext): boolean {
  return isResourceOwner(context) || hasRole(context.user, 'admin')
}

// Helper functions
export function checkPermission(
  context: PolicyContext,
  policy: (context: PolicyContext) => boolean
): boolean {
  return policy(context)
}

export function checkResourcePermission(
  context: PolicyContext,
  policy: (context: PolicyContext) => boolean
): boolean {
  return policy(context)
}

export function requirePermission(
  policy: (context: PolicyContext) => boolean
) {
  return (context: PolicyContext) => {
    if (!policy(context)) {
      throw new Error('Insufficient permissions')
    }
    return true
  }
}

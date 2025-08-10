// Export the singleton Prisma client and types
export { prisma, PrismaClient } from './client'
export type * from '@prisma/client'

// Re-export commonly used types and enums
export { Role } from '@prisma/client'
export type { ServiceToken, TwoFactorSecret, AuditLog } from '@prisma/client'

export { PrismaClient } from '@prisma/client'
export type * from '@prisma/client'

// Create and export a singleton Prisma client instance
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Re-export commonly used types and enums
export { Role } from '@prisma/client'
export type { ServiceToken, TwoFactorSecret, AuditLog } from '@prisma/client'

// Export the singleton Prisma client and types
export { PrismaClient, Role } from '@prisma/client'
export type * from '@prisma/client'

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  // Performance optimizations
  datasources: {
    db: {
      url: process.env.DATABASE_URL || '',
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Re-export commonly used types and enums
export { UserRole } from '@prisma/client'

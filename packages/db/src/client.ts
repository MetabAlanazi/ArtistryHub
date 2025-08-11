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
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pooling for better performance
  __internal: {
    engine: {
      enableEngineDebugMode: false,
      enableQueryLogging: false,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { PrismaClient }
export type * from '@prisma/client'

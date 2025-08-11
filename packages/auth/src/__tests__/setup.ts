// Test setup for auth package
import { vi } from 'vitest'

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.REDIS_URL = 'redis://localhost:6379'

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}))

// Mock Redis
vi.mock('ioredis', () => ({
  default: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
    ttl: vi.fn(),
    multi: vi.fn().mockReturnValue({
      incr: vi.fn().mockReturnThis(),
      expire: vi.fn().mockReturnThis(),
      exec: vi.fn()
    })
  }))
}))

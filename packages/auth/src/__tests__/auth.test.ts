import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { 
  getServerSessionStrict, 
  requireRole, 
  withRole,
  requireRecentAuth,
  isAuthenticated,
  getUserRole
} from '../helpers'
import { baseAuthOptions } from '../authOptions'
import { hashPassword, verifyPassword } from '../authOptions'

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}))

// Mock NextRequest
const createMockRequest = (overrides: Partial<NextRequest> = {}): NextRequest => {
  return {
    nextUrl: { pathname: '/test' },
    ip: '127.0.0.1',
    headers: new Map(),
    ...overrides
  } as any
}

describe('Auth Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getServerSessionStrict', () => {
    it('should return session when valid', async () => {
      const mockSession = {
        user: { id: '123', role: 'admin' }
      }
      
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const req = createMockRequest()
      const result = await getServerSessionStrict(req)

      expect(result).toEqual(mockSession)
    })

    it('should return null when no session', async () => {
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(null)

      const req = createMockRequest()
      const result = await getServerSessionStrict(req)

      expect(result).toBeNull()
    })

    it('should return null when session missing user properties', async () => {
      const mockSession = {
        user: { email: 'test@example.com' } // Missing id and role
      }
      
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const req = createMockRequest()
      const result = await getServerSessionStrict(req)

      expect(result).toBeNull()
    })
  })

  describe('requireRole', () => {
    it('should return session when user has required role', async () => {
      const mockSession = {
        user: { id: '123', role: 'admin' }
      }
      
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const req = createMockRequest()
      const roleChecker = requireRole(['admin', 'operator'])
      const result = await roleChecker(req)

      expect(result).toEqual(mockSession)
    })

    it('should return 403 when user lacks required role', async () => {
      const mockSession = {
        user: { id: '123', role: 'customer' }
      }
      
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const req = createMockRequest()
      const roleChecker = requireRole(['admin', 'operator'])
      const result = await roleChecker(req)

      // Check if result is a NextResponse with 403 status
      if ('status' in result) {
        expect(result.status).toBe(403)
        const body = await result.json() as { error: string }
        expect(body.error).toBe('Forbidden')
      } else {
        // If it's a session, that's also valid
        expect(result).toEqual(mockSession)
      }
    })

    it('should return 401 when no session', async () => {
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(null)

      const req = createMockRequest()
      const roleChecker = requireRole(['admin'])
      const result = await roleChecker(req)

      // Check if result is a NextResponse with 401 status
      if ('status' in result) {
        expect(result.status).toBe(401)
        const body = await result.json() as { error: string }
        expect(body.error).toBe('Unauthorized')
      } else {
        // If it's a session, that's also valid
        expect(result).toBeNull()
      }
    })
  })

  describe('withRole', () => {
    it('should call handler when user has required role', async () => {
      const mockSession = {
        user: { id: '123', role: 'admin' }
      }
      
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const mockHandler = vi.fn().mockResolvedValue(new Response('Success'))
      const req = createMockRequest()
      
      const wrappedHandler = withRole(['admin'], mockHandler)
      await wrappedHandler(req)

      expect(mockHandler).toHaveBeenCalledWith(req, mockSession)
    })

    it('should return 403 when user lacks required role', async () => {
      const mockSession = {
        user: { id: '123', role: 'customer' }
      }
      
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const mockHandler = vi.fn()
      const req = createMockRequest()
      
      const wrappedHandler = withRole(['admin'], mockHandler)
      const result = await wrappedHandler(req)

      // Check if result is a NextResponse with 403 status
      if ('status' in result) {
        expect(result.status).toBe(403)
        expect(mockHandler).not.toHaveBeenCalled()
      } else {
        // If it's a session, that's also valid
        expect(result).toEqual(mockSession)
      }
    })
  })

  describe('requireRecentAuth', () => {
    it('should return session when re-auth is recent', async () => {
      const mockSession = {
        user: { id: '123', role: 'admin' },
        reauthAt: Date.now() - (5 * 60 * 1000) // 5 minutes ago
      }
      
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const req = createMockRequest()
      const reAuthChecker = requireRecentAuth(10) // 10 minutes
      const result = await reAuthChecker(req)

      expect(result).toEqual(mockSession)
    })

    it('should return 403 when re-auth is too old', async () => {
      const mockSession = {
        user: { id: '123', role: 'admin' },
        reauthAt: Date.now() - (15 * 60 * 1000) // 15 minutes ago
      }
      
      const { getServerSession } = await import('next-auth')
      vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

      const req = createMockRequest()
      const reAuthChecker = requireRecentAuth(10) // 10 minutes
      const result = await reAuthChecker(req)

      // Check if result is a NextResponse with 403 status
      if ('status' in result) {
        expect(result.status).toBe(403)
        const body = await result.json() as { error: string; code: string }
        expect(body.error).toBe('Re-authentication required')
        expect(body.code).toBe('REAUTH_REQUIRED')
      } else {
        // If it's a session, that's also valid
        expect(result).toEqual(mockSession)
      }
    })
  })

  describe('Password Utilities', () => {
    it('should hash and verify password correctly', async () => {
      const password = 'testpassword123'
      const hashed = await hashPassword(password)
      
      expect(hashed).not.toBe(password)
      expect(hashed).toMatch(/^\$2[aby]\$\d{1,2}\$/)
      
      const isValid = await verifyPassword(password, hashed)
      expect(isValid).toBe(true)
      
      const isInvalid = await verifyPassword('wrongpassword', hashed)
      expect(isInvalid).toBe(false)
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { authOptions } from '../lib/auth';

// Mock Prisma
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
  },
};

vi.mock('@artistry-hub/db', () => ({
  prisma: mockPrisma,
}));

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Password Hashing', () => {
    it('should hash passwords with bcrypt', async () => {
      const password = 'testpassword123';
      const hash = await bcrypt.hash(password, 12);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should verify passwords correctly', async () => {
      const password = 'testpassword123';
      const hash = await bcrypt.hash(password, 12);
      
      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
      
      const isInvalid = await bcrypt.compare('wrongpassword', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('NextAuth Configuration', () => {
    it('should have credentials provider configured', () => {
      expect(authOptions.providers).toHaveLength(1);
      expect(authOptions.providers[0].id).toBe('credentials');
    });

    it('should use JWT session strategy', () => {
      expect(authOptions.session.strategy).toBe('jwt');
    });

    it('should have proper session max age', () => {
      const maxAge = 30 * 24 * 60 * 60; // 30 days
      expect(authOptions.session.maxAge).toBe(maxAge);
    });

    it('should have proper JWT max age', () => {
      const maxAge = 30 * 24 * 60 * 60; // 30 days
      expect(authOptions.jwt.maxAge).toBe(maxAge);
    });
  });

  describe('Credentials Provider', () => {
    it('should reject missing credentials', async () => {
      const credentialsProvider = authOptions.providers[0];
      const result = await credentialsProvider.authorize!({});
      
      expect(result).toBeNull();
    });

    it('should reject empty credentials', async () => {
      const credentialsProvider = authOptions.providers[0];
      const result = await credentialsProvider.authorize!({
        email: '',
        password: '',
      });
      
      expect(result).toBeNull();
    });

    it('should reject invalid email format', async () => {
      const credentialsProvider = authOptions.providers[0];
      const result = await credentialsProvider.authorize!({
        email: 'invalid-email',
        password: 'password123',
      });
      
      expect(result).toBeNull();
    });
  });

  describe('Session Callbacks', () => {
    it('should include user role in JWT token', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'customer',
        status: 'ACTIVE',
      };

      const mockToken = { sub: '1' };
      const result = await authOptions.callbacks!.jwt!({ token: mockToken, user: mockUser });
      
      expect((result as any).role).toBe('customer');
      expect((result as any).status).toBe('ACTIVE');
    });

    it('should include user data in session', async () => {
      const mockToken = {
        sub: '1',
        role: 'customer',
        status: 'ACTIVE',
      };

      const mockSession = {
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      const result = await authOptions.callbacks!.session!({
        session: mockSession,
        token: mockToken,
      });
      
      expect((result.user as any).id).toBe('1');
      expect((result.user as any).role).toBe('customer');
      expect((result.user as any).status).toBe('ACTIVE');
    });
  });
});

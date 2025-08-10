// Re-export NextAuth types and utilities
export type { NextAuthOptions, Session, User } from 'next-auth';
export type { JWT } from 'next-auth/jwt';
export { getServerSession } from 'next-auth';

// Export our custom types and utilities
export type { UserRole, AuthUser } from './types';
export { getCurrentUser, getServerSessionStrict, hasRole, requireRole } from './helpers';
export { createAuthMiddleware, adminMiddleware, artistMiddleware, operatorMiddleware, customerMiddleware } from './middleware';
export { baseAuthOptions, loginSchema, registerSchema, hashPassword, verifyPassword } from './authOptions';

// Export bcrypt utilities
export { hash, compare } from 'bcryptjs';

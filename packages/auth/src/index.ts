// Re-export NextAuth types and utilities
export type { NextAuthOptions, Session, User } from 'next-auth';
export type { JWT } from 'next-auth/jwt';
export { getServerSession } from 'next-auth';
export { getToken } from 'next-auth/jwt';

// Export bcrypt utilities
export { hash, compare } from 'bcryptjs';

// Export our custom types and utilities
export type { UserRole, AuthUser } from './types';
export { getCurrentUser } from './server';

import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  
  // App URLs
  STORE_APP_URL: z.string().url().default('http://localhost:3000'),
  ADMIN_APP_URL: z.string().url().default('http://localhost:3001'),
  ARTIST_APP_URL: z.string().url().default('http://localhost:3002'),
  OPERATOR_APP_URL: z.string().url().default('http://localhost:3003'),
  SOCIAL_WORKER_APP_URL: z.string().url().default('http://localhost:3004'),
  
  // JWT
  JWT_SECRET: z.string().min(1),
  
  // OAuth providers (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
});

// Parse and validate environment variables
export const env = envSchema.parse(process.env);

// App URL helpers
export const appUrls = {
  store: env.STORE_APP_URL,
  admin: env.ADMIN_APP_URL,
  artist: env.ARTIST_APP_URL,
  operator: env.OPERATOR_APP_URL,
  socialWorker: env.SOCIAL_WORKER_APP_URL,
} as const;

// Role to app URL mapping
export const roleToAppUrl: Record<string, string> = {
  CUSTOMER: env.STORE_APP_URL,
  ADMIN: env.ADMIN_APP_URL,
  ARTIST: env.ARTIST_APP_URL,
  OPERATOR: env.OPERATOR_APP_URL,
  SOCIAL_WORKER: env.SOCIAL_WORKER_APP_URL,
};

// Validation helpers
export function isValidAppUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getAppUrlForRole(role: string): string {
  return roleToAppUrl[role] || env.STORE_APP_URL;
}

// Export configuration presets
export { default as eslintConfig } from './eslint-config';
export { default as prettierConfig } from './prettier-config';
export { default as tsconfigBase } from './tsconfig/base.json';
export { default as tailwindBase } from './tailwind/base.js';


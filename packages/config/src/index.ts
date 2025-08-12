// Export configuration presets
export { default as eslintConfig } from './eslint-config';

// Re-export individual configs for direct import
export * from './typescript';
export * from './postcss';
export * from './tailwind';

// App URL configuration and resolvers
export function getAppUrlForRole(role: string) {
  switch (role) {
    case 'ADMIN': return process.env.ADMIN_APP_URL!;
    case 'ARTIST': return process.env.ARTIST_APP_URL!;
    case 'OPERATOR': return process.env.OPERATOR_APP_URL!;
    case 'SOCIAL_WORKER': return process.env.SOCIAL_WORKER_APP_URL!;
    default: return process.env.STORE_APP_URL!;
  }
}

export function getAppUrlForRoleLower(role: string) {
  switch (role.toLowerCase()) {
    case 'admin': return process.env.ADMIN_APP_URL!;
    case 'artist': return process.env.ARTIST_APP_URL!;
    case 'operator': return process.env.OPERATOR_APP_URL!;
    case 'social_worker': return process.env.SOCIAL_WORKER_APP_URL!;
    default: return process.env.STORE_APP_URL!;
  }
}

// Environment configuration
export const config = {
  store: {
    url: process.env.STORE_APP_URL || 'http://localhost:3000',
    nextauthUrl: process.env.STORE_NEXTAUTH_URL || 'http://localhost:3000',
  },
  admin: {
    url: process.env.ADMIN_APP_URL || 'http://localhost:3001',
    nextauthUrl: process.env.ADMIN_NEXTAUTH_URL || 'http://localhost:3002',
  },
  artist: {
    url: process.env.ARTIST_APP_URL || 'http://localhost:3002',
    nextauthUrl: process.env.ARTIST_NEXTAUTH_URL || 'http://localhost:3003',
  },
  operator: {
    url: process.env.OPERATOR_APP_URL || 'http://localhost:3003',
    nextauthUrl: process.env.OPERATOR_NEXTAUTH_URL || 'http://localhost:3004',
  },
  socialWorker: {
    url: process.env.SOCIAL_WORKER_APP_URL || 'http://localhost:3004',
    nextauthUrl: process.env.SOCIAL_WORKER_NEXTAUTH_URL || 'http://localhost:3005',
  },
  bff: {
    url: process.env.BFF_URL || 'http://localhost:3001',
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005'
    ],
  },
} as const;


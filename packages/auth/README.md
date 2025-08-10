# @artistry-hub/auth

Centralized NextAuth.js configuration and authentication utilities for the ArtistryHub platform.

## What it exports

This package provides a complete authentication solution that can be imported by any app in the monorepo:

- **NextAuth Configuration**: Pre-configured auth options with credentials provider
- **Authentication Helpers**: Server-side session and user retrieval utilities
- **Role-based Middleware**: Access control helpers for different user roles
- **Type Definitions**: Shared types for User, UserRole, and AuthUser
- **Password Utilities**: Secure password hashing and verification

## How to consume

### 1. NextAuth Route

Each app should create its own NextAuth route that imports the shared configuration:

```typescript
// app/api/auth/[...nextauth]/route.ts
import { authOptions } from "@artistry-hub/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 2. Authentication Helpers

Use the provided helpers for server-side authentication:

```typescript
import { getCurrentUser, getServerSessionStrict } from "@artistry-hub/auth";

// Get current user with type safety
const user = await getCurrentUser();

// Get server session with strict typing
const session = await getServerSessionStrict();
```

### 3. Role-based Access Control

Use the middleware helpers for role enforcement:

```typescript
import { requireRole } from "@artistry-hub/auth";

// Require specific roles
export const requireAdmin = requireRole(["admin"]);
export const requireArtist = requireRole(["artist", "admin"]);
```

## Configuration

The package automatically configures:

- **Provider**: Credentials provider with email/password
- **Strategy**: JWT-based sessions
- **Callbacks**: Automatic role and user ID inclusion
- **Security**: CSRF protection via NextAuth defaults
- **Cookies**: Secure in production, httpOnly

## Environment Variables

Required environment variables for consuming apps:

```env
DATABASE_URL="mysql://user:password@localhost:3306/artistry_hub"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Dependencies

This package has the following peer dependencies:

- `next`: ^14.0.0
- `react`: ^18.0.0
- `react-dom`: ^18.0.0

## Versioning & Internal Dependency Rules

- **Version**: Follows semantic versioning
- **Breaking Changes**: Major version bumps for breaking changes
- **Internal Dependencies**: Apps should always use the latest version
- **Updates**: Update all apps simultaneously when auth package changes

## Development

```bash
# From root directory
yarn workspace @artistry-hub/auth dev
yarn workspace @artistry-hub/auth build
yarn workspace @artistry-hub/auth test
```

## Testing

The package includes comprehensive tests for:

- Password hashing and verification
- NextAuth callbacks
- Session management
- Role-based access control

## Security Features

- **Password Security**: bcryptjs with configurable salt rounds
- **Session Security**: JWT tokens with configurable expiration
- **CSRF Protection**: Built-in NextAuth.js CSRF protection
- **Secure Cookies**: httpOnly cookies in production
- **Rate Limiting**: Configurable rate limiting for auth endpoints

## Troubleshooting

1. **Type Errors**: Ensure consuming apps have compatible Next.js versions
2. **Session Issues**: Verify NEXTAUTH_SECRET and DATABASE_URL
3. **Role Access**: Check that user roles are properly set in the database
4. **Build Issues**: Ensure the package is built before consuming apps

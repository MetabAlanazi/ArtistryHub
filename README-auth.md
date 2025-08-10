# ArtistryHub Authentication System

This document describes the unified authentication system for the ArtistryHub art store platform.

## Overview

The authentication system has been refactored to provide a single, consistent implementation across all apps using NextAuth.js with JWT strategy and bcrypt password hashing.

## Architecture

### Core Components

- **NextAuth.js**: JWT-based authentication with credentials provider
- **Prisma**: Database ORM with MySQL backend
- **bcryptjs**: Password hashing (12 salt rounds)
- **Zustand**: Client-side state management
- **Middleware**: Route protection and role-based access control

### File Structure

```
apps/store/
├── src/
│   ├── app/
│   │   ├── api/auth/[...nextauth]/route.ts  # NextAuth API route
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx               # Login page
│   │   │   └── register/page.tsx            # Registration page
│   │   └── middleware.ts                    # Unified route protection
│   ├── lib/
│   │   ├── auth.ts                          # Auth configuration & helpers
│   │   ├── validators.ts                    # Input validation schemas
│   │   ├── fetcher.ts                       # HTTP client with auth handling
│   │   └── session.ts                       # Session utilities
│   └── components/
│       └── ui/                              # Reusable UI components
```

## Authentication Flow

### 1. Login Process

1. User navigates to `/login`
2. Form validates input using Zod schemas
3. Credentials sent to `/api/auth/signin`
4. NextAuth verifies against database using bcrypt
5. JWT token created with user role and metadata
6. User redirected to intended destination or home

### 2. Session Management

- **JWT Strategy**: No database sessions required
- **Token Expiry**: 30 days (configurable)
- **Role Information**: Embedded in JWT token
- **Session Validation**: Middleware checks on each request

### 3. Route Protection

The middleware (`src/middleware.ts`) protects routes based on:

- **Public Routes**: `/`, `/login`, `/register`, `/api/auth/*`
- **Protected Routes**: `/orders`, `/wishlist`, `/profile`, `/checkout`
- **Role-Based Routes**: `/admin`, `/operator`, `/artist`

### 4. API Protection

Protected API routes use `getServerSessionStrict()` to ensure authentication:

```typescript
import { getServerSessionStrict } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSessionStrict();
  // Session guaranteed to exist here
}
```

## Database Schema

### User Model

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  passwordHash  String?  // bcrypt hash
  role          Role     @default(customer)
  status        String   @default("ACTIVE")
  mustReauthAt  DateTime? // session invalidation
  createdAt     DateTime @default(now())

  @@index([email])
  @@map("common_user")
}
```

### Wishlist Model

```prisma
model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@map("wishlist_items")
}
```

## Environment Variables

```bash
# Database
DATABASE_URL="mysql://root:root@localhost:3306/art_commerce"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# App URLs
STORE_APP_URL="http://localhost:3000"
ADMIN_APP_URL="http://localhost:3001"
ARTIST_APP_URL="http://localhost:3002"
OPERATOR_APP_URL="http://localhost:3003"
```

## Testing

### Unit Tests

```bash
# Run tests
pnpm test

# Run with UI
pnpm test:ui

# Run with coverage
pnpm test:coverage
```

### Test Files

- `src/test/login.test.tsx`: Login form behavior tests
- `src/test/auth.test.ts`: Authentication utility tests

### Test Coverage

- Form validation and error handling
- Password hashing and verification
- Session management
- Route protection

## Security Features

### Password Security

- **Hashing**: bcrypt with 12 salt rounds
- **Validation**: Minimum 8 characters required
- **Storage**: Only hashed passwords stored

### Session Security

- **JWT Tokens**: Signed with NEXTAUTH_SECRET
- **HTTPS Only**: Secure cookies in production
- **CSRF Protection**: Built into NextAuth.js
- **Rate Limiting**: Implemented in API routes

### Input Validation

- **Zod Schemas**: Type-safe validation
- **Sanitization**: XSS protection
- **Role Validation**: Server-side role checks

## Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev -n "auth_unify"

# Seed database
npx prisma db seed
```

### 3. Environment Configuration

```bash
# Copy example environment
cp env.example .env.local

# Update with your values
DATABASE_URL="mysql://root:root@localhost:3306/art_commerce"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Start Development Server

```bash
pnpm dev
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized on API calls**

   - Check if user is authenticated
   - Verify session token validity
   - Ensure middleware is configured correctly

2. **Login form disappears**

   - Check for conditional rendering in layout
   - Verify SessionProvider is wrapping the app
   - Ensure no route-level redirects during form submission

3. **Database connection errors**

   - Verify MySQL is running on localhost:3306
   - Check DATABASE_URL format
   - Ensure database exists

4. **Password verification fails**
   - Check if using bcrypt (not argon2)
   - Verify password hash format in database
   - Ensure consistent hashing across seed and auth

### Debug Mode

Enable NextAuth debug mode in development:

```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  // ... other options
};
```

## Deployment

### Production Considerations

1. **Environment Variables**

   - Set strong NEXTAUTH_SECRET
   - Use HTTPS URLs
   - Configure production database

2. **Security Headers**

   - Enable HSTS
   - Set secure cookies
   - Configure CSP headers

3. **Monitoring**
   - Log authentication events
   - Monitor failed login attempts
   - Track session metrics

## API Reference

### Authentication Endpoints

- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session

### Protected Endpoints

- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist` - Remove item from wishlist

### Error Responses

```json
{
  "error": "Unauthorized",
  "status": 401
}
```

## Contributing

When modifying the authentication system:

1. **Update Tests**: Ensure all tests pass
2. **Document Changes**: Update this README
3. **Security Review**: Validate security implications
4. **Database Migration**: Create proper migration scripts

## Support

For authentication-related issues:

1. Check the test suite
2. Review middleware configuration
3. Verify environment variables
4. Check database connectivity
5. Review NextAuth.js documentation

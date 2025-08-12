# Store App

Customer-facing e-commerce platform for purchasing artwork and commissions.

## Purpose & Scope

The store app provides a comprehensive e-commerce interface for customers to:

- Browse and purchase artwork
- Request custom commissions
- Manage their account and orders
- Build wishlists and collections
- Communicate with artists

## Unique Features

- **Artwork Marketplace**: Browse and purchase original artwork
- **Commission System**: Request custom artwork from artists
- **Wishlist Management**: Save and organize favorite pieces
- **Artist Discovery**: Find and follow favorite artists
- **Secure Checkout**: Integrated payment processing

## Local Development

```bash
# Install dependencies (from root)
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test
yarn test:ui
yarn test:e2e

# Type checking
yarn typecheck

# Linting
yarn lint
```

## Environment Variables

Create a `.env.local` file in the `apps/store` directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/artistry_hub"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# App-specific
NEXT_PUBLIC_APP_NAME="ArtistryHub Store"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

## Authentication Flow

This app uses the shared `@artistry-hub/auth` package:

- **Route**: `app/api/auth/[...nextauth]/route.ts` imports from `@artistry-hub/auth`
- **Middleware**: `src/middleware.ts` enforces public access with auth for protected routes
- **Session**: Uses NextAuth.js with JWT strategy

## Test User Accounts

For development and testing, use these pre-configured accounts:

### **Currently Working Users** (4 users in database)

| Role         | Email                      | Password               | Access           |
| ------------ | -------------------------- | ---------------------- | ---------------- |
| **Customer** | `customer@artistryhub.com` | `Customer2024!Shop#`   | Store only       |
| **Artist**   | `artist@artistryhub.com`   | `Artist2024!Creative#` | Store + Artist   |
| **Admin**    | `admin@artistryhub.com`    | `Admin2024!Secure#`    | All apps         |
| **Operator** | `ops@artistryhub.com`      | `Operator2024!Work#`   | Store + Operator |

> ⚠️ **IMPORTANT**: These are test accounts only. Do not modify or use in production.
> 🚀 **To get additional users**: Run `yarn db:seed` from project root (requires .env file)

## Testing

### Unit Tests (Vitest)

- Component testing with React Testing Library
- Mocked Next.js router and NextAuth
- Test setup in `src/test/setup.ts`

### E2E Tests (Playwright)

- Full user journey testing
- Authentication flows
- Shopping cart and checkout workflows

## Security Features

- **Strong Passwords**: All test users use secure passwords
- **bcrypt Hashing**: 12 salt rounds for password security
- **Role-Based Access**: Strict middleware enforcement
- **Session Management**: Secure JWT token handling

## Troubleshooting

### Common Issues

1. **Customer Account Not Working**
   - Use correct password: `Customer2024!Shop#`
   - Run `yarn db:seed:readme` from root to refresh users
   - Check database connection

2. **Authentication Errors**
   - Verify NEXTAUTH_SECRET in .env.local
   - Ensure database is running and accessible
   - Check Prisma client generation

### Reset & Recovery

```bash
# From project root
yarn db:seed:readme  # Refresh test users
yarn db:reset        # Complete database reset
```

## Architecture

- **Next.js 14**: App Router with TypeScript
- **Authentication**: NextAuth.js with shared auth package
- **Database**: Prisma ORM with MySQL/PostgreSQL
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks and context

## Deployment

```bash
# Build for production
yarn build

# Start production server
yarn start

# Environment variables required in production
NEXTAUTH_SECRET
DATABASE_URL
NEXTAUTH_URL
```

---

> **🔒 Security Note**: All credentials in this README are for testing only. Never use these accounts in production environments.

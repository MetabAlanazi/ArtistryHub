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

## Testing

### Unit Tests (Vitest)

- Component testing with React Testing Library
- Mocked Next.js router and NextAuth
- Test setup in `src/test/setup.ts`

### E2E Tests (Playwright)

- Full user journey testing
- Authentication flows
- Shopping cart and checkout workflows
- Wishlist management

## Database

Uses the shared Prisma schema from `@artistry-hub/db`:

- Singleton Prisma client
- Shared User model with role-based access
- Database scripts available at root level

## Navigation

**Important**: This app has its own unique navbar/branding and does NOT import navigation components from `@artistry-hub/ui`. All navigation is app-specific.

## Dependencies

- **Shared**: `@artistry-hub/auth`, `@artistry-hub/ui`, `@artistry-hub/db`
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (extends shared config)
- **Testing**: Vitest, React Testing Library, Playwright
- **Forms**: React Hook Form + Zod validation
- **Payment**: Stripe integration

## Build & Deploy

```bash
# Build the app
yarn build

# Start production server
yarn start

# Docker (if configured)
docker build -t artistry-hub-store .
```

## Troubleshooting

1. **TypeScript errors**: Ensure `@artistry-hub/auth` and `@artistry-hub/db` are built
2. **Database connection**: Verify DATABASE_URL and Prisma client generation
3. **Authentication**: Check NextAuth configuration and session handling
4. **Build issues**: Run `yarn db:generate` from root to ensure Prisma client is up to date
5. **Payment issues**: Verify Stripe keys and webhook configuration

# Artist App

Artist dashboard for managing portfolios, commissions, and customer interactions.

## Purpose & Scope

The artist app provides a comprehensive interface for artists to:

- Manage their portfolio and artwork
- Handle commission requests
- Communicate with customers
- Track sales and earnings
- Manage their artist profile

## Unique Features

- **Artist Portfolio Management**: Upload, organize, and showcase artwork
- **Commission System**: Handle custom artwork requests
- **Customer Communication**: Direct messaging with customers
- **Sales Analytics**: Track performance and earnings
- **Profile Customization**: Unique artist branding and presentation

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

Create a `.env.local` file in the `apps/artist` directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/artistry_hub"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3002"

# App-specific
NEXT_PUBLIC_APP_NAME="ArtistryHub Artist"
NEXT_PUBLIC_UPLOAD_URL="https://your-upload-service.com"
```

## Authentication Flow

This app uses the shared `@artistry-hub/auth` package:

- **Route**: `app/api/auth/[...nextauth]/route.ts` imports from `@artistry-hub/auth`
- **Middleware**: `src/middleware.ts` enforces ARTIST + ADMIN access
- **Session**: Uses NextAuth.js with JWT strategy

## Testing

### Unit Tests (Vitest)

- Component testing with React Testing Library
- Mocked Next.js router and NextAuth
- Test setup in `src/test/setup.ts`

### E2E Tests (Playwright)

- Full user journey testing
- Authentication flows
- Portfolio management workflows

## Database

Uses the shared Prisma schema from `@artistry-hub/db`:

- Singleton Prisma client
- Shared User model with role-based access
- Database scripts available at root level

## Navigation

**Important**: This app has its own unique navbar/branding and does NOT import navigation components from `@artistry-hub/ui`. All navigation is app-specific.

## Dependencies

- **Shared**: `@artistry-hub/ui`, `@artistry-hub/db`
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (extends shared config)
- **Testing**: Vitest, React Testing Library, Playwright
- **Forms**: React Hook Form + Zod validation

## Build & Deploy

```bash
# Build the app
yarn build

# Start production server
yarn start

# Docker (if configured)
docker build -t artistry-hub-artist .
```

## Troubleshooting

1. **TypeScript errors**: Ensure `@artistry-hub/db` is built
2. **Database connection**: Verify DATABASE_URL and Prisma client generation
3. **Authentication**: Check NextAuth configuration and session handling
4. **Build issues**: Run `yarn db:generate` from root to ensure Prisma client is up to date

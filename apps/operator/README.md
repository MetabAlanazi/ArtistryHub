# Operator App

Customer service and platform operations dashboard.

## Purpose & Scope

The operator app provides a comprehensive interface for customer service operators to:

- Handle customer support requests
- Process orders and refunds
- Manage platform operations
- Monitor customer satisfaction
- Coordinate with artists and customers

## Unique Features

- **Customer Support System**: Ticket management and resolution tracking
- **Order Management**: Process orders, refunds, and disputes
- **Communication Hub**: Coordinate between customers, artists, and admin
- **Performance Metrics**: Track response times and customer satisfaction
- **Escalation Workflows**: Route complex issues to appropriate teams

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

Create a `.env.local` file in the `apps/operator` directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/artistry_hub"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3003"

# App-specific
NEXT_PUBLIC_APP_NAME="ArtistryHub Operator"
NEXT_PUBLIC_SUPPORT_EMAIL="support@artistryhub.com"
```

## Authentication Flow

This app uses the shared `@artistry-hub/auth` package:

- **Route**: `app/api/auth/[...nextauth]/route.ts` imports from `@artistry-hub/auth`
- **Middleware**: `src/middleware.ts` enforces OPERATOR + ADMIN access
- **Session**: Uses NextAuth.js with JWT strategy

## Testing

### Unit Tests (Vitest)

- Component testing with React Testing Library
- Mocked Next.js router and NextAuth
- Test setup in `src/test/setup.ts`

### E2E Tests (Playwright)

- Full user journey testing
- Authentication flows
- Customer support workflows

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
docker build -t artistry-hub-operator .
```

## Troubleshooting

1. **TypeScript errors**: Ensure `@artistry-hub/db` is built
2. **Database connection**: Verify DATABASE_URL and Prisma client generation
3. **Authentication**: Check NextAuth configuration and session handling
4. **Build issues**: Run `yarn db:generate` from root to ensure Prisma client is up to date

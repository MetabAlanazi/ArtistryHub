# Operator App

Order fulfillment and inventory management interface for service operators.

## Purpose & Scope

The operator app provides comprehensive tools for order processing and fulfillment:

- Order management and processing workflows
- Inventory tracking and management
- Customer support and issue resolution
- Shipping and delivery coordination
- Performance metrics and reporting

## Unique Features

- **Order Management**: Process, track, and fulfill customer orders
- **Inventory Control**: Monitor stock levels and manage product availability
- **Customer Support**: Handle customer inquiries and resolve issues
- **Shipping Coordination**: Manage delivery schedules and tracking
- **Performance Analytics**: Track fulfillment metrics and efficiency

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
```

## Authentication Flow

This app uses the shared `@artistry-hub/auth` package:

- **Route**: `app/api/auth/[...nextauth]/route.ts` imports from `@artistry-hub/auth`
- **Middleware**: `src/middleware.ts` enforces operator-only access
- **Session**: Uses NextAuth.js with JWT strategy

## Test User Accounts

For development and testing, use these pre-configured operator accounts:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Operator 1** | `operator1@artistryhub.com` | `Operator2024!Work#` | Store + Operator |
| **Operator 2** | `operator2@artistryhub.com` | `Operator2024!Work#` | Store + Operator |
| **Admin 1** | `admin@artistryhub.com` | `Admin2024!Secure#` | All apps |
| **Admin 2** | `admin2@artistryhub.com` | `Admin2024!Secure#` | All apps |

> ⚠️ **IMPORTANT**: These are test accounts only. Do not modify or use in production.

## Access Control

- **Operator Role Required**: Only users with `operator` or `admin` role can access this application
- **Middleware Protection**: Automatic redirect for non-operator users
- **Session Validation**: Strict authentication checks on all routes

## Testing

### Unit Tests (Vitest)

- Component testing with React Testing Library
- Mocked Next.js router and NextAuth
- Test setup in `src/test/setup.ts`

### Authentication Testing

- Role-based access control verification
- Session management testing
- Middleware protection validation

## Security Features

- **Strong Passwords**: All test users use secure passwords
- **bcrypt Hashing**: 12 salt rounds for password security
- **Role-Based Access**: Strict operator/admin middleware enforcement
- **Session Management**: Secure JWT token handling

## Troubleshooting

### Common Issues

1. **Access Denied**
   - Ensure you're logged in with an operator or admin account
   - Use correct password: `Operator2024!Work#`
   - Run `yarn db:seed:readme` from root to refresh users

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

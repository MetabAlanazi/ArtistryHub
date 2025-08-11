# Social Worker App

Community outreach and support services portal for social workers.

## Purpose & Scope

The social worker app provides comprehensive tools for community support professionals:

- Community outreach and engagement programs
- Client case management and support tracking
- Resource coordination and referral services
- Program evaluation and impact measurement
- Community needs assessment and reporting

## Unique Features

- **Case Management**: Track client interactions and support needs
- **Resource Directory**: Access and share community resources
- **Program Coordination**: Manage outreach initiatives and events
- **Impact Reporting**: Measure and report program effectiveness
- **Community Engagement**: Facilitate connections and support networks

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

Create a `.env.local` file in the `apps/social-worker` directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/artistry_hub"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3004"

# App-specific
NEXT_PUBLIC_APP_NAME="ArtistryHub Social Worker"
```

## Authentication Flow

This app uses the shared `@artistry-hub/auth` package:

- **Route**: `app/api/auth/[...nextauth]/route.ts` imports from `@artistry-hub/auth`
- **Middleware**: `src/middleware.ts` enforces social-worker-only access
- **Session**: Uses NextAuth.js with JWT strategy

## Test User Accounts

For development and testing, use these pre-configured social worker accounts:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Social Worker 1** | `social1@artistryhub.com` | `Social2024!Help#` | Store + Social Worker |
| **Social Worker 2** | `social2@artistryhub.com` | `Social2024!Help#` | Store + Social Worker |
| **Admin 1** | `admin@artistryhub.com` | `Admin2024!Secure#` | All apps |
| **Admin 2** | `admin2@artistryhub.com` | `Admin2024!Secure#` | All apps |

> ⚠️ **IMPORTANT**: These are test accounts only. Do not modify or use in production.

## Access Control

- **Social Worker Role Required**: Only users with `social_worker` or `admin` role can access this application
- **Middleware Protection**: Automatic redirect for non-social-worker users
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
- **Role-Based Access**: Strict social-worker/admin middleware enforcement
- **Session Management**: Secure JWT token handling

## Troubleshooting

### Common Issues

1. **Access Denied**
   - Ensure you're logged in with a social worker or admin account
   - Use correct password: `Social2024!Help#`
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

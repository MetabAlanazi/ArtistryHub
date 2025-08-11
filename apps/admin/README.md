# Admin App

Administrative dashboard for system management and user administration.

## Purpose & Scope

The admin app provides comprehensive system administration capabilities:

- User management and role assignment
- System configuration and monitoring
- Platform-wide analytics and reporting
- Content moderation and approval workflows
- System health and performance monitoring

## Unique Features

- **User Management**: Create, edit, and manage user accounts
- **Role Administration**: Assign and modify user roles and permissions
- **System Monitoring**: Real-time platform health and performance metrics
- **Content Moderation**: Approve or reject user-generated content
- **Analytics Dashboard**: Comprehensive platform usage statistics

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

Create a `.env.local` file in the `apps/admin` directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/artistry_hub"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3001"

# App-specific
NEXT_PUBLIC_APP_NAME="ArtistryHub Admin"
```

## Authentication Flow

This app uses the shared `@artistry-hub/auth` package:

- **Route**: `app/api/auth/[...nextauth]/route.ts` imports from `@artistry-hub/auth`
- **Middleware**: `src/middleware.ts` enforces admin-only access
- **Session**: Uses NextAuth.js with JWT strategy

## Test User Accounts

For development and testing, use these pre-configured admin accounts:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Admin 1** | `admin@artistryhub.com` | `Admin2024!Secure#` | All apps |
| **Admin 2** | `admin2@artistryhub.com` | `Admin2024!Secure#` | All apps |

> ⚠️ **IMPORTANT**: These are test accounts only. Do not modify or use in production.

## Access Control

- **Admin Role Required**: Only users with `admin` role can access this application
- **Middleware Protection**: Automatic redirect for non-admin users
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
- **Role-Based Access**: Strict admin-only middleware enforcement
- **Session Management**: Secure JWT token handling

## Troubleshooting

### Common Issues

1. **Access Denied**
   - Ensure you're logged in with an admin account
   - Use correct password: `Admin2024!Secure#`
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

# ArtistryHub Database Package

This package contains the database configuration, schema, and seeding for the ArtistryHub monorepo.

## Prerequisites

- MySQL database running (via Docker Compose)
- Node.js and pnpm installed
- Prisma CLI installed globally or as a dev dependency

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Generate Prisma client:**
   ```bash
   pnpm db:generate
   ```

3. **Push schema to database:**
   ```bash
   pnpm db:push
   ```

## Seeding the Database

### Full Seed (Comprehensive Data)
Creates a complete dataset with users, addresses, audit logs, and service tokens:

```bash
pnpm seed
```

### RBAC Seed (Minimal Test Data)
Creates minimal test data focused on testing the Role-Based Access Control system:

```bash
pnpm seed:rbac
```

## Test Users Created by RBAC Seed

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| 👑 Admin | `admin@test.com` | `admin123` | Test admin functionality |
| 🎨 Artist | `artist@test.com` | `artist123` | Test artist app access |
| ⚙️ Operator | `operator@test.com` | `operator123` | Test operator app access |
| 🤝 Social Worker | `social@test.com` | `social123` | Test social worker app access |
| 🛒 Customer | `customer@test.com` | `customer123` | Test store app access |
| 🔧 Service | `service@test.com` | `service123` | Test internal service operations |

## Database Commands

- **Generate Prisma client:** `pnpm db:generate`
- **Push schema changes:** `pnpm db:push`
- **Run migrations:** `pnpm db:migrate`
- **Open Prisma Studio:** `pnpm db:studio`
- **Reset database:** `pnpm db:reset` (⚠️ Destructive - clears all data)

## Testing the RBAC System

After seeding, test the system with these URLs:

1. **Store App** (http://localhost:3000) - Register new users, login as customers
2. **Admin App** (http://localhost:3001) - Login as admin to manage users
3. **Artist App** (http://localhost:3002) - Login as artist
4. **Operator App** (http://localhost:3003) - Login as operator
5. **Social Worker App** (http://localhost:3004) - Login as social worker

## Schema Overview

The database includes:
- **Users** with role-based access control
- **Addresses** for user location data
- **Audit Logs** for tracking user actions
- **Service Tokens** for API authentication
- **Sessions** and **Accounts** for NextAuth integration

## Environment Variables

Ensure these are set in your `.env` file:
```env
DATABASE_URL="mysql://root:password@localhost:3307/artistryhub"
JWT_SECRET="your-jwt-secret-here"
```

## Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Ensure MySQL is running via Docker Compose
   - Check DATABASE_URL in .env file

2. **Prisma client not generated:**
   - Run `pnpm db:generate` after schema changes

3. **Seed fails with auth errors:**
   - Ensure @artistryhub/auth package is built
   - Check that hashPassword function is available

### Reset Everything

If you need to start fresh:
```bash
pnpm db:reset
pnpm seed:rbac
```

This will clear all data and recreate the test users.

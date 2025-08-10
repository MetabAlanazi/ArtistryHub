# @artistry-hub/db

Centralized database management with Prisma ORM for the ArtistryHub platform.

## What it exports

This package provides a unified database solution for all apps in the monorepo:

- **Prisma Client**: Singleton PrismaClient instance
- **Database Schema**: Single source of truth for all database models
- **Type Definitions**: Generated TypeScript types from Prisma schema
- **Migration Management**: Centralized database migrations
- **Seed Scripts**: Database seeding utilities

## How to consume

### 1. Import Prisma Client

```typescript
import { prisma } from "@artistry-hub/db";

// Use the singleton client
const users = await prisma.user.findMany();
```

### 2. Import Types

```typescript
import type { User, UserRole } from "@artistry-hub/db";

// Use generated types
const user: User = {
  id: "1",
  email: "user@example.com",
  role: "customer" as UserRole,
  // ... other fields
};
```

### 3. Database Operations

```typescript
import { prisma } from "@artistry-hub/db";

// CRUD operations
const user = await prisma.user.create({
  data: {
    email: "new@example.com",
    hashedPassword: "hashed_password",
    role: "customer",
  },
});
```

## Database Schema

The package maintains a single Prisma schema at `packages/db/prisma/schema.prisma` with:

- **User Model**: Centralized user management with role-based access
- **Relationships**: Proper foreign key relationships between models
- **Indexes**: Optimized database performance
- **Migrations**: Version-controlled database schema changes

## Environment Variables

Required environment variables:

```env
DATABASE_URL="mysql://user:password@localhost:3306/artistry_hub"
```

## Database Scripts

Available scripts from the root package.json:

```bash
# Generate Prisma client
yarn db:generate

# Run migrations
yarn db:migrate

# Open Prisma Studio
yarn db:studio

# Seed database
yarn db:seed
```

## Singleton Pattern

The package implements a singleton pattern for PrismaClient to prevent multiple database connections:

```typescript
// packages/db/src/client.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

## Versioning & Internal Dependency Rules

- **Version**: Follows semantic versioning
- **Breaking Changes**: Major version bumps for schema changes
- **Internal Dependencies**: All apps must use the same version
- **Updates**: Database migrations must be run when updating

## Development

```bash
# From root directory
yarn workspace @artistry-hub/db dev
yarn workspace @artistry-hub/db build
yarn workspace @artistry-hub/db test
```

## Database Management

### Migrations

```bash
# Create new migration
npx prisma migrate dev --schema packages/db/prisma/schema.prisma

# Apply migrations in production
npx prisma migrate deploy --schema packages/db/prisma/schema.prisma
```

### Seeding

```bash
# Run seed script
yarn db:seed

# Custom seed data
npx tsx packages/db/prisma/seed.ts
```

## Testing

The package includes tests for:

- Prisma client initialization
- Database connection management
- Type generation accuracy
- Migration scripts

## Security Features

- **Connection Pooling**: Efficient database connection management
- **Environment Isolation**: Separate databases for dev/staging/prod
- **Migration Safety**: Safe database schema updates
- **Type Safety**: Full TypeScript support for all database operations

## Troubleshooting

1. **Connection Issues**: Verify DATABASE_URL and database accessibility
2. **Type Errors**: Run `yarn db:generate` to regenerate Prisma client
3. **Migration Failures**: Check database permissions and existing schema
4. **Build Issues**: Ensure Prisma client is generated before building apps

## Performance Considerations

- **Connection Pooling**: Configured for optimal performance
- **Query Optimization**: Use Prisma's query optimization features
- **Indexing**: Proper database indexes for common queries
- **Caching**: Implement application-level caching where appropriate

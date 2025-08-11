# Database Package

Database client, schema, and seeding utilities for ArtistryHub.

## Purpose & Scope

This package provides centralized database management for the entire ArtistryHub platform:

- **Prisma Schema**: Single source of truth for database structure
- **Database Client**: Singleton Prisma client for all applications
- **Seeding Scripts**: Comprehensive test data generation
- **Migrations**: Database schema evolution management

## Features

- **Unified Schema**: Single Prisma schema shared across all apps
- **Secure Seeding**: Test users with strong, hashed passwords
- **Role-Based Access**: Comprehensive user role management
- **Audit Logging**: Track all user actions and system events
- **Migration Management**: Safe database schema evolution

## Installation

```bash
# From project root
yarn install

# Generate Prisma client
yarn db:generate
```

## Database Schema

The schema includes comprehensive models for:

- **Users**: Authentication, roles, and profiles
- **Products**: Artwork, commissions, and inventory
- **Orders**: Customer purchases and fulfillment
- **Artists**: Portfolios, commissions, and profiles
- **Support**: Tickets, communications, and assistance

### User Roles

- `ADMIN` - Full platform access
- `ARTIST` - Creative platform access
- `OPERATOR` - Order fulfillment access
- `SOCIAL_WORKER` - Community support access
- `CUSTOMER` - Store access only
- `SERVICE` - Support and assistance access

## Seeding Scripts

### Main Seeding (`yarn db:seed`)

Creates complete test environment with 12 users:

| Role | Count | Password Pattern |
|------|-------|------------------|
| **Admin** | 2 | `Admin2024!Secure#` |
| **Artist** | 2 | `Artist2024!Creative#` |
| **Operator** | 2 | `Operator2024!Work#` |
| **Social Worker** | 2 | `Social2024!Help#` |
| **Customer** | 2 | `Customer2024!Shop#` |
| **Service** | 2 | `Service2024!Support#` |

### README Users (`yarn db:seed:readme`)

Creates only the users documented in the README:

- **Email**: `admin@artistryhub.com` / **Password**: `Admin2024!Secure#`
- **Email**: `artist1@artistryhub.com` / **Password**: `Artist2024!Creative#`
- **Email**: `operator1@artistryhub.com` / **Password**: `Operator2024!Work#`
- **Email**: `social1@artistryhub.com` / **Password**: `Social2024!Help#`
- **Email**: `customer1@example.com` / **Password**: `Customer2024!Shop#`

### Authentication Testing (`yarn seed:auth`)

Creates users specifically for auth testing:

- Focuses on authentication flows
- Includes service tokens for API access
- Creates artist profiles and related data

### RBAC Testing (`yarn seed:rbac`)

Creates users for role-based access control testing:

- Tests all user roles and permissions
- Includes comprehensive test data
- Perfect for authorization testing

## Security Features

### Password Security

- **Strong Passwords**: All test users use secure passwords
- **bcrypt Hashing**: 12 salt rounds for maximum security
- **No Weak Passwords**: Eliminated common weak patterns
- **Unique Patterns**: Each role has distinct password format

### Test User Management

- **Automatic Deletion**: Customer users deleted and recreated on every run
- **Fresh Data**: Ensures consistent test environment
- **No Conflicts**: Prevents old data from interfering with tests

## Usage

### Development Setup

```bash
# Generate Prisma client
yarn db:generate

# Run migrations
yarn db:migrate

# Seed database
yarn db:seed

# Open Prisma Studio
yarn db:studio
```

### Testing

```bash
# Quick user refresh
yarn db:seed:readme

# Full database reset
yarn db:reset

# Specific seeding
yarn seed:auth
yarn seed:rbac
```

### Production

```bash
# Generate production client
yarn db:generate

# Run production migrations
yarn db:migrate:deploy

# Build package
yarn build
```

## Environment Variables

Required environment variables:

```env
# Database connection
DATABASE_URL="mysql://user:password@localhost:3306/artistry_hub"

# Optional: Database shadow (for migrations)
SHADOW_DATABASE_URL="mysql://user:password@localhost:3306/artistry_hub_shadow"
```

## Dependencies

- **@prisma/client**: Database ORM
- **bcryptjs**: Password hashing
- **@artistry-hub/auth**: Authentication utilities

## Troubleshooting

### Common Issues

1. **Prisma Client Not Generated**
   ```bash
   yarn db:generate
   ```

2. **Migration Errors**
   ```bash
   yarn db:reset
   yarn db:migrate
   ```

3. **Seeding Failures**
   ```bash
   yarn db:seed:readme
   ```

### Reset & Recovery

```bash
# Complete database reset
yarn db:reset

# Regenerate client
yarn db:generate

# Fresh seeding
yarn db:seed
```

## Contributing

When modifying the database schema:

1. **Create Migration**: `yarn db:migrate`
2. **Update Seeding**: Modify relevant seed scripts
3. **Test Changes**: Verify with `yarn db:seed:readme`
4. **Update Documentation**: Reflect changes in README files

## Security Notes

⚠️ **IMPORTANT**: All credentials in this package are for testing only.

- **Never use test passwords in production**
- **Do not modify test user credentials**
- **All seeding scripts include security warnings**
- **Customer users are recreated on every run**

---

> **🔒 Security Reminder**: All test credentials are for development and testing only. Never use these accounts in production environments.

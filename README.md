# ArtistryHub - Multi-Package Next.js Monorepo

> 🎨 **A comprehensive platform for artists, social workers, and art commerce**

## 🚀 **Quick Start**

```bash
# Clone and setup
git clone <your-repo-url>
cd ArtistryHub
yarn install

# Environment setup
cp env.example .env.local
# Edit .env.local with your configuration

# Database setup
yarn db:generate
yarn db:pull

# Start development
yarn dev
```

## 🔑 **CREDENTIALS & ACCESS** (DO NOT CHANGE)

> ✅ **READY TO TEST**: The users below are currently working in your database.

### **Current Test Users** (Active in Database - 5 Users)

> ⚠️ **IMPORTANT**: These credentials are for testing only. Do not modify or update them.

| Role           | Email                      | Password               | Access                        |
| -------------- | -------------------------- | ---------------------- | ----------------------------- |
| **Admin 1**    | `admin@artistryhub.com`    | `Admin2024!Secure#`    | All apps (3000-3004)          |
| **Operator 1** | `ops@artistryhub.com`      | `Operator2024!Secure#` | Store + Operator (3000, 3003) |
| **Artist 1**   | `artist@artistryhub.com`   | `Artist2024!Secure#`   | Store + Artist (3000, 3002)   |
| **Customer 1** | `customer@artistryhub.com` | `Customer2024!Secure#` | Store only (3000)             |
| **Operator 2** | `operator@artistryhub.com` | `Operator2024!Secure#` | Store + Operator (3000, 3003) |

> ✅ **VERIFIED**: These are the actual users currently in your database. All passwords use strong, unique combinations with uppercase, lowercase, numbers, and special characters.
> 🔒 **SECURE**: All passwords are securely hashed and ready for testing.
> 📊 **NOTE**: Database currently contains 5 users (down from 12 in the original seed file).

### **Getting More Users** (Optional)

> 🚀 **To get additional users, run**: `yarn db:seed` (requires proper DATABASE_URL setup)

This will create additional test users with different email patterns for comprehensive testing.

> ⚠️ **CURRENT STATE**: Your database has 5 users instead of the expected 12. This suggests the database was seeded with a different script (`reset-admin.ts`) rather than the main `seed.ts` script.

### **App URLs & Navigation**

- **Main Store**: `http://localhost:3000/store` (redirects from `http://localhost:3000`)
- **Admin Panel**: `http://localhost:3001` (Admin role only)
- **Artist Dashboard**: `http://localhost:3002` (Artist role only)
- **Operator Panel**: `http://localhost:3003` (Operator role only)
- **Social Worker Portal**: `http://localhost:3004` (Social Worker role only)

### **Smart Login Redirection**

> 🎯 **Role-Based Auto-Redirect**: After login, users are automatically redirected to their appropriate app based on their role.

| Role              | Login Redirect              | Purpose                      |
| ----------------- | --------------------------- | ---------------------------- |
| **Admin**         | Admin Portal (3001)         | System administration        |
| **Artist**        | Artist Portal (3002)        | Art creation & portfolio     |
| **Operator**      | Operator Portal (3003)      | Order fulfillment            |
| **Social Worker** | Social Worker Portal (3004) | Community support & outreach |
| **Service**       | Main Store (3000)           | Customer support & service   |
| **Customer**      | Main Store (3000)           | Shopping & orders            |

### **Logout Behavior**

> All apps redirect to the main store (`http://localhost:3000/store`) when users log out.

## 🗄️ **Database Policy**

> **Single Database Rule**: We use exactly one database name (`art_commerce`) across all environments.

### **Environment Configuration**

- **Development**: `.env.development` → `mysql://root:root@localhost:3307/art_commerce`
- **Production**: `.env.production` → `mysql://<user>:<pass>@<host>:3306/art_commerce`

### **Prisma Configuration**

- **Mode**: Introspection only (no migrations)
- **Commands**: `yarn db:pull` + `yarn db:generate`
- **Schema**: Maps to existing MySQL tables (`common_user`, `common_account`, etc.)
- **NextAuth**: Uses Prisma models mapped to existing tables

### **Admin User Reset**

```bash
# Reset admin credentials (development)
cd packages/db
npx ts-node scripts/reset-admin.ts

# Credentials: admin@artistryhub.com / Admin2024!Secure#
```

## 🛠️ **Development**

```bash
# Run all apps in development mode
yarn dev

# Run a specific app
yarn workspace @artistry-hub/store dev
yarn workspace @artistry-hub/admin dev
yarn workspace @artistry-hub/artist dev
yarn workspace @artistry-hub/operator dev

# Database operations
yarn db:pull          # Introspect database and update schema
yarn db:generate      # Generate Prisma client
yarn db:studio        # Open Prisma Studio

# Run all tests
yarn test

# Type checking
yarn typecheck

# Linting
yarn lint
```

### **Getting More Users** (Optional)

To get additional test users:

1. **Create .env file** in root directory with database connection
2. **Run seeding**: `yarn db:seed`
3. **Verify users**: Check database or use `yarn db:studio`

**Current state**: 12 users (2 Admin, 2 Artist, 2 Operator, 2 Social Worker, 2 Customer, 2 Service)  
**Additional users**: Available via `yarn db:seed` for comprehensive testing

## 🔐 **Authentication Architecture**

- **Shared Auth Package**: `@artistry-hub/auth` provides base NextAuth configuration
- **Per-App Routes**: Each app defines its own `/api/auth/[...nextauth]/route.ts`
- **Role-Based Access**: Middleware enforces app-specific role requirements
- **Independent Branding**: Each app maintains unique navbar/branding
- **Unified Navigation**: All apps have "Main Store" links and redirect to store on logout

### **Role Hierarchy**

- `ADMIN` - Access to all apps
- `ARTIST` - Access to artist + store apps
- `OPERATOR` - Access to operator + store apps
- `SOCIAL_WORKER` - Access to social worker + store apps
- `SERVICE` - Access to store + service features
- `CUSTOMER` - Access to store app only

## 🗄️ **Database & Migrations**

Single Prisma schema at `packages/db/prisma/schema.prisma`:

```bash
# Generate Prisma client
yarn db:generate

# Run migrations
yarn db:migrate

# Open Prisma Studio
yarn db:studio
```

### **Database Seeding**

The database comes pre-seeded with **12 test users** (2 of each role type) for comprehensive testing:

- **👑 2 Admin users** - Full platform access
- **🎨 2 Artist users** - Store + Artist dashboard access
- **⚙️ 2 Operator users** - Store + Operator panel access
- **🤝 2 Social Worker users** - Store + Social worker portal access
- **👤 2 Customer users** - Store-only access
- **🔧 2 Service users** - Store + Service access

> **Note**: All users are created with secure passwords and proper bcrypt hashing.

> **⚠️ IMPORTANT**: Do not modify or delete these test user accounts as they are permanently saved in the database and used by the system for role-based access control and testing purposes.

#### **Database Setup Requirements**

Before running the seed script, ensure your database is running:

#### **Database Persistence & User Accounts**

> **🔒 CRITICAL**: The test user accounts created by the seed script are **permanently stored** in the database and should **NEVER** be modified or deleted.

**Why Preserve Test Users**:

- **System Integration**: These accounts are integrated with the authentication system
- **Role-Based Access**: Each user has specific permissions and access levels
- **Testing Consistency**: Provides reliable test accounts for development and QA
- **Database Integrity**: Modifying these accounts can break system functionality
- **Production Safety**: Prevents accidental deletion of essential system accounts

**What NOT to Do**:

- ❌ Delete test user accounts
- ❌ Modify user roles or permissions
- ❌ Change user passwords or email addresses
- ❌ Use test accounts in production environments

**What TO Do**:

- ✅ Use these accounts for development and testing
- ✅ Test authentication flows and role-based access
- ✅ Verify app functionality across different user roles
- ✅ Use as reference for creating production user accounts

## 🧪 **Testing**

### **Unit Tests (Vitest)**

```bash
# Run tests for specific app
yarn workspace @artistry-hub/store test
yarn workspace @artistry-hub/admin test
yarn workspace @artistry-hub/artist test
yarn workspace @artistry-hub/operator test
yarn workspace @artistry-hub/social-worker test
```

### **E2E Tests (Playwright)**

```bash
# Run E2E tests
yarn test:e2e
```

## 🔒 **Security Features**

### **Password Security**

- **Strong Passwords**: All test users use secure passwords with uppercase, lowercase, numbers, and special characters
- **bcrypt Hashing**: 12 salt rounds for secure password storage
- **No Weak Passwords**: Eliminated common weak passwords that trigger security warnings

### **Authentication Security**

- **JWT Tokens**: Secure session management with NextAuth.js
- **Role-Based Access**: Strict middleware enforcement of app access
- **Session Validation**: Automatic re-authentication for sensitive operations

### **Development Security**

- **Test-Only Credentials**: Clear warnings about testing vs production usage
- **Secure Seeding**: All seeding scripts include security documentation
- **Audit Logging**: Comprehensive logging of user actions and system events

## 📁 **Project Structure**

```
ArtistryHub/
├── apps/                    # Next.js applications
│   ├── store/              # Customer-facing e-commerce (3000)
│   ├── admin/              # Admin panel (3001)
│   ├── artist/             # Artist dashboard (3002)
│   ├── operator/           # Operator panel (3003)
│   ├── social-worker/      # Social worker portal (3004)
│   └── bff/                # Backend for frontend API
├── packages/                # Shared packages
│   ├── auth/               # Authentication & authorization
│   ├── db/                 # Database & Prisma schema
│   ├── ui/                 # Shared UI components
│   ├── config/             # Shared configuration
│   ├── utils/              # Utility functions
│   └── client-bff/         # BFF client utilities
├── scripts/                 # Database seeding scripts
└── docs/                    # Documentation
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Customer Account Not Working**
   - Ensure you're using the correct password: `Customer2024!Shop#`
   - Run `yarn db:seed:readme` to refresh test users
   - Check that the database is running and accessible

2. **Authentication Errors**
   - Verify NEXTAUTH_SECRET is set in .env.local
   - Check database connection and Prisma client generation
   - Ensure all apps are using the same auth configuration

3. **Database Connection Issues**
   - Verify DATABASE_URL in .env.local
   - Run `yarn db:generate` to regenerate Prisma client
   - Check that MySQL/PostgreSQL is running

### **Reset & Recovery**

```bash
# Complete database reset
yarn db:reset

# Regenerate Prisma client
yarn db:generate

# Fresh seeding
yarn db:seed
```

## 📚 **Additional Resources**

- [Authentication Guide](README-auth.md) - Detailed auth setup and configuration
- [Migration Guide](migration.md) - Security refactor and migration details
- [API Documentation](packages/api/README.md) - Event-driven API architecture
- [UI Components](packages/ui/README.md) - Shared component library

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

> **⚠️ SECURITY REMINDER**: All credentials in this README are for testing only. Never use these accounts in production environments.

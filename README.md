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
yarn db:migrate
yarn db:seed

# Start development
yarn dev
```

## 🔑 **CREDENTIALS & ACCESS** (DO NOT CHANGE)

> ✅ **READY TO TEST**: The users below are currently working in your database.

### **Current Test Users** (Active in Database - 4 Users)

> ⚠️ **IMPORTANT**: These credentials are for testing only. Do not modify or update them.

| Role         | Email                      | Password               | Access                        |
| ------------ | -------------------------- | ---------------------- | ----------------------------- |
| **Admin**    | `admin@artistryhub.com`    | `Admin2024!Secure#`    | All apps (3000-3004)          |
| **Operator** | `ops@artistryhub.com`      | `Operator2024!Work#`   | Store + Operator (3000, 3003) |
| **Artist**   | `artist@artistryhub.com`   | `Artist2024!Creative#` | Store + Artist (3000, 3002)   |
| **Customer** | `customer@artistryhub.com` | `Customer2024!Shop#`   | Store only (3000)             |

> ✅ **VERIFIED**: These are the actual users currently in the database. All passwords use strong, unique combinations with uppercase, lowercase, numbers, and special characters.
> 🔒 **SECURE**: All passwords are securely hashed and ready for testing.

### **Getting More Users** (Optional)

> 🚀 **To get additional users, run**: `yarn db:seed` (requires .env file)

This will create additional test users with different email patterns for comprehensive testing.

### **App URLs & Navigation**

- **Main Store**: `http://localhost:3000/store` (redirects from `http://localhost:3000`)
- **Admin Panel**: `http://localhost:3002` (Admin role only)
- **Artist Dashboard**: `http://localhost:3002` (Artist role only)
- **Operator Panel**: `http://localhost:3003` (Operator role only)
- **Social Worker Portal**: `http://localhost:3004` (Social Worker role only)

### **Smart Login Redirection**

> 🎯 **Role-Based Auto-Redirect**: After login, users are automatically redirected to their appropriate app based on their role.

| Role         | Login Redirect         | Purpose                  |
| ------------ | ---------------------- | ------------------------ |
| **Admin**    | Admin Portal (3002)    | System administration    |
| **Artist**   | Artist Portal (3002)   | Art creation & portfolio |
| **Operator** | Operator Portal (3003) | Order fulfillment        |
| **Customer** | Main Store (3000)      | Shopping & orders        |

### **Logout Behavior**

> All apps redirect to the main store (`http://localhost:3000/store`) when users log out.

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
yarn db:seed          # Seed full database with 12 users (requires .env)
yarn db:seed:readme   # Seed only README test users
yarn db:seed:auth     # Seed authentication users (current 4 users)
yarn db:reset         # Reset database and run migrations
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

**Current state**: 4 users (Admin, Operator, Artist, Customer)  
**Additional users**: Will be created with different email patterns

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

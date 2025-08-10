# ArtistryHub - Multi-Package Next.js Monorepo

A modern, scalable platform for artists and social workers built with Next.js, TypeScript, and Turborepo.

## 🎯 **CURRENT STATUS: FULLY FUNCTIONAL** ✅

**All apps are working and properly connected with automatic redirects to the main store.**

## ⚡ **QUICK START (5 minutes)**

```bash
# 1. Install dependencies
yarn install

# 2. Set up environment variables
cp env.example .env.local

# 3. Start the main store app
cd apps/store && yarn dev --port 3000

# 4. Open in browser
# Main page: http://localhost:3000 (auto-redirects to store)
# Store: http://localhost:3000/store
```

**🎉 That's it! The store will work immediately with the pre-configured test users above.**

## 🏗️ Architecture

This monorepo is organized into:

### Apps (`apps/`)

- **`store`** - Customer-facing e-commerce platform (port 3000) - **MAIN APP**
- **`admin`** - Administrative dashboard (port 3001)
- **`artist`** - Artist management interface (port 3002)
- **`operator`** - Service operator interface (port 3003)
- **`social-worker`** - Social worker tools (port 3004)

> **🚀 Smart Routing**: The main page (`localhost:3000`) automatically redirects to the store (`localhost:3000/store`)

### Packages (`packages/`)

- **`@artistry-hub/auth`** - Centralized NextAuth configuration
- **`@artistry-hub/db`** - Prisma database client and schema
- **`@artistry-hub/ui`** - Shared UI components (generic only)
- **`@artistry-hub/config`** - Shared configuration (ESLint, TypeScript, Tailwind)
- **`@artistry-hub/utils`** - Utility functions
- **`@artistry-hub/api`** - API utilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn 4 (Berry)
- Corepack enabled

### Installation

```bash
# Enable Corepack (if not already enabled)
corepack enable

# Install dependencies
yarn install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your configuration
```

## 🔑 **CREDENTIALS & ACCESS** (DO NOT CHANGE)

### **Default Test Users** (Pre-configured in database)

> ⚠️ **IMPORTANT**: These credentials are for testing only. Do not modify or update them.

| Role              | Email                      | Password      | Access                             |
| ----------------- | -------------------------- | ------------- | ---------------------------------- |
| **Admin**         | `admin@artistryhub.com`    | `admin123`    | All apps (3000-3004)               |
| **Artist**        | `artist@artistryhub.com`   | `artist123`   | Store + Artist (3000, 3002)        |
| **Operator**      | `operator@artistryhub.com` | `operator123` | Store + Operator (3000, 3003)      |
| **Social Worker** | `social@artistryhub.com`   | `social123`   | Store + Social Worker (3000, 3004) |
| **Customer**      | `customer@artistryhub.com` | `customer123` | Store only (3000)                  |

### **App URLs & Navigation**

- **Main Store**: `http://localhost:3000/store` (redirects from `http://localhost:3000`)
- **Admin Panel**: `http://localhost:3001` (Admin role only)
- **Artist Dashboard**: `http://localhost:3002` (Artist role only)
- **Operator Panel**: `http://localhost:3003` (Operator role only)
- **Social Worker Portal**: `http://localhost:3004` (Social Worker role only)

### **Logout Behavior**

> All apps redirect to the main store (`http://localhost:3000/store`) when users log out.

### Development

```bash
# Run all apps in development mode
yarn dev

# Run a specific app
yarn workspace @artistry-hub/store dev
yarn workspace @artistry-hub/admin dev
yarn workspace @artistry-hub/artist dev
yarn workspace @artistry-hub/operator dev

# Run all tests
yarn test

# Type checking
yarn typecheck

# Linting
yarn lint
```

## 🔐 Authentication Architecture

- **Shared Auth Package**: `@artistry-hub/auth` provides base NextAuth configuration
- **Per-App Routes**: Each app defines its own `/api/auth/[...nextauth]/route.ts`
- **Role-Based Access**: Middleware enforces app-specific role requirements
- **Independent Branding**: Each app maintains unique navbar/branding
- **Unified Navigation**: All apps have "Main Store" links and redirect to store on logout

### Role Hierarchy

- `ADMIN` - Access to all apps
- `ARTIST` - Access to artist + store apps
- `OPERATOR` - Access to operator + store apps
- `CUSTOMER` - Access to store app only

## 🗄️ Database & Migrations

Single Prisma schema at `packages/db/prisma/schema.prisma`:

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

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run all tests
yarn test

# Run tests with UI
yarn test:ui

# Run tests for specific app
yarn workspace @artistry-hub/store test
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers
yarn dlx playwright install --with-deps

# Run E2E tests
yarn workspace @artistry-hub/store test:e2e
```

## 📦 Package Management

- **Yarn 4 (Berry)** with `nodeLinker: node-modules`
- **Workspace dependencies** using `workspace:*` syntax
- **Turborepo** for build orchestration and caching

### Adding Dependencies

```bash
# Add to specific app/package
yarn workspace @artistry-hub/store add react-hook-form

# Add to root (dev dependencies)
yarn add -D turbo

# Add workspace dependency
yarn workspace @artistry-hub/store add @artistry-hub/ui
```

## 🔧 Configuration

### TypeScript

- Base config in `packages/config/src/tsconfig/base.json`
- Apps extend base config with app-specific paths

### ESLint

- Base config in `packages/config/src/eslint-config/`
- Apps extend base config

### Tailwind CSS

- Base config in `packages/config/src/tailwind/base.js`
- Apps extend with app-specific content paths

## 🚀 Deployment

Each app can be deployed independently:

```bash
# Build specific app
yarn workspace @artistry-hub/store build

# Start production server
yarn workspace @artistry-hub/store start
```

## 🔧 **Recent Updates & Fixes**

### **✅ Resolved Issues**

- **Home Page Redirect**: Fixed import errors and implemented automatic redirect from `/` to `/store`
- **Component Imports**: Corrected named vs default export mismatches
- **Tailwind Colors**: Added missing primary color variants (100, 800)
- **Navigation Links**: All apps now have consistent "Main Store" navigation
- **Logout Redirects**: Unified logout behavior across all apps

### **🚀 Current Features**

- **Smart Routing**: Main page automatically redirects to store
- **Role-Based Access**: Proper authentication and authorization
- **Unified Experience**: Consistent navigation across all apps
- **Store-First Design**: Store is the central hub for all users

## 📚 Development Workflow

1. **Feature Development**: Work in app-specific directories
2. **Shared Logic**: Extract to appropriate packages
3. **Testing**: Unit tests for packages, E2E for critical user flows
4. **Linting**: ESLint + Prettier enforced via CI
5. **Type Safety**: TypeScript strict mode across all packages

## 🚨 **IMPORTANT NOTES**

### **Environment Variables**

> Make sure to set up proper environment variables in each app's `.env` file:
>
> - `NEXTAUTH_SECRET` (required for authentication)
> - `DATABASE_URL` (for database connection)
> - `NEXTAUTH_URL` (app-specific URL)

### **Database Setup**

> Run database migrations and seed data before testing:
>
> ```bash
> yarn db:migrate
> yarn db:seed
> ```

### **Port Management**

> Each app runs on a specific port. Ensure ports are available:
>
> - Store: 3000 (main app)
> - Admin: 3001
> - Artist: 3002
> - Operator: 3003
> - Social Worker: 3004

## 🤝 Contributing

1. Create feature branch from `develop`
2. Make changes following the established patterns
3. Add/update tests as needed
4. Ensure all checks pass: `yarn lint && yarn typecheck && yarn test`
5. Submit PR with clear description

## 📄 License

[Add your license here]

## 🆘 Support

For questions or issues:

1. Check existing documentation
2. Review package READMEs
3. Open an issue with clear reproduction steps

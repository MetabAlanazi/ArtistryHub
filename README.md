# ArtistryHub - Art Commerce Platform

A production-ready monorepo for an art commerce platform selling paintings, posters, and art-themed decor/furniture, built with strict separation of concerns and MySQL as the database.

## 🏗️ Architecture

### Monorepo Structure

```
repo/
├── apps/
│   ├── store/          # Customer-facing store (port 3000)
│   ├── admin/          # Admin dashboard (port 3001)
│   ├── artist/         # Artist portal (port 3002)
│   ├── operator/       # Operations dashboard (port 3003)
│   └── social-worker/  # Background worker (no UI)
├── packages/
│   ├── db/            # Prisma schema + client
│   ├── auth/          # NextAuth config + RBAC
│   ├── api/           # REST/tRPC contracts
│   ├── utils/         # Shared utilities
│   └── config/        # Shared configurations
```

### Tech Stack

- **Monorepo**: pnpm + Turborepo
- **Language**: TypeScript (strict)
- **Web Apps**: Next.js 14 (App Router)
- **Database**: MySQL 8.0 (Dockerized)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS (per app)
- **State**: React Query + Zustand
- **Validation**: Zod
- **Payments**: Stripe
- **Queue/Cache**: Redis + BullMQ
- **Storage**: S3-compatible (MinIO)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### 1. Clone and Install

```bash
git clone <repository-url>
cd ArtistryHub
pnpm install
```

### 2. Start Infrastructure

```bash
# Start MySQL, Redis, and MinIO
pnpm docker:up
```

### 3. Setup Database

```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed database
pnpm seed
```

### 4. Start Development

```bash
# Start all apps
pnpm dev
```

### 5. Access Applications

- **Store**: http://localhost:3000
- **Admin**: http://localhost:3001
- **Artist Portal**: http://localhost:3002
- **Operator Dashboard**: http://localhost:3003
- **MinIO Console**: http://localhost:9001

## 🔐 Authentication

### Default Users

- **Admin**: admin@artistryhub.com / password123
- **Operator**: operator@artistryhub.com / password123
- **Artist 1**: artist1@artistryhub.com / password123
- **Artist 2**: artist2@artistryhub.com / password123
- **Customer 1**: customer1@example.com / password123

## 📊 Database Schema

### Table Prefixes

- `common_*` - Users, addresses, audit logs
- `catalog_*` - Products, variants, inventory
- `orders_*` - Carts, orders, payments
- `artists_*` - Artist profiles, submissions
- `ops_*` - Fulfillment, support tickets
- `social_*` - Social media integration

### Key Features

- **SKU Generation**: CAT-YYYY-#### format
- **Inventory Management**: Reservation system
- **Audit Logging**: All CRUD operations tracked
- **RBAC**: Role-based access control
- **Idempotency**: Payment & webhook safety

## 🛠️ Development

### Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all apps
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm typecheck

# Database operations
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:studio

# Docker operations
pnpm docker:up
pnpm docker:down
pnpm docker:logs
```

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="mysql://root:root@localhost:3306/art_commerce"

# Redis
REDIS_URL="redis://localhost:6379"

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (test keys)
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# S3/MinIO
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY_ID="minioadmin"
S3_SECRET_ACCESS_KEY="minioadmin"
S3_BUCKET="art-uploads"
```

## 🏛️ Architecture Principles

### Separation of Concerns

- **No shared UI components** between apps
- **Shared code limited to**: types, db client, auth logic, API contracts, utils
- **Each app has its own**: Tailwind config, components, layouts

### Business Logic

- **Inventory Reservation**: On payment intent → reserve qtyReserved
- **Price Rules Engine**: Stackable discounts with snapshots
- **Audit Logging**: Every status transition tracked
- **Idempotency**: Payment & webhook handlers safe
- **Currency**: SAR base with proper rounding

### Security & Compliance

- **PII Redaction**: In logs and exports
- **Rate Limiting**: On auth and checkout
- **RBAC**: Strict role-based permissions
- **Audit Trail**: Complete activity logging

## 📈 Features

### Store (Customer)

- Product browsing and search
- Shopping cart and checkout
- Order tracking
- Artist profiles
- "Hang on wall" preview

### Admin (Backoffice)

- Dashboard with analytics
- Product/variant management
- Order and payment processing
- Artist approval system
- Price rule management

### Artist Portal

- Profile management
- Product submissions
- Commission tracking
- Payout information

### Operator Dashboard

- Order fulfillment
- Inventory management
- Support ticket handling
- Shipping and returns

### Social Worker

- Background job processing
- Social media posting
- Event handling
- Retry mechanisms

## 🧪 Testing

### Acceptance Criteria

- ✅ Poster purchase decrements stock
- ✅ Stripe webhooks are idempotent
- ✅ Audit logs on all transitions
- ✅ Admin can publish/unpublish products
- ✅ Operator can fulfill orders
- ✅ Artist submissions require approval
- ✅ Social worker posts on events

## 🚀 Deployment

### Production Checklist

- [ ] Update environment variables
- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Configure S3/R2 storage
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipeline
- [ ] Set up SSL certificates
- [ ] Configure backup strategy

### Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec app pnpm prisma:migrate:deploy

# Seed production data
docker-compose exec app pnpm seed
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.



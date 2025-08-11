# Security Refactor Migration Plan

## Overview

This document outlines the systematic security refactor across all 5 Next.js apps in the ArtistryHub monorepo.

## Current State

- **Monorepo Manager**: Yarn + Turbo
- **Apps**: store, admin, artist, operator, social-worker
- **Shared Packages**: auth, db (Prisma/MySQL), api (zod DTOs), ui, utils, config

## Migration Phases

### Phase 1: Centralize Auth (packages/auth) ✅

- [x] Create unified auth exports
- [x] Enforce JWT session strategy
- [x] Remove per-app auth.ts files
- [x] Centralize cookies/secrets

### Phase 2: Lock Down Routing ✅

- [x] Replace custom middleware.ts with auth middleware
- [x] Server-side enforcement with withRole
- [x] No client-only auth checks

### Phase 3: BFF Layer & Remove Prisma From UIs ✅

- [x] Create apps/bff for Prisma access
- [x] Expose REST routes under /api/v1/\*
- [x] Replace UI Prisma calls with typed fetches
- [x] Internal auth between UI apps and BFF
- [x] **NEW**: Create packages/client-bff with typed helpers
- [x] **NEW**: Implement proper RBAC on all BFF endpoints
- [x] **NEW**: Add audit logging for all privileged operations

### Phase 4: RBAC Enforcement Utilities ✅

- [x] Implement withRole wrapper
- [x] Apply to all BFF routes
- [x] Server-side role enforcement

### Phase 5: Rate Limiting (Redis) ✅

- [x] Redis sliding-window limiter
- [x] Apply to sensitive endpoints
- [x] Remove in-memory limiters

### Phase 6: 2FA + Re-Auth ✅

- [x] TOTP setup/verify
- [x] Login challenge
- [x] Re-auth endpoint for sensitive actions

### Phase 7: Audit Logs + Contract/CI ✅

- [x] AuditLog writes for key events
- [x] Contract tests for DTO changes
- [x] CI failure on breaking changes

## Code Movement Summary

### From apps/\*/src/lib/auth.ts → packages/auth

- All NextAuth configurations
- Session utilities
- Role checking functions

### From apps/\*/middleware.ts → packages/auth/middlewares

- Admin middleware
- Artist middleware
- Operator middleware
- Store middleware

### From apps/\*/src/lib/db.ts → apps/bff

- All Prisma client usage
- Database queries
- Data mutations

### New: apps/bff

- REST API endpoints with proper RBAC
- Prisma operations
- Input validation with zod DTOs
- Audit logging for all operations

### New: packages/client-bff

- Typed BFF client utilities
- Zod schemas for all endpoints
- Error handling and response validation
- Query parameter builders

## BFF Endpoints & RBAC

### Public Endpoints (No Auth Required)

- `GET /api/v1/products` - Browse products
- `GET /api/v1/products/:id` - View product details

### Customer Endpoints (CUSTOMER, ADMIN)

- `GET /api/v1/wishlist` - View wishlist
- `POST /api/v1/wishlist` - Add to wishlist
- `DELETE /api/v1/wishlist` - Remove from wishlist
- `GET /api/v1/wishlist/check/:id` - Check if in wishlist
- `GET /api/v1/orders` - View orders
- `GET /api/v1/orders/:id` - View order details

### Admin Endpoints (ADMIN only)

- `GET /api/v1/admin/users` - List all users
- `PATCH /api/v1/admin/users/:id/role` - Change user role (requires recent re-auth)
- `GET /api/v1/admin/stats` - System statistics
- `GET /api/v1/admin/audit-logs` - View audit logs

### User Endpoints (Authenticated users)

- `GET /api/v1/users/profile` - View own profile
- `POST /api/v1/auth/reauth` - Re-authenticate
- `POST /api/v1/auth/logout` - Logout

## Environment Variables Required

### Per App

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
DATABASE_URL=mysql://root:root@localhost:3306/yourdb
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_BFF_URL=http://localhost:3001
```

### Global

```
NEXTAUTH_SECRET=
DATABASE_URL=
REDIS_URL=
BFF_PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005
```

## Testing Requirements

- Unit tests for auth utilities
- E2E tests for RBAC flows
- Rate limiting tests
- 2FA and re-auth tests
- Contract tests for API changes

## Breaking Changes

- Apps must use packages/auth instead of local auth
- All Prisma calls moved to BFF
- Middleware replaced with auth middleware
- Session handling centralized
- **NEW**: UI apps must use packages/client-bff for BFF communication

## Rollback Plan

- Keep original auth files as backup
- Feature flags for gradual rollout
- Database migrations are additive only

## Next Steps

1. **Remove Prisma from UI apps** - Replace with client-bff calls
2. **Test BFF endpoints** - Verify RBAC enforcement
3. **Update UI components** - Use typed BFF responses
4. **Add integration tests** - Ensure end-to-end functionality

# 🚀 Enterprise-Grade Session Management System

## Overview

This document describes the comprehensive Single Sign-On (SSO) session management system implemented for ArtistryHub, providing enterprise-grade security with role-based access control (RBAC) across all applications in the monorepo.

## 🎯 Key Features

### ✅ **Single Sign-On (SSO)**
- **Centralized Authentication**: Login once, access all apps
- **Shared Sessions**: Valid across all applications
- **Automatic Redirects**: Users are taken to their primary app

### ✅ **Enterprise Security**
- **JWT Tokens**: Short-lived access tokens (15 minutes)
- **Refresh Tokens**: Long-lived with automatic rotation (30 days)
- **Secure Cookies**: HTTP-only, SameSite, Secure flags
- **Token Revocation**: Immediate invalidation on logout

### ✅ **Role-Based Access Control (RBAC)**
- **Granular Permissions**: App-specific access control
- **Automatic Enforcement**: Middleware and API-level protection
- **Permission Versioning**: Automatic token invalidation on role changes

### ✅ **Audit & Compliance**
- **Security Event Logging**: All authentication events tracked
- **Access Denied Logging**: Failed attempts recorded
- **IP Address Tracking**: User location monitoring
- **User Agent Logging**: Device and browser tracking

## 🏗️ Architecture

### **Core Components**

```
┌─────────────────────────────────────────────────────────────┐
│                    Enterprise Session Manager               │
├─────────────────────────────────────────────────────────────┤
│  • JWT Token Management                                    │
│  • Refresh Token Handling                                  │
│  • Role-Based Access Control                               │
│  • App Redirection Logic                                   │
│  • Security Audit Logging                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Authentication API                       │
├─────────────────────────────────────────────────────────────┤
│  • Login/Logout Endpoints                                  │
│  • Token Refresh                                           │
│  • Session Validation                                      │
│  • Global Logout                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Enhanced Middleware                      │
├─────────────────────────────────────────────────────────────┤
│  • Route Protection                                        │
│  • Role Validation                                         │
│  • Automatic Redirects                                     │
│  • Access Logging                                          │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow**

1. **User Login** → JWT Access Token + Refresh Token
2. **API Requests** → Access Token Validation
3. **Token Expiry** → Automatic Refresh via Refresh Token
4. **Role Changes** → Permission Version Increment → Token Invalidation
5. **Logout** → Token Revocation + Cookie Clearing

## 🔐 Security Implementation

### **JWT Token Structure**

```typescript
interface JWTPayload {
  sub: string                    // User ID
  email: string                 // User email
  name: string                  // User name
  role: UserRole               // User role
  permissionsVersion: number    // Permission version
  iat: number                  // Issued at
  exp: number                  // Expiration time
  jti: string                  // JWT ID (unique)
}
```

### **Cookie Security**

```typescript
// Access Token Cookie
{
  httpOnly: true,              // No JavaScript access
  secure: true,                // HTTPS only in production
  sameSite: 'lax',            // CSRF protection
  maxAge: 15 * 60,            // 15 minutes
  path: '/'
}

// Refresh Token Cookie
{
  httpOnly: true,              // No JavaScript access
  secure: true,                // HTTPS only in production
  sameSite: 'lax',            // CSRF protection
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: '/'
}
```

### **Token Lifecycle**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Login     │───▶│ Access Token│───▶│   Expired   │
│             │    │ (15 min)    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Refresh Token│    │   Refresh   │    │   Logout    │
│ (30 days)   │    │   Token     │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Rotate    │    │ New Access  │    │   Revoke    │
│   Token     │    │   Token     │    │   All       │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🎭 Role-Based Access Control

### **User Roles & App Access**

| User Role | Store | Admin | Artist | Operator | Social Worker |
|-----------|-------|-------|--------|----------|---------------|
| **Customer** | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None |
| **Artist** | ✅ Browse | ❌ None | ✅ Full | ❌ None | ❌ None |
| **Operator** | ✅ Browse | ❌ None | ❌ None | ✅ Full | ❌ None |
| **Social Worker** | ✅ Browse | ❌ None | ❌ None | ❌ None | ✅ Full |
| **Admin** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

### **Primary App Assignment**

- **Customer** → Store (localhost:3000)
- **Artist** → Artist Dashboard (localhost:3002)
- **Operator** → Operator Panel (localhost:3003)
- **Social Worker** → Social Worker Portal (localhost:3004)
- **Admin** → Admin Portal (localhost:3001)

## 🚦 Middleware Implementation

### **Store App Middleware**

```typescript
export const createStoreMiddleware = () => new EnhancedMiddlewareFactory({
  appName: 'store',
  allowRoles: ['customer', 'artist', 'admin', 'operator', 'social_worker', 'service'],
  publicRoutes: ['/', '/store', '/products', '/categories', '/login', '/register'],
  requireAuth: false // Allow public browsing
}).createMiddleware()
```

### **Admin App Middleware**

```typescript
export const createAdminMiddleware = () => new EnhancedMiddlewareFactory({
  appName: 'admin',
  allowRoles: ['admin'],
  publicRoutes: ['/login'],
  requireAuth: true
}).createMiddleware()
```

### **Middleware Features**

- **Route Protection**: Automatic authentication checks
- **Role Validation**: Ensures users have required permissions
- **App Redirection**: Redirects users to their primary app
- **Audit Logging**: Records all access attempts
- **CSRF Protection**: SameSite cookie configuration

## 🔌 API Endpoints

### **Authentication Endpoints**

```typescript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securePassword123",
  "callbackUrl": "/dashboard"
}

// Token Refresh
POST /api/auth/refresh
// Uses refresh token from cookies

// Logout
POST /api/auth/logout
// Revokes refresh token and clears cookies

// Global Logout
POST /api/auth/logout/global
// Revokes all user tokens across all apps

// Session Validation
GET /api/auth/session
// Returns current user information
```

### **Response Examples**

```typescript
// Successful Login
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}

// Token Refresh
{
  "success": true,
  "accessToken": "new.jwt.token",
  "newRefreshToken": "optional.new.refresh.token"
}
```

## 📊 Database Schema

### **User Table**

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  hashedPassword VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  permissionsVersion INTEGER NOT NULL DEFAULT 0,
  lastLoginAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Refresh Token Table**

```sql
CREATE TABLE refresh_tokens (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  tokenHash VARCHAR(255) UNIQUE NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  isRevoked BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lastUsedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### **Security Audit Log Table**

```sql
CREATE TABLE security_audit_logs (
  id VARCHAR(255) PRIMARY KEY,
  event VARCHAR(100) NOT NULL,
  userId VARCHAR(255) NOT NULL,
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🛡️ Security Features

### **Token Security**

- **Minimal Claims**: Only essential user information in JWT
- **Short Lifespan**: Access tokens expire in 15 minutes
- **Automatic Rotation**: Refresh tokens rotate after 70% of lifetime
- **Immediate Revocation**: Tokens invalidated on logout

### **Cookie Security**

- **HTTP-Only**: Prevents XSS attacks
- **Secure Flag**: HTTPS only in production
- **SameSite**: CSRF protection
- **Path Restriction**: Limited to application scope

### **Permission Management**

- **Version Control**: Automatic token invalidation on role changes
- **Granular Access**: App-specific permissions
- **Audit Trail**: Complete access history
- **Real-time Updates**: Immediate permission changes

## 📝 Usage Examples

### **Implementing in App Middleware**

```typescript
// apps/store/src/middleware.ts
import { createStoreMiddleware } from '@artistry-hub/auth'

export default createStoreMiddleware()

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)']
}
```

### **API Route Protection**

```typescript
// apps/admin/src/app/api/users/route.ts
import { requireRole } from '@artistry-hub/auth'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Check if user has admin role
  const authCheck = await requireRole(['admin'])(request)
  if (authCheck) return authCheck

  // Continue with protected logic
  return NextResponse.json({ users: [] })
}
```

### **Client-Side Session Management**

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Validate session on mount
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
```

## 🔧 Configuration

### **Environment Variables**

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# App URLs
STORE_APP_URL=http://localhost:3000
ADMIN_APP_URL=http://localhost:3001
ARTIST_APP_URL=http://localhost:3002
OPERATOR_APP_URL=http://localhost:3003
SOCIAL_WORKER_APP_URL=http://localhost:3004

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/artistryhub

# Security
NODE_ENV=development
```

### **Token Configuration**

```typescript
// Access Token: 15 minutes
ACCESS_TOKEN_TTL = 15 * 60 * 1000

// Refresh Token: 30 days
REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000

// Token Rotation: After 70% of lifetime
ROTATION_THRESHOLD = 0.7
```

## 🚀 Deployment

### **Production Checklist**

- [ ] **JWT Secret**: Use strong, unique secret
- [ ] **HTTPS**: Enable secure cookies
- [ ] **Database**: Use production-grade database
- [ ] **Monitoring**: Enable security audit logging
- [ ] **Rate Limiting**: Implement API rate limiting
- [ ] **Backup**: Regular database backups

### **Security Hardening**

- [ ] **CORS**: Configure cross-origin policies
- [ ] **Headers**: Security headers (HSTS, CSP, etc.)
- [ ] **Logging**: Centralized security logging
- [ ] **Monitoring**: Real-time security alerts
- [ ] **Updates**: Regular dependency updates

## 📚 API Reference

### **SessionManager Class**

```typescript
class SessionManager {
  // Token Management
  static createAccessToken(user: SessionUser): Promise<string>
  static createRefreshToken(userId: string): Promise<string>
  static verifyAccessToken(token: string): Promise<JWTPayload | null>
  static validateRefreshToken(token: string): Promise<SessionUser | null>
  static refreshAccessToken(refreshToken: string): Promise<RefreshResult | null>
  
  // Access Control
  static hasAppAccess(userRole: UserRole, appName: string): boolean
  static getPrimaryAppUrl(userRole: UserRole): string
  static shouldRedirect(userRole: UserRole, currentApp: string): RedirectResult
  
  // Security
  static revokeRefreshToken(token: string): Promise<void>
  static revokeAllUserTokens(userId: string): Promise<void>
  static invalidateUserTokens(userId: string): Promise<void>
  static logSecurityEvent(event: string, userId: string, details: object): Promise<void>
  
  // Cookie Management
  static setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string): NextResponse
  static clearAuthCookies(response: NextResponse): NextResponse
  static getUserFromRequest(request: NextRequest): Promise<SessionUser | null>
}
```

### **Enhanced Middleware Factory**

```typescript
class EnhancedMiddlewareFactory {
  constructor(config: MiddlewareConfig)
  createMiddleware(): MiddlewareFunction
}

interface MiddlewareConfig {
  appName: string
  allowRoles?: UserRole[]
  publicRoutes?: string[]
  loginRoute?: string
  requireAuth?: boolean
  enableSSO?: boolean
  enableAudit?: boolean
}
```

## 🧪 Testing

### **Test Scenarios**

1. **Authentication Flow**
   - Login with valid credentials
   - Token creation and validation
   - Refresh token rotation
   - Logout and token revocation

2. **Access Control**
   - Role-based app access
   - Permission enforcement
   - Automatic redirects
   - Access denied scenarios

3. **Security Features**
   - Token expiration handling
   - Permission version changes
   - Global logout functionality
   - Audit logging verification

### **Test Commands**

```bash
# Run all tests
yarn test

# Run specific test suites
yarn test:auth
yarn test:middleware
yarn test:session

# Run with coverage
yarn test:coverage
```

## 🔍 Monitoring & Debugging

### **Log Analysis**

```bash
# View security audit logs
SELECT * FROM security_audit_logs 
WHERE event = 'access_denied' 
ORDER BY timestamp DESC;

# Check user sessions
SELECT u.email, u.role, rt.createdAt, rt.lastUsedAt
FROM users u
JOIN refresh_tokens rt ON u.id = rt.userId
WHERE rt.isRevoked = FALSE;
```

### **Debug Information**

```typescript
// Enable debug logging
console.log('🔐 Session Debug:', {
  user: sessionUser,
  appAccess: SessionManager.hasAppAccess(user.role, 'admin'),
  primaryApp: SessionManager.getPrimaryAppUrl(user.role),
  shouldRedirect: SessionManager.shouldRedirect(user.role, 'store')
})
```

## 🚨 Troubleshooting

### **Common Issues**

1. **Token Expiration**
   - Check access token lifetime
   - Verify refresh token rotation
   - Monitor permission version changes

2. **Redirect Loops**
   - Verify app configuration
   - Check role assignments
   - Review middleware logic

3. **Permission Denied**
   - Validate user roles
   - Check app access configuration
   - Review audit logs

### **Debug Steps**

1. **Check Browser Cookies**
   - Verify access_token and refresh_token
   - Check cookie security flags
   - Validate expiration times

2. **Review Server Logs**
   - Authentication attempts
   - Access denied events
   - Redirect operations

3. **Database Verification**
   - User role assignments
   - Token validity
   - Permission versions

## 🔮 Future Enhancements

### **Planned Features**

- **Multi-Factor Authentication (MFA)**
- **OAuth2/OIDC Integration**
- **Advanced Permission System**
- **Real-time Session Monitoring**
- **Automated Security Alerts**

### **Scalability Improvements**

- **Redis Session Storage**
- **Distributed Token Validation**
- **Load Balancer Integration**
- **Microservice Architecture**

## 📄 License

This session management system is part of the ArtistryHub project and follows enterprise security best practices. For questions or contributions, please refer to the main project documentation.

---

**⚠️ Security Notice**: This system implements enterprise-grade security measures. Always follow security best practices in production deployments and regularly review and update security configurations.

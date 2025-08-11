# Project Guidelines

## 1. Project Understanding

- Always read and understand the project before making any modifications to ensure you know the potential impact of changes.

## 2. Change Confirmation

- After implementing any change, wait for confirmation that it works before cleaning up chat history or proceeding further.

## 3. GitHub Rules

- Do **NOT** push changes to GitHub unless explicitly requested.
- When pushing to GitHub:
  - Update `README.md` with any new features, changes, or instructions.
  - Remove any unused or dead code.

## 4. Rollback Option

- Ensure every change can be reverted.
- Document rollback steps if needed.

## 5. Code Quality

- Keep code clean, well-structured, and maintainable.
- Follow best practices for readability and performance.

## 6. Communication

- Clarify unclear requirements before starting.
- Provide a short plan of the changes before implementation.

## 7. Testing

- Test changes locally before delivery.
- Ensure no breaking changes are introduced.
- Mention possible side effects for major updates.

## 8. Version Control Discipline

- Commit changes in small, logical chunks with meaningful commit messages.
- Avoid overwriting or squashing commits without approval.

## 9. Session Management & Authentication Rules

### 9.1 Role-Based Access Control (RBAC)

- **NEVER** allow users to access apps they shouldn't have access to
- **ALWAYS** implement automatic redirects based on user roles
- **ENFORCE** app boundaries through middleware and session validation

### 9.2 Session Management Best Practices

- Use centralized `SessionManager` class for all session operations
- Implement automatic role-based app redirects for all users
- Validate user status and role before granting access
- Log all redirects and access attempts for security auditing

### 9.3 App Access Matrix

```
User Role    | Store | Admin | Artist | Operator | Social Worker
-------------|-------|-------|--------|----------|---------------
Admin        |  ✅   |  ✅   |   ✅   |    ✅    |      ✅
Artist       |  ✅   |  ❌   |   ✅   |    ❌    |      ❌
Operator     |  ✅   |  ❌   |   ❌   |    ✅    |      ❌
Customer     |  ✅   |  ❌   |   ❌   |    ❌    |      ❌
Social Worker|  ✅   |  ❌   |   ❌   |    ❌    |      ✅
```

### 9.4 Primary App Assignment

- **Admin** → Admin Portal (localhost:3001)
- **Artist** → Artist Dashboard (localhost:3002)
- **Operator** → Operator Panel (localhost:3003)
- **Social Worker** → Social Worker Portal (localhost:3004)
- **Customer** → Store (localhost:3000)

### 9.5 Middleware Requirements

- All apps must implement role-based access control
- Use `SessionManager.shouldRedirect()` for automatic redirects
- Log all access attempts and redirects
- Prevent unauthorized cross-app access

### 9.6 Security Enforcement

- **NEVER** hardcode app URLs in middleware
- **ALWAYS** use environment variables for app URLs
- **VALIDATE** user sessions before granting access
- **LOG** all security events for audit purposes

## 10. Additional Recommendations

- Document any added or changed functions with comments.
- Keep dependencies up to date only after testing.
- Maintain consistent formatting using Prettier/ESLint rules.

# @artistry-hub/utils

Shared utility functions and helpers for the ArtistryHub platform.

## What it exports

This package provides common utility functions that can be used across all apps and packages:

- **Currency**: Formatting and conversion utilities
- **Dates**: Date manipulation and formatting helpers
- **IDs**: ID generation and validation utilities
- **Logger**: Centralized logging system
- **Middleware Control**: Middleware management utilities
- **Validation**: Common validation functions

## How to consume

### 1. Import Specific Utilities

```typescript
import {
  formatCurrency,
  formatDate,
  generateId,
  logger,
} from "@artistry-hub/utils";

// Use utilities
const price = formatCurrency(29.99, "USD");
const date = formatDate(new Date(), "MMM dd, yyyy");
const id = generateId();
logger.info("User action completed", { userId: id });
```

### 2. Import All Utilities

```typescript
import * as utils from "@artistry-hub/utils";

// Use with namespace
const price = utils.formatCurrency(29.99, "USD");
const id = utils.generateId();
```

## Available Utilities

### Currency Utilities

```typescript
import { formatCurrency, convertCurrency } from "@artistry-hub/utils";

// Format currency for display
formatCurrency(29.99, "USD"); // "$29.99"
formatCurrency(29.99, "EUR"); // "€29.99"

// Convert between currencies
convertCurrency(100, "USD", "EUR", 0.85); // 85
```

### Date Utilities

```typescript
import { formatDate, addDays, isExpired } from "@artistry-hub/utils";

// Format dates
formatDate(new Date(), "MMM dd, yyyy"); // "Dec 25, 2024"
formatDate(new Date(), "yyyy-MM-dd"); // "2024-12-25"

// Date manipulation
const futureDate = addDays(new Date(), 7);
const expired = isExpired(someDate);
```

### ID Utilities

```typescript
import { generateId, validateId, generateSlug } from "@artistry-hub/utils";

// Generate unique IDs
const id = generateId(); // "abc123def456"
const slug = generateSlug("My Product Name"); // "my-product-name"

// Validate IDs
const isValid = validateId(id);
```

### Logger

```typescript
import { logger } from "@artistry-hub/utils";

// Different log levels
logger.info("User logged in", { userId: "123" });
logger.warn("Rate limit approaching", { endpoint: "/api/users" });
logger.error("Database connection failed", { error: err });
logger.debug("Processing request", { requestId: "req-123" });
```

### Middleware Control

```typescript
import { createMiddleware, withAuth } from "@artistry-hub/utils";

// Create custom middleware
const authMiddleware = createMiddleware(withAuth);

// Use in Next.js
export const config = {
  matcher: ["/protected/:path*"],
};
```

### Validation

```typescript
import {
  validateEmail,
  validatePassword,
  validateUrl,
} from "@artistry-hub/utils";

// Validate common formats
const isValidEmail = validateEmail("user@example.com");
const isValidPassword = validatePassword("SecurePass123!");
const isValidUrl = validateUrl("https://example.com");
```

## Configuration

### Logger Configuration

```typescript
import { logger } from "@artistry-hub/utils";

// Configure logger level
logger.setLevel("info"); // 'debug', 'info', 'warn', 'error'

// Configure output format
logger.setFormat("json"); // 'text', 'json'
```

### Currency Configuration

```typescript
import { setDefaultCurrency, setExchangeRates } from "@artistry-hub/utils";

// Set default currency
setDefaultCurrency("USD");

// Set exchange rates
setExchangeRates({
  USD: { EUR: 0.85, GBP: 0.73 },
  EUR: { USD: 1.18, GBP: 0.86 },
});
```

## Versioning & Internal Dependency Rules

- **Version**: Follows semantic versioning
- **Breaking Changes**: Major version bumps for API changes
- **Internal Dependencies**: All apps can use any compatible version
- **Updates**: Utilities are backward compatible within major versions

## Development

```bash
# From root directory
yarn workspace @artistry-hub/utils dev
yarn workspace @artistry-hub/utils build
yarn workspace @artistry-hub/utils test
```

## Testing

The package includes comprehensive tests for:

- Currency formatting and conversion
- Date manipulation and formatting
- ID generation and validation
- Logger functionality
- Validation functions

## Performance Considerations

- **Lazy Loading**: Utilities are loaded only when needed
- **Caching**: Expensive operations are cached where appropriate
- **Tree Shaking**: Unused utilities can be eliminated in builds
- **Minimal Dependencies**: Lightweight with minimal external dependencies

## Error Handling

```typescript
import { logger, safeExecute } from "@artistry-hub/utils";

// Safe execution with error handling
const result = safeExecute(
  () => {
    // Potentially dangerous operation
    return riskyFunction();
  },
  {
    fallback: "default-value",
    onError: (error) => logger.error("Operation failed", { error }),
  }
);
```

## Best Practices

1. **Import only what you need** - Use specific imports for better tree shaking
2. **Handle errors gracefully** - Use safe execution utilities
3. **Use appropriate log levels** - Don't log everything at debug level
4. **Validate inputs** - Use validation utilities before processing
5. **Cache expensive operations** - Cache results when appropriate

## Troubleshooting

1. **Import errors**: Check that the package is properly installed
2. **Logger issues**: Verify logger configuration and environment
3. **Validation failures**: Check input format and validation rules
4. **Performance problems**: Use profiling to identify bottlenecks

## Examples

### Complete Example

```typescript
import {
  formatCurrency,
  formatDate,
  generateId,
  logger,
  validateEmail,
} from "@artistry-hub/utils";

export const processOrder = (orderData: any) => {
  try {
    // Validate email
    if (!validateEmail(orderData.email)) {
      throw new Error("Invalid email address");
    }

    // Generate order ID
    const orderId = generateId();

    // Format data
    const formattedPrice = formatCurrency(orderData.total, "USD");
    const orderDate = formatDate(new Date(), "MMM dd, yyyy");

    // Log order
    logger.info("Order processed", {
      orderId,
      total: formattedPrice,
      date: orderDate,
    });

    return { orderId, formattedPrice, orderDate };
  } catch (error) {
    logger.error("Order processing failed", { error, orderData });
    throw error;
  }
};
```

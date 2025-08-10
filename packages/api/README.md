# @artistry-hub/api

Shared API utilities and event handling for the ArtistryHub platform.

## What it exports

This package provides common API functionality that can be used across all apps and packages:

- **DTOs**: Data Transfer Objects for API requests/responses
- **Events**: Event handling and management utilities
- **API Helpers**: Common API utility functions

## How to consume

### 1. Import DTOs

```typescript
import { UserDTO, ProductDTO, OrderDTO } from "@artistry-hub/api";

// Use DTOs for type-safe API operations
const userData: UserDTO = {
  id: "123",
  email: "user@example.com",
  name: "John Doe",
  role: "customer",
};
```

### 2. Import Events

```typescript
import { EventEmitter, EventTypes } from "@artistry-hub/api";

// Use event system for cross-app communication
const emitter = new EventEmitter();
emitter.emit(EventTypes.USER_CREATED, userData);
```

### 3. Import API Helpers

```typescript
import { apiClient, createApiResponse } from "@artistry-hub/api";

// Use API utilities
const response = await apiClient.get("/users");
const apiResponse = createApiResponse(data, { success: true });
```

## Available DTOs

### User DTOs

```typescript
import { UserDTO, CreateUserDTO, UpdateUserDTO } from "@artistry-hub/api";

// User creation
const newUser: CreateUserDTO = {
  email: "new@example.com",
  password: "securepassword",
  name: "New User",
  role: "customer",
};

// User update
const userUpdate: UpdateUserDTO = {
  name: "Updated Name",
  email: "updated@example.com",
};
```

### Product DTOs

```typescript
import {
  ProductDTO,
  CreateProductDTO,
  UpdateProductDTO,
} from "@artistry-hub/api";

// Product creation
const newProduct: CreateProductDTO = {
  name: "Artwork Title",
  description: "Beautiful artwork description",
  price: 2999,
  artistId: "artist-123",
  category: "painting",
};
```

### Order DTOs

```typescript
import { OrderDTO, CreateOrderDTO, OrderStatus } from "@artistry-hub/api";

// Order creation
const newOrder: CreateOrderDTO = {
  userId: "user-123",
  items: [{ productId: "product-123", quantity: 1, price: 2999 }],
  total: 2999,
  status: OrderStatus.PENDING,
};
```

## Event System

### Event Types

```typescript
import { EventTypes } from "@artistry-hub/api";

// Predefined event types
EventTypes.USER_CREATED;
EventTypes.USER_UPDATED;
EventTypes.USER_DELETED;
EventTypes.ORDER_CREATED;
EventTypes.ORDER_UPDATED;
EventTypes.PRODUCT_CREATED;
EventTypes.PRODUCT_UPDATED;
```

### Event Handling

```typescript
import { EventEmitter, EventTypes } from "@artistry-hub/api";

const emitter = new EventEmitter();

// Subscribe to events
emitter.on(EventTypes.USER_CREATED, (userData) => {
  console.log("New user created:", userData);
  // Handle user creation
});

// Emit events
emitter.emit(EventTypes.USER_CREATED, {
  id: "123",
  email: "user@example.com",
});
```

## API Utilities

### API Client

```typescript
import { apiClient } from "@artistry-hub/api";

// HTTP methods
const users = await apiClient.get("/users");
const newUser = await apiClient.post("/users", userData);
const updatedUser = await apiClient.put("/users/123", updateData);
const deleted = await apiClient.delete("/users/123");
```

### Response Helpers

```typescript
import { createApiResponse, createErrorResponse } from "@artistry-hub/api";

// Success response
const successResponse = createApiResponse(data, {
  success: true,
  message: "Operation completed successfully",
});

// Error response
const errorResponse = createErrorResponse("User not found", 404);
```

## Versioning & Internal Dependency Rules

- **Version**: Follows semantic versioning
- **Breaking Changes**: Major version bumps for API changes
- **Internal Dependencies**: All apps can use any compatible version
- **Updates**: API changes should be backward compatible

## Development

```bash
# From root directory
yarn workspace @artistry-hub/api dev
yarn workspace @artistry-hub/api build
yarn workspace @artistry-hub/api test
```

## Testing

The package includes comprehensive tests for:

- DTO validation and serialization
- Event system functionality
- API utility functions
- Error handling

## Best Practices

1. **Use DTOs consistently** - Always use DTOs for API data
2. **Handle events properly** - Subscribe and unsubscribe appropriately
3. **Validate data** - Ensure DTOs are properly validated
4. **Error handling** - Use proper error responses
5. **Type safety** - Leverage TypeScript for API operations

## Troubleshooting

1. **Import errors**: Check that the package is properly installed
2. **Event issues**: Verify event subscriptions and emissions
3. **DTO validation**: Check data structure against DTO definitions
4. **API errors**: Verify API client configuration

## Examples

### Complete API Example

```typescript
import {
  UserDTO,
  CreateUserDTO,
  EventEmitter,
  EventTypes,
  apiClient,
  createApiResponse,
} from "@artistry-hub/api";

export const userService = {
  async createUser(userData: CreateUserDTO): Promise<UserDTO> {
    try {
      // Create user via API
      const response = await apiClient.post("/users", userData);

      // Emit event
      const emitter = new EventEmitter();
      emitter.emit(EventTypes.USER_CREATED, response.data);

      return response.data;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  },

  async getUser(id: string): Promise<UserDTO> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};
```

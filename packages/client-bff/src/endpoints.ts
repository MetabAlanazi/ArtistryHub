import { z } from 'zod'
import { bffClient } from './client'
import type { BffResponse, Pagination, QueryParams } from './types'

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export const LoginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    role: z.string()
  })
})

export const authEndpoints = {
  login: (data: z.infer<typeof LoginRequestSchema>) =>
    bffClient.post('/api/v1/auth/login', data, LoginResponseSchema),
  
  register: (data: z.infer<typeof LoginRequestSchema> & { name: string; role: string }) =>
    bffClient.post('/api/v1/auth/register', data, LoginResponseSchema),
  
  reauth: (data: { password: string; twoFactorCode?: string }) =>
    bffClient.post('/api/v1/auth/reauth', data),
  
  logout: () => bffClient.post('/api/v1/auth/logout', {})
}

// ============================================================================
// USER ENDPOINTS
// ============================================================================

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.string(),
  status: z.string()
})

export const userEndpoints = {
  getProfile: () => bffClient.get('/api/v1/users/profile', UserProfileSchema)
}

// ============================================================================
// PRODUCT ENDPOINTS
// ============================================================================

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  status: z.string(),
  images: z.array(z.string()),
  variants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    priceCents: z.number(),
    stockLevel: z.number()
  }))
})

export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number()
  })
})

export const productEndpoints = {
  getAll: (params?: QueryParams) => {
    const query = bffClient.buildQuery(params || {})
    return bffClient.get(`/api/v1/products${query}`, ProductsResponseSchema)
  },
  
  getById: (id: string) => 
    bffClient.get(`/api/v1/products/${id}`, z.object({ product: ProductSchema }))
}

// ============================================================================
// WISHLIST ENDPOINTS
// ============================================================================

export const WishlistItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  product: ProductSchema
})

export const WishlistResponseSchema = z.object({
  wishlist: z.array(WishlistItemSchema)
})

export const wishlistEndpoints = {
  getAll: () => bffClient.get('/api/v1/wishlist', WishlistResponseSchema),
  
  add: (productId: string) => 
    bffClient.post('/api/v1/wishlist', { productId }),
  
  remove: (productId: string) => 
    bffClient.delete(`/api/v1/wishlist?productId=${productId}`),
  
  check: (productId: string) => 
    bffClient.get(`/api/v1/wishlist/check/${productId}`, z.object({ inWishlist: z.boolean() }))
}

// ============================================================================
// ORDER ENDPOINTS
// ============================================================================

export const OrderSchema = z.object({
  id: z.string(),
  status: z.string(),
  totalCents: z.number(),
  createdAt: z.string(),
  items: z.array(z.object({
    id: z.string(),
    productId: z.string(),
    quantity: z.number(),
    priceCents: z.number()
  }))
})

export const OrdersResponseSchema = z.object({
  orders: z.array(OrderSchema)
})

export const orderEndpoints = {
  getAll: () => bffClient.get('/api/v1/orders', OrdersResponseSchema),
  
  getById: (id: string) => 
    bffClient.get(`/api/v1/orders/${id}`, z.object({ order: OrderSchema }))
}

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

export const AdminUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const AdminUsersResponseSchema = z.object({
  users: z.array(AdminUserSchema)
})

export const AdminStatsSchema = z.object({
  totalUsers: z.number(),
  totalProducts: z.number(),
  totalOrders: z.number(),
  totalRevenue: z.number()
})

export const adminEndpoints = {
  getUsers: () => bffClient.get('/api/v1/admin/users', AdminUsersResponseSchema),
  
  updateUserRole: (userId: string, newRole: string) =>
    bffClient.patch(`/api/v1/admin/users/${userId}/role`, { newRole }),
  
  getStats: () => bffClient.get('/api/v1/admin/stats', AdminStatsSchema),
  
  getAuditLogs: (params?: QueryParams) => {
    const query = bffClient.buildQuery(params || {})
    return bffClient.get(`/api/v1/admin/audit-logs${query}`)
  }
}

// ============================================================================
// EXPORT ALL ENDPOINTS
// ============================================================================

export const bffEndpoints = {
  auth: authEndpoints,
  users: userEndpoints,
  products: productEndpoints,
  wishlist: wishlistEndpoints,
  orders: orderEndpoints,
  admin: adminEndpoints
}

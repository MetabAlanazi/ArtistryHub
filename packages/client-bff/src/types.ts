import { z } from 'zod'

// BFF API response envelope
export const BffResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    code: z.string().optional(),
    message: z.string().optional(),
    details: z.any().optional()
  })

export type BffResponse<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string
  message?: string
  details?: any
}

// Common error codes
export const BffErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  REAUTH_REQUIRED: 'REAUTH_REQUIRED'
} as const

export type BffErrorCode = typeof BffErrorCodes[keyof typeof BffErrorCodes]

// Pagination
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  pages: z.number()
})

export type Pagination = z.infer<typeof PaginationSchema>

// Common query parameters
export const QueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

export type QueryParams = z.infer<typeof QueryParamsSchema>

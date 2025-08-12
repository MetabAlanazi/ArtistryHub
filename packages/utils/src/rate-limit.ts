/**
 * Server-only rate limiting utility with bounded memory
 * Uses LRU cache to prevent memory leaks
 */

import type { Request, Response, NextFunction } from 'express'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (identifier: string) => string // Custom key generator
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

// Simple in-memory store with LRU-like behavior
class RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>()
  private maxSize: number

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize
  }

  get(key: string): { count: number; resetTime: number } | undefined {
    return this.store.get(key)
  }

  set(key: string, value: { count: number; resetTime: number }): void {
    // Clean up expired entries first
    this.cleanup()

    // If store is full, remove oldest entry
    if (this.store.size >= this.maxSize) {
      const firstKey = this.store.keys().next().value
      if (firstKey) {
        this.store.delete(firstKey)
      }
    }

    this.store.set(key, value)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.store.entries()) {
      if (now > value.resetTime) {
        this.store.delete(key)
      }
    }
  }

  size(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }
}

// Global rate limit store (singleton)
const globalStore = new RateLimitStore()

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyGenerator = (id: string) => id } = config

  return function rateLimit(identifier: string): RateLimitResult {
    const key = keyGenerator(identifier)
    const now = Date.now()
    const resetTime = now + windowMs

    const current = globalStore.get(key)

    if (!current || now > current.resetTime) {
      // First request or window expired
      globalStore.set(key, { count: 1, resetTime })
      return {
        success: true,
        remaining: maxRequests - 1,
        resetTime,
      }
    }

    if (current.count >= maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetTime: current.resetTime,
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      }
    }

    // Increment counter
    current.count++
    globalStore.set(key, current)

    return {
      success: true,
      remaining: maxRequests - current.count,
      resetTime: current.resetTime,
    }
  }
}

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  // API endpoints: 100 requests per minute
  api: createRateLimiter({ windowMs: 60 * 1000, maxRequests: 100 }),
  
  // Authentication: 5 attempts per 15 minutes
  auth: createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }),
  
  // File uploads: 10 uploads per hour
  upload: createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 10 }),
  
  // Search: 50 searches per minute
  search: createRateLimiter({ windowMs: 60 * 1000, maxRequests: 50 }),
}

// Express.js middleware helper
export function rateLimitMiddleware(limiter: ReturnType<typeof createRateLimiter>) {
  return function(req: Request, res: Response, next: NextFunction) {
    const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown'
    const result = limiter(identifier)

    if (!result.success) {
      res.setHeader('X-RateLimit-Limit', result.remaining)
      res.setHeader('X-RateLimit-Remaining', result.remaining)
      res.setHeader('X-RateLimit-Reset', result.resetTime)
      if (result.retryAfter) {
        res.setHeader('Retry-After', result.retryAfter)
      }
      
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        retryAfter: result.retryAfter,
      })
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', result.remaining + result.remaining)
    res.setHeader('X-RateLimit-Remaining', result.remaining)
    res.setHeader('X-RateLimit-Reset', result.resetTime)

    next()
  }
}

// Next.js API route helper
export function withRateLimit(
  handler: (req: Request, res: Response) => Promise<void> | void,
  limiter: ReturnType<typeof createRateLimiter> = rateLimiters.api
) {
  return async function(req: Request, res: Response) {
    const identifier = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown'
    const result = limiter(identifier)

    if (!result.success) {
      res.setHeader('X-RateLimit-Limit', result.remaining + result.remaining)
      res.setHeader('X-RateLimit-Remaining', result.remaining)
      res.setHeader('X-RateLimit-Reset', result.resetTime)
      if (result.retryAfter) {
        res.setHeader('Retry-After', result.retryAfter)
      }
      
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        retryAfter: result.retryAfter,
      })
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', result.remaining + result.remaining)
    res.setHeader('X-RateLimit-Remaining', result.remaining)
    res.setHeader('X-RateLimit-Reset', result.resetTime)

    return handler(req, res)
  }
}

// Utility to get store statistics (useful for monitoring)
export function getRateLimitStats() {
  return {
    storeSize: globalStore.size(),
    // Add more stats as needed
  }
}

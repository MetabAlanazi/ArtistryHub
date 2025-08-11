import { NextRequest, NextResponse } from 'next/server'
import { Redis } from 'ioredis'

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string // Custom key generator
  skipSuccessfulRequests?: boolean // Skip rate limiting for successful requests
  skipFailedRequests?: boolean // Skip rate limiting for failed requests
}

export class RedisRateLimiter {
  private redis: Redis
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
  }

  private generateKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req)
    }

    // Default: IP + User Agent + Route
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const route = req.nextUrl.pathname
    
    return `rate_limit:${ip}:${userAgent}:${route}`
  }

  private async getCurrentCount(key: string): Promise<number> {
    const count = await this.redis.get(key)
    return count ? parseInt(count, 10) : 0
  }

  private async incrementCount(key: string): Promise<number> {
    const multi = this.redis.multi()
    multi.incr(key)
    multi.expire(key, Math.ceil(this.config.windowMs / 1000))
    
    const results = await multi.exec()
    return results?.[0]?.[1] as number || 1
  }

  async checkLimit(req: NextRequest): Promise<{
    limited: boolean
    remaining: number
    resetTime: number
    retryAfter: number
  }> {
    const key = this.generateKey(req)
    const currentCount = await this.getCurrentCount(key)
    
    if (currentCount >= this.config.maxRequests) {
      const ttl = await this.redis.ttl(key)
      const resetTime = Date.now() + (ttl * 1000)
      const retryAfter = Math.ceil(ttl)
      
      return {
        limited: true,
        remaining: 0,
        resetTime,
        retryAfter
      }
    }

    const newCount = await this.incrementCount(key)
    
    return {
      limited: false,
      remaining: Math.max(0, this.config.maxRequests - newCount),
      resetTime: Date.now() + this.config.windowMs,
      retryAfter: 0
    }
  }

  async middleware(req: NextRequest) {
    const result = await this.checkLimit(req)
    
    if (result.limited) {
      const response = NextResponse.json(
        { 
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: result.retryAfter
        },
        { status: 429 }
      )
      
      response.headers.set('Retry-After', result.retryAfter.toString())
      response.headers.set('X-RateLimit-Limit', this.config.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
      
      return response
    }

    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', this.config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
    
    return response
  }
}

// Pre-configured rate limiters for common use cases
export const createLoginLimiter = () => new RedisRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  keyGenerator: (req) => `login_limit:${req.ip || 'unknown'}`
})

export const createSignupLimiter = () => new RedisRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 attempts per hour
  keyGenerator: (req) => `signup_limit:${req.ip || 'unknown'}`
})

export const createCheckoutLimiter = () => new RedisRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 10, // 10 attempts per 5 minutes
  keyGenerator: (req) => `checkout_limit:${req.ip || 'unknown'}`
})

export const createRoleChangeLimiter = () => new RedisRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 2, // 2 attempts per hour
  keyGenerator: (req) => `role_change_limit:${req.ip || 'unknown'}`
})

export const createPayoutLimiter = () => new RedisRateLimiter({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  maxRequests: 5, // 5 attempts per day
  keyGenerator: (req) => `payout_limit:${req.ip || 'unknown'}`
})

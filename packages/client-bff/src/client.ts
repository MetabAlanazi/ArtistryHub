import { z } from 'zod'
import type { BffResponse, BffErrorCode } from './types'

export interface BffClientConfig {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
}

export class BffClient {
  private config: BffClientConfig

  constructor(config: BffClientConfig) {
    this.config = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    responseSchema?: z.ZodType<T>
  ): Promise<BffResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout!),
    }

    try {
      const response = await fetch(url, requestOptions)
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
          code: data.code || 'UNKNOWN_ERROR',
          message: data.message || `HTTP ${response.status}`
        }
      }

      // Validate response if schema provided
      if (responseSchema) {
        const validation = responseSchema.safeParse(data)
        if (!validation.success) {
          return {
            success: false,
            error: 'Invalid response format',
            code: 'VALIDATION_ERROR',
            details: validation.error.errors
          }
        }
        return {
          success: true,
          data: validation.data
        }
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
            code: 'TIMEOUT'
          }
        }
        return {
          success: false,
          error: error.message,
          code: 'NETWORK_ERROR'
        }
      }
      
      return {
        success: false,
        error: 'Unknown error',
        code: 'UNKNOWN_ERROR'
      }
    }
  }

  // GET request
  async get<T>(endpoint: string, responseSchema?: z.ZodType<T>): Promise<BffResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, responseSchema)
  }

  // POST request
  async post<T>(
    endpoint: string, 
    body: any, 
    responseSchema?: z.ZodType<T>
  ): Promise<BffResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }, responseSchema)
  }

  // PUT request
  async put<T>(
    endpoint: string, 
    body: any, 
    responseSchema?: z.ZodType<T>
  ): Promise<BffResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    }, responseSchema)
  }

  // PATCH request
  async patch<T>(
    endpoint: string, 
    body: any, 
    responseSchema?: z.ZodType<T>
  ): Promise<BffResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }, responseSchema)
  }

  // DELETE request
  async delete<T>(endpoint: string, responseSchema?: z.ZodType<T>): Promise<BffResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, responseSchema)
  }

  // Helper to build query strings
  buildQuery(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    
    const query = searchParams.toString()
    return query ? `?${query}` : ''
  }
}

// Default client instance
export const createBffClient = (baseUrl: string) => new BffClient({ baseUrl })

// Environment-based client
export const bffClient = createBffClient(
  process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:3001'
)

import pino from 'pino'

// Environment-based logger configuration
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info')

// Base logger configuration
const baseConfig: pino.LoggerOptions = {
  level: logLevel,
  // Performance optimizations for production
  ...(isProduction && {
    // Production: Fast JSON logging without pretty formatting
    transport: undefined,
    // Reduce overhead in production
    base: undefined,
    // Fast serialization
    serializers: pino.stdSerializers,
  }),
  // Development: Pretty logging with colors
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'HH:MM:ss Z',
        hideObject: false,
      },
    },
  }),
}

// Create the logger instance
export const logger = pino(baseConfig)

export function createLogger(name: string) {
  return logger.child({ name })
}

export interface AuditLogData {
  actorUserId?: string
  action: string
  entity: string
  entityId: string
  meta?: Record<string, unknown>
}

export async function logAudit(data: AuditLogData) {
  try {
    // For now, just log to console. Database logging can be implemented later
    logger.info({
      msg: 'Audit log created',
      ...data,
    })
  } catch (error) {
    logger.error({
      msg: 'Failed to create audit log',
      error: error instanceof Error ? error.message : String(error),
      ...data,
    })
  }
}

// Performance logging utilities
export function logPerformance(operation: string, duration: number, meta?: Record<string, unknown>) {
  if (duration > 100) { // Only log slow operations (>100ms)
    logger.warn({
      msg: 'Slow operation detected',
      operation,
      duration,
      ...meta,
    })
  } else if (isDevelopment) {
    logger.debug({
      msg: 'Operation completed',
      operation,
      duration,
      ...meta,
    })
  }
}

// Request logging middleware helper
export function logRequest(req: { method?: string; url?: string }, duration: number) {
  const level = duration > 1000 ? 'warn' : 'info'
  logger[level]({
    msg: 'HTTP request completed',
    method: req.method,
    url: req.url,
    duration,
  })
}

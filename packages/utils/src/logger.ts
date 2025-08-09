import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
    },
  },
})

export function createLogger(name: string) {
  return logger.child({ name })
}

export interface AuditLogData {
  actorUserId?: string
  action: string
  entity: string
  entityId: string
  meta?: any
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

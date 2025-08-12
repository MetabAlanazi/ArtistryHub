import { z } from 'zod'

// Event schemas
export const orderCreatedEvent = z.object({
  type: z.literal('order.created'),
  data: z.object({
    orderId: z.string(),
    userId: z.string().optional(),
    email: z.string(),
    totalCents: z.number(),
    currency: z.string(),
  }),
  timestamp: z.date(),
  id: z.string(),
})

export const orderPaidEvent = z.object({
  type: z.literal('order.paid'),
  data: z.object({
    orderId: z.string(),
    paymentId: z.string(),
    amountCents: z.number(),
    currency: z.string(),
  }),
  timestamp: z.date(),
  id: z.string(),
})

export const orderShippedEvent = z.object({
  type: z.literal('order.shipped'),
  data: z.object({
    orderId: z.string(),
    trackingNumber: z.string(),
    carrier: z.string(),
  }),
  timestamp: z.date(),
  id: z.string(),
})

export const productPublishedEvent = z.object({
  type: z.literal('product.published'),
  data: z.object({
    productId: z.string(),
    title: z.string(),
    artistId: z.string().optional(),
  }),
  timestamp: z.date(),
  id: z.string(),
})

export const inventoryLowStockEvent = z.object({
  type: z.literal('inventory.low_stock'),
  data: z.object({
    variantId: z.string(),
    productId: z.string(),
    currentStock: z.number(),
    threshold: z.number(),
  }),
  timestamp: z.date(),
  id: z.string(),
})

export const returnRequestedEvent = z.object({
  type: z.literal('return.requested'),
  data: z.object({
    orderId: z.string(),
    reason: z.string(),
    userId: z.string().optional(),
  }),
  timestamp: z.date(),
  id: z.string(),
})

export const ticketOpenedEvent = z.object({
  type: z.literal('ticket.opened'),
  data: z.object({
    ticketId: z.string(),
    subject: z.string(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    channel: z.enum(['EMAIL', 'CHAT', 'PHONE']),
  }),
  timestamp: z.date(),
  id: z.string(),
})

export const ticketResolvedEvent = z.object({
  type: z.literal('ticket.resolved'),
  data: z.object({
    ticketId: z.string(),
    resolvedBy: z.string(),
    resolution: z.string(),
  }),
  timestamp: z.date(),
  id: z.string(),
})

// Union type for all events
export const eventSchema = z.union([
  orderCreatedEvent,
  orderPaidEvent,
  orderShippedEvent,
  productPublishedEvent,
  inventoryLowStockEvent,
  returnRequestedEvent,
  ticketOpenedEvent,
  ticketResolvedEvent,
])

// Event types
export type OrderCreatedEvent = z.infer<typeof orderCreatedEvent>
export type OrderPaidEvent = z.infer<typeof orderPaidEvent>
export type OrderShippedEvent = z.infer<typeof orderShippedEvent>
export type ProductPublishedEvent = z.infer<typeof productPublishedEvent>
export type InventoryLowStockEvent = z.infer<typeof inventoryLowStockEvent>
export type ReturnRequestedEvent = z.infer<typeof returnRequestedEvent>
export type TicketOpenedEvent = z.infer<typeof ticketOpenedEvent>
export type TicketResolvedEvent = z.infer<typeof ticketResolvedEvent>

export type Event = z.infer<typeof eventSchema>

// Event handlers
export interface EventHandler<T extends Event = Event> {
  handle(event: T): Promise<void>
}

export interface EventBus {
  publish(event: Event): Promise<void>
  subscribe<T extends Event>(eventType: T['type'], handler: EventHandler<T>): void
  unsubscribe(eventType: string, handler: EventHandler): void
}













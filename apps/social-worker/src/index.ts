import { logger } from '@artistry-hub/utils'
import { PrismaClient } from '@artistry-hub/db'
import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'

const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// Create queues
const productPublishedQueue = new Queue('product-published', { connection: redis })
const orderPaidQueue = new Queue('order-paid', { connection: redis })
const inventoryLowStockQueue = new Queue('inventory-low-stock', { connection: redis })

// Product published worker
const productPublishedWorker = new Worker('product-published', async (job) => {
  const { productId, title, artistId } = job.data
  
  logger.info('Processing product published event', { productId, title })
  
  try {
    // Get social channels
    const channels = await prisma.channel.findMany({
      where: { provider: 'INSTAGRAM' }
    })
    
    for (const channel of channels) {
      // Create post content
      const content = `🎨 New artwork available: "${title}"\n\nDiscover this beautiful piece on ArtistryHub!\n\n#art #artwork #saudiart #artistryhub`
      
      // Create post record
      const post = await prisma.post.create({
        data: {
          channelId: channel.id,
          content,
          status: 'PLANNED'
        }
      })
      
      // Simulate posting to social media
      logger.info('Posting to social media', { postId: post.id, channel: channel.name })
      
      // Update post status
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      })
      
      // Log the post
      await prisma.postLog.create({
        data: {
          postId: post.id,
          payload: { content, channel: channel.name },
          response: { success: true, timestamp: new Date() }
        }
      })
    }
    
    logger.info('Product published event processed successfully', { productId })
  } catch (error) {
    logger.error('Error processing product published event', { productId, error })
    throw error
  }
}, { connection: redis })

// Order paid worker
const orderPaidWorker = new Worker('order-paid', async (job) => {
  const { orderId, amountCents } = job.data
  
  logger.info('Processing order paid event', { orderId, amountCents })
  
  try {
    // Send order confirmation email (simulated)
    logger.info('Sending order confirmation email', { orderId })
    
    // Update order status if needed
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' }
    })
    
    logger.info('Order paid event processed successfully', { orderId })
  } catch (error) {
    logger.error('Error processing order paid event', { orderId, error })
    throw error
  }
}, { connection: redis })

// Inventory low stock worker
const inventoryLowStockWorker = new Worker('inventory-low-stock', async (job) => {
  const { variantId, productId, currentStock, threshold } = job.data
  
  logger.info('Processing inventory low stock event', { variantId, currentStock, threshold })
  
  try {
    // Send low stock notification (simulated)
    logger.info('Sending low stock notification', { variantId, currentStock })
    
    // Create support ticket for low stock
    await prisma.supportTicket.create({
      data: {
        subject: `Low Stock Alert - Product ${productId}`,
        message: `Variant ${variantId} is running low on stock. Current: ${currentStock}, Threshold: ${threshold}`,
        channel: 'EMAIL',
        priority: 'MEDIUM'
      }
    })
    
    logger.info('Inventory low stock event processed successfully', { variantId })
  } catch (error) {
    logger.error('Error processing inventory low stock event', { variantId, error })
    throw error
  }
}, { connection: redis })

// Error handling
productPublishedWorker.on('error', (error) => {
  logger.error('Product published worker error', { error })
})

orderPaidWorker.on('error', (error) => {
  logger.error('Order paid worker error', { error })
})

inventoryLowStockWorker.on('error', (error) => {
  logger.error('Inventory low stock worker error', { error })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Shutting down social worker...')
  
  await productPublishedWorker.close()
  await orderPaidWorker.close()
  await inventoryLowStockWorker.close()
  await redis.quit()
  await prisma.$disconnect()
  
  process.exit(0)
})

logger.info('Social worker started successfully')









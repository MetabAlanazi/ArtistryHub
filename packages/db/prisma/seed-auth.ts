import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

async function logAudit(data: {
  actorUserId?: string
  action: string
  entity: string
  entityId: string
  meta?: any
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: data.actorUserId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        meta: data.meta,
      },
    })
    console.log('Audit log created:', data.action)
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

async function main() {
  console.log('🌱 Seeding authentication users...')

  // Create admin user
  const adminPassword = await hashPassword('Admin123!')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@artistryhub.com' },
    update: {},
    create: {
      email: 'admin@artistryhub.com',
      name: 'System Administrator',
      passwordHash: adminPassword,
      role: 'admin',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  // Create operator user
  const operatorPassword = await hashPassword('Ops123!')
  const operator = await prisma.user.upsert({
    where: { email: 'ops@artistryhub.com' },
    update: {},
    create: {
      email: 'ops@artistryhub.com',
      name: 'Operations Manager',
      passwordHash: operatorPassword,
      role: 'operator',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  // Create artist user
  const artistPassword = await hashPassword('Artist123!')
  const artist = await prisma.user.upsert({
    where: { email: 'artist@artistryhub.com' },
    update: {},
    create: {
      email: 'artist@artistryhub.com',
      name: 'Sarah Ahmed',
      passwordHash: artistPassword,
      role: 'artist',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  // Create customer user
  const customerPassword = await hashPassword('Customer123!')
  const customer = await prisma.user.upsert({
    where: { email: 'customer@artistryhub.com' },
    update: {},
    create: {
      email: 'customer@artistryhub.com',
      name: 'John Doe',
      passwordHash: customerPassword,
      role: 'customer',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  // Create service account for social worker
  const serviceUser = await prisma.user.upsert({
    where: { email: 'service@artistryhub.com' },
    update: {},
    create: {
      email: 'service@artistryhub.com',
      name: 'Social Worker Service',
      passwordHash: null, // No password for service accounts
      role: 'service',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  // Create service token for social worker
  const crypto = require('crypto')
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = await hashPassword(token)
  
  const serviceToken = await prisma.serviceToken.upsert({
    where: { id: 'social-worker-token' },
    update: {},
    create: {
      id: 'social-worker-token',
      userId: serviceUser.id,
      name: 'social-worker',
      tokenHash: tokenHash,
      scopes: 'events:read,posts:write',
      active: true,
    },
  })

  // Create artist profile for the artist
  await prisma.artistProfile.upsert({
    where: { userId: artist.id },
    update: {},
    create: {
      userId: artist.id,
      bio: 'Contemporary artist specializing in abstract paintings and digital art.',
      specialties: ['Abstract Art', 'Digital Art', 'Mixed Media'],
      portfolio: ['https://example.com/portfolio1', 'https://example.com/portfolio2'],
      commission: {
        available: true,
        minBudget: 50000, // 500 SAR
        maxBudget: 500000, // 5000 SAR
        turnaroundTime: '2-4 weeks'
      }
    },
  })

  // Log user creation
  await logAudit({
    actorUserId: admin.id,
    action: 'USER_CREATED',
    entity: 'USER',
    entityId: admin.id,
    meta: { role: 'admin', email: admin.email }
  })

  await logAudit({
    actorUserId: admin.id,
    action: 'USER_CREATED',
    entity: 'USER',
    entityId: operator.id,
    meta: { role: 'operator', email: operator.email }
  })

  await logAudit({
    actorUserId: admin.id,
    action: 'USER_CREATED',
    entity: 'USER',
    entityId: artist.id,
    meta: { role: 'artist', email: artist.email }
  })

  await logAudit({
    actorUserId: admin.id,
    action: 'USER_CREATED',
    entity: 'USER',
    entityId: customer.id,
    meta: { role: 'customer', email: customer.email }
  })

  await logAudit({
    actorUserId: admin.id,
    action: 'USER_CREATED',
    entity: 'USER',
    entityId: serviceUser.id,
    meta: { role: 'service', email: serviceUser.email }
  })

  await logAudit({
    actorUserId: admin.id,
    action: 'SERVICE_TOKEN_CREATED',
    entity: 'SERVICE_TOKEN',
    entityId: serviceToken.id,
    meta: { name: serviceToken.name, scopes: serviceToken.scopes }
  })

  console.log('✅ Authentication users seeded successfully!')
  console.log('📋 User IDs:')
  console.log(`   Admin: ${admin.id}`)
  console.log(`   Operator: ${operator.id}`)
  console.log(`   Artist: ${artist.id}`)
  console.log(`   Customer: ${customer.id}`)
  console.log(`   Service: ${serviceUser.id}`)
  console.log('')
  console.log('🔐 Login Credentials:')
  console.log('   Admin: admin@artistryhub.com / Admin123!')
  console.log('   Operator: ops@artistryhub.com / Ops123!')
  console.log('   Artist: artist@artistryhub.com / Artist123!')
  console.log('   Customer: customer@artistryhub.com / Customer123!')
  console.log('')
  console.log('🔑 Service Token (Social Worker):')
  console.log(`   Token: ${token}`)
  console.log(`   Scopes: ${serviceToken.scopes}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding authentication users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

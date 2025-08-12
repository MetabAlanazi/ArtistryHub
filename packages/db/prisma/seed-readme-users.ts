/**
 * README-SPECIFIC USER SEEDING SCRIPT - ArtistryHub
 * 
 * ⚠️  IMPORTANT: TESTING ONLY - DO NOT MODIFY USER NAMES OR PASSWORDS
 * 
 * PURPOSE:
 * This script creates ONLY the test users documented in the README.
 * It creates 12 users with exact credentials matching the README documentation.
 * Perfect for quick testing without full database seeding.
 * 
 * SECURITY NOTES:
 * - All passwords are securely hashed using bcrypt with 12 salt rounds
 * - These are TEST accounts only - NEVER use in production
 * - User names and passwords are standardized and should not be changed
 * - Every run uses upsert to avoid duplicates
 * 
 * CREATED USERS (12 total - README exact match):
 * - 2 Admin users: admin@artistryhub.com, admin2@artistryhub.com
 * - 2 Artist users: artist1@artistryhub.com, artist2@artistryhub.com
 * - 2 Operator users: operator1@artistryhub.com, operator2@artistryhub.com
 * - 2 Social Worker users: social1@artistryhub.com, social2@artistryhub.com
 * - 2 Customer users: customer1@example.com, customer2@example.com
 * - 2 Service users: service1@artistryhub.com, service2@artistryhub.com
 * 
 * USAGE:
 * - Run with: yarn db:seed:readme
 * - This creates only the README users without full database reset
 * - Perfect for testing specific user accounts
 * 
 * DATABASE REQUIREMENTS:
 * - Prisma client must be generated: yarn db:generate
 * - Database must be running and accessible via DATABASE_URL
 * - User table must exist with proper schema
 * 
 * DEPENDENCIES:
 * - @prisma/client: Database ORM
 * - bcryptjs: Password hashing for security
 * 
 * ⚠️  WARNING: These credentials are for testing only.
 * ⚠️  Do not modify or update them.
 */

import { prisma, Role } from '@artistry-hub/db'
import bcrypt from 'bcryptjs'

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

async function main() {
  console.log('🌱 Seeding README test users...')

  // Create all users from README exactly as documented
  const admin1Password = await hashPassword('Admin2024!Secure#');
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@artistryhub.com' },
    update: {},
    create: {
      email: 'admin@artistryhub.com',
      name: 'System Administrator',
      hashedPassword: admin1Password,
      role: 'admin',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  const admin2Password = await hashPassword('Admin2024!Secure#');
  const admin2 = await prisma.user.upsert({
    where: { email: 'admin2@artistryhub.com' },
    update: {},
    create: {
      email: 'admin2@artistryhub.com',
      name: 'Platform Manager',
      hashedPassword: admin2Password,
      role: 'admin',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  const artist1Password = await hashPassword('Artist2024!Creative#');
  const artist1 = await prisma.user.upsert({
    where: { email: 'artist1@artistryhub.com' },
    update: {},
    create: {
      email: 'artist1@artistryhub.com',
      name: 'Creative Artist 1',
      hashedPassword: artist1Password,
      role: 'artist',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  const artist2Password = await hashPassword('Artist2024!Creative#');
  const artist2 = await prisma.user.upsert({
    where: { email: 'artist2@artistryhub.com' },
    update: {},
    create: {
      email: 'artist2@artistryhub.com',
      name: 'Creative Artist 2',
      hashedPassword: artist2Password,
      role: 'artist',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  const operator1Password = await hashPassword('Operator2024!Work#');
  const operator1 = await prisma.user.upsert({
    where: { email: 'operator1@artistryhub.com' },
    update: {},
    create: {
      email: 'operator1@artistryhub.com',
      name: 'Gallery Operator',
      hashedPassword: operator1Password,
      role: 'operator',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  const operator2Password = await hashPassword('Operator2024!Work#');
  const operator2 = await prisma.user.upsert({
    where: { email: 'operator2@artistryhub.com' },
    update: {},
    create: {
      email: 'operator2@artistryhub.com',
      name: 'Fulfillment Manager',
      hashedPassword: operator2Password,
      role: 'operator',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  const social1Password = await hashPassword('Social2024!Help#');
  const socialWorker1 = await prisma.user.upsert({
    where: { email: 'social1@artistryhub.com' },
    update: {},
    create: {
      email: 'social1@artistryhub.com',
      name: 'Community Social Worker',
      hashedPassword: social1Password,
      role: 'social_worker',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  const social2Password = await hashPassword('Social2024!Help#');
  const socialWorker2 = await prisma.user.upsert({
    where: { email: 'social2@artistryhub.com' },
    update: {},
    create: {
      email: 'social2@artistryhub.com',
      name: 'Outreach Coordinator',
      hashedPassword: social2Password,
      role: 'social_worker',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  // Customer 1 - RECREATED EVERY TIME (deleted and reinserted)
  const customer1Password = await hashPassword('Customer2024!Shop#');
  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      email: 'customer1@example.com',
      name: 'John Doe',
      hashedPassword: customer1Password,
      role: 'customer',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  // Customer 2 - RECREATED EVERY TIME (deleted and reinserted)
  const customer2Password = await hashPassword('Customer2024!Shop#');
  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      email: 'customer2@example.com',
      name: 'Jane Smith',
      hashedPassword: customer2Password,
      role: 'customer',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  const service1Password = await hashPassword('Service2024!Support#');
  const service1 = await prisma.user.upsert({
    where: { email: 'service1@artistryhub.com' },
    update: {},
    create: {
      email: 'service1@artistryhub.com',
      name: 'Support Agent',
      hashedPassword: service1Password,
      role: 'service',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  const service2Password = await hashPassword('Service2024!Support#');
  const service2 = await prisma.user.upsert({
    where: { email: 'service2@artistryhub.com' },
    update: {},
    create: {
      email: 'service2@artistryhub.com',
      name: 'Technical Specialist',
      hashedPassword: service2Password,
      role: 'service',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  console.log('✅ README test users seeded successfully!')
  console.log('')
  console.log('🔐 Login Credentials (exactly matching README):')
  console.log('   Admin 1: admin@artistryhub.com / Admin2024!Secure#')
  console.log('   Admin 2: admin2@artistryhub.com / Admin2024!Secure#')
  console.log('   Artist 1: artist1@artistryhub.com / Artist2024!Creative#')
  console.log('   Artist 2: artist2@artistryhub.com / Artist2024!Creative#')
  console.log('   Operator 1: operator1@artistryhub.com / Operator2024!Work#')
  console.log('   Operator 2: operator2@artistryhub.com / Operator2024!Work#')
  console.log('   Social Worker 1: social1@artistryhub.com / Social2024!Help#')
  console.log('   Social Worker 2: social2@artistryhub.com / Social2024!Help#')
  console.log('   Customer 1: customer1@example.com / Customer2024!Shop#')
  console.log('   Customer 2: customer2@example.com / Customer2024!Shop#')
  console.log('   Service 1: service1@artistryhub.com / Service2024!Support#')
  console.log('   Service 2: service2@artistryhub.com / Service2024!Support#')
  console.log('')
  console.log('📋 User IDs:')
  console.log(`   Admin 1: ${admin1.id}`)
  console.log(`   Admin 2: ${admin2.id}`)
  console.log(`   Artist 1: ${artist1.id}`)
  console.log(`   Artist 2: ${artist2.id}`)
  console.log(`   Operator 1: ${operator1.id}`)
  console.log(`   Operator 2: ${operator2.id}`)
  console.log(`   Social Worker 1: ${socialWorker1.id}`)
  console.log(`   Social Worker 2: ${socialWorker2.id}`)
  console.log(`   Customer 1: ${customer1.id}`)
  console.log(`   Customer 2: ${customer2.id}`)
  console.log(`   Service 1: ${service1.id}`)
  console.log(`   Service 2: ${service2.id}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding README users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


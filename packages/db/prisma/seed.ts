/**
 * MAIN DATABASE SEEDING SCRIPT - ArtistryHub
 * 
 * ⚠️  IMPORTANT: TESTING ONLY - DO NOT MODIFY USER NAMES OR PASSWORDS
 * 
 * PURPOSE:
 * This script creates the complete set of test users for the ArtistryHub platform.
 * It creates 12 users (2 of each role type) with secure passwords for testing.
 * 
 * SECURITY NOTES:
 * - All passwords are securely hashed using bcrypt with 12 salt rounds
 * - These are TEST accounts only - NEVER use in production
 * - User names and passwords are standardized and should not be changed
 * - Every run deletes existing users and creates fresh test data
 * 
 * CREATED USERS (12 total):
 * - 2 Admin users: Full platform access for system administration
 * - 2 Artist users: Store + Artist dashboard access
 * - 2 Operator users: Store + Operator panel access  
 * - 2 Social Worker users: Store + Social worker portal access
 * - 2 Customer users: Store-only access for e-commerce testing
 * - 2 Service users: Store + Service access for support
 * 
 * USAGE:
 * - Run with: yarn db:seed
 * - This will reset the database and create fresh test users
 * - Perfect for development, testing, and demo environments
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
 * ⚠️  WARNING: This script DELETES all existing users and recreates them.
 * ⚠️  Only use in development/testing environments.
 */

import { prisma } from '@artistry-hub/db';
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (only for tables that exist)
  console.log('🧹 Clearing existing data...');
  try {
    // Delete all existing data to ensure clean state
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany(); // Delete ALL existing users including customers
    console.log('✅ All existing users deleted (including customers)');
  } catch (error) {
    console.log('⚠️  Some tables may not exist yet, continuing...');
  }

  // Create sample users with different roles (matching README exactly)
  console.log('👥 Creating sample users...');

  // Admin users
  const admin1Password = await hashPassword('Admin2024!Secure#');
  const admin1 = await prisma.user.create({
    data: {
      email: 'admin@artistryhub.com',
      name: 'System Administrator',
      hashedPassword: admin1Password,
      role: 'admin',
      status: 'ACTIVE',
    },
  });

  const admin2Password = await hashPassword('Admin2024!Secure#');
  const admin2 = await prisma.user.create({
    data: {
      email: 'admin2@artistryhub.com',
      name: 'Platform Manager',
      hashedPassword: admin2Password,
      role: 'admin',
      status: 'ACTIVE',
    },
  });

  // Artist users
  const artist1Password = await hashPassword('Artist2024!Creative#');
  const artist1 = await prisma.user.create({
    data: {
      email: 'artist1@artistryhub.com',
      name: 'Creative Artist 1',
      hashedPassword: artist1Password,
      role: 'artist',
      status: 'ACTIVE',
    },
  });

  const artist2Password = await hashPassword('Artist2024!Creative#');
  const artist2 = await prisma.user.create({
    data: {
      email: 'artist2@artistryhub.com',
      name: 'Creative Artist 2',
      hashedPassword: artist2Password,
      role: 'artist',
      status: 'ACTIVE',
    },
  });

  // Operator users
  const operator1Password = await hashPassword('Operator2024!Work#');
  const operator1 = await prisma.user.create({
    data: {
      email: 'operator1@artistryhub.com',
      name: 'Gallery Operator',
      hashedPassword: operator1Password,
      role: 'operator',
      status: 'ACTIVE',
    },
  });

  const operator2Password = await hashPassword('Operator2024!Work#');
  const operator2 = await prisma.user.create({
    data: {
      email: 'operator2@artistryhub.com',
      name: 'Fulfillment Manager',
      hashedPassword: operator2Password,
      role: 'operator',
      status: 'ACTIVE',
    },
  });

  // Social Worker users
  const social1Password = await hashPassword('Social2024!Help#');
  const socialWorker1 = await prisma.user.create({
    data: {
      email: 'social1@artistryhub.com',
      name: 'Community Social Worker',
      hashedPassword: social1Password,
      role: 'social_worker',
      status: 'ACTIVE',
    },
  });

  const social2Password = await hashPassword('Social2024!Help#');
  const socialWorker2 = await prisma.user.create({
    data: {
      email: 'social2@artistryhub.com',
      name: 'Outreach Coordinator',
      hashedPassword: social2Password,
      role: 'social_worker',
      status: 'ACTIVE',
    },
  });

  // Customer users - RECREATED EVERY TIME (deleted and reinserted)
  const customer1Password = await hashPassword('Customer2024!Shop#');
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      name: 'John Doe',
      hashedPassword: customer1Password,
      role: 'customer',
      status: 'ACTIVE',
    },
  });

  // Customer 2 - RECREATED EVERY TIME (deleted and reinserted)
  const customer2Password = await hashPassword('Customer2024!Shop#');
  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      name: 'Jane Smith',
      hashedPassword: customer2Password,
      role: 'customer',
      status: 'ACTIVE',
    },
  });

  // Service users
  const service1Password = await hashPassword('Service2024!Support#');
  const service1 = await prisma.user.create({
    data: {
      email: 'service1@artistryhub.com',
      name: 'Support Agent',
      hashedPassword: service1Password,
      role: 'service',
      status: 'ACTIVE',
    },
  });

  const service2Password = await hashPassword('Service2024!Support#');
  const service2 = await prisma.user.create({
    data: {
      email: 'service2@artistryhub.com',
      name: 'Technical Specialist',
      hashedPassword: service2Password,
      role: 'service',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Users created successfully!');
  console.log('');
  console.log('🔐 Login Credentials (matching README):');
  console.log('   Admin 1: admin@artistryhub.com / Admin2024!Secure#');
  console.log('   Admin 2: admin2@artistryhub.com / Admin2024!Secure#');
  console.log('   Artist 1: artist1@artistryhub.com / Artist2024!Creative#');
  console.log('   Artist 2: artist2@artistryhub.com / Artist2024!Creative#');
  console.log('   Operator 1: operator1@artistryhub.com / Operator2024!Work#');
  console.log('   Operator 2: operator2@artistryhub.com / Operator2024!Work#');
  console.log('   Social Worker 1: social1@artistryhub.com / Social2024!Help#');
  console.log('   Social Worker 2: social2@artistryhub.com / Social2024!Help#');
  console.log('   Customer 1: customer1@example.com / Customer2024!Shop#');
  console.log('   Customer 2: customer2@example.com / Customer2024!Shop#');
  console.log('   Service 1: service1@artistryhub.com / Service2024!Support#');
  console.log('   Service 2: service2@artistryhub.com / Service2024!Support#');
  console.log('');



  // Display created users
  console.log('\n📋 Created Users:');
  console.log('-------------------');
  console.log(`👑 Admin 1: ${admin1.email} (${admin1.name})`);
  console.log(`👑 Admin 2: ${admin2.email} (${admin2.name})`);
  console.log(`🎨 Artist 1: ${artist1.email} (${artist1.name})`);
  console.log(`🎨 Artist 2: ${artist2.email} (${artist2.name})`);
  console.log(`⚙️  Operator 1: ${operator1.email} (${operator1.name})`);
  console.log(`⚙️  Operator 2: ${operator2.email} (${operator2.name})`);
  console.log(`🤝 Social Worker 1: ${socialWorker1.email} (${socialWorker1.name})`);
  console.log(`🤝 Social Worker 2: ${socialWorker2.email} (${socialWorker2.name})`);
  console.log(`👤 Customer 1: ${customer1.email} (${customer1.name})`);
  console.log(`👤 Customer 2: ${customer2.email} (${customer2.name})`);
  console.log(`🔧 Service 1: ${service1.email} (${service1.name})`);
  console.log(`🔧 Service 2: ${service2.email} (${service2.name})`);


  console.log('\n🌱 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

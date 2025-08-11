/**
 * ROLE-BASED ACCESS CONTROL (RBAC) SEEDING SCRIPT - ArtistryHub
 * 
 * ⚠️  IMPORTANT: TESTING ONLY - DO NOT MODIFY USER NAMES OR PASSWORDS
 * 
 * PURPOSE:
 * This script creates test users specifically for testing role-based access control
 * and permission systems. It focuses on creating users with different roles to
 * test authorization flows and access restrictions across the platform.
 * 
 * SECURITY NOTES:
 * - All passwords are securely hashed using bcrypt with 12 salt rounds
 * - These are TEST accounts only - NEVER use in production
 * - User names and passwords are standardized and should not be changed
 * - Every run DELETES existing data and creates fresh test users
 * 
 * CREATED USERS:
 * - Admin: Full platform access for system administration
 * - Artist: Creative platform access for portfolio management
 * - Operator: Order fulfillment and inventory management access
 * - Social Worker: Community outreach and support services access
 * - Customer: E-commerce store access for shopping
 * - Service: Support and technical assistance access
 * 
 * RBAC TESTING:
 * - Role-based access control
 * - Permission enforcement
 * - Route protection
 * - Middleware authorization
 * - App-specific access restrictions
 * 
 * USAGE:
 * - Run with: yarn seed:rbac
 * - Use this for testing role-based access control and permissions
 * - Perfect for testing authorization flows and access restrictions
 * 
 * DATABASE REQUIREMENTS:
 * - Prisma client must be generated
 * - Database must be running and accessible
 * - User table must exist with proper schema
 * 
 * DEPENDENCIES:
 * - @prisma/client: Database ORM
 * - @artistryhub/auth: Password hashing utility
 * 
 * ⚠️  WARNING: This script DELETES all existing data and recreates it.
 * ⚠️  Only use in development/testing environments.
 */

import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '@artistryhub/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RBAC database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.serviceToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany(); // Delete ALL existing users including customers
  await prisma.address.deleteMany();
  console.log('✅ All existing users deleted (including customers)');

  // Create test users with different roles
  console.log('👥 Creating test users...');

  // Admin user
  const adminPassword = await hashPassword('Admin2024!Secure#');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      name: 'Test Admin',
      role: 'admin',
      status: 'ACTIVE',
      hashedPassword: adminPassword,
    },
  });

  // Artist user
  const artistPassword = await hashPassword('Artist2024!Creative#');
  const artist = await prisma.user.create({
    data: {
      email: 'artist@test.com',
      name: 'Test Artist',
      role: 'artist',
      status: 'ACTIVE',
      hashedPassword: artistPassword,
    },
  });

  // Operator user
  const operatorPassword = await hashPassword('Operator2024!Work#');
  const operator = await prisma.user.create({
    data: {
      email: 'operator@test.com',
      name: 'Test Operator',
      role: 'operator',
      status: 'ACTIVE',
      hashedPassword: operatorPassword,
    },
  });

  // Social Worker user
  const socialWorkerPassword = await hashPassword('Social2024!Help#');
  const socialWorker = await prisma.user.create({
    data: {
      email: 'social@test.com',
      name: 'Test Social Worker',
      role: 'social_worker',
      status: 'ACTIVE',
      hashedPassword: socialWorkerPassword,
    },
  });

  // Customer users - RECREATED EVERY TIME (deleted and reinserted)
  const customer1Password = await hashPassword('Customer2024!Shop#');
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      name: 'Test Customer',
      role: 'customer',
      status: 'ACTIVE',
      hashedPassword: customer1Password,
    },
  });

  // Service user
  const servicePassword = await hashPassword('Service2024!Support#');
  const service = await prisma.user.create({
    data: {
      email: 'service@test.com',
      name: 'Test Service',
      role: 'service',
      status: 'ACTIVE',
      hashedPassword: servicePassword,
    },
  });

  console.log('✅ RBAC Database seeding completed successfully!');
  console.log('\n📋 Test users created:');
  console.log(`👑 Admin: ${admin.email} (password: Admin2024!Secure#)`);
  console.log(`🎨 Artist: ${artist.email} (password: Artist2024!Creative#)`);
  console.log(`⚙️ Operator: ${operator.email} (password: Operator2024!Work#)`);
  console.log(`🤝 Social Worker: ${socialWorker.email} (password: Social2024!Help#)`);
  console.log(`🛒 Customer: ${customer1.email} (password: Customer2024!Shop#)`);
  console.log(`🔧 Service: ${service.email} (password: Service2024!Support#)`);
  console.log('\n💡 You can now test the RBAC system with these accounts!');
  console.log('\n🚀 Test the system:');
  console.log('1. Store app (http://localhost:3000) - Register new users, login as customers');
  console.log('2. Admin app (http://localhost:3001) - Login as admin to manage users');
  console.log('3. Artist app (http://localhost:3002) - Login as artist');
  console.log('4. Operator app (http://localhost:3003) - Login as operator');
  console.log('5. Social Worker app (http://localhost:3004) - Login as social worker');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

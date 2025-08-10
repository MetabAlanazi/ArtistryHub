import { PrismaClient } from '@prisma/client';
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
  await prisma.user.deleteMany();
  await prisma.address.deleteMany();

  // Create test users with different roles
  console.log('👥 Creating test users...');

  // Admin user
  const adminPassword = await hashPassword('admin123');
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
  const artistPassword = await hashPassword('artist123');
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
  const operatorPassword = await hashPassword('operator123');
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
  const socialWorkerPassword = await hashPassword('social123');
  const socialWorker = await prisma.user.create({
    data: {
      email: 'social@test.com',
      name: 'Test Social Worker',
      role: 'social_worker',
      status: 'ACTIVE',
      hashedPassword: socialWorkerPassword,
    },
  });

  // Customer users
  const customer1Password = await hashPassword('customer123');
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
  const servicePassword = await hashPassword('service123');
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
  console.log(`👑 Admin: ${admin.email} (password: admin123)`);
  console.log(`🎨 Artist: ${artist.email} (password: artist123)`);
  console.log(`⚙️ Operator: ${operator.email} (password: operator123)`);
  console.log(`🤝 Social Worker: ${socialWorker.email} (password: social123)`);
  console.log(`🛒 Customer: ${customer1.email} (password: customer123)`);
  console.log(`🔧 Service: ${service.email} (password: service123)`);
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

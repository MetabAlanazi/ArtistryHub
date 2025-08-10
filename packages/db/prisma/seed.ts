import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (only for tables that exist)
  console.log('🧹 Clearing existing data...');
  try {
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.address.deleteMany();
  } catch (error) {
    console.log('⚠️  Some tables may not exist yet, continuing...');
  }

  // Create sample users with different roles
  console.log('👥 Creating sample users...');

  // Admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@artistryhub.com',
      name: 'System Administrator',
      role: 'admin',
      status: 'ACTIVE',
    },
  });

  // Artist users
  const artist1 = await prisma.user.create({
    data: {
      email: 'artist1@artistryhub.com',
      name: 'Creative Artist 1',
      role: 'artist',
      status: 'ACTIVE',
    },
  });

  const artist2 = await prisma.user.create({
    data: {
      email: 'artist2@artistryhub.com',
      name: 'Creative Artist 2',
      role: 'artist',
      status: 'ACTIVE',
    },
  });

  // Operator user
  const operator = await prisma.user.create({
    data: {
      email: 'operator@artistryhub.com',
      name: 'Gallery Operator',
      role: 'operator',
      status: 'ACTIVE',
    },
  });

  // Social Worker user
  const socialWorker = await prisma.user.create({
    data: {
      email: 'social@artistryhub.com',
      name: 'Community Social Worker',
      role: 'social_worker',
      status: 'ACTIVE',
    },
  });

  // Customer users
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      name: 'John Doe',
      role: 'customer',
      status: 'ACTIVE',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      name: 'Jane Smith',
      role: 'customer',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Users created successfully!');

  // Create sample addresses
  console.log('🏠 Creating sample addresses...');

  const adminAddress = await prisma.address.create({
    data: {
      userId: admin.id,
      line1: '123 Admin Street',
      city: 'Admin City',
      country: 'Admin Country',
      phone: '+1234567890',
      isDefault: true,
    },
  });

  const artist1Address = await prisma.address.create({
    data: {
      userId: artist1.id,
      line1: '456 Artist Lane',
      city: 'Creative City',
      country: 'Art Country',
      phone: '+1234567891',
      isDefault: true,
    },
  });

  const artist2Address = await prisma.address.create({
    data: {
      userId: artist2.id,
      line1: '789 Artist Road',
      city: 'Artistic City',
      country: 'Creative Country',
      phone: '+1234567892',
      isDefault: true,
    },
  });

  const operatorAddress = await prisma.address.create({
    data: {
      userId: operator.id,
      line1: '321 Operator Blvd',
      city: 'Gallery City',
      country: 'Art Country',
      phone: '+1234567893',
      isDefault: true,
    },
  });

  const socialWorkerAddress = await prisma.address.create({
    data: {
      userId: socialWorker.id,
      line1: '654 Social Ave',
      city: 'Community City',
      country: 'Social Country',
      phone: '+1234567894',
      isDefault: true,
    },
  });

  const customer1Address = await prisma.address.create({
    data: {
      userId: customer1.id,
      line1: '987 Customer Way',
      city: 'Customer City',
      country: 'Customer Country',
      phone: '+1234567895',
      isDefault: true,
    },
  });

  const customer2Address = await prisma.address.create({
    data: {
      userId: customer2.id,
      line1: '147 Customer Drive',
      city: 'Client City',
      country: 'Client Country',
      phone: '+1234567896',
      isDefault: true,
    },
  });

  console.log('✅ Addresses created successfully!');

  // Display created users
  console.log('\n📋 Created Users:');
  console.log('-------------------');
  console.log(`👑 Admin: ${admin.email} (${admin.name})`);
  console.log(`🎨 Artist 1: ${artist1.email} (${artist1.name})`);
  console.log(`🎨 Artist 2: ${artist2.email} (${artist2.name})`);
  console.log(`⚙️  Operator: ${operator.email} (${operator.name})`);
  console.log(`🤝 Social Worker: ${socialWorker.email} (${socialWorker.name})`);
  console.log(`👤 Customer 1: ${customer1.email} (${customer1.name})`);
  console.log(`👤 Customer 2: ${customer2.email} (${customer2.name})`);
  console.log('\n⚠️  Note: These users have no passwords set yet.');
  console.log('   You will need to implement password authentication separately.');

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

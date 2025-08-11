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

  // Admin users
  const admin1 = await prisma.user.create({
    data: {
      email: 'admin1@artistryhub.com',
      name: 'System Administrator',
      role: 'admin',
      status: 'ACTIVE',
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'admin2@artistryhub.com',
      name: 'Platform Manager',
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

  // Operator users
  const operator1 = await prisma.user.create({
    data: {
      email: 'operator1@artistryhub.com',
      name: 'Gallery Operator',
      role: 'operator',
      status: 'ACTIVE',
    },
  });

  const operator2 = await prisma.user.create({
    data: {
      email: 'operator2@artistryhub.com',
      name: 'Fulfillment Manager',
      role: 'operator',
      status: 'ACTIVE',
    },
  });

  // Social Worker users
  const socialWorker1 = await prisma.user.create({
    data: {
      email: 'social1@artistryhub.com',
      name: 'Community Social Worker',
      role: 'social_worker',
      status: 'ACTIVE',
    },
  });

  const socialWorker2 = await prisma.user.create({
    data: {
      email: 'social2@artistryhub.com',
      name: 'Outreach Coordinator',
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

  // Service users
  const service1 = await prisma.user.create({
    data: {
      email: 'service1@artistryhub.com',
      name: 'Support Agent',
      role: 'service',
      status: 'ACTIVE',
    },
  });

  const service2 = await prisma.user.create({
    data: {
      email: 'service2@artistryhub.com',
      name: 'Technical Specialist',
      role: 'service',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Users created successfully!');

  // Create sample addresses
  console.log('🏠 Creating sample addresses...');

  const admin1Address = await prisma.address.create({
    data: {
      userId: admin1.id,
      line1: '123 Admin Street',
      city: 'Admin City',
      country: 'Admin Country',
      phone: '+1234567890',
      isDefault: true,
    },
  });

  const admin2Address = await prisma.address.create({
    data: {
      userId: admin2.id,
      line1: '456 Admin Avenue',
      city: 'Management City',
      country: 'Admin Country',
      phone: '+1234567891',
      isDefault: true,
    },
  });

  const artist1Address = await prisma.address.create({
    data: {
      userId: artist1.id,
      line1: '789 Artist Lane',
      city: 'Creative City',
      country: 'Art Country',
      phone: '+1234567892',
      isDefault: true,
    },
  });

  const artist2Address = await prisma.address.create({
    data: {
      userId: artist2.id,
      line1: '321 Artist Road',
      city: 'Artistic City',
      country: 'Creative Country',
      phone: '+1234567893',
      isDefault: true,
    },
  });

  const operator1Address = await prisma.address.create({
    data: {
      userId: operator1.id,
      line1: '654 Operator Blvd',
      city: 'Gallery City',
      country: 'Art Country',
      phone: '+1234567894',
      isDefault: true,
    },
  });

  const operator2Address = await prisma.address.create({
    data: {
      userId: operator2.id,
      line1: '987 Operator Drive',
      city: 'Fulfillment City',
      country: 'Art Country',
      phone: '+1234567895',
      isDefault: true,
    },
  });

  const socialWorker1Address = await prisma.address.create({
    data: {
      userId: socialWorker1.id,
      line1: '147 Social Ave',
      city: 'Community City',
      country: 'Social Country',
      phone: '+1234567896',
      isDefault: true,
    },
  });

  const socialWorker2Address = await prisma.address.create({
    data: {
      userId: socialWorker2.id,
      line1: '258 Social Street',
      city: 'Outreach City',
      country: 'Social Country',
      phone: '+1234567897',
      isDefault: true,
    },
  });

  const customer1Address = await prisma.address.create({
    data: {
      userId: customer1.id,
      line1: '369 Customer Way',
      city: 'Customer City',
      country: 'Customer Country',
      phone: '+1234567898',
      isDefault: true,
    },
  });

  const customer2Address = await prisma.address.create({
    data: {
      userId: customer2.id,
      line1: '741 Customer Drive',
      city: 'Client City',
      country: 'Client Country',
      phone: '+1234567899',
      isDefault: true,
    },
  });

  const service1Address = await prisma.address.create({
    data: {
      userId: service1.id,
      line1: '852 Service Road',
      city: 'Support City',
      country: 'Service Country',
      phone: '+1234567900',
      isDefault: true,
    },
  });

  const service2Address = await prisma.address.create({
    data: {
      userId: service2.id,
      line1: '963 Service Lane',
      city: 'Technical City',
      country: 'Service Country',
      phone: '+1234567901',
      isDefault: true,
    },
  });

  console.log('✅ Addresses created successfully!');

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

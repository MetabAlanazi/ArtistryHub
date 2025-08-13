import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔐 Resetting admin user credentials...');
    
    const hash = await bcrypt.hash('Admin2024!Secure#', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@artistryhub.com' },
      update: { 
        hashedPassword: hash, 
        role: 'admin', 
        status: 'ACTIVE',
        name: 'System Administrator'
      },
      create: {
        id: 'admin_001',
        email: 'admin@artistryhub.com',
        name: 'System Administrator',
        hashedPassword: hash,
        role: 'admin',
        status: 'ACTIVE',
      },
    });

    console.log('✅ Admin user ready!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Role: ${adminUser.role}`);
    console.log(`📊 Status: ${adminUser.status}`);
    console.log(`🆔 ID: ${adminUser.id}`);
    console.log('\n🔑 Login credentials:');
    console.log('   Email: admin@artistryhub.com');
    console.log('   Password: Admin2024!Secure#');

    // Also ensure other test users exist
    const testUsers = [
      {
        email: 'operator@artistryhub.com',
        name: 'Operations Manager',
        password: 'Operator2024!Secure#',
        role: 'operator'
      },
      {
        email: 'artist@artistryhub.com',
        name: 'Sarah Ahmed',
        password: 'Artist2024!Secure#',
        role: 'artist'
      },
      {
        email: 'customer@artistryhub.com',
        name: 'John Doe',
        password: 'Customer2024!Secure#',
        role: 'customer'
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            hashedPassword: hashedPassword,
            role: userData.role,
            status: 'ACTIVE',
          }
        });
        console.log(`✅ ${userData.role} user created: ${user.email}`);
      } else {
        console.log(`ℹ️ ${userData.role} user already exists: ${userData.email}`);
      }
    }

  } catch (error) {
    console.error('❌ Error resetting admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

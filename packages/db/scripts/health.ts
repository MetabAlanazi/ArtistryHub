import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://root:root@localhost:3307/art_commerce'
    }
  }
});

async function healthCheck() {
  try {
    console.log('🔍 Running database health check...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Basic connection test:', result);
    
    // Test common_user table access
    const userCount = await prisma.user.count();
    console.log(`✅ common_user table accessible, found ${userCount} users`);
    
    // Test specific query
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true
      },
      take: 3
    });
    
    console.log('✅ Sample users:', users);
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

healthCheck();

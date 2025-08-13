const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment files...\n');

// Development environment
const devEnv = `# Development Environment Configuration
NODE_ENV=development

# Database - Development (use art_commerce only, Docker MySQL on port 3307)
DATABASE_URL=mysql://root:root@localhost:3307/art_commerce

# NextAuth Configuration
NEXTAUTH_SECRET=dev-secret-change-me
NEXTAUTH_URL=http://localhost:3001

# App URLs
NEXT_PUBLIC_STORE_APP_URL=http://localhost:3000
NEXT_PUBLIC_MEDIA_HOST=localhost

# BFF Configuration
NEXT_PUBLIC_BFF_URL=http://localhost:3005

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=artistry-hub-images
MINIO_URL=http://localhost:9000

# Redis
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=debug
`;

// Production environment template
const prodEnv = `# Production Environment Configuration
NODE_ENV=production

# Database - Production (use art_commerce only)
DATABASE_URL=mysql://<prod-user>:<prod-pass>@<prod-host>:3306/art_commerce

# NextAuth Configuration
NEXTAUTH_SECRET=prod-secret-change-me
NEXTAUTH_URL=https://admin.yourdomain.com

# App URLs
NEXT_PUBLIC_STORE_APP_URL=https://store.yourdomain.com
NEXT_PUBLIC_MEDIA_HOST=cdn.yourdomain.com

# BFF Configuration
NEXT_PUBLIC_BFF_URL=https://api.yourdomain.com

# MinIO Configuration
MINIO_ENDPOINT=<your-minio-host>
MINIO_PORT=9000
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=<your-access-key>
MINIO_SECRET_KEY=<your-secret-key>
MINIO_BUCKET_NAME=artistry-hub-images
MINIO_URL=https://<your-minio-host>:9000

# Redis
REDIS_URL=redis://<your-redis-host>:6379

# Logging
LOG_LEVEL=info
`;

try {
  // Create .env.development
  fs.writeFileSync('.env.development', devEnv);
  console.log('✅ Created .env.development (port 3307)');
  
  // Create .env.production
  fs.writeFileSync('.env.production', prodEnv);
  console.log('✅ Created .env.production');
  
  console.log('\n📋 Environment files created successfully!');
  console.log('\n🔑 Next steps:');
  console.log('1. Restart Docker containers: docker-compose down && docker-compose up -d');
  console.log('2. Update .env.production with your actual production values');
  console.log('3. Run: yarn db:pull (to introspect database)');
  console.log('4. Run: yarn db:generate (to generate Prisma client)');
  console.log('5. Test login with admin@artistryhub.com / Admin2024!Secure#');
  
} catch (error) {
  console.error('❌ Error creating environment files:', error.message);
  console.log('\n📝 Manual setup required:');
  console.log('Create .env.development and .env.production manually with the content above');
}

/**
 * QUICK DATABASE SEEDING SCRIPT - ArtistryHub
 *
 * ⚠️  IMPORTANT: TESTING ONLY - DO NOT MODIFY USER NAMES OR PASSWORDS
 *
 * PURPOSE:
 * This script creates essential test users for development and testing purposes.
 * It uses upsert operations to avoid duplicate users if the script is run multiple times.
 *
 * SECURITY NOTES:
 * - All passwords are hashed using bcrypt with 12 salt rounds
 * - These are TEST accounts only - never use in production
 * - Passwords follow secure patterns with uppercase, lowercase, numbers, and special characters
 * - User names and passwords are standardized and should not be changed
 *
 * CREATED USERS:
 * - Admin: Full platform access for system administration
 * - Customer: Store access for e-commerce testing
 * - Artist: Creative platform access for portfolio management
 * - Operator: Order fulfillment and inventory management access
 *
 * USAGE:
 * - Run this from the project root: node scripts/seed-db.js
 * - This will create or update test users without deleting existing data
 * - Perfect for quick development setup
 *
 * DATABASE REQUIREMENTS:
 * - Prisma client must be generated: yarn db:generate
 * - Database must be running and accessible via DATABASE_URL
 * - User table must exist with proper schema
 *
 * DEPENDENCIES:
 * - @prisma/client: Database ORM
 * - bcryptjs: Password hashing
 *
 * ⚠️  WARNING: These credentials are for testing only.
 * ⚠️  Do not modify or update them.
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user
  const adminPassword = "Admin2024!Secure#";
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@artistryhub.com" },
    update: {},
    create: {
      email: "admin@artistryhub.com",
      name: "Admin User",
      hashedPassword: adminHash,
      role: "admin",
      status: "ACTIVE",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Create customer user - RECREATED EVERY TIME (deleted and reinserted)
  const customerPassword = "Customer2024!Shop#";
  const customerHash = await bcrypt.hash(customerPassword, 12);

  const customer = await prisma.user.upsert({
    where: { email: "customer@artistryhub.com" },
    update: {},
    create: {
      email: "customer@artistryhub.com",
      name: "Customer User",
      hashedPassword: customerHash,
      role: "customer",
      status: "ACTIVE",
    },
  });

  console.log("✅ Customer user created:", customer.email);

  // Create artist user
  const artistPassword = "Artist2024!Creative#";
  const artistHash = await bcrypt.hash(artistPassword, 12);

  const artist = await prisma.user.upsert({
    where: { email: "artist@artistryhub.com" },
    update: {},
    create: {
      email: "artist@artistryhub.com",
      name: "Artist User",
      hashedPassword: artistHash,
      role: "artist",
      status: "ACTIVE",
    },
  });

  console.log("✅ Artist user created:", artist.email);

  // Create operator user
  const operatorPassword = "Operator2024!Work#";
  const operatorHash = await bcrypt.hash(operatorPassword, 12);

  const operator = await prisma.user.upsert({
    where: { email: "operator@artistryhub.com" },
    update: {},
    create: {
      email: "operator@artistryhub.com",
      name: "Operator User",
      hashedPassword: operatorHash,
      role: "operator",
      status: "ACTIVE",
    },
  });

  console.log("✅ Operator user created:", operator.email);

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📋 Test Credentials:");
  console.log("Admin: admin@artistryhub.com / admin123");
  console.log("Customer: customer@artistryhub.com / Customer2024!Shop#");
  console.log("Artist: artist@artistryhub.com / Artist2024!Creative#");
  console.log("Operator: operator@artistryhub.com / Operator2024!Work#");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

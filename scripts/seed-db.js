#!/usr/bin/env node

/**
 * Quick database seeding script for ArtistryHub
 * Run this from the project root to seed the database with test data
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user
  const adminPassword = "admin123";
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

  // Create customer user
  const customerPassword = "customer123";
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
  const artistPassword = "artist123";
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
  const operatorPassword = "operator123";
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
  console.log("Customer: customer@artistryhub.com / customer123");
  console.log("Artist: artist@artistryhub.com / artist123");
  console.log("Operator: operator@artistryhub.com / operator123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

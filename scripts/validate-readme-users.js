/**
 * README User Validation Script
 *
 * This script validates that the database contains exactly the users
 * documented in the README with the correct credentials.
 */

const { prisma } = require("@artistry-hub/db");
const bcrypt = require("bcryptjs");

// Expected users from README
const expectedUsers = [
  {
    email: "admin@artistryhub.com",
    name: "System Administrator",
    role: "admin",
    password: "Admin2024!Secure#",
  },
  {
    email: "admin2@artistryhub.com",
    name: "Platform Manager",
    role: "admin",
    password: "Admin2024!Secure#",
  },
  {
    email: "artist1@artistryhub.com",
    name: "Creative Artist 1",
    role: "artist",
    password: "Artist2024!Creative#",
  },
  {
    email: "artist2@artistryhub.com",
    name: "Creative Artist 2",
    role: "artist",
    password: "Artist2024!Creative#",
  },
  {
    email: "operator1@artistryhub.com",
    name: "Service Operator 1",
    role: "operator",
    password: "Operator2024!Work#",
  },
  {
    email: "operator2@artistryhub.com",
    name: "Service Operator 2",
    role: "operator",
    password: "Operator2024!Work#",
  },
  {
    email: "social1@artistryhub.com",
    name: "Social Worker 1",
    role: "social_worker",
    password: "Social2024!Help#",
  },
  {
    email: "social2@artistryhub.com",
    name: "Social Worker 2",
    role: "social_worker",
    password: "Social2024!Help#",
  },
  {
    email: "customer1@example.com",
    name: "Test Customer 1",
    role: "customer",
    password: "Customer2024!Shop#",
  },
  {
    email: "customer2@example.com",
    name: "Test Customer 2",
    role: "customer",
    password: "Customer2024!Shop#",
  },
  {
    email: "service1@artistryhub.com",
    name: "Service Account 1",
    role: "service",
    password: "Service2024!Support#",
  },
  {
    email: "service2@artistryhub.com",
    name: "Service Account 2",
    role: "service",
    password: "Service2024!Support#",
  },
];

async function validateUsers() {
  console.log("🔍 Validating README users against database...\n");

  try {
    // Get all users from database
    const dbUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        hashedPassword: true,
        status: true,
        emailVerified: true,
      },
    });

    console.log(`📊 Database contains ${dbUsers.length} users\n`);

    // Validate each expected user
    let validationErrors = 0;
    let validationSuccess = 0;

    for (const expectedUser of expectedUsers) {
      const dbUser = dbUsers.find((u) => u.email === expectedUser.email);

      if (!dbUser) {
        console.log(`❌ MISSING: ${expectedUser.email} (${expectedUser.role})`);
        validationErrors++;
        continue;
      }

      // Validate password
      const isValidPassword = await bcrypt.compare(
        expectedUser.password,
        dbUser.hashedPassword
      );

      if (!isValidPassword) {
        console.log(
          `❌ PASSWORD MISMATCH: ${expectedUser.email} - Expected: ${expectedUser.password}`
        );
        validationErrors++;
        continue;
      }

      // Validate role
      if (dbUser.role !== expectedUser.role) {
        console.log(
          `❌ ROLE MISMATCH: ${expectedUser.email} - Expected: ${expectedUser.role}, Got: ${dbUser.role}`
        );
        validationErrors++;
        continue;
      }

      // Validate status
      if (dbUser.status !== "ACTIVE") {
        console.log(
          `❌ STATUS MISMATCH: ${expectedUser.email} - Expected: ACTIVE, Got: ${dbUser.status}`
        );
        validationErrors++;
        continue;
      }

      console.log(
        `✅ VALID: ${expectedUser.email} (${expectedUser.role}) - ID: ${dbUser.id}`
      );
      validationSuccess++;
    }

    // Check for extra users
    const expectedEmails = expectedUsers.map((u) => u.email);
    const extraUsers = dbUsers.filter((u) => !expectedEmails.includes(u.email));

    if (extraUsers.length > 0) {
      console.log(`\n⚠️  EXTRA USERS (${extraUsers.length}):`);
      extraUsers.forEach((user) => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📋 VALIDATION SUMMARY:");
    console.log(`✅ Valid users: ${validationSuccess}`);
    console.log(`❌ Errors: ${validationErrors}`);
    console.log(`📊 Total expected: ${expectedUsers.length}`);
    console.log(`📊 Total in database: ${dbUsers.length}`);
    console.log(`📊 Extra users: ${extraUsers.length}`);

    if (validationErrors === 0 && extraUsers.length === 0) {
      console.log("\n🎉 SUCCESS: Database perfectly matches README!");
    } else {
      console.log("\n⚠️  ISSUES FOUND: Database does not match README exactly");
    }
  } catch (error) {
    console.error("❌ Validation error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run validation
validateUsers();

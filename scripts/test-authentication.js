/**
 * Authentication Test Script
 *
 * This script tests that the authentication system works correctly
 * with the README user credentials.
 */

const { prisma } = require("@artistry-hub/db");
const bcrypt = require("bcryptjs");

// Test user credentials from README
const testUsers = [
  {
    email: "admin@artistryhub.com",
    password: "Admin2024!Secure#",
    role: "admin",
  },
  {
    email: "artist1@artistryhub.com",
    password: "Artist2024!Creative#",
    role: "artist",
  },
  {
    email: "customer1@example.com",
    password: "Customer2024!Shop#",
    role: "customer",
  },
];

async function testAuthentication() {
  console.log("🔐 Testing authentication with README credentials...\n");

  try {
    for (const testUser of testUsers) {
      console.log(`🧪 Testing: ${testUser.email} (${testUser.role})`);

      // Find user in database
      const dbUser = await prisma.user.findUnique({
        where: { email: testUser.email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          hashedPassword: true,
          status: true,
        },
      });

      if (!dbUser) {
        console.log(`❌ USER NOT FOUND: ${testUser.email}`);
        continue;
      }

      // Test password verification
      const isValidPassword = await bcrypt.compare(
        testUser.password,
        dbUser.hashedPassword
      );

      if (!isValidPassword) {
        console.log(`❌ PASSWORD VERIFICATION FAILED: ${testUser.email}`);
        continue;
      }

      // Test role validation
      if (dbUser.role !== testUser.role) {
        console.log(
          `❌ ROLE MISMATCH: Expected ${testUser.role}, got ${dbUser.role}`
        );
        continue;
      }

      // Test status validation
      if (dbUser.status !== "ACTIVE") {
        console.log(`❌ STATUS INVALID: ${dbUser.status}`);
        continue;
      }

      console.log(`✅ AUTHENTICATION SUCCESS: ${testUser.email}`);
      console.log(`   - ID: ${dbUser.id}`);
      console.log(`   - Name: ${dbUser.name}`);
      console.log(`   - Role: ${dbUser.role}`);
      console.log(`   - Status: ${dbUser.status}`);
      console.log("");
    }

    console.log("🎯 Testing app access permissions...\n");

    // Test app access based on roles
    const appAccessTests = [
      { user: "admin@artistryhub.com", app: "Store (3000)", expected: true },
      { user: "admin@artistryhub.com", app: "Admin (3001)", expected: true },
      { user: "admin@artistryhub.com", app: "Artist (3002)", expected: true },
      { user: "admin@artistryhub.com", app: "Operator (3003)", expected: true },
      {
        user: "admin@artistryhub.com",
        app: "Social Worker (3004)",
        expected: true,
      },

      { user: "artist1@artistryhub.com", app: "Store (3000)", expected: true },
      { user: "artist1@artistryhub.com", app: "Admin (3001)", expected: false },
      { user: "artist1@artistryhub.com", app: "Artist (3002)", expected: true },
      {
        user: "artist1@artistryhub.com",
        app: "Operator (3003)",
        expected: false,
      },
      {
        user: "artist1@artistryhub.com",
        app: "Social Worker (3004)",
        expected: false,
      },

      { user: "customer1@example.com", app: "Store (3000)", expected: true },
      { user: "customer1@example.com", app: "Admin (3001)", expected: false },
      { user: "customer1@example.com", app: "Artist (3002)", expected: false },
      {
        user: "customer1@example.com",
        app: "Operator (3003)",
        expected: false,
      },
      {
        user: "customer1@example.com",
        app: "Social Worker (3004)",
        expected: false,
      },
    ];

    for (const test of appAccessTests) {
      const user = await prisma.user.findUnique({
        where: { email: test.user },
        select: { role: true },
      });

      if (!user) {
        console.log(`❌ USER NOT FOUND: ${test.user}`);
        continue;
      }

      let hasAccess = false;

      // Check access based on role
      if (test.app.includes("Store")) {
        hasAccess = true; // All users can access store
      } else if (test.app.includes("Admin")) {
        hasAccess = user.role === "ADMIN";
      } else if (test.app.includes("Artist")) {
        hasAccess = ["admin", "artist"].includes(user.role);
      } else if (test.app.includes("Operator")) {
        hasAccess = ["admin", "operator"].includes(user.role);
      } else if (test.app.includes("Social Worker")) {
        hasAccess = ["admin", "social_worker"].includes(user.role);
      }

      const status = hasAccess === test.expected ? "✅" : "❌";
      console.log(
        `${status} ${test.user} (${user.role}) -> ${test.app}: ${hasAccess ? "ACCESS" : "DENIED"}`
      );
    }

    console.log("\n🎉 Authentication and access control tests completed!");
  } catch (error) {
    console.error("❌ Test error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testAuthentication();

const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

async function testLogin() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "art_commerce",
  });

  try {
    console.log("🔐 Testing admin login credentials...\n");

    // Test credentials from README
    const testEmail = "admin@artistryhub.com";
    const testPassword = "Admin2024!Secure#";

    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Password: ${testPassword}\n`);

    // Get user from database
    const [users] = await connection.execute(
      "SELECT * FROM common_user WHERE email = ?",
      [testEmail]
    );

    if (users.length === 0) {
      console.log("❌ User not found in database");
      return;
    }

    const user = users[0];
    console.log(`✅ User found: ${user.name} (${user.role})`);
    console.log(`📅 Created: ${user.createdAt}`);
    console.log(`📊 Status: ${user.status}\n`);

    // Test password verification
    const isValidPassword = await bcrypt.compare(
      testPassword,
      user.hashedPassword
    );

    if (isValidPassword) {
      console.log("🎉 Password verification successful!");
      console.log("✅ Login credentials are working correctly");
    } else {
      console.log("❌ Password verification failed");
      console.log("🔍 The password hash in the database may be incorrect");
    }

    // Show all available users for reference
    console.log("\n📋 All available users:");
    const [allUsers] = await connection.execute(
      "SELECT email, name, role, status FROM common_user ORDER BY role, name"
    );

    allUsers.forEach((user) => {
      console.log(`  • ${user.email} (${user.role}) - ${user.status}`);
    });
  } catch (error) {
    console.error("❌ Error testing login:", error);
  } finally {
    await connection.end();
  }
}

testLogin();

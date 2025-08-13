const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

async function resetAdmin() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "art_commerce",
  });

  try {
    console.log("🔐 Resetting admin user credentials...");

    const hash = await bcrypt.hash("Admin2024!Secure#", 12);

    // Check if admin user exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM common_user WHERE email = ?",
      ["admin@artistryhub.com"]
    );

    if (existingUsers.length > 0) {
      // Update existing admin user
      await connection.execute(
        "UPDATE common_user SET hashedPassword = ?, role = ?, status = ? WHERE email = ?",
        [hash, "admin", "ACTIVE", "admin@artistryhub.com"]
      );
      console.log("✅ Admin user updated successfully!");
    } else {
      // Create new admin user
      const userId = "admin_" + Date.now();
      await connection.execute(
        "INSERT INTO common_user (id, email, name, hashedPassword, role, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [
          userId,
          "admin@artistryhub.com",
          "System Administrator",
          hash,
          "admin",
          "ACTIVE",
        ]
      );
      console.log("✅ Admin user created successfully!");
    }

    console.log("\n🔑 Login credentials:");
    console.log("   Email: admin@artistryhub.com");
    console.log("   Password: Admin2024!Secure#");

    // Also ensure other test users exist
    const testUsers = [
      {
        email: "operator@artistryhub.com",
        name: "Operations Manager",
        password: "Operator2024!Secure#",
        role: "operator",
      },
      {
        email: "artist@artistryhub.com",
        name: "Sarah Ahmed",
        password: "Artist2024!Secure#",
        role: "artist",
      },
      {
        email: "customer@artistryhub.com",
        name: "John Doe",
        password: "Customer2024!Secure#",
        role: "customer",
      },
    ];

    for (const userData of testUsers) {
      const [existingUser] = await connection.execute(
        "SELECT * FROM common_user WHERE email = ?",
        [userData.email]
      );

      if (existingUser.length === 0) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const userId = userData.role + "_" + Date.now();
        await connection.execute(
          "INSERT INTO common_user (id, email, name, hashedPassword, role, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
          [
            userId,
            userData.email,
            userData.name,
            hashedPassword,
            userData.role,
            "ACTIVE",
          ]
        );
        console.log(`✅ ${userData.role} user created: ${userData.email}`);
      } else {
        console.log(
          `ℹ️ ${userData.role} user already exists: ${userData.email}`
        );
      }
    }

    // Show all users
    console.log("\n📋 All users in database:");
    const [allUsers] = await connection.execute(
      "SELECT email, name, role, status FROM common_user ORDER BY role, name"
    );
    allUsers.forEach((user) => {
      console.log(`  • ${user.email} (${user.role}) - ${user.status}`);
    });
  } catch (error) {
    console.error("❌ Error resetting admin user:", error);
  } finally {
    await connection.end();
    console.log("\n🔌 Database connection closed");
  }
}

resetAdmin();

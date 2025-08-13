const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "art_commerce",
  });

  try {
    console.log("🔌 Connected to database");

    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(191) PRIMARY KEY,
        email VARCHAR(191) UNIQUE NOT NULL,
        name VARCHAR(191),
        hashedPassword VARCHAR(191) NOT NULL,
        role ENUM('customer', 'artist', 'admin', 'operator', 'service', 'social_worker') DEFAULT 'customer',
        status VARCHAR(191) DEFAULT 'ACTIVE',
        permissionsVersion INT DEFAULT 0,
        lastLoginAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Users table created/verified");

    // Check if admin user exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      ["admin@artistryhub.com"]
    );

    if (existingUsers.length > 0) {
      console.log("ℹ️ Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("Admin2024!Secure#", 12);
    const userId = "admin_" + Date.now();

    await connection.execute(
      `
      INSERT INTO users (id, email, name, hashedPassword, role, status, permissionsVersion)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        userId,
        "admin@artistryhub.com",
        "System Administrator",
        hashedPassword,
        "admin",
        "ACTIVE",
        1,
      ]
    );

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@artistryhub.com");
    console.log("🔑 Password: Admin2024!Secure#");
    console.log("👤 Role: admin");

    // Create other test users
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
        "SELECT * FROM users WHERE email = ?",
        [userData.email]
      );

      if (existingUser.length === 0) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const userId =
          userData.role +
          "_" +
          Date.now() +
          Math.random().toString(36).substr(2, 9);

        await connection.execute(
          `
          INSERT INTO users (id, email, name, hashedPassword, role, status, permissionsVersion)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
          [
            userId,
            userData.email,
            userData.name,
            hashedPassword,
            userData.role,
            "ACTIVE",
            1,
          ]
        );

        console.log(`✅ ${userData.role} user created: ${userData.email}`);
      } else {
        console.log(
          `ℹ️ ${userData.role} user already exists: ${userData.email}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error setting up database:", error);
  } finally {
    await connection.end();
    console.log("🔌 Database connection closed");
  }
}

setupDatabase();

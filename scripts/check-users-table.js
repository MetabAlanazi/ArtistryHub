const mysql = require("mysql2/promise");

async function checkUsersTable() {
  try {
    console.log("🔌 Connecting to database...");

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "art_commerce",
    });

    console.log("✅ Connected to database successfully");

    // Check users table structure
    console.log("\n📋 Users table structure:");
    const [columns] = await connection.execute("DESCRIBE users");
    columns.forEach((col) => {
      console.log(
        `  • ${col.Field} (${col.Type}) ${col.Null === "NO" ? "NOT NULL" : ""}`
      );
    });

    // Check users table content
    console.log("\n👥 Users table content:");
    const [users] = await connection.execute("SELECT * FROM users");
    console.log(`Found ${users.length} users:`);
    users.forEach((user) => {
      console.log(`  • ${user.email} (${user.role}) - ${user.name}`);
    });

    await connection.end();
    console.log("\n🔌 Connection closed");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkUsersTable();

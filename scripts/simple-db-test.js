const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    console.log("🔌 Testing database connection...");

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "art_commerce",
    });

    console.log("✅ Connected to database successfully");

    const [tables] = await connection.execute("SHOW TABLES");
    console.log("📋 Tables found:", tables.length);
    tables.forEach((table) => {
      console.log(`  • ${Object.values(table)[0]}`);
    });

    await connection.end();
    console.log("🔌 Connection closed");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Error code:", error.code);
  }
}

testConnection();

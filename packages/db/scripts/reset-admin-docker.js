const { exec } = require("child_process");
const bcrypt = require("bcryptjs");
const util = require("util");
const execAsync = util.promisify(exec);

async function resetAdminDocker() {
  try {
    console.log("🔐 Resetting admin user credentials using Docker...");

    const hash = await bcrypt.hash("Admin2024!Secure#", 12);

    // Check if admin user exists
    const checkUserCmd = `docker exec artistryhub-mysql-1 mysql -u root -proot -e "USE art_commerce; SELECT COUNT(*) as count FROM common_user WHERE email = 'admin@artistryhub.com';"`;

    const { stdout: checkResult } = await execAsync(checkUserCmd);
    const userExists = checkResult.includes("1");

    if (userExists) {
      // Update existing admin user
      const updateCmd = `docker exec artistryhub-mysql-1 mysql -u root -proot -e "USE art_commerce; UPDATE common_user SET hashedPassword = '${hash}', role = 'admin', status = 'ACTIVE' WHERE email = 'admin@artistryhub.com';"`;
      await execAsync(updateCmd);
      console.log("✅ Admin user updated successfully!");
    } else {
      // Create new admin user
      const userId = "admin_" + Date.now();
      const createCmd = `docker exec artistryhub-mysql-1 mysql -u root -proot -e "USE art_commerce; INSERT INTO common_user (id, email, name, hashedPassword, role, status, createdAt, updatedAt) VALUES ('${userId}', 'admin@artistryhub.com', 'System Administrator', '${hash}', 'admin', 'ACTIVE', NOW(), NOW());"`;
      await execAsync(createCmd);
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
      const checkCmd = `docker exec artistryhub-mysql-1 mysql -u root -proot -e "USE art_commerce; SELECT COUNT(*) as count FROM common_user WHERE email = '${userData.email}';"`;
      const { stdout: checkOutput } = await execAsync(checkCmd);
      const exists = checkOutput.includes("1");

      if (!exists) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const userId = userData.role + "_" + Date.now();
        const insertCmd = `docker exec artistryhub-mysql-1 mysql -u root -proot -e "USE art_commerce; INSERT INTO common_user (id, email, name, hashedPassword, role, status, createdAt, updatedAt) VALUES ('${userId}', '${userData.email}', '${userData.name}', '${hashedPassword}', '${userData.role}', 'ACTIVE', NOW(), NOW());"`;
        await execAsync(insertCmd);
        console.log(`✅ ${userData.role} user created: ${userData.email}`);
      } else {
        console.log(
          `ℹ️ ${userData.role} user already exists: ${userData.email}`
        );
      }
    }

    // Show all users
    console.log("\n📋 All users in database:");
    const showUsersCmd = `docker exec artistryhub-mysql-1 mysql -u root -proot -e "USE art_commerce; SELECT email, name, role, status FROM common_user ORDER BY role, name;"`;
    const { stdout: usersOutput } = await execAsync(showUsersCmd);

    // Parse the output to show users nicely
    const lines = usersOutput.split("\n");
    let userLines = false;
    for (const line of lines) {
      if (line.includes("email")) userLines = true;
      else if (userLines && line.trim() && !line.includes("---")) {
        const parts = line.split("\t");
        if (parts.length >= 4) {
          console.log(`  • ${parts[0]} (${parts[2]}) - ${parts[3]}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error resetting admin user:", error.message);
  }
}

resetAdminDocker();

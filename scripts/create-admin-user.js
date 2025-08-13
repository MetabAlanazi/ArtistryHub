const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@artistryhub.com" },
    });

    if (existingUser) {
      console.log("Admin user already exists:", existingUser.email);
      return;
    }

    // Hash the password from README
    const hashedPassword = await bcrypt.hash("Admin2024!Secure#", 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@artistryhub.com",
        name: "System Administrator",
        hashedPassword: hashedPassword,
        role: "admin",
        status: "ACTIVE",
        permissionsVersion: 1,
      },
    });

    console.log("✅ Admin user created successfully:");
    console.log("Email:", adminUser.email);
    console.log("Role:", adminUser.role);
    console.log("ID:", adminUser.id);

    // Also create other test users
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
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            hashedPassword: hashedPassword,
            role: userData.role,
            status: "ACTIVE",
            permissionsVersion: 1,
          },
        });
        console.log(`✅ ${userData.role} user created:`, user.email);
      } else {
        console.log(`ℹ️ ${userData.role} user already exists:`, userData.email);
      }
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();

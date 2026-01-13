import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { config } from "dotenv";

// Load environment variables
config();

// Create connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@pack118.com";
  const password = "password123";
  const name = "Admin User";

  console.log("=================================");
  console.log("Creating Initial Admin User");
  console.log("=================================\n");

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`✓ Admin user already exists!`);
    console.log(`Email: ${existingUser.email}`);
    console.log(`Role: ${existingUser.role}`);
    console.log("\nYou can log in at /finances with the existing credentials.");
    return;
  }

  console.log("Creating admin user...");

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role: "ADMIN",
      emailVerified: true,
      accounts: {
        create: {
          accountId: `email-${email}`,
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  console.log("\n=================================");
  console.log("✓ Admin user created successfully!");
  console.log("=================================");
  console.log(`Email: ${user.email}`);
  console.log(`Password: password123`);
  console.log(`Role: ${user.role}`);
  console.log(`Name: ${user.name}`);
  console.log("\nYou can now log in at /finances with these credentials.");
  console.log("⚠️  Remember to change the password after first login!");
}

main()
  .catch((error) => {
    console.error("\nError creating admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

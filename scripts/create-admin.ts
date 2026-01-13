import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import * as readline from "readline";
import { config } from "dotenv";

// Load environment variables
config();

// Create connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("=================================");
  console.log("Create Initial Admin User");
  console.log("=================================\n");

  const email = await prompt("Email: ");

  if (!email || !email.includes("@")) {
    console.error("Error: Please provide a valid email address");
    process.exit(1);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.error(`\nError: User with email ${email} already exists!`);
    process.exit(1);
  }

  const password = await prompt("Password (min 8 characters): ");

  if (!password || password.length < 8) {
    console.error("Error: Password must be at least 8 characters");
    process.exit(1);
  }

  const name = await prompt("Name (optional, press Enter to skip): ");

  console.log("\nCreating admin user...");

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
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
  console.log(`Role: ${user.role}`);
  console.log(`Name: ${user.name || "Not set"}`);
  console.log("\nYou can now log in at /finances with these credentials.");
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

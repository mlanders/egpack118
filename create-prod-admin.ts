import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@pack118.com";
  const password = "password123";
  
  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existing) {
    console.log("Admin user already exists!");
    console.log("Email:", existing.email);
    console.log("Role:", existing.role);
    return;
  }
  
  const hashedPassword = await hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      name: "Admin",
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
  
  console.log("\nAdmin user created successfully!");
  console.log("Email:", user.email);
  console.log("Password: password123");
  console.log("Role:", user.role);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

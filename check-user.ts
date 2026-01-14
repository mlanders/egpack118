import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@pack118.com" },
    include: { accounts: true },
  });
  
  console.log("User found:", user ? "YES" : "NO");
  if (user) {
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Has account:", user.accounts.length > 0);
    console.log("Account info:", user.accounts[0] ? "Password hash exists: " + (user.accounts[0].password ? "YES" : "NO") : "No account");
  } else {
    console.log("\nNo user found. Let me check all users:");
    const allUsers = await prisma.user.findMany();
    console.log("Total users:", allUsers.length);
    allUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

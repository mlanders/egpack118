import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create connection pool for tests
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export async function resetDatabase() {
  const prisma = new PrismaClient({
    adapter,
  });

  await prisma.packDuesPayment.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.packTransaction.deleteMany();
  await prisma.scout.deleteMany();
  await prisma.fiscalYearConfig.deleteMany();

  await prisma.$disconnect();
}

export async function seedTestData() {
  const prisma = new PrismaClient({
    adapter,
  });

  // Create fiscal year config
  const fiscalYearConfig = await prisma.fiscalYearConfig.create({
    data: {
      fiscalYear: "2024-2025",
      packDuesAmount: 100.0,
    },
  });

  // Create test scouts individually to get their IDs
  const scout1 = await prisma.scout.create({
    data: {
      name: "Test Scout 1",
      beginningBalance: 0,
      fiscalYear: "2024-2025",
      active: true,
    },
  });

  const scout2 = await prisma.scout.create({
    data: {
      name: "Test Scout 2",
      beginningBalance: 25.5,
      fiscalYear: "2024-2025",
      active: true,
    },
  });

  await prisma.$disconnect();

  return {
    fiscalYearConfig,
    scout1,
    scout2,
  };
}

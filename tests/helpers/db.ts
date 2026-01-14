import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// IMPORTANT: Tests MUST ALWAYS use TEST_DATABASE_URL (never DATABASE_URL)
if (!process.env.TEST_DATABASE_URL) {
  throw new Error(
    "TEST_DATABASE_URL environment variable is not set. Please set it in your .env file.",
  );
}

// Create connection pool for tests using TEST_DATABASE_URL
const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
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

// Helper to get current fiscal year (matches app logic)
function getCurrentFiscalYear(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  if (month >= 6) {
    // July (6) through December (11)
    return `${year}-${year + 1}`;
  } else {
    // January (0) through June (5)
    return `${year - 1}-${year}`;
  }
}

export async function seedTestData() {
  const prisma = new PrismaClient({
    adapter,
  });

  const currentFiscalYear = getCurrentFiscalYear();

  // Create fiscal year config
  const fiscalYearConfig = await prisma.fiscalYearConfig.create({
    data: {
      fiscalYear: currentFiscalYear,
      packDuesAmount: 100.0,
    },
  });

  // Create test scouts individually to get their IDs
  const scout1 = await prisma.scout.create({
    data: {
      name: "Test Scout 1",
      beginningBalance: 0,
      fiscalYear: currentFiscalYear,
      active: true,
    },
  });

  const scout2 = await prisma.scout.create({
    data: {
      name: "Test Scout 2",
      beginningBalance: 25.5,
      fiscalYear: currentFiscalYear,
      active: true,
    },
  });

  await prisma.$disconnect();

  return {
    fiscalYearConfig,
    scout1,
    scout2,
    currentFiscalYear,
  };
}

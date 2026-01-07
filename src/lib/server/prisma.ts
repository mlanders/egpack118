import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";

// Prevent multiple instances in development (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Create connection pool
const pool =
  globalForPrisma.pool ?? new Pool({ connectionString: env.DATABASE_URL });

// Create Prisma adapter
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: dev ? ["query", "error", "warn"] : ["error"],
  });

if (dev) {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

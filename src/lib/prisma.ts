import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7: driver adapters are mandatory — PrismaPg for PostgreSQL.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL ?? "",
    }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

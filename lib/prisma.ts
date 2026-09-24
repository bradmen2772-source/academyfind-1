import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

function getAdapter() {
  const connectionString = process.env.DATABASE_URL || "";
  if (connectionString.includes("neon.tech")) {
    return new PrismaNeon({ connectionString });
  }
  return new PrismaPg({ connectionString });
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: getAdapter() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
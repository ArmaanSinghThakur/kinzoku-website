import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// One database client (and connection pool) per server process, kept on globalThis because this
// file can be loaded more than once in the same process: by the website's bundles and by
// server.ts (live connection), and again after every edit in development.
const globalForDb = globalThis as unknown as { db?: PrismaClient };

export const db = (globalForDb.db ??= new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
}));

/**
 * True for Prisma's "already exists" error (P2002). Checks the code rather than the error class,
 * since the class differs between the copies of this file loaded in one process.
 */
export function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

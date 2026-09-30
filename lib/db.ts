import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// One database client (and connection pool) per server process. In development, hot reload runs
// this file again on every edit, so the client is kept on globalThis instead of opening new pools.
const globalForDb = globalThis as unknown as { db?: PrismaClient };

export const db =
  globalForDb.db ?? new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function createPrismaClient() {
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      // Serverless: keep pool tiny. Many concurrent Vercel instances each
      // holding 5 connections quickly exhaust Supabase's connection limit.
      max: 2,
      // Fail fast rather than hanging — lets the try/catch fallback kick in
      // and serve cached/static content instead of blocking the response.
      connectionTimeoutMillis: 5_000,
      // Release idle connections quickly so other instances can claim them.
      idleTimeoutMillis: 10_000,
    });

    globalForPrisma.pgPool.on("error", (err) => {
      console.error("pg pool error:", err.message);
    });
  }

  const adapter = new PrismaPg(globalForPrisma.pgPool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;

/**
 * Retry wrapper — attempts the async fn up to `attempts` times with
 * exponential backoff before re-throwing. Use this around critical DB
 * queries (homepage, program pages) so a single transient connection blip
 * doesn't result in a 500 for the visitor.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 150
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
      }
    }
  }
  throw lastErr;
}

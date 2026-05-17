import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function createPrismaClient() {
  if (!globalForPrisma.pgPool) {
    // Parse the DATABASE_URL so we can pass explicit SSL options.
    // Using a raw connectionString with sslmode= overrides the ssl object,
    // which breaks Supabase's transaction pooler (port 6543). Explicit params
    // let us force rejectUnauthorized:false for the pooler's wildcard cert.
    const url = new URL(process.env.DATABASE_URL!);
    globalForPrisma.pgPool = new Pool({
      host: url.hostname,
      port: Number(url.port) || 5432,
      database: url.pathname.replace(/^\//, ""),
      user: url.username,
      password: url.password,
      // Serverless: keep pool tiny. Many concurrent Vercel instances each
      // holding connections quickly exhaust Supabase's connection limit.
      max: 2,
      // Fail fast rather than hanging — lets the try/catch fallback kick in.
      connectionTimeoutMillis: 5_000,
      // Release idle connections quickly so other instances can claim them.
      idleTimeoutMillis: 10_000,
      // Supabase pooler uses a wildcard cert — skip hostname verification.
      ssl: { rejectUnauthorized: false },
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

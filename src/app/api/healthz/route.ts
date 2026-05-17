export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars (without revealing values)
  checks.AUTH_SECRET = process.env.AUTH_SECRET ? "set" : "MISSING";
  checks.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? "set" : "MISSING";
  checks.NEXTAUTH_URL = process.env.NEXTAUTH_URL || "MISSING";
  checks.DATABASE_URL = process.env.DATABASE_URL ? "set" : "MISSING";
  checks.node = process.version;

  // Check auth module
  try {
    const { auth } = await import("@/lib/auth");
    checks.auth_module = typeof auth === "function" ? "OK" : "unexpected";
  } catch (e: unknown) {
    checks.auth_module = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Check DB
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.$queryRaw`SELECT 1`;
    checks.db = "OK";
  } catch (e: unknown) {
    checks.db = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  return Response.json(checks);
}

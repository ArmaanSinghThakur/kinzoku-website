import { db } from "@/lib/db";

// Health check for the server's container, the uptime check and releases (plan: "api/ … health
// check"). Answers only "ok" or "unavailable", never any details about the database.
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" }, { headers: noStore });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503, headers: noStore });
  }
}

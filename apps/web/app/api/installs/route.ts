import { getDb } from "@/lib/analytics/db";
import { getPublicInstalls } from "@/lib/analytics/stats";

// Cached for five minutes so the public counter never costs a query per visitor.
export const revalidate = 300;

/** The public install total, or null when there is no database or the number is still small. */
export async function GET() {
  const db = getDb();
  let installs: number | null = null;
  try {
    installs = db ? await getPublicInstalls(db) : null;
  } catch {
    // A counter is decoration: if the database is down, show nothing rather than an error.
  }
  return Response.json({ installs }, { headers: { "X-Content-Type-Options": "nosniff" } });
}

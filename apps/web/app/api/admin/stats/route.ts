import { loaders } from "@/.registry/manifest";
import { json, requireAdmin, requireDb } from "@/lib/admin/guard";
import { getOverview } from "@/lib/analytics/stats";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const db = requireDb();
  if (db instanceof Response) return db;
  const known = Object.keys(loaders).filter((name) => name !== "index");
  return json(await getOverview(db, known));
}

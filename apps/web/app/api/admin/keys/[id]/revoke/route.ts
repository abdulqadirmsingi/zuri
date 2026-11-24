import { json, requireAdmin, requireDb, requireJson } from "@/lib/admin/guard";
import { revokeKey } from "@/lib/licence/keys";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(request) ?? requireJson(request);
  if (denied) return denied;
  const db = requireDb();
  if (db instanceof Response) return db;
  const id = Number((await ctx.params).id);
  if (!Number.isSafeInteger(id) || id < 1) return json({ error: "Invalid id" }, 400);
  return (await revokeKey(db, id)) ? json({ ok: true }) : json({ error: "Not found" }, 404);
}

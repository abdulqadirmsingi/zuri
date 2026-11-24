import { z } from "zod";
import { json, requireAdmin, requireDb, requireJson } from "@/lib/admin/guard";
import { createLicence, listKeys } from "@/lib/licence/keys";

const createBody = z.object({
  customerRef: z.string().min(1).max(128),
  tier: z.literal("pro").default("pro"),
});

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const db = requireDb();
  if (db instanceof Response) return db;
  return json({ keys: await listKeys(db) });
}

/** The plaintext key is in this response only. It cannot be retrieved again. */
export async function POST(request: Request) {
  const denied = requireAdmin(request) ?? requireJson(request);
  if (denied) return denied;
  const db = requireDb();
  if (db instanceof Response) return db;
  const parsed = createBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: "Invalid body" }, 400);
  return json(await createLicence(db, parsed.data), 201);
}

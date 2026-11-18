import type { Db } from "@/lib/analytics/db";
import { bearerToken, verifyKey } from "./keys";

/** Free items are open. Pro items need an active licence key (fails closed, see verifyKey). */
export async function canAccess(
  tier: "free" | "pro",
  headers: Headers,
  db: Db | null,
): Promise<boolean> {
  if (tier === "free") return true;
  return verifyKey(db, bearerToken(headers));
}

import { after } from "next/server";
import { loaders } from "@/.registry/manifest";
import { buildInstallEvent } from "@/lib/analytics/build-event";
import { getDb } from "@/lib/analytics/db";
import { recordInstall } from "@/lib/analytics/install-events";
import { parseItemName, readRegistryItem } from "@/lib/registry-files";

// Served by a function (never from public/) so every request can be counted.
// No CDN caching for now: an edge hit would skip the function and swallow the count.
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(request: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name: param } = await ctx.params;
  const name = parseItemName(param);
  if (!name) return Response.json({ error: "Invalid name" }, { status: 400 });

  const item = await readRegistryItem(name, loaders);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });

  // The index is a listing, not an install. after() runs once the response is sent,
  // so counting never delays the response, and recordInstall never throws.
  if (name !== "index") {
    const event = buildInstallEvent({
      component: name,
      version: item.version,
      tier: item.tier,
      headers: request.headers,
      secret: process.env.ZURI_HASH_SECRET,
      now: new Date(),
    });
    if (event) after(() => recordInstall(getDb(), event));
  }

  return new Response(item.body, { headers });
}

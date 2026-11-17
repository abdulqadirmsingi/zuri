import { loaders } from "@/.registry/manifest";
import { parseItemName, readRegistryItem } from "@/lib/registry-files";

// Served by a function (never from public/) so every request can be counted.
// No CDN caching for now: an edge hit would skip the function and swallow the count.
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(_request: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name: param } = await ctx.params;
  const name = parseItemName(param);
  if (!name) return Response.json({ error: "Invalid name" }, { status: 400 });

  const body = await readRegistryItem(name, loaders);
  if (body === null) return Response.json({ error: "Not found" }, { status: 404 });

  return new Response(body, { headers });
}

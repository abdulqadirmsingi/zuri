import type { InstallEventInsert } from "@/db/schema";
import { classifySource } from "./source";
import { clientIp, visitorHash } from "./visitor";

/** Returns null when counting is not configured (no secret): an unsalted hash would be reversible. */
export function buildInstallEvent(input: {
  component: string;
  version: string | null;
  tier: "free" | "pro";
  headers: Headers;
  secret: string | undefined;
  now: Date;
}): InstallEventInsert | null {
  if (!input.secret) return null;
  const userAgent = input.headers.get("user-agent") ?? "";
  return {
    component: input.component,
    version: input.version,
    tier: input.tier,
    country: input.headers.get("x-vercel-ip-country"),
    source: classifySource(input.headers),
    visitorHash: visitorHash({
      secret: input.secret,
      now: input.now,
      ip: clientIp(input.headers),
      userAgent,
    }),
  };
}

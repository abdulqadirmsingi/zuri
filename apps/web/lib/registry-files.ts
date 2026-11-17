import { z } from "zod";

// Lowercase kebab-case only: keeps lookups to known names and rejects traversal-looking input.
const nameSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(64);

export type RegistryLoaders = Record<string, () => Promise<{ default: unknown }>>;

/** "button" and "button.json" are both accepted, since the shadcn CLI requests the latter. */
export function parseItemName(param: string): string | null {
  const parsed = nameSchema.safeParse(param.replace(/\.json$/, ""));
  return parsed.success ? parsed.data : null;
}

export interface RegistryItemResult {
  body: string;
  version: string | null;
  tier: "free" | "pro";
}

const metaSchema = z.object({
  meta: z
    .object({ version: z.string().optional(), tier: z.enum(["free", "pro"]).optional() })
    .optional(),
});

/** Returns the item JSON plus the metadata used for counting, or null if unknown. `index` is the registry index. */
export async function readRegistryItem(
  name: string,
  loaders: RegistryLoaders,
): Promise<RegistryItemResult | null> {
  // hasOwn: names like "constructor" are valid kebab-case but must not hit Object.prototype.
  if (!Object.hasOwn(loaders, name)) return null;
  const load = loaders[name];
  if (!load) return null;
  const item = (await load()).default;
  const meta = metaSchema.safeParse(item);
  return {
    body: JSON.stringify(item),
    version: (meta.success && meta.data.meta?.version) || null,
    // Fail safe: anything without an explicit tier is treated as free metadata-wise, not as a secret.
    tier: (meta.success && meta.data.meta?.tier) || "free",
  };
}

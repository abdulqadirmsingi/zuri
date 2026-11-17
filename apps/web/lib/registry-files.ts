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

/** Returns the item as a JSON string, or null if unknown. `index` is the registry index. */
export async function readRegistryItem(
  name: string,
  loaders: RegistryLoaders,
): Promise<string | null> {
  // hasOwn: names like "constructor" are valid kebab-case but must not hit Object.prototype.
  if (!Object.hasOwn(loaders, name)) return null;
  const load = loaders[name];
  if (!load) return null;
  return JSON.stringify((await load()).default);
}

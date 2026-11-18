import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { loaders } from "@/.registry/manifest";
import { codeThemes } from "@/lib/code-themes";

/** Shows the exact file a user receives, read from the built registry item. */
export async function Source({ name }: { name: string }) {
  if (!Object.hasOwn(loaders, name)) throw new Error(`Unknown registry item: ${name}`);
  const load = loaders[name as keyof typeof loaders];
  const item = (await load()).default as { files?: { path: string; content: string }[] };
  const file = item.files?.[0];
  if (!file) throw new Error(`Registry item has no files: ${name}`);
  return <DynamicCodeBlock lang="tsx" code={file.content} options={{ themes: codeThemes }} />;
}

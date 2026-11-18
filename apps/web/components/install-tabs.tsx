import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { siteUrl } from "@/lib/shared";

const managers = [
  ["pnpm", (url: string) => `pnpm dlx shadcn@latest add ${url}`],
  ["npm", (url: string) => `npx shadcn@latest add ${url}`],
  ["yarn", (url: string) => `yarn dlx shadcn@latest add ${url}`],
  ["bun", (url: string) => `bunx --bun shadcn@latest add ${url}`],
] as const;

/** Install command for a registry item in every package manager, with copy buttons. */
export function InstallTabs({ name }: { name: string }) {
  const url = `${siteUrl}/r/${name}.json`;
  return (
    <Tabs items={managers.map(([label]) => label)}>
      {managers.map(([label, command]) => (
        <Tab key={label} value={label}>
          <CodeBlock>
            <Pre>{command(url)}</Pre>
          </CodeBlock>
        </Tab>
      ))}
    </Tabs>
  );
}

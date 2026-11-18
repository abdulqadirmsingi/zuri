import { CopyButton } from "@registry/actions/copy-button/copy-button";

export function CopyButtonDefault() {
  return (
    <>
      <CopyButton value="npx shadcn@latest add button" label="Copy link" />
      <CopyButton value="npx shadcn@latest add button" iconOnly label="Copy command" />
      <CopyButton value="npx shadcn@latest add button" shape="pill" label="Copy" />
    </>
  );
}

import { CopyButton } from "@registry/actions/copy-button/copy-button";
import { Input } from "@registry/inputs/input/input";

export function CopyButtonDefault() {
  return (
    <>
      <CopyButton value="npx shadcn@latest add button" label="Copy link" />
      <CopyButton value="npx shadcn@latest add button" iconOnly label="Copy command" />
      <CopyButton value="npx shadcn@latest add button" shape="pill" label="Copy" />
    </>
  );
}

const command = "npx shadcn@latest add button";

export function CopyButtonStyles() {
  return (
    <>
      <CopyButton value={command} variant="accent" label="Copy" />
      <CopyButton value={command} variant="soft" label="Copy" />
      <CopyButton value={command} variant="brutal" label="Copy" />
      <CopyButton value={command} variant="wipe" label="Copy" />
      <CopyButton value={command} variant="link" label="Copy link" />
      <CopyButton value={command} variant="ghost" iconOnly label="Copy command" />
    </>
  );
}

/** Recipes: the same CopyButton placed inside other shapes. */
export function CopyButtonRecipes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted py-2 ps-4 pe-2">
        <span aria-hidden="true" className="select-none font-mono text-sm text-accent-ink">
          $
        </span>
        <code className="min-w-0 flex-1 break-all font-mono text-sm">{command}</code>
        <CopyButton value={command} iconOnly label="Copy command" variant="ghost" size="sm" />
      </div>
      <div className="flex items-center gap-2">
        <Input
          readOnly
          aria-label="Share link"
          defaultValue="https://example.com/r/button"
          className="flex-1"
        />
        <CopyButton value="https://example.com/r/button" variant="accent" label="Copy link" />
      </div>
    </div>
  );
}

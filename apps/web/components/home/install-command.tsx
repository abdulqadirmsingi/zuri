import { CopyButton } from "@registry/actions/copy-button/copy-button";

/** A shell command in a bordered box with a copy button. */
export function InstallCommand({ command }: { command: string }) {
  return (
    <div className="flex w-full max-w-full items-center gap-2 rounded-xl border border-border bg-muted py-2 ps-4 pe-2">
      <span aria-hidden="true" className="select-none font-mono text-sm text-accent-ink">
        $
      </span>
      <code className="min-w-0 flex-1 break-all font-mono text-sm">{command}</code>
      <CopyButton value={command} iconOnly label="Copy command" variant="ghost" size="sm" />
    </div>
  );
}

"use client";

import { CopyButton } from "@registry/actions/copy-button/copy-button";

/** A copyable code block. It scrolls sideways on narrow screens, so it is focusable and named. */
export function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="m-0 text-sm font-medium">{label}</h3>
        <CopyButton value={code} label="Copy" size="sm" />
      </div>
      <section
        aria-label={`${label} code`}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs a tab stop so keyboard users can scroll it.
        tabIndex={0}
        className="overflow-x-auto rounded-lg bg-muted p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <pre className="m-0 font-mono text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </section>
    </div>
  );
}

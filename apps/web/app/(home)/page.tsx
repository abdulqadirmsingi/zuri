import Link from "next/link";
import { siteUrl } from "@/lib/shared";

export default function Home() {
  return (
    <main className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      {/* Backdrop for the glass card: soft saffron glow, decorative only. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_30%,color-mix(in_oklch,var(--accent)_35%,transparent),transparent)]"
      />
      <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">Zuri</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        <span lang="sw">Zuri</span> means “beautiful” in Swahili. Small, accessible React components
        you copy into your project and own.
      </p>
      <div className="zuri-glass mt-8 max-w-full rounded-lg px-4 py-3">
        <code className="break-all text-start font-mono text-sm">
          npx shadcn@latest add {siteUrl}/r/button.json
        </code>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/docs"
          className="inline-flex min-h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Read the docs
        </Link>
        <Link
          href="/docs/components/button"
          className="inline-flex min-h-10 items-center rounded-md border border-border px-5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          See Button
        </Link>
      </div>
    </main>
  );
}

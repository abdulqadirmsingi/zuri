import { Button } from "@registry/actions/button/button";
import { GlassBackdrop } from "./glass-backdrop";

// Demos render the real registry source, so docs can never drift from what users install.
export function ButtonDefault() {
  return <Button>Continue</Button>;
}

export function ButtonVariants() {
  return (
    <>
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="link">Link style</Button>
      <Button variant="brutal">Brutal</Button>
      <Button variant="wipe">Wipe</Button>
      {/* Glass needs something behind it to blur. */}
      <GlassBackdrop className="w-auto">
        <Button variant="glass">Glass</Button>
      </GlassBackdrop>
    </>
  );
}

export function ButtonSizes() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </>
  );
}

export function ButtonStates() {
  return (
    <>
      <Button>Enabled</Button>
      <Button disabled>Disabled</Button>
    </>
  );
}

const plus = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M8 3v10M3 8h10" />
  </svg>
);
const arrow = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);
const dots = (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="3" cy="8" r="1.3" />
    <circle cx="8" cy="8" r="1.3" />
    <circle cx="13" cy="8" r="1.3" />
  </svg>
);

export function ButtonIcons() {
  return (
    <>
      <Button variant="outline" shape="pill">
        {plus}
        Add item
      </Button>
      <Button shape="pill">
        Continue
        {arrow}
      </Button>
      <Button variant="ghost" size="icon" shape="pill" aria-label="More options">
        {dots}
      </Button>
    </>
  );
}

export function ButtonLoading() {
  return (
    <>
      <Button loading>Paying…</Button>
      <Button variant="outline" loading>
        Saving
      </Button>
    </>
  );
}

const arrowRight = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
  >
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

/** Recipes built by passing className to the same Button, so each is a few classes, not a new component. */
export function ButtonAlternatives() {
  return (
    <>
      <Button variant="accent" shape="pill" size="lg" className="group">
        Get started
        {arrowRight}
      </Button>
      <Button
        variant="accent"
        shape="pill"
        className="shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_35%,transparent)] hover:shadow-[0_0_0_8px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
      >
        Glow
      </Button>
      <Button variant="outline" shape="pill">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-success motion-safe:animate-pulse"
        />
        Live now
      </Button>
      <Button variant="soft" shape="pill">
        Messages
        <span className="rounded-full bg-foreground px-2 text-xs text-background">3</span>
      </Button>
    </>
  );
}

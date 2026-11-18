import { Button } from "@registry/actions/button/button";

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
      {/* Glass needs something behind it to blur. */}
      <span className="rounded-lg bg-linear-to-br from-accent to-primary p-4">
        <Button variant="glass">Glass</Button>
      </span>
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

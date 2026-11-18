import { Button } from "@registry/actions/button/button";

// Demos render the real registry source, so docs can never drift from what users install.
export function ButtonVariants() {
  return (
    <>
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
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

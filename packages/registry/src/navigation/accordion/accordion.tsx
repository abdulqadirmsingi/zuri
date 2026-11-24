"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { type ComponentProps, createElement } from "react";
import { cn } from "@/lib/utils";

/**
 * A stack of sections that expand and collapse. Pass `type="single"` (one open at a time; add
 * `collapsible` to allow closing it) or `type="multiple"`.
 */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-border", className)} {...props} />;
}

export interface AccordionTriggerProps extends ComponentProps<typeof AccordionPrimitive.Trigger> {
  /** Heading level of the wrapper, so it fits your page outline. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** The button that toggles a section. It sits inside a real heading, as the pattern requires. */
export function AccordionTrigger({
  className,
  children,
  headingLevel = 3,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header asChild>
      {createElement(
        `h${headingLevel}`,
        { className: "m-0 flex" },
        <AccordionPrimitive.Trigger
          className={cn(
            "group flex min-h-11 flex-1 cursor-pointer items-center justify-between gap-4 rounded-md py-3 text-start text-sm font-medium transition-colors duration-[var(--duration-base)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          {children}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </AccordionPrimitive.Trigger>,
      )}
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      // Height animates with keyframes (declared in this item's css) so Radix can wait for the
      // exit to finish. Durations are tokens, so reduced motion makes it near-instant.
      className="overflow-hidden text-sm data-[state=closed]:animate-[zuri-accordion-up_var(--duration-base)_var(--ease-out)] data-[state=open]:animate-[zuri-accordion-down_var(--duration-base)_var(--ease-out)]"
      {...props}
    >
      <div className={cn("pb-4 text-muted-foreground", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

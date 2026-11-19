import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export interface SplitHeroProps extends Omit<ComponentProps<"section">, "title"> {
  /** A short line above the headline, such as a category or a date. */
  eyebrow?: ReactNode;
  /** The headline. It is the page's main heading by default. */
  title: ReactNode;
  description?: ReactNode;
  /** Buttons or links, shown under the description. */
  actions?: ReactNode;
  /** Short supporting facts shown under the actions, e.g. { label: "Students", value: "1,200" }. */
  highlights?: { label: string; value: string }[];
  /** The image, illustration or any visual. Give an image its own alt text. */
  media: ReactNode;
  /** Which side the media is on. "end" is the right in left-to-right layouts and flips in right-to-left. */
  mediaPosition?: "start" | "end";
  /** Heading level for the headline. Use 2 if the page already has an h1. Defaults to 1. */
  headingLevel?: 1 | 2;
}

/**
 * A hero with text on one side and a visual on the other. On narrow screens it stacks, with the
 * text first. The text never sits on top of the media, so its contrast does not depend on the
 * image you choose.
 */
export function SplitHero({
  eyebrow,
  title,
  description,
  actions,
  highlights,
  media,
  mediaPosition = "end",
  headingLevel = 1,
  className,
  ...props
}: SplitHeroProps) {
  const id = useId();
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section aria-labelledby={id} className={cn("w-full", className)} {...props}>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="flex min-w-0 flex-col gap-6">
          {eyebrow ? <p className="m-0 text-sm font-medium text-accent-ink">{eyebrow}</p> : null}
          <Heading
            id={id}
            className="m-0 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {title}
          </Heading>
          {description ? (
            <p className="m-0 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          {highlights?.length ? (
            <dl className="m-0 mt-2 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6">
              {highlights.map((h) => (
                <div key={h.label} className="flex flex-col gap-0.5">
                  <dd className="m-0 text-2xl font-semibold tabular-nums">{h.value}</dd>
                  <dt className="text-sm text-muted-foreground">{h.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <div
          className={cn(
            "min-w-0 overflow-hidden rounded-3xl border border-border",
            mediaPosition === "start" && "lg:order-first",
          )}
        >
          {media}
        </div>
      </div>
    </section>
  );
}

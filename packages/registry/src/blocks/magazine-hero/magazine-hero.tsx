import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export interface MagazineHeroProps extends Omit<ComponentProps<"section">, "title"> {
  /** A short line above the headline, such as an issue or a category. */
  eyebrow?: ReactNode;
  /** The headline, set very large. Use <br /> to choose the line breaks. */
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Short labels shown as a row under the actions. */
  tags?: string[];
  /** The main visual, shown in a tall frame beside the headline. Give an image its own alt text. */
  media: ReactNode;
  /** A short caption under the visual, such as a credit. */
  caption?: ReactNode;
  /** A small badge that overlaps a corner of the visual, such as "New" or "2027 intake". */
  badge?: ReactNode;
  /** Heading level for the headline. Use 2 if the page already has an h1. Defaults to 1. */
  headingLevel?: 1 | 2;
}

/**
 * An editorial hero: a very large headline beside a tall, offset visual with a corner badge, in
 * the style of a magazine cover. On narrow screens the visual comes after the text. The headline
 * and the visual never overlap, so text contrast never depends on the image.
 */
export function MagazineHero({
  eyebrow,
  title,
  description,
  actions,
  tags,
  media,
  caption,
  badge,
  headingLevel = 1,
  className,
  ...props
}: MagazineHeroProps) {
  const id = useId();
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section aria-labelledby={id} className={cn("w-full overflow-hidden", className)} {...props}>
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-8 lg:grid-cols-12 lg:items-end lg:gap-8 lg:py-24">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
          {eyebrow ? (
            <p className="m-0 w-fit rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
              {eyebrow}
            </p>
          ) : null}
          <Heading
            id={id}
            className="m-0 text-balance text-[clamp(2.75rem,9vw,7rem)] font-semibold leading-[0.95] tracking-tight"
          >
            {title}
          </Heading>
          {description ? (
            <p className="m-0 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          {tags?.length ? (
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-control-border px-3 py-1 text-sm"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <figure className="m-0 min-w-0 lg:col-span-5">
          {/* The offset block and the badge hang off this wrapper, not the figure, so the caption is never covered. */}
          <div className="relative">
            {/* A solid block behind and to one side of the frame. Decorative; it carries no text. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-accent sm:translate-x-4 sm:translate-y-4"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-muted">
              {media}
            </div>
            {badge ? (
              <span className="absolute -start-2 bottom-8 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg sm:-start-6">
                {badge}
              </span>
            ) : null}
          </div>
          {caption ? (
            <figcaption className="mt-8 text-sm text-muted-foreground">{caption}</figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}

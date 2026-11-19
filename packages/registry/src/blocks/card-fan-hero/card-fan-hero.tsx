import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export interface FanCard {
  id: string;
  /** The card's visual. Give an image its own alt text. */
  media: ReactNode;
  /** A short caption shown on the card. */
  label: string;
}

export interface CardFanHeroProps extends Omit<ComponentProps<"section">, "title"> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** The cards to fan out. Three to five work best. */
  cards: FanCard[];
  /** Heading level for the headline. Use 2 if the page already has an h1. Defaults to 1. */
  headingLevel?: 1 | 2;
}

/** Degrees each card turns away from the middle one. */
const TURN = 5;
/** How far, in rem, each card drops for every step squared from the middle, which makes the arc. */
const DROP = 0.6;

/**
 * A centred hero with a row of cards fanned out in an arc beneath it. The cards are a plain list of
 * figures, so they read naturally to screen readers. Each card's width is worked out from how
 * many there are, so the fan always fits its container, down to 320px.
 */
export function CardFanHero({
  eyebrow,
  title,
  description,
  actions,
  cards,
  headingLevel = 1,
  className,
  ...props
}: CardFanHeroProps) {
  const id = useId();
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const n = cards.length;
  return (
    <section aria-labelledby={id} className={cn("w-full overflow-hidden", className)} {...props}>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 pt-14 text-center sm:px-8 lg:pt-24">
        {eyebrow ? (
          <p className="m-0 w-fit rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
            {eyebrow}
          </p>
        ) : null}
        <Heading
          id={id}
          className="m-0 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
        >
          {title}
        </Heading>
        {description ? (
          <p className="m-0 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>
        ) : null}
      </div>

      {n > 0 ? (
        <ul
          // The cards overlap by a quarter of their width, so n cards take 0.75n + 0.25 widths.
          style={
            {
              "--zuri-fan-n": n,
              "--zuri-fan-w": "min(calc(100% / (0.75 * var(--zuri-fan-n) + 0.25)), 14rem)",
            } as React.CSSProperties
          }
          className="mx-auto m-0 mt-14 flex w-full max-w-5xl list-none items-start justify-center px-4 pb-16 sm:px-8 lg:pb-24"
        >
          {cards.map((card, i) => {
            const offset = i - (n - 1) / 2;
            return (
              <li
                key={card.id}
                className="relative w-[var(--zuri-fan-w)] shrink-0 transition-[transform,translate,scale,rotate] duration-[var(--duration-base)] ease-[var(--ease-out)] ms-[calc(var(--zuri-fan-w)*-0.25)] first:ms-0 hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                style={
                  {
                    transform: `rotate(${offset * TURN}deg) translateY(${offset * offset * DROP}rem)`,
                    zIndex: n - Math.round(Math.abs(offset) * 2),
                  } as React.CSSProperties
                }
              >
                <figure className="m-0 overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
                  <div className="aspect-[3/4] bg-muted">{card.media}</div>
                  <figcaption className="px-3 py-2 text-start text-sm font-medium">
                    {card.label}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

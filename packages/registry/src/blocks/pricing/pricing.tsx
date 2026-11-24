import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  id: string;
  name: ReactNode;
  /** Shown as given, so the wording and currency are yours: "TZS 20,000", "Free", "Soon". */
  price: ReactNode;
  /** Small text after the price, such as "per month". */
  period?: ReactNode;
  description?: ReactNode;
  features?: ReactNode[];
  /** A link or button. Put it here so the block never decides where money goes. */
  action?: ReactNode;
  /** Gives the plan the strong, filled look. Use for at most one plan. */
  featured?: boolean;
  /** A short label above the name, such as "Most chosen". */
  badge?: ReactNode;
}

export interface PricingProps extends ComponentProps<"ul"> {
  plans: PricingPlan[];
  /** Plan names are headings; set the level that fits the page outline. Defaults to 3. */
  headingLevel?: 3 | 4;
}

/**
 * Plans side by side. It holds no prices of its own: every figure, name and link comes from
 * the caller, so nothing here can drift from what you actually charge.
 */
export function Pricing({ plans, headingLevel = 3, className, ...props }: PricingProps) {
  const base = useId();
  const Heading = `h${headingLevel}` as const;
  return (
    <ul
      className={cn(
        "m-0 grid w-full list-none gap-4 p-0 md:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]",
        className,
      )}
      {...props}
    >
      {plans.map((plan) => {
        const titleId = `${base}-${plan.id}`;
        return (
          <li
            key={plan.id}
            className={cn(
              "flex flex-col gap-6 rounded-3xl border p-7",
              // The filled plan pairs its background with its own foreground token for contrast.
              plan.featured
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-muted text-foreground",
            )}
          >
            <article aria-labelledby={titleId} className="flex flex-1 flex-col gap-6">
              <header className="flex flex-col gap-2">
                {plan.badge ? (
                  <p className="m-0 text-xs font-medium uppercase tracking-wider opacity-80">
                    {plan.badge}
                  </p>
                ) : null}
                <Heading id={titleId} className="m-0 text-lg font-semibold">
                  {plan.name}
                </Heading>
                <p className="m-0 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-4xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period ? <span className="text-sm opacity-80">{plan.period}</span> : null}
                </p>
                {plan.description ? (
                  <p className="m-0 text-pretty text-sm leading-relaxed opacity-80">
                    {plan.description}
                  </p>
                ) : null}
              </header>
              {plan.features?.length ? (
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm">
                  {plan.features.map((feature, i) => (
                    // Order is fixed by the caller, so the index is a stable key.
                    // biome-ignore lint/suspicious/noArrayIndexKey: static, ordered list
                    <li key={i} className="flex gap-2.5">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="mt-0.5 size-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3.5 8.5 3 3 6-7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {plan.action ? <div className="mt-auto">{plan.action}</div> : null}
            </article>
          </li>
        );
      })}
    </ul>
  );
}

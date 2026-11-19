import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export interface ClosingCtaProps extends Omit<ComponentProps<"section">, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Buttons or links. Put the main action first. */
  actions?: ReactNode;
  /** "default" is a bordered panel; "accent" fills it with the accent colour. */
  tone?: "default" | "accent";
  /** Heading level. Defaults to 2. */
  headingLevel?: 2 | 3;
}

/** The call to action at the foot of a page: one heading, one line of text and the actions. */
export function ClosingCta({
  title,
  description,
  actions,
  tone = "default",
  headingLevel = 2,
  className,
  ...props
}: ClosingCtaProps) {
  const id = useId();
  const Heading = `h${headingLevel}` as const;
  return (
    <section aria-labelledby={id} className={cn("w-full px-4 py-12 sm:px-8", className)} {...props}>
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col items-center gap-5 rounded-[2rem] px-6 py-14 text-center sm:px-12",
          // The accent fill is paired with its own foreground token, which is what keeps the contrast.
          tone === "accent"
            ? "bg-accent text-accent-foreground"
            : "border border-border bg-muted text-foreground",
        )}
      >
        <Heading
          id={id}
          className="m-0 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
        >
          {title}
        </Heading>
        {description ? (
          <p className="m-0 max-w-xl text-pretty text-lg leading-relaxed opacity-80">
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}

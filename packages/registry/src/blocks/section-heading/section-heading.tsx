import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends Omit<ComponentProps<"div">, "title"> {
  /** A short line above the title, such as a category. */
  eyebrow?: ReactNode;
  /** The section's heading. */
  title: ReactNode;
  description?: ReactNode;
  /** "center" centres the text; "start" aligns it to the reading start. */
  align?: "start" | "center";
  /** Heading level. Use the level that fits the page outline. Defaults to 2. */
  headingLevel?: 2 | 3 | 4;
  /** An id for the heading itself, so a section can name itself with `aria-labelledby`. */
  titleId?: string;
}

/** The title block that opens a page section: an eyebrow, a heading and a short description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  headingLevel = 2,
  titleId,
  className,
  ...props
}: SectionHeadingProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? <p className="m-0 text-sm font-medium text-accent-ink">{eyebrow}</p> : null}
      <Heading
        id={titleId}
        className="m-0 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
      >
        {title}
      </Heading>
      {description ? (
        <p className="m-0 text-pretty text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

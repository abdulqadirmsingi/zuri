import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva("flex flex-col gap-4 rounded-xl p-6 text-foreground", {
  variants: {
    variant: {
      default: "border border-border bg-background",
      outline: "border border-control-border bg-background",
      glass: "zuri-glass",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface CardProps extends ComponentProps<"div">, VariantProps<typeof cardVariants> {}

/** A surface that groups related content. Compose with CardHeader, CardContent and CardFooter. */
export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export interface CardTitleProps extends ComponentProps<"h3"> {
  /** Heading element to render, so the card fits your page's heading outline. */
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({ as: Heading = "h3", className, ...props }: CardTitleProps) {
  return <Heading className={cn("text-lg font-semibold leading-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("text-sm", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)} {...props} />;
}

export { cardVariants };

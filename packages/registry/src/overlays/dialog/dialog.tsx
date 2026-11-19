"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { useQuietFocusRestore } from "@/lib/focus-modality";
import { cn } from "@/lib/utils";

/** Compose with DialogTrigger, DialogContent, DialogTitle and DialogDescription. */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

const contentVariants = cva(
  // Enter animation only (`starting:`): Radix unmounts immediately on close, which is fine
  // and keeps this free of keyframes. Durations come from tokens, so reduced motion is honoured.
  "fixed start-1/2 top-1/2 z-[var(--z-modal)] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-xl p-6 text-foreground transition-[opacity,transform,translate,scale,rotate] duration-[var(--duration-base)] ease-[var(--ease-out)] starting:scale-95 starting:opacity-0 rtl:translate-x-1/2 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "border border-border bg-background",
        glass: "zuri-glass",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface DialogContentProps
  extends ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof contentVariants> {
  /** Accessible name for the close button. Defaults to "Close". */
  closeLabel?: string;
}

/**
 * The modal itself, with its backdrop. Radix traps focus inside, returns it to the trigger on
 * close, locks page scroll, closes on Escape and on an outside click, and hides the rest of
 * the page from screen readers. Always include a DialogTitle: it is the dialog's name.
 */
export function DialogContent({
  className,
  variant,
  closeLabel = "Close",
  children,
  onCloseAutoFocus,
  ...props
}: DialogContentProps) {
  const quiet = useQuietFocusRestore(onCloseAutoFocus);
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-foreground/40 transition-opacity duration-[var(--duration-base)] starting:opacity-0" />
      <DialogPrimitive.Content
        className={cn(contentVariants({ variant }), className)}
        onCloseAutoFocus={quiet.onCloseAutoFocus}
        {...props}
      >
        <span hidden ref={quiet.probe} />
        {children}
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="absolute end-3 top-3 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-4"
          >
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 pe-8", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold leading-tight", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export { contentVariants as dialogContentVariants };

"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Compose with AlertDialogTrigger, AlertDialogContent, AlertDialogTitle and the two buttons. */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

/**
 * Interrupts the user to confirm something that matters, usually a destructive action.
 * Unlike a Dialog it does NOT close on an outside click, and it puts focus on Cancel (the safe
 * choice) when it opens. Escape still cancels. Always include a title and a description.
 */
export function AlertDialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-foreground/40 transition-opacity duration-[var(--duration-base)] starting:opacity-0" />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed start-1/2 top-1/2 z-[var(--z-modal)] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-xl border border-border bg-background p-6 text-foreground transition-[opacity,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] starting:scale-95 starting:opacity-0 rtl:translate-x-1/2 focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-lg font-semibold leading-tight", className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Dismisses without doing anything. Radix focuses this one first. */
export function AlertDialogCancel({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
}

export interface AlertDialogActionProps extends ComponentProps<typeof AlertDialogPrimitive.Action> {
  /** Use "destructive" when the action deletes or cannot be undone. */
  variant?: "default" | "destructive";
}

/** Confirms the action and closes the dialog. Do the work in `onClick`. */
export function AlertDialogAction({
  className,
  variant = "default",
  ...props
}: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

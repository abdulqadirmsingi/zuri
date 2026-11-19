"use client";

import * as MenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Compose with DropdownMenuTrigger and DropdownMenuContent, then items inside the content. */
/**
 * Non-modal by default, as in the WAI-ARIA menu button pattern. Radix's modal mode marks the rest
 * of the page `aria-hidden` while leaving its links and buttons focusable, which axe reports as
 * `aria-hidden-focus`. The menu still closes on Escape or an outside click.
 * Pass `modal` to get the locked-page behaviour back.
 */
export function DropdownMenu({
  modal = false,
  ...props
}: ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root modal={modal} {...props} />;
}
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

/**
 * A menu of actions opened from a button. Radix provides the keyboard model: Arrow keys move,
 * Home and End jump, typing a letter jumps to a matching item, Enter or Space chooses, Escape
 * closes and returns focus to the trigger. Use it for actions, not for navigation between pages.
 */
export function DropdownMenuContent({
  className,
  sideOffset = 6,
  collisionPadding = 8,
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "z-[var(--z-dropdown)] min-w-44 max-w-[calc(100vw-1rem)] max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto rounded-xl border border-border bg-background p-1 text-sm text-foreground shadow-lg transition-[opacity,transform,translate,scale,rotate] duration-[var(--duration-fast)] ease-[var(--ease-out)] starting:scale-95 starting:opacity-0",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

const itemBase =
  "relative flex min-h-9 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-muted [&_svg]:size-4 [&_svg]:shrink-0";

export interface DropdownMenuItemProps extends ComponentProps<typeof MenuPrimitive.Item> {
  /** Danger styling for actions that delete or cannot be undone. */
  destructive?: boolean;
}

export function DropdownMenuItem({ className, destructive, ...props }: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      className={cn(itemBase, destructive && "text-danger", className)}
      {...props}
    />
  );
}

const tick = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

const dot = (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="3" />
  </svg>
);

/** A toggle item. The check mark is hidden from screen readers; the checked state is announced. */
export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem className={cn(itemBase, "ps-8", className)} {...props}>
      <span className="absolute start-2 inline-flex size-4 items-center justify-center">
        <MenuPrimitive.ItemIndicator>{tick}</MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

/** One choice in a DropdownMenuRadioGroup. */
export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem className={cn(itemBase, "ps-8", className)} {...props}>
      <span className="absolute start-2 inline-flex size-4 items-center justify-center">
        <MenuPrimitive.ItemIndicator>{dot}</MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

/** A non-interactive heading for a group of items. */
export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Label>) {
  return (
    <MenuPrimitive.Label
      className={cn("px-2.5 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  );
}

/** A shortcut hint such as "Ctrl K" on the end of an item. It is text only; it binds no keys. */
export function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("ms-auto text-xs text-muted-foreground", className)} {...props} />;
}

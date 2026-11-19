import { useEffect, useRef } from "react";

// Whether the last thing the person did was use a mouse or finger (true) or the keyboard (false).
// One shared pair of listeners serves every component; they are added on first use, never at import.
let pointer = false;
let listening = false;

function listen() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("pointerdown", () => (pointer = true), true);
  window.addEventListener("keydown", () => (pointer = false), true);
}

/** Starts tracking mouse versus keyboard use. Call once in a component that reads `lastInputWasPointer`. */
export function useFocusModality() {
  useEffect(listen, []);
}

/** True when the last interaction was a mouse or touch. */
export function lastInputWasPointer(): boolean {
  return pointer;
}

/** Puts focus on `el` without showing a focus ring, where the browser supports `focusVisible`. */
export function focusQuietly(el: HTMLElement) {
  el.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
}

/**
 * When an overlay (menu, popover, dialog) closes, focus returns to the button that opened it. That
 * is right for keyboard users, but after a mouse click the browser still draws a focus ring around
 * the button, which looks like a stray black border. Put `probe` on an empty element that is the
 * first child of the overlay's content, and pass `onCloseAutoFocus` to the content: after a mouse
 * or touch interaction, focus returns quietly, with no ring; after a key press, the ring shows as
 * normal. (`probe` runs when the content mounts, just before the overlay moves focus inside it,
 * so it can see which button had focus.)
 */
export function useQuietFocusRestore(onCloseAutoFocus?: (event: Event) => void) {
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(listen, []);
  return {
    probe: (node: HTMLElement | null) => {
      if (!node) return;
      // Radix sets `aria-controls` on the trigger to the content's id while it is open. Menus do not
      // let the mouse focus their button at all, so this is the reliable way to find it.
      const id = node.parentElement?.id;
      const controlled = id ? document.querySelector<HTMLElement>(`[aria-controls="${id}"]`) : null;
      const active = document.activeElement;
      // `body` means nothing had focus (a click does not focus a button in Safari).
      const focused = active instanceof HTMLElement && active !== document.body ? active : null;
      trigger.current = controlled ?? focused;
    },
    onCloseAutoFocus: (event: Event) => {
      onCloseAutoFocus?.(event);
      const el = trigger.current;
      if (event.defaultPrevented || !pointer || !el?.isConnected) return;
      event.preventDefault();
      focusQuietly(el);
    },
  };
}

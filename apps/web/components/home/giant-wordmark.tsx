"use client";

import { useRef } from "react";

/**
 * A huge decorative wordmark. A saffron spotlight follows the pointer across the letters. It only
 * sets two CSS variables (no re-render), is hidden from assistive tech, and shows a fixed
 * resting highlight when there is no pointer, such as on a phone.
 */
export function GiantWordmark({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  return (
    <p
      ref={ref}
      aria-hidden="true"
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      className="m-0 select-none bg-clip-text text-center font-display -mb-[0.1em] text-[clamp(9rem,54vw,62rem)] font-semibold leading-[0.74] tracking-[-0.06em] text-transparent [-webkit-background-clip:text] [background-image:radial-gradient(28rem_circle_at_var(--mx,70%)_var(--my,30%),var(--accent),var(--muted)_70%)]"
    >
      {children}
    </p>
  );
}

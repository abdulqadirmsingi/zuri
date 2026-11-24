"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { type KeyboardEvent, useId, useRef, useState } from "react";

export interface Shot {
  id: string;
  title: string;
  text: string;
  href: string;
  src: StaticImageData;
  alt: string;
}

/**
 * Whole-page blocks as a stage: the chosen page sits in the middle, its neighbours lean in at the
 * sides and can be clicked. Tabs above follow the WAI-ARIA tabs pattern (arrow keys, Home, End).
 * The slides only translate and scale, and snap without easing under reduced motion.
 */
export function PagesShowcase({ shots }: { shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = shots[active];
  if (!current) return null;

  const go = (i: number, focus = false) => {
    const next = (i + shots.length) % shots.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: shots.length - 1,
    };
    const target = keys[e.key];
    if (target === undefined) return;
    e.preventDefault();
    go(target, true);
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div
        role="tablist"
        aria-label="Page blocks"
        onKeyDown={onKey}
        className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-background p-1"
      >
        {shots.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => go(i)}
            className="min-h-9 whitespace-nowrap rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors duration-[var(--duration-base)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:bg-primary aria-selected:text-primary-foreground"
          >
            {s.title}
          </button>
        ))}
      </div>

      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${current.id}`}
        className="relative w-full overflow-x-clip py-6 [perspective:1600px]"
      >
        <div className="relative mx-auto aspect-[16/10] w-[min(100%,58rem)]">
          {shots.map((s, i) => {
            const offset = i - active;
            const near = Math.abs(offset) <= 1;
            return (
              <button
                key={s.id}
                type="button"
                tabIndex={-1}
                aria-hidden={offset !== 0}
                onClick={() => go(i)}
                style={{
                  transform: `translateX(${offset * 92}%) scale(${offset === 0 ? 1 : 0.84}) rotateY(${offset * -8}deg)`,
                  opacity: offset === 0 ? 1 : near ? 0.45 : 0,
                  zIndex: offset === 0 ? 2 : 1,
                  pointerEvents: near ? undefined : "none",
                }}
                className="absolute inset-0 block cursor-pointer overflow-hidden rounded-[1.75rem] border border-border bg-muted shadow-[0_40px_80px_-40px_rgb(0_0_0/0.45)] transition-[transform,opacity] duration-700 ease-[var(--ease-out)] motion-reduce:transition-none"
              >
                <Image
                  src={s.src}
                  alt={offset === 0 ? s.alt : ""}
                  sizes="(min-width: 1024px) 58rem, 100vw"
                  className="size-full object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex w-full max-w-[58rem] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div aria-live="polite">
          <p className="m-0 font-display text-2xl font-semibold tracking-tight">{current.title}</p>
          <p className="m-0 mt-1 text-muted-foreground">{current.text}</p>
        </div>
        <Link
          href={current.href}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Open the block <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

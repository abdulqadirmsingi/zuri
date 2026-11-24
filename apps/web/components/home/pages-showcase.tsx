"use client";

import { CopyButton } from "@registry/actions/copy-button/copy-button";
import { Pause, Play } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

export interface Shot {
  id: string;
  /** Registry item name, for the install command. */
  item: string;
  title: string;
  text: string;
  /** Docs page for the block. */
  href: string;
  /** A route that renders the block alone, shown live in the frame. */
  preview: string;
  /** Shown until the live page has loaded, and instead of it without JavaScript. */
  src: StaticImageData;
  alt: string;
}

/** The page inside the frame is laid out at one of these widths, then scaled down to fit:
 * desktop in a browser frame on wide screens, a phone layout in a phone-shaped frame on small ones. */
const DESKTOP = 1280;
const PHONE = 390;
/** How long each page stays on before the next one, while playing. */
const DWELL_MS = 7000;

/**
 * Whole-page blocks, live. A tab list (WAI-ARIA tabs: arrow keys, Home, End) beside a frame that
 * runs the real page, scaled to fit: at desktop width on wide screens, and at phone width on phones,
 * so a visitor on a phone sees the block's own mobile layout. The tabs advance by
 * themselves, with a visible timer and a pause button (WCAG 2.2.2). They stop for good once
 * someone picks a tab, pause while the pointer or focus is inside, and never start for people
 * who prefer reduced motion.
 */
export function PagesShowcase({ shots, command }: { shots: Shot[]; command: string }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState(false);
  const [scale, setScale] = useState(0);
  const [wide, setWide] = useState(true);
  const virtual = wide ? DESKTOP : PHONE;
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [seen, setSeen] = useState<string[]>([]);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setScale(entry.contentRect.width / virtual);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [virtual]);

  const currentId = shots[active]?.id;
  useEffect(() => {
    if (currentId) setSeen((ids) => (ids.includes(currentId) ? ids : [...ids, currentId]));
  }, [currentId]);

  const current = shots[active];
  if (!current) return null;

  const pick = (i: number, focus = false) => {
    const next = (i + shots.length) % shots.length;
    setActive(next);
    setPlaying(false);
    if (focus) tabs.current[next]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: shots.length - 1,
    };
    const target = keys[e.key];
    if (target === undefined) return;
    e.preventDefault();
    pick(target, true);
  };

  const running = playing && !held;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: these only pause the timer while someone is looking; nothing here acts on them
    <div
      className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div
          role="tablist"
          aria-label="Page blocks"
          aria-orientation="vertical"
          onKeyDown={onKey}
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {shots.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${s.id}`}
                aria-selected={on}
                aria-controls={`${base}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => pick(i)}
                className="group relative flex shrink-0 flex-col items-start gap-1 overflow-hidden rounded-full border border-transparent px-4 py-2.5 lg:rounded-2xl lg:px-5 lg:py-4 text-start transition-colors duration-[var(--duration-base)] hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:border-border aria-selected:bg-muted lg:min-w-0"
              >
                <span className="flex items-baseline gap-3">
                  <span className="hidden font-mono text-xs text-muted-foreground lg:inline">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="whitespace-nowrap font-display text-base font-semibold tracking-tight lg:text-lg">
                    {s.title}
                  </span>
                </span>
                <span
                  className={`hidden ps-8 text-sm lg:grid text-muted-foreground transition-[grid-template-rows,opacity] duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <span className="overflow-hidden">{s.text}</span>
                </span>
                {on && playing ? (
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-border">
                    <span
                      key={`${s.id}-${active}`}
                      onAnimationEnd={() => setActive((a) => (a + 1) % shots.length)}
                      style={{
                        animationDuration: `${DWELL_MS}ms`,
                        animationPlayState: running ? "running" : "paused",
                      }}
                      className="block h-full origin-left animate-[zuri-progress_linear_forwards] bg-accent rtl:origin-right"
                    />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex min-h-9 w-fit items-center gap-2 rounded-full px-3 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {playing ? (
            <Pause aria-hidden="true" className="size-4" />
          ) : (
            <Play aria-hidden="true" className="size-4" />
          )}
          {playing ? "Pause" : "Play"} the tour
        </button>
      </div>

      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${current.id}`}
        className="mx-auto w-full min-w-0 max-w-[22rem] overflow-hidden rounded-[2rem] border border-border bg-background shadow sm:max-w-none sm:rounded-[1.25rem]-[0_50px_100px_-40px_rgb(0_0_0/0.45)]"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
          <span aria-hidden="true" className="hidden gap-1.5 sm:flex">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-muted py-1 ps-3 pe-1">
            <code className="min-w-0 flex-1 truncate font-mono text-xs">
              {command}
              {current.item}
            </code>
            <CopyButton
              value={`${command}${current.item}`}
              iconOnly
              label={`Copy the install command for ${current.title}`}
              variant="ghost"
              size="sm"
            />
          </div>
          <Link
            href={current.href}
            className="hidden min-h-8 shrink-0 items-center rounded-full px-3 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline-flex"
          >
            Docs <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>

        <div
          ref={viewport}
          className="relative aspect-[9/16] overflow-hidden bg-muted sm:aspect-[16/10]"
        >
          {shots.map((s, i) => {
            const on = i === active;
            return (
              <div
                key={s.id}
                aria-hidden={!on}
                className={`absolute inset-0 transition-opacity duration-500 ease-[var(--ease-out)] motion-reduce:transition-none ${on ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                <Image
                  src={s.src}
                  alt={on ? s.alt : ""}
                  sizes="(min-width: 1024px) 60rem, 100vw"
                  className="absolute inset-0 size-full object-contain object-top sm:object-cover"
                />
                {/* The live page: mounted once its tab has been shown, then kept, so going back
                    is instant. It fades in over the picture when it has loaded. */}
                {scale > 0 && seen.includes(s.id) ? (
                  <iframe
                    title={`${s.title}, live preview`}
                    src={s.preview}
                    loading="lazy"
                    tabIndex={on ? 0 : -1}
                    onLoad={() => setLoaded((l) => ({ ...l, [s.id]: true }))}
                    style={{
                      width: virtual,
                      height: `${100 / scale}%`,
                      transform: `scale(${scale})`,
                    }}
                    className={`absolute start-0 top-0 origin-top-left border-0 bg-background transition-opacity duration-500 rtl:origin-top-right ${loaded[s.id] ? "opacity-100" : "opacity-0"}`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <p className="m-0 text-center text-pretty text-muted-foreground lg:hidden">{current.text}</p>
    </div>
  );
}

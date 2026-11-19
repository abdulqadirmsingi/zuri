"use client";

import { CopyButton } from "@registry/actions/copy-button/copy-button";
import Link from "next/link";
import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";

export interface StageItem {
  /** Registry name, also the docs slug. */
  id: string;
  title: string;
  description: string;
  dependencies: string[];
  /** The live demo, rendered on the server and passed in. */
  demo: ReactNode;
  command: string;
}

/**
 * A component browser. The names are a vertical tab list set as big type; choosing one puts the
 * real component on a stage, with what it is made of and the command to install it. Arrow keys
 * move through the list, Home and End jump to the ends, like any tab list.
 */
export function ComponentStage({ items }: { items: StageItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(
    0,
    items.findIndex((i) => i.id === active),
  );
  const item = items[index];

  const move = (to: number) => {
    const next = (to + items.length) % items.length;
    const target = items[next];
    if (!target) return;
    setActive(target.id);
    tabs.current[next]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    const to = keys[e.key];
    if (to === undefined) return;
    e.preventDefault();
    move(to);
  };

  if (!item) return null;
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-14">
      <div
        role="tablist"
        aria-label="Components"
        aria-orientation="vertical"
        onKeyDown={onKey}
        className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-0"
      >
        {items.map((it, i) => {
          const on = i === index;
          return (
            <button
              key={it.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${base}-tab-${it.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${base}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(it.id)}
              className={`group flex min-h-11 items-center gap-3 rounded-full border px-4 text-start text-sm font-medium transition-colors duration-[var(--duration-base)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:min-h-0 lg:rounded-none lg:border-0 lg:border-t lg:border-border lg:px-0 lg:py-1 lg:font-display lg:text-[clamp(2rem,3.6vw,3.25rem)] lg:font-semibold lg:leading-[1.1] lg:tracking-tight ${
                on
                  ? "border-foreground bg-foreground text-background lg:bg-transparent lg:text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                aria-hidden="true"
                className={`hidden w-[0.9em] shrink-0 text-accent transition-[opacity,transform,translate,scale,rotate] duration-[var(--duration-base)] lg:inline-block ${on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
              >
                →
              </span>
              {it.title}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${item.id}`}
        tabIndex={-1}
        className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border"
      >
        {/* The stage: a dotted canvas with registration marks in the corners. */}
        <div className="relative flex min-h-[22rem] items-center justify-center bg-muted p-6 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] sm:p-10">
          {["start-3 top-3", "end-3 top-3", "start-3 bottom-3", "end-3 bottom-3"].map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`absolute font-mono text-sm leading-none text-muted-foreground ${pos}`}
            >
              +
            </span>
          ))}
          <div
            key={item.id}
            className="flex w-full max-w-md animate-[zuri-rise_var(--duration-slow)_var(--ease-out)] flex-wrap items-center justify-center gap-3"
          >
            {item.demo}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border bg-background p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="m-0 font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
            <Link
              href={`/docs/components/${item.id}`}
              className="rounded-sm font-mono text-xs uppercase tracking-wider hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Open docs<span className="sr-only"> for {item.title}</span> →
            </Link>
          </div>
          <p className="m-0 max-w-xl text-muted-foreground">{item.description}</p>
          <p className="m-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Depends on{" "}
            <span className="normal-case tracking-normal text-foreground">
              {item.dependencies.length ? item.dependencies.join(", ") : "nothing"}
            </span>
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted py-1.5 ps-4 pe-1.5">
            <span aria-hidden="true" className="select-none font-mono text-sm text-accent-ink">
              $
            </span>
            <code className="min-w-0 flex-1 break-all font-mono text-xs sm:text-sm">
              {item.command}
            </code>
            <CopyButton
              value={item.command}
              iconOnly
              label={`Copy the ${item.title} command`}
              variant="ghost"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

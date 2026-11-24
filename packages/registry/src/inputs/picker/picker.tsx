"use client";

import {
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface PickerOption {
  value: string;
  /** The text shown, and the option's accessible name. */
  label: string;
  /** Options with the same group are listed together under a heading. */
  group?: string;
  disabled?: boolean;
  /** Extra words the search should match, such as synonyms. */
  keywords?: string[];
}

export interface PickerProps
  extends Omit<ComponentProps<"button">, "value" | "defaultValue" | "onChange" | "children"> {
  options: PickerOption[];
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shown when nothing is chosen. */
  placeholder?: string;
  /** Show a search box above the list. "auto" (the default) shows it from 8 options up. */
  searchable?: boolean | "auto";
  /** Name of the search box, and the label of the list. Defaults to "Search". */
  searchLabel?: string;
  /** Shown when the search matches nothing. */
  emptyText?: string;
  /** "field" looks like an input; "inline" is bare text with an underline, for use inside a sentence. */
  variant?: "field" | "inline";
  invalid?: boolean;
  /** Submitted with a form under this name. */
  name?: string;
  /** Names the panel that holds the list, for screen readers. Defaults to "Options". */
  panelLabel?: string;
  /** Extra classes for the list panel. */
  panelClassName?: string;
  /** Replaces the default chevron. */
  icon?: ReactNode;
  /** Draws the chosen option in the button. The option's label is still its accessible name. */
  renderValue?: (option: PickerOption) => ReactNode;
  /** Draws each option in the list. The row stays one option for assistive technology. */
  renderOption?: (option: PickerOption, state: { selected: boolean }) => ReactNode;
}

const chevron = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4 shrink-0 text-muted-foreground"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const tick = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4 shrink-0"
  >
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

/**
 * A dropdown made of our own parts instead of the operating system's: the same look and behaviour
 * on every device, with search, groups and full keyboard support. It follows the WAI-ARIA
 * "select-only combobox" idea: a button opens a listbox; arrow keys move, Enter chooses, Escape
 * closes, and typing jumps to a match. For a long list it adds a search box.
 */
export function Picker({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Choose…",
  searchable = "auto",
  searchLabel = "Search",
  emptyText = "No matches",
  variant = "field",
  invalid,
  name,
  panelClassName,
  panelLabel = "Options",
  icon = chevron,
  renderValue,
  renderOption,
  className,
  disabled,
  id,
  ...props
}: PickerProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const selected = options.find((o) => o.value === current);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | undefined>();
  const typed = useRef({ text: "", at: 0 });
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const base = useId();
  const showSearch = searchable === "auto" ? options.length >= 8 : searchable;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      [o.label, ...(o.keywords ?? [])].some((t) => t.toLowerCase().includes(q)),
    );
  }, [options, query]);
  const enabled = visible.filter((o) => !o.disabled);
  const optionId = (v: string) => `${base}-opt-${v}`;

  // Group headings keep the order in which each group first appears.
  const groups = useMemo(() => {
    const map = new Map<string, PickerOption[]>();
    for (const o of visible) {
      const g = o.group ?? "";
      map.set(g, [...(map.get(g) ?? []), o]);
    }
    return [...map.entries()];
  }, [visible]);

  const choose = (v: string) => {
    if (value === undefined) setInner(v);
    onValueChange?.(v);
    setOpen(false);
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      setActive(
        (selected && !selected.disabled ? selected : options.find((o) => !o.disabled))?.value,
      );
    }
  };

  // Keep the highlighted option in view, and the highlight on a real, visible option.
  useEffect(() => {
    if (!open) return;
    if (active && !enabled.some((o) => o.value === active)) setActive(enabled[0]?.value);
  }, [open, active, enabled]);
  useEffect(() => {
    if (!open || !active) return;
    document.getElementById(`${base}-opt-${active}`)?.scrollIntoView?.({ block: "nearest" });
  }, [open, active, base]);

  const move = (to: number) => {
    if (!enabled.length) return;
    const i = enabled.findIndex((o) => o.value === active);
    const next =
      enabled[(((i === -1 ? 0 : i + to) % enabled.length) + enabled.length) % enabled.length];
    setActive(next?.value);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        return move(1);
      case "ArrowUp":
        e.preventDefault();
        return move(-1);
      case "Home":
        if (showSearch) return; // leave Home and End to the text box
        e.preventDefault();
        return setActive(enabled[0]?.value);
      case "End":
        if (showSearch) return;
        e.preventDefault();
        return setActive(enabled[enabled.length - 1]?.value);
      case "Enter":
      case " ":
        if (e.key === " " && showSearch) return;
        e.preventDefault();
        return active ? choose(active) : undefined;
      default:
        // Typing jumps to the next option that starts with what was typed (no search box only).
        if (!showSearch && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const now = Date.now();
          const t = typed.current;
          t.text = now - t.at > 700 ? e.key : t.text + e.key;
          t.at = now;
          const hit = enabled.find((o) => o.label.toLowerCase().startsWith(t.text.toLowerCase()));
          if (hit) setActive(hit.value);
        }
    }
  };

  const inline = variant === "inline";
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          id={id}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? `${base}-list` : undefined}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          className={cn(
            // No ring on a mouse click (the browser decides, via :focus-visible); keyboard users still get one.
            "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
            inline
              ? "inline-flex cursor-pointer items-baseline gap-[0.15em] rounded-[0.15em] border-0 border-b-[0.07em] border-solid border-accent bg-transparent p-0 text-start text-accent-ink [font:inherit]"
              : "inline-flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-control-border bg-background px-3 text-start text-sm aria-[invalid=true]:border-danger",
            className,
          )}
          {...props}
        >
          <span className={cn("truncate", !selected && !inline && "text-muted-foreground")}>
            {selected ? (renderValue ? renderValue(selected) : selected.label) : placeholder}
          </span>
          {inline ? (
            <span aria-hidden="true" className="text-[0.28em] text-accent-ink">
              ▼
            </span>
          ) : (
            icon
          )}
        </button>
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={current ?? ""} /> : null}
      <PopoverContent
        align="start"
        aria-label={panelLabel}
        sideOffset={inline ? 10 : 6}
        // The list takes focus itself, so the keys below work the moment it opens.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          // On a touch screen, focusing the search box would raise the on-screen keyboard over the
          // list, so focus the list instead; the search box is one tap away.
          const touch = window.matchMedia?.("(pointer: coarse)").matches;
          (showSearch && !touch ? searchRef.current : listRef.current)?.focus({
            preventScroll: true,
          });
        }}
        className={cn(
          "w-auto min-w-[max(12rem,var(--radix-popover-trigger-width))] max-w-[calc(100vw-1rem)] p-1 font-sans text-base",
          panelClassName,
        )}
      >
        {showSearch ? (
          <input
            ref={searchRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${base}-list`}
            aria-activedescendant={active ? optionId(active) : undefined}
            aria-label={searchLabel}
            placeholder={`${searchLabel}…`}
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="mb-1 min-h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-foreground/10 focus-visible:outline-none"
          />
        ) : null}
        <div
          ref={listRef}
          id={`${base}-list`}
          role="listbox"
          aria-label={searchLabel}
          tabIndex={showSearch ? -1 : 0}
          aria-activedescendant={!showSearch && active ? optionId(active) : undefined}
          onKeyDown={showSearch ? undefined : onKeyDown}
          className="max-h-64 overflow-y-auto focus-visible:outline-none"
        >
          {groups.map(([group, items]) => (
            <div key={group || "_"} role="presentation">
              {group ? (
                <div
                  aria-hidden="true"
                  className="px-2.5 pt-2 pb-1 font-mono text-xs uppercase tracking-wider text-muted-foreground"
                >
                  {group}
                </div>
              ) : null}
              <div role="presentation">
                {items.map((o) => (
                  // Keyboard users move with the arrow keys on the list; the click is for the mouse.
                  // biome-ignore lint/a11y/useKeyWithClickEvents: the listbox handles the keys.
                  <div
                    key={o.value}
                    tabIndex={-1}
                    id={optionId(o.value)}
                    role="option"
                    aria-selected={o.value === current}
                    aria-disabled={o.disabled || undefined}
                    data-active={o.value === active || undefined}
                    onPointerMove={() => !o.disabled && setActive(o.value)}
                    onClick={() => !o.disabled && choose(o.value)}
                    className={cn(
                      "flex min-h-9 cursor-pointer select-none items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-sm",
                      "data-[active]:bg-muted aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                      o.value === current && "font-medium",
                    )}
                  >
                    {renderOption ? (
                      renderOption(o, { selected: o.value === current })
                    ) : (
                      <span className="truncate">{o.label}</span>
                    )}
                    {o.value === current ? tick : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {visible.length === 0 ? (
            <div role="presentation" className="px-2.5 py-3 text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

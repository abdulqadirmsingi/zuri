"use client";

import {
  type ChangeEvent,
  type ClipboardEvent,
  type ComponentProps,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { Picker, type PickerOption } from "@/components/ui/picker";
import { cn } from "@/lib/utils";
import { COUNTRIES, type Country } from "./countries";
import {
  digitsOf,
  findByDial,
  flagEmoji,
  groupDigits,
  isPlausible,
  MAX_DIGITS,
  toE164,
} from "./phone-number";

export interface PhoneDetails {
  /** ISO code of the chosen country. */
  country: string;
  /** The digits typed after the country code, exactly as typed (a leading 0 is kept). */
  national: string;
  /** Whether the number has a plausible length. A length check only. */
  valid: boolean;
}

export interface PhoneInputProps
  extends Omit<
    ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "size" | "type" | "children"
  > {
  /** Controlled value in E.164 form, such as "+255712345678", or "" when empty. */
  value?: string;
  /** Initial value when uncontrolled, in E.164 form. */
  defaultValue?: string;
  /** Called with the E.164 number ("" while empty) and details about it. */
  onValueChange?: (e164: string, details: PhoneDetails) => void;
  /** ISO code of the country shown first. Defaults to "TZ". */
  defaultCountry?: string;
  /** The countries to offer. Defaults to a built-in list. */
  countries?: readonly Country[];
  /** ISO codes listed first under "Common". Defaults to TZ, KE, UG and RW. */
  preferred?: readonly string[];
  /**
   * "joined": the country button and the number share one control. "split": two separate fields.
   * "chip": a saffron chip with the dial code sits inside the field. These three have a country
   * dropdown. "fixed" has none: the country is `defaultCountry` and its code shows as plain text.
   * "plain" is only the number field, for when the country is obvious from the page.
   */
  layout?: "joined" | "split" | "chip" | "fixed" | "plain";
  variant?: InputProps["variant"];
  size?: InputProps["size"];
  /** Also show the country's name next to the code on the button. */
  showName?: boolean;
  /**
   * What marks each country. "emoji" (the default) draws the flag as text, with no images or
   * requests; "code" shows the two-letter code in a small tile instead.
   */
  flags?: "emoji" | "code";
  /** Draws your own mark for an ISO code, such as a flag image. Overrides `flags`. */
  renderFlag?: (iso: string) => ReactNode;
  /** Whether a leading 0 is dropped from the E.164 output. Defaults to true. */
  stripLeadingZero?: boolean;
  invalid?: boolean;
  /** Submitted with a form: a hidden field holds the E.164 number under this name. */
  name?: string;
  /** Names the country button. Defaults to "Country". */
  countryLabel?: string;
  /** Names the country search box. Defaults to "Search countries". */
  searchLabel?: string;
  emptyText?: string;
  /** Classes for the outer control. */
  className?: string;
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
    className="size-3.5 shrink-0 opacity-70"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const triggerHeight = { sm: "min-h-8", md: "min-h-10", lg: "min-h-12" } as const;
const DEFAULT_PREFERRED = ["TZ", "KE", "UG", "RW"] as const;

/**
 * A phone number field with a country picker. It keeps the number as digits, shows it grouped, and
 * reports it in E.164 form. Pasting a full international number (+255 712 345 678) switches the
 * country for you.
 *
 * It checks length only: for real validation of a number plan, use a library such as
 * libphonenumber on your server. It never stores or sends the number anywhere itself.
 */
export function PhoneInput({
  value,
  defaultValue,
  onValueChange,
  defaultCountry = "TZ",
  countries = COUNTRIES,
  preferred = DEFAULT_PREFERRED,
  layout = "joined",
  variant,
  size: sizeProp,
  showName = false,
  flags = "emoji",
  renderFlag,
  stripLeadingZero = true,
  invalid,
  name,
  countryLabel = "Country",
  searchLabel = "Search countries",
  emptyText = "No country found",
  className,
  disabled,
  placeholder,
  ref,
  onPaste,
  ...props
}: PhoneInputProps) {
  const size = sizeProp ?? "md";
  const byIso = useMemo(() => new Map(countries.map((c) => [c.iso, c])), [countries]);
  const fallback = byIso.get(defaultCountry) ?? countries[0];
  if (!fallback) throw new Error("PhoneInput needs at least one country.");

  const start = useMemo(() => {
    const found = defaultValue
      ? findByDial(digitsOf(defaultValue), countries, defaultCountry)
      : null;
    return { iso: found?.country.iso ?? fallback.iso, national: found?.national ?? "" };
  }, [defaultValue, countries, defaultCountry, fallback.iso]);
  const [iso, setIso] = useState(start.iso);
  const [national, setNational] = useState(start.national);
  const country = byIso.get(iso) ?? fallback;
  const pickerEnabled = layout !== "fixed" && layout !== "plain";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastEmitted = useRef(toE164(country, national, stripLeadingZero));
  const caret = useRef<number | null>(null);

  // A controlled value that did not come from this field's own last change replaces what is shown.
  // The check keeps a typed leading 0 on screen even though the E.164 echo drops it.
  useEffect(() => {
    if (value === undefined || value === lastEmitted.current) return;
    const found = value ? findByDial(digitsOf(value), countries, iso) : null;
    lastEmitted.current = value;
    if (found) {
      setIso(found.country.iso);
      setNational(found.national);
    } else if (!value) setNational("");
  }, [value, countries, iso]);

  // After the digits are regrouped, put the caret back after the same digit it was after.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (caret.current === null || !el || document.activeElement !== el) return;
    const wanted = caret.current;
    caret.current = null;
    let seen = 0;
    let at = 0;
    while (at < el.value.length && seen < wanted) {
      if (/\d/.test(el.value[at] ?? "")) seen++;
      at++;
    }
    el.setSelectionRange(at, at);
  });

  const maxNational = (c: Country) => MAX_DIGITS - c.dial.length + (stripLeadingZero ? 1 : 0);

  function commit(next: Country, digits: string) {
    const clipped = digits.slice(0, maxNational(next));
    setIso(next.iso);
    setNational(clipped);
    const e164 = toE164(next, clipped, stripLeadingZero);
    lastEmitted.current = e164;
    onValueChange?.(e164, { country: next.iso, national: clipped, valid: isPlausible(e164) });
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const el = event.target;
    caret.current = digitsOf(el.value.slice(0, el.selectionStart ?? el.value.length)).length;
    commit(country, digitsOf(el.value));
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    onPaste?.(event);
    if (event.defaultPrevented) return;
    const text = event.clipboardData.getData("text").trim();
    if (!/^(\+|00)/.test(text)) return;
    // "+255 712…" and "00255 712…" both mean the same thing: the digits after the prefix.
    const all = digitsOf(text);
    const found = findByDial(text.startsWith("00") ? all.slice(2) : all, countries, iso);
    if (!found) return;
    // Without a dropdown the country cannot change, so only a number for this country is read.
    if (!pickerEnabled && found.country.dial !== country.dial) return;
    event.preventDefault();
    commit(found.country, found.national);
  }

  const e164 = toE164(country, national, stripLeadingZero);
  const options: PickerOption[] = useMemo(() => {
    const pinned = preferred.filter((p, i) => byIso.has(p) && preferred.indexOf(p) === i);
    const make = (c: Country, group: string): PickerOption => ({
      value: c.iso,
      label: c.name,
      group,
      keywords: [c.iso, c.dial, `+${c.dial}`],
    });
    return [
      ...pinned.map((p) => make(byIso.get(p) as Country, "Common")),
      // Each country appears once, so an option's value is also its unique id.
      ...countries.filter((c) => !pinned.includes(c.iso)).map((c) => make(c, "All countries")),
    ];
  }, [countries, preferred, byIso]);

  const mark = (c: Country) =>
    renderFlag ? (
      <span aria-hidden="true" className="inline-flex shrink-0 items-center">
        {renderFlag(c.iso)}
      </span>
    ) : flags === "emoji" ? (
      <span
        aria-hidden="true"
        className="inline-flex w-5 shrink-0 items-center justify-center text-base leading-none [font-family:'Apple_Color_Emoji','Segoe_UI_Emoji','Noto_Color_Emoji',sans-serif]"
      >
        {flagEmoji(c.iso)}
      </span>
    ) : (
      <span
        aria-hidden="true"
        className="inline-flex h-5 min-w-7 shrink-0 items-center justify-center rounded-sm border border-border bg-muted px-1 font-mono text-[0.65rem] font-medium leading-none text-foreground"
      >
        {c.iso}
      </span>
    );

  const chip = layout === "chip";
  // What is written on the button, so the spoken name always contains it. Flags are decorative.
  const visibleText =
    chip || flags === "emoji" || renderFlag
      ? `+${country.dial}`
      : `${country.iso} +${country.dial}`;
  const picker = (
    <Picker
      aria-label={`${countryLabel}: ${visibleText}, ${country.name}`}
      options={options}
      value={iso}
      onValueChange={(next) => {
        const c = byIso.get(next);
        if (c) commit(c, national);
      }}
      searchable
      searchLabel={searchLabel}
      emptyText={emptyText}
      panelLabel={countryLabel}
      disabled={disabled}
      icon={chevron}
      panelClassName="w-72"
      className={cn(
        layout === "split"
          ? cn("w-auto min-w-[9.5rem]", triggerHeight[size])
          : // joined: a segment flush with the field's edge. It runs the full height, has a clean
            // divider on its far side, and tints softly on hover. The group clips it to the rounded
            // corners, so the focus outline is drawn inside it.
            "h-auto min-h-0 w-auto gap-1.5 self-stretch rounded-none border-0 border-e border-border bg-transparent ps-3 pe-2.5 text-sm text-foreground hover:bg-foreground/5 aria-expanded:bg-foreground/5 focus-visible:outline-offset-[-2px]",
        chip &&
          "rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground hover:bg-accent hover:opacity-90",
      )}
      renderValue={(o) => {
        const c = byIso.get(o.value) as Country;
        return (
          <span className="inline-flex items-center gap-1.5">
            {chip ? null : mark(c)}
            <span className="tabular-nums">+{c.dial}</span>
            {showName && !chip ? <span className="hidden truncate sm:inline">{c.name}</span> : null}
          </span>
        );
      }}
      renderOption={(o) => {
        const c = byIso.get(o.value) as Country;
        return (
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            {mark(c)}
            <span className="truncate">{c.name}</span>
            <span className="ms-auto ps-2 tabular-nums text-muted-foreground">+{c.dial}</span>
          </span>
        );
      }}
    />
  );

  const numberProps = {
    ref: (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    type: "tel",
    inputMode: "tel" as const,
    autoComplete: "tel-national",
    value: groupDigits(national),
    onChange,
    onPaste: handlePaste,
    disabled,
    placeholder,
    "aria-invalid": invalid || props["aria-invalid"] || undefined,
    ...props,
  };
  // Pasting and typing both end here, so the form gets one clean value.
  const hidden = name ? <input type="hidden" name={name} value={e164} /> : null;

  if (layout === "plain") {
    return (
      <>
        <Input {...numberProps} variant={variant} size={size} className={className} />
        {hidden}
      </>
    );
  }
  if (layout === "split") {
    return (
      <div className={cn("flex w-full items-start gap-2", className)}>
        {picker}
        <Input {...numberProps} variant={variant} size={size} className="flex-1" />
        {hidden}
      </div>
    );
  }
  return (
    <InputGroup
      variant={variant}
      size={size}
      // The segment sits flush against the left edge, so the group gives up its own padding there.
      className={cn(!chip && "ps-0 overflow-hidden", className)}
      start={
        <>
          {layout === "fixed" ? (
            // No dropdown: the code is plain text, so it is not a control and not in the tab order.
            <span className="inline-flex items-center gap-1.5 self-stretch border-e border-border ps-3 pe-2.5 text-sm text-foreground">
              {mark(country)}
              <span className="tabular-nums">+{country.dial}</span>
            </span>
          ) : (
            picker
          )}
        </>
      }
    >
      <input {...numberProps} />
      {hidden}
    </InputGroup>
  );
}

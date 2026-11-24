import { ProgressiveBlur } from "@registry/display/progressive-blur/progressive-blur";

const rows = [
  ["School fees", "Today, 09:12", "TZS 45,000"],
  ["Mobile data bundle", "Today, 08:40", "TZS 5,000"],
  ["Water bill", "Yesterday", "TZS 18,500"],
  ["Rent share", "Yesterday", "TZS 150,000"],
  ["Groceries", "Mon", "TZS 32,400"],
  ["Electricity token", "Mon", "TZS 20,000"],
  ["Bus fare", "Sun", "TZS 2,500"],
  ["Refund: school kit", "Sat", "TZS 12,000"],
  ["Savings top-up", "Fri", "TZS 50,000"],
  ["Pharmacy", "Thu", "TZS 14,300"],
];

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring";

function List({ className }: { className?: string }) {
  return (
    <section
      aria-label="Recent transactions"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs a tab stop so keyboard users can scroll it.
      tabIndex={0}
      className={`h-full overflow-y-auto p-4 ${focus} ${className ?? ""}`}
    >
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {rows.map(([name, when, amount]) => (
          <li
            key={name}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-3 text-sm"
          >
            <span className="flex flex-col">
              <span className="font-medium">{name}</span>
              <span className="text-xs text-muted-foreground">{when}</span>
            </span>
            <span className="tabular-nums">{amount}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const frame = "relative h-72 w-full max-w-sm overflow-hidden rounded-xl border border-border";

export function BlurBottom() {
  return (
    <div className={frame}>
      {/* Bottom padding as tall as the blur, so the last row can scroll clear of it. */}
      <List className="pb-28" />
      <ProgressiveBlur />
    </div>
  );
}

export function BlurBoth() {
  return (
    <div className={frame}>
      <List className="py-20" />
      <ProgressiveBlur side="top" size="4.5rem" fade />
      <ProgressiveBlur side="bottom" size="4.5rem" fade />
    </div>
  );
}

export function BlurSide() {
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border">
      <section
        aria-label="Cards"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs a tab stop so keyboard users can scroll it.
        tabIndex={0}
        className={`flex gap-3 overflow-x-auto p-4 pe-24 ${focus}`}
      >
        {rows.slice(0, 6).map(([name, , amount]) => (
          <div
            key={name}
            className="flex h-28 w-36 shrink-0 flex-col justify-between rounded-lg border border-border bg-background p-3 text-sm"
          >
            <span className="font-medium">{name}</span>
            <span className="tabular-nums text-muted-foreground">{amount}</span>
          </div>
        ))}
      </section>
      <ProgressiveBlur side="right" size="5rem" strength={10} steps={4} />
    </div>
  );
}

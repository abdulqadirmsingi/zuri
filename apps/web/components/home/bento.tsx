import { Reveal } from "@registry/blocks/reveal/reveal";
import { InstallCommand } from "./install-command";

const title =
  "m-0 text-balance font-display text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl";
const body = "m-0 text-pretty leading-relaxed text-foreground/70";
const card = "flex flex-col gap-4 overflow-hidden rounded-[2rem] p-7 sm:p-9";

const checks = [
  "Keyboard and screen-reader friendly",
  "Light, dark and right-to-left",
  "Glass that stays readable",
  "One file you can read in a minute",
];

const chips = ["TZS 25,000", "+255 7•• ••• •••", "Code: 4 8 1 5"];

/** Four soft, tinted cards: what you get, who it is for, how light it is, and the command. */
export function Bento({ count, command }: { count: number; command: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
      <Reveal className={`${card} bg-tint-butter lg:row-span-2`}>
        <h3 className={title}>What is in the box</h3>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-full bg-background/70 text-sm"
              >
                ✓
              </span>
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-10 font-display text-8xl font-semibold leading-none tracking-tight sm:text-9xl">
          {count}
          <span className="ms-3 font-mono text-sm font-normal tracking-wider uppercase text-foreground/70">
            parts, all free
          </span>
        </p>
      </Reveal>

      <Reveal delay={80} className={`${card} bg-tint-coral`}>
        <h3 className={title}>Made with East Africa in mind</h3>
        <p className={body}>
          Money in shillings, phone numbers that start at +255, and a code field that behaves.
        </p>
        <ul className="m-0 mt-auto flex list-none flex-wrap gap-2 p-0 pt-6">
          {chips.map((c) => (
            <li
              key={c}
              className="rounded-full bg-background/75 px-4 py-2 font-mono text-sm text-foreground"
            >
              {c}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={160} className={`${card} bg-tint-mint`}>
        <h3 className={title}>Light to ship. Yours to change.</h3>
        <p className={body}>Copy it in, edit it, delete what you do not need. Nothing to update.</p>
        <ul className="m-0 mt-auto flex list-none gap-2 p-0 pt-6">
          {["Copy", "Edit", "Ship"].map((w) => (
            <li
              key={w}
              className="grid h-16 flex-1 place-items-center rounded-2xl bg-background/75 text-sm font-medium"
            >
              {w}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={120} className={`${card} bg-tint-sky lg:col-span-2`}>
        <h3 className={title}>
          Designed for developers.
          <br />
          One command, one file.
        </h3>
        <p className={`${body} max-w-xl`}>
          Works with the shadcn CLI. The component and the few packages it needs land in your
          project.
        </p>
        <div className="mt-auto max-w-2xl pt-6">
          <InstallCommand command={command} />
        </div>
      </Reveal>
    </div>
  );
}

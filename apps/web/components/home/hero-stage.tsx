"use client";

import { OtpInput } from "@registry/inputs/otp-input/otp-input";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Seg = [text: string, tone?: "k" | "s" | "c" | "f" | "t"];

// Real lines from packages/registry/src/inputs/otp-input/otp-input.tsx, lightly trimmed.
const lines: Seg[][] = [
  [["export function ", "k"], ["OtpInput", "f"], ["({"]],
  [["  length = "], ["6", "s"], [","]],
  [["  verify,"]],
  [["  size = "], ['"md"', "s"], [","]],
  [["  tone = "], ['"soft"', "s"], [","]],
  [["  ...rest"]],
  [["}: "], ["OtpInputProps", "t"], [") {"]],
  [["  const ", "k"], ["[code, setCode] = "], ["useState", "f"], ['("")', "s"], [";"]],
  [
    ["  const ", "k"],
    ["[phase, setPhase] = "],
    ["useState", "f"],
    ["<"],
    ["Phase", "t"],
    [">("],
    ['"type"', "s"],
    [");"],
  ],
  [["  // A fresh id for the filter, because", "c"]],
  [["  // two rows on one page must not share one.", "c"]],
  [["  const ", "k"], ["gooId = "], ["`otp-goo-${", "s"], ["useId", "f"], ["()}`", "s"], [";"]],
];

const tones = {
  k: "text-[oklch(0.75_0.14_310)]",
  s: "text-[oklch(0.8_0.12_150)]",
  c: "text-[oklch(0.6_0_0)] italic",
  f: "text-[oklch(0.82_0.12_80)]",
  t: "text-[oklch(0.78_0.1_230)]",
};

/**
 * The hero's picture is the product itself: a working code field in front of the file it comes
 * from. The editor is always dark (the `dark` class) and decorative; the card in front is the real
 * component, so typing six digits plays its verify-and-fuse animation.
 */
export function HeroStage() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:h-[32rem] lg:max-w-none">
      <div
        aria-hidden="true"
        className="dark absolute end-0 top-0 hidden w-[92%] overflow-hidden rounded-2xl border border-white/10 bg-background text-foreground shadow-[0_40px_90px_-30px_rgb(0_0_0/0.55)] lg:block"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono text-xs">
            otp-input.tsx
          </span>
          <span className="font-mono text-xs text-muted-foreground">components/ui</span>
        </div>
        <pre className="m-0 overflow-hidden py-4 font-mono text-[0.8rem] leading-6">
          {lines.map((segs, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed listing that never reorders
            <div key={i} className="flex">
              <span className="w-10 shrink-0 pe-4 text-end text-white/50 select-none">{i + 1}</span>
              <span className="whitespace-pre">
                {segs.map(([text, tone], j) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: segments of a fixed line
                  <span key={j} className={tone ? tones[tone] : undefined}>
                    {text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </pre>
      </div>

      <div className="zuri-float relative rounded-[1.5rem] border border-black/5 bg-background p-7 shadow-[0_30px_70px_-25px_rgb(0_0_0/0.4)] lg:absolute lg:bottom-0 lg:start-0 lg:w-[25rem]">
        <p className="m-0 font-display text-2xl font-semibold tracking-tight">Enter the code</p>
        <p className="m-0 mt-1 mb-6 text-sm text-muted-foreground">
          Type any six digits. This one is live.
        </p>
        <OtpInput
          aria-label="Verification code"
          verify={async () => {
            await wait(900);
            return true;
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { Button } from "@registry/actions/button/button";
import { Badge } from "@registry/display/badge/badge";
import { Progress } from "@registry/display/progress/progress";
import { OtpInput } from "@registry/inputs/otp-input/otp-input";
import { Switch } from "@registry/inputs/switch/switch";
import { useId, useState } from "react";

const card =
  "rounded-2xl border border-black/5 bg-background/90 p-5 text-foreground shadow-[0_24px_60px_-24px_rgb(0_0_0/0.35)] backdrop-blur supports-[not(backdrop-filter:blur(1px))]:bg-background";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * The hero's "illustration" is the product: four real Zuri components, working, on floating cards.
 * On small screens only the code field shows, so the headline keeps the room it needs.
 */
export function HeroStage() {
  const motionId = useId();
  const [calm, setCalm] = useState(false);
  return (
    <div className="relative mx-auto w-full max-w-md lg:h-[30rem] lg:max-w-none">
      <div className={`${card} zuri-float lg:absolute lg:start-[8%] lg:top-[6%] lg:w-[23rem]`}>
        <p className="m-0 mb-1 text-sm font-semibold">Check your phone</p>
        <p className="m-0 mb-4 text-xs text-muted-foreground">
          Type any six digits. It is the real component.
        </p>
        <OtpInput
          aria-label="Verification code"
          size="sm"
          verify={async () => {
            await wait(900);
            return true;
          }}
        />
      </div>

      <div
        className={`${card} hidden [animation-delay:-2s] zuri-float lg:absolute lg:end-[4%] lg:top-[38%] lg:block lg:w-64`}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="m-0 text-sm font-semibold">Uploading</p>
          <Badge variant="success">On track</Badge>
        </div>
        <Progress value={68} aria-label="Upload progress" />
        <p className="m-0 mt-2 font-mono text-xs text-muted-foreground">68%</p>
      </div>

      <div
        className={`${card} hidden [animation-delay:-4s] zuri-float lg:absolute lg:bottom-[4%] lg:start-[2%] lg:block lg:w-72`}
      >
        <div className="flex items-center justify-between gap-4">
          <label htmlFor={motionId} className="text-sm font-medium">
            Reduce motion
          </label>
          <Switch id={motionId} checked={calm} onChange={(e) => setCalm(e.target.checked)} />
        </div>
        <p className="m-0 mt-2 text-xs text-muted-foreground">
          {calm ? "Every animation now fades instead." : "Honoured by every component."}
        </p>
      </div>

      <div
        className={`${card} hidden p-3 [animation-delay:-1s] zuri-float lg:absolute lg:end-[3%] lg:top-[4%] lg:block`}
      >
        <Button shape="pill" size="sm">
          Ship it
        </Button>
      </div>
    </div>
  );
}

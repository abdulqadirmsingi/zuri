"use client";

import { Button } from "@registry/actions/button/button";
import { Field } from "@registry/inputs/field/field";
import { OtpInput } from "@registry/inputs/otp-input/otp-input";
import { useState } from "react";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** A real app calls its server here. The demo answers after a short pause, as a network would. */
function useAnswer() {
  const [accept, setAccept] = useState(true);
  const verify = async () => {
    await wait(900);
    return accept;
  };
  const knob = (
    <fieldset className="m-0 flex flex-wrap items-center justify-center gap-2 border-0 p-0">
      <legend className="sr-only">The answer the demo gives</legend>
      <Button
        size="sm"
        shape="pill"
        variant={accept ? "default" : "outline"}
        aria-pressed={accept}
        onClick={() => setAccept(true)}
      >
        Accept any code
      </Button>
      <Button
        size="sm"
        shape="pill"
        variant={accept ? "outline" : "default"}
        aria-pressed={!accept}
        onClick={() => setAccept(false)}
      >
        Reject any code
      </Button>
    </fieldset>
  );
  return { verify, knob };
}

export function OtpInputDefault() {
  const { verify, knob } = useAnswer();
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      <Field label="Verification code" hint="Type six digits, or paste them.">
        {(control) => <OtpInput {...control} label={null} verify={verify} className="mx-auto" />}
      </Field>
      {knob}
    </div>
  );
}

export function OtpInputVariants() {
  const { verify, knob } = useAnswer();
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <OtpInput length={4} size="lg" label="4-digit code, large" verify={verify} />
      <OtpInput tone="accent" label="6-digit code, accent" verify={verify} />
      <OtpInput size="sm" fuse={false} label="6-digit code, no merge" verify={verify} />
      {knob}
    </div>
  );
}

export function OtpInputForm() {
  const [sent, setSent] = useState("");
  return (
    <form
      className="flex w-full max-w-sm flex-col items-center gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(new FormData(e.currentTarget).get("code") as string);
      }}
    >
      <OtpInput name="code" label="Code from the text message" onComplete={() => setSent("")} />
      <Button type="submit">Confirm</Button>
      <p role="status" className="m-0 text-sm text-muted-foreground">
        {sent
          ? `Submitted: ${sent}`
          : "Without verify, the field just collects the code for a form."}
      </p>
    </form>
  );
}

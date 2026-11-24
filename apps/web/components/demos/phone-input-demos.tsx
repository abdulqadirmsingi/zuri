"use client";

import { Field } from "@registry/inputs/field/field";
import { PhoneInput } from "@registry/inputs/phone-input/phone-input";
import { useState } from "react";

const stack = "flex w-full max-w-sm flex-col gap-5";

export function PhoneInputDefault() {
  const [value, setValue] = useState("");
  const [valid, setValid] = useState(false);
  return (
    <div className={stack}>
      <Field label="Phone number" hint="Try pasting +254 712 345 678: the country follows.">
        {(control) => (
          <PhoneInput
            {...control}
            placeholder="712 345 678"
            onValueChange={(e164, d) => {
              setValue(e164);
              setValid(d.valid);
            }}
          />
        )}
      </Field>
      <p role="status" className="m-0 font-mono text-xs text-muted-foreground">
        {value ? `${value} · ${valid ? "plausible length" : "keep typing"}` : "E.164 appears here"}
      </p>
    </div>
  );
}

export function PhoneInputLayouts() {
  return (
    <div className={stack}>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Joined
        </span>
        <PhoneInput aria-label="Phone number, joined" placeholder="712 345 678" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Split
        </span>
        <PhoneInput aria-label="Phone number, split" layout="split" placeholder="712 345 678" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Chip
        </span>
        <PhoneInput aria-label="Phone number, chip" layout="chip" placeholder="712 345 678" />
      </div>
    </div>
  );
}

export function PhoneInputLooks() {
  return (
    <div className={stack}>
      <PhoneInput aria-label="Soft" variant="soft" placeholder="Soft" />
      <PhoneInput aria-label="Underline" variant="underline" placeholder="Underline" />
      <PhoneInput aria-label="Code tile instead of a flag" flags="code" placeholder="Code tile" />
      <PhoneInput aria-label="Large, with country name" size="lg" showName placeholder="Large" />
      <PhoneInput aria-label="Small" size="sm" placeholder="Small" />
      <PhoneInput aria-label="Invalid" invalid defaultValue="+25571" />
      <PhoneInput aria-label="Disabled" disabled defaultValue="+255712345678" />
    </div>
  );
}

export function PhoneInputNoDropdown() {
  return (
    <div className={stack}>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Fixed code
        </span>
        <PhoneInput
          aria-label="Phone number, fixed code"
          layout="fixed"
          placeholder="712 345 678"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Fixed, Kenya
        </span>
        <PhoneInput
          aria-label="Phone number, fixed Kenya"
          layout="fixed"
          defaultCountry="KE"
          placeholder="712 345 678"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Number only
        </span>
        <PhoneInput
          aria-label="Phone number, number only"
          layout="plain"
          placeholder="0712 345 678"
        />
      </div>
    </div>
  );
}

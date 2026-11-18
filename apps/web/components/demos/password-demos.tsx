"use client";

import { Button } from "@registry/actions/button/button";
import {
  PasswordStrength,
  scorePassword,
} from "@registry/inputs/password-strength/password-strength";
import { useState } from "react";

export function PasswordDefault() {
  return (
    <PasswordStrength label="New password" hint="Longer is stronger. A short phrase works well." />
  );
}

/** A form that refuses a weak password, so the error and the shake can be seen. */
export function PasswordWithError() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const score = scorePassword(value);
        setError(score.level < 3 ? "Choose a stronger password before continuing." : undefined);
      }}
    >
      <PasswordStrength
        label="Create a password"
        name="password"
        value={value}
        onValueChange={(v) => {
          setValue(v);
          setError(undefined);
        }}
        error={error}
      />
      <Button type="submit">Continue</Button>
    </form>
  );
}

export function PasswordReworded() {
  return (
    <PasswordStrength
      label="Choose a password"
      defaultValue="Maji-ya-moto-9"
      shortLength={10}
      messages={{
        meterLabel: "How strong is it?",
        words: { weak: "Needs work", fair: "Getting there", good: "Nice", strong: "Great" },
        checksLabel: "What makes it strong",
      }}
    />
  );
}

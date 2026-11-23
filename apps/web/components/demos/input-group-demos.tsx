"use client";

import { Button } from "@registry/actions/button/button";
import { Input } from "@registry/inputs/input/input";
import { InputGroup } from "@registry/inputs/input-group/input-group";
import { Label } from "@registry/inputs/label/label";
import { useState } from "react";

const stack = "flex w-full max-w-sm flex-col gap-4";

const search = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);
const eye = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" />
    <circle cx="8" cy="8" r="2" />
  </svg>
);
const clear = (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

export function InputGroupDefault() {
  return (
    <div className={stack}>
      <InputGroup start={search}>
        <Input aria-label="Search components" type="search" placeholder="Search components" />
      </InputGroup>
      <div className="flex flex-col gap-2">
        <Label htmlFor="grp-phone">Phone number</Label>
        <InputGroup start={<span className="text-sm">+255</span>}>
          <Input id="grp-phone" type="tel" autoComplete="tel-national" placeholder="7XX XXX XXX" />
        </InputGroup>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="grp-amount">Amount</Label>
        <InputGroup end={<span className="text-sm">TZS</span>}>
          <Input id="grp-amount" inputMode="numeric" placeholder="0" />
        </InputGroup>
      </div>
    </div>
  );
}

export function InputGroupButtons() {
  const [shown, setShown] = useState(false);
  const [query, setQuery] = useState("Kilele");
  return (
    <div className={stack}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="grp-pass">Password</Label>
        <InputGroup
          end={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Show password"
              aria-pressed={shown}
              onClick={() => setShown((s) => !s)}
            >
              {eye}
            </Button>
          }
        >
          <Input
            id="grp-pass"
            type={shown ? "text" : "password"}
            autoComplete="new-password"
            defaultValue="correct horse"
          />
        </InputGroup>
      </div>
      <InputGroup
        start={search}
        end={
          query ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              {clear}
            </Button>
          ) : null
        }
      >
        <Input
          aria-label="Search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>
    </div>
  );
}

export function InputGroupLooks() {
  return (
    <div className={stack}>
      <InputGroup variant="soft" start={search}>
        <Input aria-label="Soft" placeholder="Soft" />
      </InputGroup>
      <InputGroup variant="underline" start={search}>
        <Input aria-label="Underline" placeholder="Underline" />
      </InputGroup>
      <InputGroup size="lg" start={search} end={<span className="text-sm">TZS</span>}>
        <Input aria-label="Large" placeholder="Large" />
      </InputGroup>
      <InputGroup end={<span className="text-sm">TZS</span>}>
        <Input aria-label="Invalid amount" invalid defaultValue="abc" />
      </InputGroup>
    </div>
  );
}

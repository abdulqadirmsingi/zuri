"use client";

import { SwellNav, type SwellNavItem } from "@registry/navigation/swell-nav/swell-nav";
import { useState } from "react";

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const swellItems: SwellNavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg aria-hidden="true" {...svg}>
        <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    id: "search",
    label: "Search",
    icon: (
      <svg aria-hidden="true" {...svg}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-4.2-4.2" />
      </svg>
    ),
  },
  {
    id: "send",
    label: "Send",
    icon: (
      <svg aria-hidden="true" {...svg}>
        <path d="M4 12l16-8-6 16-3-7z" />
      </svg>
    ),
  },
  {
    id: "saved",
    label: "Saved",
    icon: (
      <svg aria-hidden="true" {...svg}>
        <path d="M6 4h12v16l-6-4-6 4z" />
      </svg>
    ),
  },
  {
    id: "me",
    label: "Profile",
    icon: (
      <svg aria-hidden="true" {...svg}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5" />
      </svg>
    ),
  },
];

const screens: Record<string, string> = {
  home: "Your day at a glance",
  search: "Find anything",
  send: "Move money in seconds",
  saved: "Things you kept",
  me: "Your account",
};

/** A phone-like frame, so the bar sits at the bottom of something. */
export function SwellNavDefault() {
  const [tab, setTab] = useState("home");
  return (
    <div className="mx-auto flex h-80 w-full max-w-sm flex-col justify-between overflow-hidden rounded-3xl border border-border bg-muted">
      <div className="p-6">
        <p className="m-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {tab}
        </p>
        <p className="m-0 mt-2 text-2xl font-semibold tracking-tight">{screens[tab]}</p>
      </div>
      <SwellNav items={swellItems} value={tab} onValueChange={setTab} />
    </div>
  );
}

export function SwellNavFour() {
  return (
    <div className="mx-auto flex h-72 w-full max-w-sm flex-col justify-end overflow-hidden rounded-3xl border border-border bg-muted">
      <SwellNav items={swellItems.slice(0, 4)} defaultValue="send" aria-label="Four tabs" />
    </div>
  );
}

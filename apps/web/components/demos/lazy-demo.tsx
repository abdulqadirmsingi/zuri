"use client";

import dynamic from "next/dynamic";

/**
 * Any demo by name, loaded only when it is first shown. The home page lets visitors pick from every
 * component, and shipping all of their demos up front would slow the first paint for nothing.
 */
export const LazyDemo = dynamic(() => import("./index").then((m) => ({ default: m.Demo })), {
  loading: () => (
    <span
      role="status"
      className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
    >
      Loading…
    </span>
  ),
});

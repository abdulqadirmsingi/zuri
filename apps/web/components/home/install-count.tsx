"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { formatCount } from "@/lib/analytics/format-count";

const reply = z.object({ installs: z.number().int().nonnegative().nullable() });

/** "· 1.2k installs", rendered only once the real number is known and big enough to show. */
export function InstallCount() {
  const [installs, setInstalls] = useState<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/installs", { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => setInstalls(reply.parse(json).installs))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  if (installs === null) return null;
  return <> · {formatCount(installs)} installs</>;
}

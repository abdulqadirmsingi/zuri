"use client";

import { ExpandingButtonGroup } from "@registry/actions/expanding-button-group/expanding-button-group";
import { useState } from "react";

const svg = (path: string) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={path} />
  </svg>
);
const icons = {
  reply: svg("M6.5 3.5L2.5 7.5l4 4M2.5 7.5h6a5 5 0 0 1 5 5"),
  archive: svg("M2.5 4.5h11v2h-11zM3.5 6.5v6h9v-6M6.5 9h3"),
  trash: svg("M3.5 4.5h9M6.5 4.5v-1h3v1M4.5 4.5l.5 8h6l.5-8"),
  share: svg("M8 10.5v-8M5 5l3-3 3 3M3.5 9v4h9V9"),
  pin: svg("M9.5 2.5l4 4-2 .5-2.5 2.5.5 3-1 1-3-3-3.5 3.5M7 6.5l-.5-3 1-1"),
};

export function ExpandingDefault() {
  const [log, setLog] = useState("Nothing yet");
  return (
    <div className="flex flex-col items-center gap-3">
      <ExpandingButtonGroup
        aria-label="Message actions"
        onAction={(id) => setLog(`Last action: ${id}`)}
        actions={[
          { id: "reply", label: "Reply", icon: icons.reply },
          { id: "archive", label: "Archive", icon: icons.archive, successLabel: "Archived" },
          { id: "share", label: "Share", icon: icons.share, successLabel: "Link copied" },
          { id: "delete", label: "Delete", icon: icons.trash, variant: "danger" },
        ]}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {log}
      </p>
    </div>
  );
}

export function ExpandingAsync() {
  return (
    <ExpandingButtonGroup
      aria-label="Save actions"
      actions={[
        {
          id: "save",
          label: "Save draft",
          icon: icons.archive,
          successLabel: "Saved",
          // A promise keeps the button busy until it settles.
          onPress: () => new Promise((resolve) => setTimeout(resolve, 1200)),
        },
        {
          id: "fail",
          label: "Try upload",
          icon: icons.share,
          successLabel: "Uploaded",
          // Returning false (or rejecting) means it did not work, so no success message appears.
          onPress: () => new Promise((resolve) => setTimeout(() => resolve(false), 800)),
        },
        { id: "pin", label: "Pin", icon: icons.pin, disabled: true },
      ]}
    />
  );
}

export function ExpandingSmall() {
  return (
    <ExpandingButtonGroup
      aria-label="Compact actions"
      size="sm"
      restingId="share"
      actions={[
        { id: "reply", label: "Reply", icon: icons.reply },
        { id: "share", label: "Share", icon: icons.share },
        { id: "delete", label: "Delete", icon: icons.trash, variant: "danger" },
      ]}
    />
  );
}

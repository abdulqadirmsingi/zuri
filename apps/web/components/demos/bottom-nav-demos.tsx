import { BottomNav, type BottomNavItem } from "@registry/navigation/bottom-nav/bottom-nav";
import { GlassBackdrop } from "./glass-backdrop";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const items: BottomNavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg aria-hidden="true" {...base}>
        <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    id: "saved",
    label: "Saved",
    icon: (
      <svg aria-hidden="true" {...base}>
        <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    id: "messages",
    label: "Messages",
    badge: 2,
    icon: (
      <svg aria-hidden="true" {...base}>
        <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg aria-hidden="true" {...base}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.5-4 14.5-4 16 0" />
      </svg>
    ),
  },
];

export function BottomNavDefault() {
  return <BottomNav aria-label="Demo" items={items} />;
}

export function BottomNavGlass() {
  return (
    <GlassBackdrop className="p-6">
      <BottomNav aria-label="Demo glass" items={items} variant="glass" defaultValue="messages" />
    </GlassBackdrop>
  );
}

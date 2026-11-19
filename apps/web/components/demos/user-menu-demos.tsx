"use client";

import {
  type ThemeChoice,
  UserMenu,
  type UserMenuItem,
  type UserStatus,
} from "@registry/navigation/user-menu/user-menu";
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

const items: UserMenuItem[] = [
  {
    id: "profile",
    label: "Profile",
    href: "#profile",
    icon: svg(
      "M8 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 13.5c.8-2.4 2.8-3.5 5-3.5s4.2 1.1 5 3.5",
    ),
    shortcut: "Ctrl P",
  },
  { id: "billing", label: "Billing", href: "#billing", icon: svg("M2.5 4.5h11v7h-11zM2.5 7h11") },
  {
    id: "settings",
    label: "Settings",
    icon: svg("M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14"),
    shortcut: "Ctrl ,",
  },
];

export function UserMenuDefault() {
  const [theme, setTheme] = useState<ThemeChoice>("system");
  const [status, setStatus] = useState<UserStatus>("available");
  const [note, setNote] = useState("Nothing yet");
  return (
    <div className="flex flex-col items-center gap-3">
      <UserMenu
        user={{ name: "Asha Juma", email: "asha@example.com", plan: "Pro" }}
        items={items}
        theme={theme}
        onThemeChange={setTheme}
        status={status}
        onStatusChange={setStatus}
        // A promise keeps the item busy until it settles, then the menu closes.
        onSignOut={() =>
          new Promise<void>((resolve) =>
            setTimeout(() => {
              setNote("Signed out (demo only: nothing really happened)");
              resolve();
            }, 1200),
          )
        }
      />
      <p role="status" className="text-sm text-muted-foreground">
        Theme: {theme} · Status: {status} · {note}
      </p>
    </div>
  );
}

export function UserMenuWithName() {
  return (
    <UserMenu
      showName
      showTheme={false}
      user={{ name: "Baraka Mushi", email: "baraka@example.com" }}
      items={items.slice(0, 2)}
    />
  );
}

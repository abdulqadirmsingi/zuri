"use client";

import { useRouter } from "next/navigation";

export function SignOut() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        router.replace("/admin/login");
      }}
      className="min-h-10 rounded-md border border-border px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      Sign out
    </button>
  );
}

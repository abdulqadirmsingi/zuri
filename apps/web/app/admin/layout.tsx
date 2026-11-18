import type { Metadata } from "next";
import type { ReactNode } from "react";

// Private area: keep it out of search results.
export const metadata: Metadata = {
  title: "Admin · Zuri",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}

import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/shared";
import { display, mono, sans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  // Makes the preview image and other metadata URLs absolute, which social sites require. Without
  // NEXT_PUBLIC_SITE_URL, Next.js falls back to the deployment's own URL (on Vercel, its domain).
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(siteUrl) : undefined,
  title: { default: "Zuri", template: "%s · Zuri" },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon.ico", sizes: "48x48" },
    ],
    apple: "/brand/zuri-icon-180.png",
  },
  description: "Beautiful, accessible React components. Own the code.",
  openGraph: { type: "website", siteName: "Zuri" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

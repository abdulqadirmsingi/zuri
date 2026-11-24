"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Eased, inertial scrolling for the landing page only (the docs keep native scrolling so the
 * sticky sidebar behaves). It is skipped entirely for people who prefer reduced motion, and on
 * touch screens Lenis leaves native momentum scrolling alone by default.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: true });
    return () => lenis.destroy();
  }, []);
  return null;
}

"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum smooth-scroll layer. Wraps the app once at the root. Fully
 * reduced-motion-safe: if the user prefers reduced motion, Lenis never
 * initializes and native scroll is used unchanged.
 *
 * Uses only transform/opacity-friendly scrolling (no layout thrash) and
 * cleans itself up on unmount. Framer Motion's useScroll continues to
 * work because Lenis drives the real window scroll position.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // native scroll, no momentum

    const lenis = new Lenis({
      duration: 1.9, // heavier glide — noticeable drift after release
      easing: (t) => 1 - Math.pow(1 - t, 4), // pronounced expo-out decel
      smoothWheel: true,
      touchMultiplier: 1.8,
      wheelMultiplier: 1.15,
    });

    // Expose for scroll-locking UI (modals, mobile menu) to pause momentum.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Keep anchor links (#feed, #methodology) working with Lenis.
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const id = target.getAttribute("href");
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -80 });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

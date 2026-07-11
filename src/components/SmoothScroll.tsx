"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Momentum smooth-scroll layer. Wraps the app once at the root. Fully
 * reduced-motion-safe: if the user prefers reduced motion, Lenis never
 * initializes and native scroll is used unchanged.
 *
 * Lenis and GSAP ScrollTrigger are synced onto the SAME requestAnimationFrame
 * loop (GSAP's ticker) rather than two separate RAF loops — running them
 * independently causes ScrollTrigger to read a stale scroll position and
 * lag a frame or two behind, which is what caused the earlier scroll-linked
 * effects to feel disconnected from the actual scroll position.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // native scroll, no momentum

    const lenis = new Lenis({
      duration: 1.35, // snappier initial response, still gliding on release
      easing: (t) => 1 - Math.pow(1 - t, 3), // cubic expo-out — tighter than quartic
      smoothWheel: true,
      touchMultiplier: 1.8,
      wheelMultiplier: 1.25,
    });

    // Expose for scroll-locking UI (modals, mobile menu) to pause momentum.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Keep ScrollTrigger's internal scroll position in sync on every Lenis
    // scroll event, and drive Lenis from GSAP's ticker instead of a
    // separate requestAnimationFrame loop.
    lenis.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once Lenis has measured the page.
    ScrollTrigger.refresh();

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
      gsap.ticker.remove(tickerCallback);
      document.removeEventListener("click", handleAnchorClick);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

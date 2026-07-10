/**
 * FLUX SIGNAL RADAR — GLOBAL MOTION DESIGN SYSTEM
 *
 * Single source of truth for all animation. Components import presets
 * from here instead of hand-rolling initial/animate/transition inline,
 * so motion stays consistent (easing, duration, stagger) across the app.
 *
 * All presets are plain Framer Motion Variants/Transition objects.
 * Reduced-motion is respected globally via globals.css, and the
 * `useReducedMotionSafe` helper below lets JS-driven motion opt out too.
 */

import { Variants, Transition } from "framer-motion";

// ---- Easing & timing tokens ---------------------------------------------

export const ease = {
  standard: [0.22, 1, 0.36, 1] as const, // smooth "expo-out" feel
  entrance: [0.16, 1, 0.3, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
};

export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
};

export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 32,
};

export const softSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
};

// ---- Core reveal variants -----------------------------------------------

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: ease.standard } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.entrance } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.entrance } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: duration.base, ease: ease.entrance } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: duration.base, ease: ease.entrance } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: duration.base, ease: ease.entrance } },
};

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: spring },
};

export const blurReveal: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 12 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: duration.slow, ease: ease.standard },
  },
};

// ---- Stagger container ---------------------------------------------------

export function staggerContainer(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

// ---- Interaction presets (spread onto motion components) -----------------

export const hoverLift = {
  whileHover: { y: -3, transition: { duration: duration.fast, ease: ease.standard } },
  whileTap: { scale: 0.98 },
};

export const hoverScale = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
};

export const pressable = {
  whileTap: { scale: 0.96 },
};

// ---- Page & layout transitions ------------------------------------------

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.entrance } },
  exit: { opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.exit } },
};

// ---- Overlay presets (modals, drawers) ----------------------------------

export const modal: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: softSpring },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: duration.fast } },
};

export const drawer: Variants = {
  hidden: { x: "100%" },
  show: { x: 0, transition: softSpring },
  exit: { x: "100%", transition: { duration: duration.base, ease: ease.exit } },
};

export const accordion: Variants = {
  hidden: { height: 0, opacity: 0 },
  show: { height: "auto", opacity: 1, transition: { duration: duration.base, ease: ease.standard } },
  exit: { height: 0, opacity: 0, transition: { duration: duration.fast, ease: ease.exit } },
};

// ---- Standard viewport config for scroll-reveal -------------------------

export const inViewport = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-60px" },
};

// Convenience for the very common "reveal on scroll with a variant" case.
export function reveal(variants: Variants = fadeUp) {
  return { variants, ...inViewport };
}

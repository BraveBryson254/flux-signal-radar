"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";
import { fadeUp, staggerContainer, inViewport, reveal } from "@/lib/motionSystem";

/**
 * Thin reusable wrappers over the motion system. Using these instead of
 * inline motion.div keeps animation config centralized — change the
 * preset in motionSystem.ts and the whole app updates.
 */

interface RevealProps extends HTMLMotionProps<"div"> {
  variants?: Variants;
  children: ReactNode;
}

/** Scroll-reveal a block once it enters the viewport. */
export function Reveal({ variants = fadeUp, children, ...props }: RevealProps) {
  return (
    <motion.div {...reveal(variants)} {...props}>
      {children}
    </motion.div>
  );
}

/** Animate immediately on mount (for above-the-fold content). */
export function Appear({ variants = fadeUp, children, ...props }: RevealProps) {
  return (
    <motion.div initial="hidden" animate="show" variants={variants} {...props}>
      {children}
    </motion.div>
  );
}

interface StaggerProps extends HTMLMotionProps<"div"> {
  stagger?: number;
  delayChildren?: number;
  children: ReactNode;
  revealOnScroll?: boolean;
}

/** Parent that staggers its children (each child should use a variant). */
export function Stagger({
  stagger = 0.06,
  delayChildren = 0,
  revealOnScroll = true,
  children,
  ...props
}: StaggerProps) {
  const trigger = revealOnScroll
    ? inViewport
    : { initial: "hidden" as const, animate: "show" as const };
  return (
    <motion.div variants={staggerContainer(stagger, delayChildren)} {...trigger} {...props}>
      {children}
    </motion.div>
  );
}

/** Child item for a Stagger parent. */
export function StaggerItem({ variants = fadeUp, children, ...props }: RevealProps) {
  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
}

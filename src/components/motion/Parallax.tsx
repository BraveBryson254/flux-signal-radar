"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Wraps children in a layer that shifts vertically as a function of
 * scroll position, at a different rate than normal scroll — creating
 * depth. speed < 1 = moves slower than scroll (background feel);
 * speed > 1 = moves faster (foreground pop). speed = 1 is neutral.
 *
 * GPU-friendly: animates `transform` only. Fully disabled under
 * prefers-reduced-motion (renders children with no transform).
 */
export default function Parallax({
  children,
  speed = 0.3,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map full scroll-through range to a vertical offset proportional to speed.
  const range = 120 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeUp, ease, duration } from "@/lib/motionSystem";

/**
 * Shared shell for every dashboard widget — consistent border, padding,
 * header, and scroll-in animation from the central motion system.
 */
export default function Widget({
  title,
  action,
  children,
  className = "",
  index = 0,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: duration.base, ease: ease.entrance, delay: Math.min(index * 0.04, 0.3) }}
      className={`rounded-xl border border-border bg-panel p-5 transition-shadow duration-300 hover:shadow-[0_0_24px_-12px_var(--color-accent)] ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="font-display text-sm font-semibold text-text">{title}</h3>
          )}
          {action}
        </div>
      )}
      {children}
    </motion.section>
  );
}

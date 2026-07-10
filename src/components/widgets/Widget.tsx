"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Shared shell for every dashboard widget — consistent border, padding,
 * header, and scroll-in animation. Keeps the grid visually coherent
 * across tiers.
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      className={`rounded-xl border border-border bg-panel p-5 ${className}`}
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

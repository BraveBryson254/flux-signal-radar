"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:brightness-110",
  secondary: "border border-border text-text hover:border-text-faint",
  ghost: "text-text-muted hover:text-text",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

/**
 * Shared design-system button. Consistent motion (press scale),
 * variants, and sizing across the whole app.
 */
export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-body font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

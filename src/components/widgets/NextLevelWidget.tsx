"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { tierById } from "@/lib/tiers";
import { Tier } from "@/lib/mockAuth";

/**
 * Instead of showing dozens of disabled features, locked capabilities
 * are presented as an attractive "coming with your next level"
 * experience — aspirational, not frustrating.
 */
export function NextLevelWidget({
  requiredTier,
  title,
  description,
  index,
}: {
  requiredTier: Tier;
  title: string;
  description: string;
  index: number;
}) {
  const tier = tierById(requiredTier);
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-xl border p-5"
      style={{ borderColor: "var(--color-accent)", borderStyle: "dashed" }}
    >
      {/* soft glow accent */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl"
        style={{ background: "var(--color-accent)" }}
      />
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-panel-raised px-2.5 py-1">
        <Sparkles size={12} className="text-accent" />
        <span className="font-mono text-[10px] tracking-widest text-accent">
          WITH {tier.name.toUpperCase()}
        </span>
      </div>
      <h3 className="font-display text-base font-semibold text-text">{title}</h3>
      <p className="mt-1 font-body text-sm text-text-muted">{description}</p>
      <Link
        href="/pricing"
        className="group mt-4 flex items-center gap-1.5 font-body text-sm font-medium text-accent"
      >
        Unlock for ${tier.price}/mo
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.section>
  );
}

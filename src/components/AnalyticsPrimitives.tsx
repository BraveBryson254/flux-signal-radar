"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import CountUp from "@/components/CountUp";

export function MetricCard({
  label,
  value,
  suffix = "",
  accent,
  index = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-border bg-panel p-5"
    >
      <p className="font-mono text-[10px] tracking-widest text-text-faint">{label}</p>
      <p
        className="mt-2 font-display text-2xl font-semibold"
        style={{ color: accent ?? "var(--color-text)" }}
      >
        <CountUp value={value} suffix={suffix} />
      </p>
    </motion.div>
  );
}

export function ScoreRing({
  label,
  score,
  index = 0,
}: {
  label: string;
  score: number;
  index?: number;
}) {
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 70 ? "var(--color-bull)" : score >= 40 ? "var(--color-accent)" : "var(--color-bear)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-panel p-5"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg width={96} height={96} viewBox="0 0 96 96" className="-rotate-90">
          <circle cx={48} cy={48} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={6} />
          <motion.circle
            cx={48}
            cy={48}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute font-display text-xl font-semibold text-text">{score}</span>
      </div>
      <span className="font-mono text-xs text-text-muted">{label}</span>
    </motion.div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <h3 className="mb-4 font-display text-sm font-semibold text-text">{title}</h3>
      {children}
    </div>
  );
}

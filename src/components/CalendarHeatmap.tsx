"use client";

import { motion } from "framer-motion";
import { JournalEntry } from "@/lib/performanceData";

/**
 * A GitHub-style calendar heatmap, but for daily realized R instead of
 * commit counts — a standard feature in serious trading journals
 * (Edgewonk, TraderVue) that we didn't have before.
 */
export default function CalendarHeatmap({ entries }: { entries: JournalEntry[] }) {
  const byDay = new Map<string, number>();
  entries.forEach((e) => {
    byDay.set(e.date, (byDay.get(e.date) ?? 0) + e.rMultiple);
  });

  const today = new Date();
  const days: { date: string; r: number | null }[] = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, r: byDay.has(key) ? byDay.get(key)! : null });
  }

  const maxAbs = Math.max(1, ...days.map((d) => Math.abs(d.r ?? 0)));

  function colorFor(r: number | null) {
    if (r === null) return "var(--color-panel-raised)";
    if (r === 0) return "var(--color-border)";
    const intensity = Math.min(1, Math.abs(r) / maxAbs);
    return r > 0
      ? `rgba(200,255,77,${0.25 + intensity * 0.6})`
      : `rgba(255,92,122,${0.25 + intensity * 0.6})`;
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-text">Daily P&L (last 12 weeks)</h3>
        <div className="flex items-center gap-2 font-mono text-[10px] text-text-faint">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "rgba(255,92,122,0.6)" }} />
          Loss
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--color-border)" }} />
          Flat
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "rgba(200,255,77,0.6)" }} />
          Win
        </div>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1">
        {days.map((d, i) => (
          <motion.div
            key={d.date}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.004, 0.3) }}
            title={d.r !== null ? `${d.date}: ${d.r > 0 ? "+" : ""}${d.r.toFixed(1)}R` : d.date}
            className="h-3.5 w-3.5 rounded-sm"
            style={{ background: colorFor(d.r) }}
          />
        ))}
      </div>
    </div>
  );
}

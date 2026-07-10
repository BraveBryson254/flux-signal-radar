"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Signal } from "@/lib/types";
import { strategies, sessionMeta } from "@/lib/mockData";

function ConfluenceGauge({ value, direction }: { value: number; direction: Signal["direction"] }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = direction === "long" ? "var(--color-bull)" : "var(--color-bear)";

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <svg width={64} height={64} viewBox="0 0 64 64" className="-rotate-90">
        <circle cx={32} cy={32} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={5} />
        <motion.circle
          cx={32}
          cy={32}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute font-mono text-sm font-semibold text-text">{value}</span>
    </div>
  );
}

export default function SignalCard({ signal, index }: { signal: Signal; index: number }) {
  const isLong = signal.direction === "long";
  const directionColor = isLong ? "var(--color-bull)" : "var(--color-bear)";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -3 }}
      className="group rounded-xl border border-border bg-panel p-5 transition-colors hover:border-text-faint"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ConfluenceGauge value={signal.confluence} direction={signal.direction} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-text">
                {signal.instrument}
              </h3>
              <span
                className="flex items-center gap-0.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium"
                style={{ color: directionColor, backgroundColor: `${directionColor}1a` }}
              >
                {isLong ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {isLong ? "LONG" : "SHORT"}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-xs text-text-faint">
              {signal.timeframe} · {sessionMeta[signal.session].label} session · {signal.detectedAt}
            </p>
          </div>
        </div>
        <span className="whitespace-nowrap font-mono text-xs text-text-muted">
          R:R {signal.riskReward.toFixed(1)}
        </span>
      </div>

      {/* Price levels */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-panel-raised p-3 font-mono text-xs">
        <div>
          <p className="text-text-faint">Entry</p>
          <p className="mt-0.5 text-text">{signal.entry}</p>
        </div>
        <div>
          <p className="text-text-faint">Stop</p>
          <p className="mt-0.5 text-bear">{signal.stop}</p>
        </div>
        <div>
          <p className="text-text-faint">Target</p>
          <p className="mt-0.5 text-bull">{signal.target}</p>
        </div>
      </div>

      {/* Strategy tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {signal.strategies.map((sid) => {
          const strat = strategies.find((s) => s.id === sid);
          if (!strat) return null;
          return (
            <span
              key={sid}
              className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-text-muted"
            >
              {strat.short}
            </span>
          );
        })}
      </div>
    </motion.article>
  );
}

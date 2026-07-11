"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, Target, ShieldAlert, Waves, Gauge, AlertTriangle } from "lucide-react";
import { Signal } from "@/lib/types";
import { generateRationale } from "@/lib/tradeRationale";

const confidenceColor: Record<string, string> = {
  "Very high": "var(--color-bull)",
  High: "var(--color-bull)",
  Moderate: "var(--color-accent)",
  Low: "var(--color-bear)",
};

/**
 * "Why this trade?" — an expandable AI-style rationale generated from the
 * signal's own data. Collapsed by default so it never disrupts the feed;
 * clicking expands a structured breakdown.
 */
export default function TradeRationaleCard({ signal }: { signal: Signal }) {
  const [open, setOpen] = useState(false);
  const rationale = generateRationale(signal);

  return (
    <div className="rounded-lg border border-border bg-panel-raised">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <Sparkles size={13} className="shrink-0 text-accent" />
        <span className="flex-1 font-mono text-[11px] text-text-muted">Why this trade?</span>
        <ChevronDown
          size={13}
          className="shrink-0 text-text-faint transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-border p-3">
              <RationaleRow icon={<Target size={12} />} label="Setup" text={rationale.setupReason} />
              <RationaleRow icon={<Target size={12} />} label="Entry" text={rationale.entryReason} />
              <RationaleRow icon={<ShieldAlert size={12} />} label="Stop placement" text={rationale.stopReason} />
              <RationaleRow icon={<Waves size={12} />} label="Liquidity" text={rationale.liquidityNote} />

              <div className="flex items-center gap-2 rounded-md bg-panel px-2.5 py-2">
                <Gauge size={13} style={{ color: confidenceColor[rationale.confidenceLabel] }} />
                <div className="min-w-0">
                  <p className="font-mono text-[10px]" style={{ color: confidenceColor[rationale.confidenceLabel] }}>
                    {rationale.confidenceLabel} confidence
                  </p>
                  <p className="font-body text-xs text-text-muted">{rationale.confidenceNote}</p>
                </div>
              </div>

              <p className="font-body text-xs text-text-muted">{rationale.sentiment}</p>

              <div>
                <p className="mb-1.5 flex items-center gap-1 font-mono text-[10px] tracking-widest text-bear">
                  <AlertTriangle size={11} /> COMMON MISTAKES
                </p>
                <ul className="space-y-1">
                  {rationale.commonMistakes.map((m, i) => (
                    <li key={i} className="flex gap-1.5 font-body text-xs text-text-faint">
                      <span className="text-bear">·</span> {m}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="font-mono text-[9px] text-text-faint">
                Generated from this signal&apos;s data. Not personalized financial advice.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RationaleRow({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="flex gap-2">
      <div className="mt-0.5 shrink-0 text-accent">{icon}</div>
      <div>
        <p className="font-mono text-[10px] text-accent">{label.toUpperCase()}</p>
        <p className="font-body text-xs text-text-muted">{text}</p>
      </div>
    </div>
  );
}

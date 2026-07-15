"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import Widget from "./Widget";
import { useTraderJourney } from "@/lib/useTraderJourney";

/**
 * The "trader journey" — guided progression that answers "what should I
 * do today?". Every step is now computed from real Supabase data
 * (journal entries, academy progress, arena scores, competition entries,
 * actual level) via useTraderJourney — no hardcoded completion state.
 */
export function TraderJourneyWidget({ index }: { index: number }) {
  const { steps, loading } = useTraderJourney();
  const doneCount = steps.filter((s) => s.done).length;
  const pct = (doneCount / steps.length) * 100;
  const nextStep = steps.find((s) => !s.done);

  return (
    <Widget
      title="Your trader journey"
      index={index}
      action={
        <span className="font-mono text-xs text-text-faint">
          {doneCount}/{steps.length}
        </span>
      }
    >
      {loading ? (
        <p className="font-mono text-xs text-text-faint">Loading...</p>
      ) : (
        <>
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-panel-raised">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>

          <div className="space-y-2">
            {steps.map((step) => (
              <Link
                key={step.id}
                href={step.href}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-panel-raised"
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                  style={{
                    borderColor: step.done ? "var(--color-bull)" : "var(--color-border)",
                    background: step.done ? "var(--color-bull)" : "transparent",
                  }}
                >
                  {step.done && <Check size={12} className="text-bg" />}
                </div>
                <span
                  className="flex-1 font-body text-sm"
                  style={{
                    color: step.done ? "var(--color-text-faint)" : "var(--color-text)",
                    textDecoration: step.done ? "line-through" : "none",
                  }}
                >
                  {step.label}
                </span>
              </Link>
            ))}
          </div>

          {nextStep && (
            <Link
              href={nextStep.href}
              className="group mt-4 flex items-center gap-1.5 font-body text-sm font-medium text-accent"
            >
              Next: {nextStep.label}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </>
      )}
    </Widget>
  );
}

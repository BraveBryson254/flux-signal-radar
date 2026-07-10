"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import Widget from "./Widget";

/**
 * The "trader journey" — guided progression that answers "what should I
 * do today?". Steps are mock-complete for now; the backend will track
 * real completion state per user.
 */
const journeySteps = [
  { id: "s1", label: "Complete your profile", href: "/profile", done: true },
  { id: "s2", label: "Read your first lesson", href: "/academy", done: true },
  { id: "s3", label: "Log your first trade", href: "/journal", done: true },
  { id: "s4", label: "Play a trading game", href: "/games", done: false },
  { id: "s5", label: "Join your first competition", href: "/competitions", done: false },
  { id: "s6", label: "Reach Level 10", href: "/dashboard", done: false },
];

export function TraderJourneyWidget({ index }: { index: number }) {
  const doneCount = journeySteps.filter((s) => s.done).length;
  const pct = (doneCount / journeySteps.length) * 100;
  const nextStep = journeySteps.find((s) => !s.done);

  return (
    <Widget
      title="Your trader journey"
      index={index}
      action={
        <span className="font-mono text-xs text-text-faint">
          {doneCount}/{journeySteps.length}
        </span>
      }
    >
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-panel-raised">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7 }}
        />
      </div>

      <div className="space-y-2">
        {journeySteps.map((step) => (
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
    </Widget>
  );
}

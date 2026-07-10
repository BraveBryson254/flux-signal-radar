"use client";

import { motion } from "framer-motion";
import { strategies } from "@/lib/mockData";

const pipeline = [
  {
    stage: "SCAN.01",
    title: "Session filter",
    body: "Every instrument is weighted by which session is active — Asian, London, or New York — before anything else runs.",
  },
  {
    stage: "SCAN.02",
    title: "Strategy scoring",
    body: "Six independent strategy engines score the current structure in parallel and tag any setup they agree on.",
  },
  {
    stage: "SCAN.03",
    title: "Confluence + R-multiple",
    body: "Agreeing strategies are combined into a single confluence score, then ranked by risk-reward quality.",
  },
  {
    stage: "SCAN.04",
    title: "Compliance check",
    body: "Optional Prop Firm mode discards any setup that would breach a max drawdown or daily loss limit.",
  },
];

export default function StrategyStrip() {
  return (
    <section id="methodology" className="border-b border-border px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <span className="font-mono text-xs tracking-widest text-accent">
            HOW SCORING WORKS
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
            Four stages, run on every candle close.
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-text-muted">
            No repainting. Every signal on the radar is confirmed on a closed
            bar and re-validated as new candles form.
          </p>
        </div>

        {/* Pipeline */}
        <div className="mb-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
          {pipeline.map((step, i) => (
            <motion.div
              key={step.stage}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-panel p-6"
            >
              <span className="font-mono text-xs text-accent">{step.stage}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Strategy catalog */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-lg border border-border bg-panel p-5 transition-colors hover:border-text-faint"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-display text-base font-semibold text-text">
                  {s.label}
                </h4>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-text-faint">
                  {s.short}
                </span>
              </div>
              <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

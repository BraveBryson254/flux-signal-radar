"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tiltUp, perspective } from "@/lib/motionSystem";

const stages = [
  { stage: "SCAN.01", title: "Session filter" },
  { stage: "SCAN.02", title: "Strategy scoring" },
  { stage: "SCAN.03", title: "Confluence + R" },
  { stage: "SCAN.04", title: "Compliance check" },
];

export default function PipelineTeaser() {
  return (
    <section className="border-b border-border px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <span className="font-mono text-xs tracking-widest text-accent">HOW IT WORKS</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
            Four stages, every candle close.
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line, drawn left to right on scroll */}
          <svg
            className="absolute left-0 top-6 hidden w-full md:block"
            height="4"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.line
              x1="6%"
              y1="2"
              x2="94%"
              y2="2"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeDasharray="1 1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </svg>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4" style={perspective}>
            {stages.map((s, i) => (
              <motion.div
                key={s.stage}
                variants={tiltUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-panel">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </div>
                <p className="font-mono text-xs text-accent">{s.stage}</p>
                <h3 className="mt-1 font-display text-base font-semibold text-text">
                  {s.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

        <Link
          href="/methodology"
          className="group mt-10 flex w-fit items-center gap-1.5 font-body text-sm font-medium text-accent"
        >
          See the full methodology
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

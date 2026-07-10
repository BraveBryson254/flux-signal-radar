"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mockSignals } from "@/lib/mockData";
import SignalCard from "./SignalCard";

export default function FeedPreview() {
  const preview = mockSignals.slice(0, 3);

  return (
    <section className="border-b border-border px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs tracking-widest text-accent">LIVE RIGHT NOW</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
              A taste of the feed
            </h2>
          </div>
          <Link
            href="/feed"
            className="group flex w-fit items-center gap-1.5 font-body text-sm font-medium text-accent"
          >
            View full live feed
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {preview.map((signal, i) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.35 }}
            >
              <SignalCard signal={signal} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

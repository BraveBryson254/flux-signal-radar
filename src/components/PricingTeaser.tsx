"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tiers } from "@/lib/tiers";

export default function PricingTeaser() {
  return (
    <section className="border-b border-border px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <span className="font-mono text-xs tracking-widest text-accent">PRICING</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
            One good setup a day is free.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={
                tier.recommended
                  ? { opacity: 1, y: -6, scale: 1.02 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-xl border bg-panel p-5"
              style={{
                borderColor: tier.recommended ? "var(--color-accent)" : "var(--color-border)",
                borderWidth: tier.recommended ? 2 : 1,
                boxShadow: tier.recommended ? "0 0 32px -8px var(--color-accent)" : "none",
              }}
            >
              <h3 className="font-display text-base font-semibold text-text">{tier.name}</h3>
              <p className="mt-2 font-display text-2xl font-semibold text-text">
                ${tier.price}
                {tier.price > 0 && <span className="font-body text-sm text-text-faint">/mo</span>}
              </p>
              <p className="mt-2 font-body text-xs text-text-muted">{tier.tagline}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/pricing"
            className="group flex items-center gap-1.5 font-body text-sm font-medium text-accent"
          >
            Compare all features
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

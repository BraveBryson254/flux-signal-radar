"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tiers } from "@/lib/tiers";

export default function PricingPage() {
  return (
    <main>
      <Header />
      <section className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="font-mono text-xs tracking-widest text-accent">PRICING</span>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-text md:text-5xl">
              One good setup a day is free.
              <br />
              Everything else is $10 to start.
            </h1>
            <p className="mx-auto mt-4 max-w-lg font-body text-text-muted">
              7-day free trial on every paid tier. No card required to start —
              you only choose a plan when the trial ends.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="relative flex flex-col rounded-xl border bg-panel p-6"
                style={{
                  borderColor: tier.recommended ? "var(--color-accent)" : "var(--color-border)",
                  borderWidth: tier.recommended ? 2 : 1,
                }}
              >
                {tier.recommended && (
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-semibold text-bg">
                    MOST POPULAR
                  </span>
                )}

                <h3 className="font-display text-lg font-semibold text-text">{tier.name}</h3>
                <p className="mt-1 font-body text-sm text-text-muted">{tier.tagline}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-semibold text-text">
                    ${tier.price}
                  </span>
                  {tier.price > 0 && (
                    <span className="font-body text-sm text-text-faint">/mo</span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-body text-sm text-text-muted">
                      <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="mt-6 rounded-lg px-4 py-2.5 text-center font-body text-sm font-semibold transition-transform hover:scale-[1.02]"
                  style={{
                    background: tier.recommended ? "var(--color-accent)" : "transparent",
                    color: tier.recommended ? "var(--color-bg)" : "var(--color-text)",
                    border: tier.recommended ? "none" : "1px solid var(--color-border)",
                  }}
                >
                  {tier.price === 0 ? "Start free" : "Start 7-day trial"}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-center font-mono text-xs text-text-faint">
            Pay via M-Pesa, Airtel Money, bank transfer, or card. Billed in USD, shown in your currency.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}

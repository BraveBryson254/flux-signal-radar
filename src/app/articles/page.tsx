"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess, tierById } from "@/lib/tiers";
import { articles, glossary, Article } from "@/lib/articleData";

export default function ArticlesPage() {
  const { user } = useAuth();
  const userTier = user?.tier ?? "free";
  const [open, setOpen] = useState<Article | null>(null);

  if (open) {
    return (
      <main>
        <Header />
        <div className="mx-auto max-w-2xl px-6 pt-28 pb-20">
          <button
            onClick={() => setOpen(null)}
            className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text"
          >
            <ArrowLeft size={13} /> All articles
          </button>
          <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-mono text-xs tracking-widest text-accent">
              {open.category.toUpperCase()} · {open.difficulty.toUpperCase()}
            </span>
            <h1 className="mt-2 font-display text-2xl font-semibold text-text md:text-3xl">{open.title}</h1>
            <p className="mt-2 flex items-center gap-1 font-mono text-xs text-text-faint">
              <Clock size={12} /> {open.readMinutes} min read
            </p>
            <div className="mt-6 space-y-4">
              {open.body.map((p, i) => (
                <p key={i} className="font-body text-[15px] leading-relaxed text-text-muted">{p}</p>
              ))}
            </div>
          </motion.article>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">KNOWLEDGE</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">Articles</h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Original, practical writing on structure, liquidity, risk, and the
            mindset behind consistent trading.
          </p>
        </Reveal>

        <Stagger className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {articles.map((article) => {
            const unlocked = hasAccess(userTier, article.minTier);
            return (
              <StaggerItem key={article.id} variants={fadeUp}>
                <motion.button
                  {...hoverLift}
                  onClick={() => (unlocked ? setOpen(article) : null)}
                  className="flex h-full w-full flex-col rounded-xl border border-border bg-panel p-5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-panel-raised px-2 py-0.5 font-mono text-[10px] text-accent">
                      {article.category}
                    </span>
                    {!unlocked ? (
                      <Link href="/pricing" className="flex items-center gap-1 font-mono text-[10px] text-text-faint">
                        <Lock size={10} /> {tierById(article.minTier).name}
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-text-faint">
                        <Clock size={11} /> {article.readMinutes}m
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-text">{article.title}</h3>
                  <p className="mt-1.5 flex-1 font-body text-sm text-text-muted">{article.excerpt}</p>
                  <span className="mt-3 font-mono text-[10px] text-text-faint">{article.difficulty}</span>
                </motion.button>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Glossary */}
        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg font-semibold text-text">Glossary</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {glossary.map((g, i) => (
              <motion.div
                key={g.term}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-lg border border-border bg-panel p-4"
              >
                <p className="font-mono text-sm font-semibold text-accent">{g.term}</p>
                <p className="mt-1 font-body text-sm text-text-muted">{g.definition}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

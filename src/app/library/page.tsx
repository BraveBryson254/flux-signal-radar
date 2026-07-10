"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess, tierById } from "@/lib/tiers";
import { books } from "@/lib/educationData";

export default function LibraryPage() {
  const { user } = useAuth();
  const userTier = user?.tier ?? "free";
  const categories = ["All", ...Array.from(new Set(books.map((b) => b.category)))];
  const [category, setCategory] = useState("All");

  const filtered = books.filter((b) => category === "All" || b.category === category);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">EDUCATION</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Digital Library
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            A curated shelf of trading books, read entirely in-browser. Your
            progress and bookmarks sync across devices.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
              style={{
                borderColor: category === cat ? "var(--color-accent)" : "var(--color-border)",
                color: category === cat ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <Stagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((book) => {
            const unlocked = hasAccess(userTier, book.minTier);
            return (
              <StaggerItem key={book.id} variants={fadeUp}>
                <motion.div {...hoverLift} className="h-full">
                  <Link
                    href={unlocked ? `/library/${book.id}` : "/pricing"}
                    className="flex h-full flex-col"
                  >
                    {/* Book cover */}
                    <div
                      className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-lg border border-border p-4"
                      style={{
                        background:
                          "linear-gradient(150deg, var(--color-panel-raised), var(--color-panel))",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <BookOpen size={18} className="text-accent" />
                        {book.sample && (
                          <span className="rounded-full bg-bg/60 px-2 py-0.5 font-mono text-[9px] text-text-muted">
                            SAMPLE
                          </span>
                        )}
                        {!unlocked && (
                          <span className="flex items-center gap-1 rounded-full bg-bg/60 px-2 py-0.5 font-mono text-[9px] text-text-faint">
                            <Lock size={9} />
                            {tierById(book.minTier).name}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold leading-tight text-text">
                          {book.title}
                        </p>
                        <p className="mt-1 font-mono text-[10px] text-text-faint">{book.author}</p>
                      </div>
                      {book.progress > 0 && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-panel-raised">
                          <div className="h-full bg-accent" style={{ width: `${book.progress}%` }} />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 font-mono text-[10px] text-text-faint">
                      {book.pages} pages{book.progress > 0 ? ` · ${book.progress}%` : ""}
                    </p>
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
      <Footer />
    </main>
  );
}

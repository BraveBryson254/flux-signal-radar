"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookMarked } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp } from "@/lib/motionSystem";
import { readingList, readingListCategories } from "@/lib/readingListData";
import { schools } from "@/lib/schoolsData";

export default function ReadingListPage() {
  const [category, setCategory] = useState("All");
  const filtered = readingList.filter((r) => category === "All" || r.category === category);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <Link href="/academy" className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text">
          <ArrowLeft size={13} /> Academy
        </Link>

        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">RECOMMENDED READING</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Books worth your time
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Respected trading books, cited for attribution — not reproduced. Each links
            to the closest Flux course covering similar ground.
          </p>
        </Reveal>

        <div className="mt-6 flex flex-wrap gap-2">
          {["All", ...readingListCategories].map((cat) => (
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

        <Stagger className="mt-6 space-y-3">
          {filtered.map((book) => {
            const school = schools.find((s) => s.id === book.relatedSchoolId);
            return (
              <StaggerItem key={book.id} variants={fadeUp}>
                <motion.div className="flex items-start gap-4 rounded-xl border border-border bg-panel p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-panel-raised">
                    <BookMarked size={16} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-semibold text-text">{book.title}</p>
                    <p className="font-mono text-[11px] text-text-faint">{book.author} · {book.category}</p>
                    <p className="mt-2 font-body text-sm text-text-muted">{book.blurb}</p>
                    {school && (
                      <Link
                        href={`/academy/schools/${school.id}`}
                        className="mt-2 inline-block font-mono text-[11px] text-accent hover:underline"
                      >
                        Related: {school.name} →
                      </Link>
                    )}
                  </div>
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

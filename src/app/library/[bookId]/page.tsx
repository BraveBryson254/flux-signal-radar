"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, List, Sun, Moon } from "lucide-react";
import Header from "@/components/Header";
import { books, sampleChapters } from "@/lib/educationData";
import { markBookRead } from "@/lib/academyProgress";

export default function ReaderPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = use(params);
  const book = books.find((b) => b.id === bookId);
  const [chapter, setChapter] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [sepia, setSepia] = useState(false);

  useEffect(() => {
    if (book) markBookRead(book.id);
  }, [book]);

  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">Book not found.</p>
      </main>
    );
  }

  const current = sampleChapters[chapter % sampleChapters.length];
  const readingProgress = ((chapter + 1) / sampleChapters.length) * 100;

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        {/* Reader toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text"
          >
            <ArrowLeft size={13} /> Library
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSepia((v) => !v)}
              aria-label="Toggle reading theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:text-text"
            >
              {sepia ? <Moon size={14} /> : <Sun size={14} />}
            </button>
            <button
              onClick={() => setShowToc((v) => !v)}
              aria-label="Table of contents"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:text-text"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setBookmarked((v) => !v)}
              aria-label="Bookmark"
              className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
              style={{
                borderColor: bookmarked ? "var(--color-accent)" : "var(--color-border)",
                color: bookmarked ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              <motion.span animate={{ scale: bookmarked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                <Bookmark size={14} fill={bookmarked ? "var(--color-accent)" : "none"} />
              </motion.span>
            </button>
          </div>
        </div>

        {/* Reading progress */}
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-panel-raised">
          <motion.div
            className="h-full bg-accent"
            animate={{ width: `${readingProgress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <p className="font-display text-lg font-semibold text-text">{book.title}</p>
        <p className="mb-8 font-mono text-xs text-text-faint">{book.author}</p>

        {/* Table of contents drawer */}
        <AnimatePresence>
          {showToc && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden rounded-lg border border-border bg-panel"
            >
              {sampleChapters.map((ch, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChapter(i);
                    setShowToc(false);
                  }}
                  className="block w-full px-4 py-3 text-left font-body text-sm transition-colors hover:bg-panel-raised"
                  style={{ color: i === chapter ? "var(--color-accent)" : "var(--color-text-muted)" }}
                >
                  {ch.title}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chapter content */}
        <AnimatePresence mode="wait">
          <motion.article
            key={chapter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border p-8"
            style={{
              background: sepia ? "#f5efe0" : "var(--color-panel)",
              color: sepia ? "#3a3222" : "var(--color-text)",
            }}
          >
            <h2 className="font-display text-xl font-semibold">{current.title}</h2>
            <div className="mt-5 space-y-4">
              {current.paragraphs.map((p, i) => (
                <p key={i} className="font-body text-[15px] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </motion.article>
        </AnimatePresence>

        {/* Pager */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setChapter((c) => Math.max(0, c - 1))}
            disabled={chapter === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 font-body text-sm text-text-muted transition-colors hover:text-text disabled:opacity-40"
          >
            <ArrowLeft size={14} /> Previous
          </button>
          <span className="font-mono text-xs text-text-faint">
            {chapter + 1} / {sampleChapters.length}
          </span>
          <button
            onClick={() => setChapter((c) => Math.min(sampleChapters.length - 1, c + 1))}
            disabled={chapter === sampleChapters.length - 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 font-body text-sm text-text-muted transition-colors hover:text-text disabled:opacity-40"
          >
            Next <ArrowRight size={14} />
          </button>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] text-text-faint">
          Read-only preview. Full book content loads per-page once uploaded via the admin panel.
        </p>
      </div>
    </main>
  );
}

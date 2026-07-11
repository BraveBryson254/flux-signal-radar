"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp } from "@/lib/motionSystem";
import { researchLibrary, ResearchEntry } from "@/lib/researchData";
import { schools } from "@/lib/schoolsData";

export default function ResearchLibraryPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <Link href="/academy" className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text">
          <ArrowLeft size={13} /> Academy
        </Link>

        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">RESEARCH LIBRARY</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            What research actually says
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Well-established behavioral finance and decision-science themes, explained in
            plain language — not summaries of any single paper.
          </p>
        </Reveal>

        <Stagger className="mt-8 space-y-3">
          {researchLibrary.map((entry) => (
            <StaggerItem key={entry.id} variants={fadeUp}>
              <ResearchCard entry={entry} isOpen={open === entry.id} onToggle={() => setOpen(open === entry.id ? null : entry.id)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      <Footer />
    </main>
  );
}

function ResearchCard({ entry, isOpen, onToggle }: { entry: ResearchEntry; isOpen: boolean; onToggle: () => void }) {
  const school = schools.find((s) => s.id === entry.relatedSchoolId);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-panel">
      <button onClick={onToggle} className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-panel-raised">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-panel-raised">
          <FlaskConical size={16} className="text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold text-text">{entry.title}</p>
          <p className="font-mono text-[11px] text-text-faint">{entry.topic} · {entry.difficulty}</p>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border">
            <div className="space-y-4 p-5">
              <div>
                <p className="mb-2 font-mono text-[10px] tracking-widest text-accent">KEY FINDINGS</p>
                <ul className="space-y-1.5">
                  {entry.keyFindings.map((f, i) => (
                    <li key={i} className="flex gap-2 font-body text-sm text-text-muted">
                      <Check size={14} className="mt-0.5 shrink-0 text-bull" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-panel-raised p-4">
                <p className="mb-1 font-mono text-[10px] tracking-widest text-accent">PRACTICAL APPLICATION</p>
                <p className="font-body text-sm text-text">{entry.practicalApplication}</p>
              </div>
              {school && (
                <Link href={`/academy/schools/${school.id}`} className="inline-block font-mono text-[11px] text-accent hover:underline">
                  Related: {school.name} →
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

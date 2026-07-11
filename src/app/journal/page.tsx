"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/motion/Motion";
import { modal } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import {
  journalEntries as seedEntries,
  emotionLabels,
  JournalEntry,
  Emotion,
  TradeDirection,
  TradeOutcome,
} from "@/lib/performanceData";

const outcomeColor: Record<TradeOutcome, string> = {
  win: "var(--color-bull)",
  loss: "var(--color-bear)",
  breakeven: "var(--color-neutral)",
};

export default function JournalPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>(seedEntries);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">LOADING...</p>
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <Reveal>
            <span className="font-mono text-xs tracking-widest text-accent">PERFORMANCE</span>
            <h1 className="mt-2 font-display text-2xl font-semibold text-text md:text-3xl">
              Trading Journal
            </h1>
            <Link href="/analytics" className="mt-2 inline-block font-mono text-xs text-accent hover:underline">
              View analytics →
            </Link>
          </Reveal>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
          >
            <Plus size={15} /> Log trade
          </button>
        </div>

        <div className="space-y-3">
          {entries.map((entry, i) => {
            const long = entry.direction === "long";
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className="rounded-xl border border-border bg-panel p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center gap-0.5 rounded-full px-2 py-0.5 font-mono text-[10px]"
                      style={{
                        color: long ? "var(--color-bull)" : "var(--color-bear)",
                        background: long ? "rgba(200,255,77,0.12)" : "rgba(255,92,122,0.12)",
                      }}
                    >
                      {long ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {entry.direction.toUpperCase()}
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-text">
                        {entry.instrument}
                      </p>
                      <p className="font-mono text-[10px] text-text-faint">
                        {entry.date} · {entry.strategy} · {emotionLabels[entry.emotion]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-mono text-sm font-semibold"
                      style={{ color: outcomeColor[entry.outcome] }}
                    >
                      {entry.rMultiple > 0 ? "+" : ""}
                      {entry.rMultiple}R
                    </p>
                    <p
                      className="font-mono text-[10px] capitalize"
                      style={{ color: outcomeColor[entry.outcome] }}
                    >
                      {entry.outcome}
                    </p>
                  </div>
                </div>

                {(entry.mistake || entry.lesson || entry.notes) && (
                  <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {entry.mistake && (
                      <p className="font-body text-xs text-text-muted">
                        <span className="text-bear">Mistake:</span> {entry.mistake}
                      </p>
                    )}
                    {entry.lesson && (
                      <p className="font-body text-xs text-text-muted">
                        <span className="text-bull">Lesson:</span> {entry.lesson}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="font-body text-xs text-text-faint">{entry.notes}</p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />

      <AnimatePresence>
        {showForm && (
          <NewTradeModal
            onClose={() => setShowForm(false)}
            onSave={(entry) => {
              setEntries((prev) => [entry, ...prev]);
              setShowForm(false);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function NewTradeModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (e: JournalEntry) => void;
}) {
  const [instrument, setInstrument] = useState("XAUUSD");
  const [direction, setDirection] = useState<TradeDirection>("long");
  const [rMultiple, setRMultiple] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("calm");
  const [strategy, setStrategy] = useState("SMC");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    const r = parseFloat(rMultiple) || 0;
    onSave({
      id: `j-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      instrument,
      direction,
      outcome: r > 0 ? "win" : r < 0 ? "loss" : "breakeven",
      rMultiple: r,
      emotion,
      strategy,
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
      />
      <motion.div
        variants={modal}
        initial="hidden"
        animate="show"
        exit="exit"
        className="relative w-full max-w-md rounded-2xl border border-border bg-panel p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-text">Log a trade</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Instrument">
              <input
                value={instrument}
                onChange={(e) => setInstrument(e.target.value.toUpperCase())}
                className="input"
              />
            </Field>
            <Field label="Realized R">
              <input
                type="number"
                step="0.1"
                value={rMultiple}
                onChange={(e) => setRMultiple(e.target.value)}
                placeholder="e.g. 2.4 or -1"
                className="input"
              />
            </Field>
          </div>

          <Field label="Direction">
            <div className="flex gap-2">
              {(["long", "short"] as TradeDirection[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className="flex-1 rounded-lg border py-2 font-mono text-xs capitalize transition-colors"
                  style={{
                    borderColor: direction === d ? "var(--color-accent)" : "var(--color-border)",
                    color: direction === d ? "var(--color-accent)" : "var(--color-text-muted)",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Strategy">
              <select value={strategy} onChange={(e) => setStrategy(e.target.value)} className="input">
                {["SMC", "ICT", "Wyckoff", "SNR"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Emotion">
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value as Emotion)}
                className="input"
              >
                {Object.entries(emotionLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="What happened, what you learned..."
              className="input resize-none"
            />
          </Field>

          <button
            onClick={handleSave}
            className="w-full rounded-lg bg-accent py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
          >
            Save entry
          </button>
        </div>
      </motion.div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          background: var(--color-panel-raised);
          padding: 0.55rem 0.7rem;
          font-family: var(--font-body);
          font-size: 0.8rem;
          color: var(--color-text);
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--color-accent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] tracking-widest text-text-faint">
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

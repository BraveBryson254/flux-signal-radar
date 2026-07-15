"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownRight, X, Pencil, Trash2, ImagePlus } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/motion/Motion";
import { modal } from "@/lib/motionSystem";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import { useAuth } from "@/lib/mockAuth";
import {
  fetchJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  uploadScreenshot,
} from "@/lib/journalService";
import {
  emotionLabels,
  JournalEntry,
  Emotion,
  TradeDirection,
  TradeOutcome,
  TradeGrade,
} from "@/lib/performanceData";

const outcomeColor: Record<TradeOutcome, string> = {
  win: "var(--color-bull)",
  loss: "var(--color-bear)",
  breakeven: "var(--color-neutral)",
};

const gradeColor: Record<TradeGrade, string> = {
  A: "var(--color-bull)",
  B: "var(--color-bull)",
  C: "var(--color-accent)",
  D: "var(--color-bear)",
  F: "var(--color-bear)",
};

export default function JournalPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntriesLoading(true);
    fetchJournalEntries(user.id).then((data) => {
      setEntries(data);
      setEntriesLoading(false);
    });
  }, [user]);

  if (isLoading || !user || entriesLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">LOADING...</p>
      </main>
    );
  }

  const handleDelete = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await deleteJournalEntry(id);
  };

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

        {entries.length > 0 && (
          <div className="mb-6">
            <CalendarHeatmap entries={entries} />
          </div>
        )}

        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="font-body text-sm text-text-muted">
              No trades logged yet — click &quot;Log trade&quot; to add your first entry.
            </p>
          </div>
        ) : (
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
                        <div className="flex items-center gap-2">
                          <p className="font-display text-base font-semibold text-text">{entry.instrument}</p>
                          {entry.grade && (
                            <span
                              className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold"
                              style={{ color: gradeColor[entry.grade], background: "var(--color-panel-raised)" }}
                            >
                              {entry.grade}
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-text-faint">
                          {entry.date} · {entry.strategy} · {emotionLabels[entry.emotion]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold" style={{ color: outcomeColor[entry.outcome] }}>
                          {entry.rMultiple > 0 ? "+" : ""}
                          {entry.rMultiple}R
                        </p>
                        <p className="font-mono text-[10px] capitalize" style={{ color: outcomeColor[entry.outcome] }}>
                          {entry.outcome}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingEntry(entry)}
                        aria-label="Edit"
                        className="rounded-md p-1 text-text-faint transition-colors hover:text-accent"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        aria-label="Delete"
                        className="rounded-md p-1 text-text-faint transition-colors hover:text-bear"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-panel-raised px-2 py-0.5 font-mono text-[10px] text-text-muted"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.screenshotUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.screenshotUrl}
                      alt="Trade screenshot"
                      className="mt-3 max-h-64 w-full rounded-lg border border-border object-cover"
                    />
                  )}

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
                      {entry.notes && <p className="font-body text-xs text-text-faint">{entry.notes}</p>}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />

      <AnimatePresence>
        {showForm && (
          <TradeModal
            onClose={() => setShowForm(false)}
            onSave={async (entry) => {
              if (!user) return;
              const saved = await createJournalEntry(user.id, entry);
              if (saved) setEntries((prev) => [saved, ...prev]);
              setShowForm(false);
            }}
          />
        )}
        {editingEntry && (
          <TradeModal
            existing={editingEntry}
            onClose={() => setEditingEntry(null)}
            onSave={async (patch) => {
              const ok = await updateJournalEntry(editingEntry.id, patch);
              if (ok) {
                setEntries((prev) =>
                  prev.map((e) => (e.id === editingEntry.id ? { ...e, ...patch } : e))
                );
              }
              setEditingEntry(null);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function TradeModal({
  existing,
  onClose,
  onSave,
}: {
  existing?: JournalEntry;
  onClose: () => void;
  onSave: (e: Omit<JournalEntry, "id">) => Promise<void>;
}) {
  const { user } = useAuth();
  const [instrument, setInstrument] = useState(existing?.instrument ?? "XAUUSD");
  const [direction, setDirection] = useState<TradeDirection>(existing?.direction ?? "long");
  const [rMultiple, setRMultiple] = useState(existing ? String(existing.rMultiple) : "");
  const [emotion, setEmotion] = useState<Emotion>(existing?.emotion ?? "calm");
  const [strategy, setStrategy] = useState(existing?.strategy ?? "SMC");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [tagsInput, setTagsInput] = useState(existing?.tags?.join(", ") ?? "");
  const [grade, setGrade] = useState<TradeGrade | "">(existing?.grade ?? "");
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(existing?.screenshotUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const url = await uploadScreenshot(user.id, file);
    if (url) setScreenshotUrl(url);
    setUploading(false);
  };

  const handleSave = async () => {
    const r = parseFloat(rMultiple) || 0;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setSaving(true);
    await onSave({
      date: existing?.date ?? new Date().toISOString().slice(0, 10),
      instrument,
      direction,
      outcome: r > 0 ? "win" : r < 0 ? "loss" : "breakeven",
      rMultiple: r,
      emotion,
      strategy,
      notes: notes || undefined,
      tags: tags.length > 0 ? tags : undefined,
      grade: grade || undefined,
      screenshotUrl,
    });
    setSaving(false);
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
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-panel p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-text">
            {existing ? "Edit trade" : "Log a trade"}
          </h2>
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
              <input value={instrument} onChange={(e) => setInstrument(e.target.value.toUpperCase())} className="input" />
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
              <select value={emotion} onChange={(e) => setEmotion(e.target.value as Emotion)} className="input">
                {Object.entries(emotionLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Process grade (independent of outcome)">
            <div className="flex gap-1.5">
              {(["A", "B", "C", "D", "F"] as TradeGrade[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(grade === g ? "" : g)}
                  className="flex-1 rounded-lg border py-2 font-mono text-xs font-bold transition-colors"
                  style={{
                    borderColor: grade === g ? gradeColor[g] : "var(--color-border)",
                    color: grade === g ? gradeColor[g] : "var(--color-text-muted)",
                    background: grade === g ? "var(--color-panel-raised)" : "transparent",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Tags (comma separated)">
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. liquidity-sweep, revenge-trade, london-session"
              className="input"
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="What happened, what you learned..."
              className="input resize-none"
            />
          </Field>

          <Field label="Chart screenshot">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="input flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <ImagePlus size={14} />
              {uploading ? "Uploading..." : screenshotUrl ? "Replace screenshot" : "Attach screenshot"}
            </button>
            {screenshotUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={screenshotUrl} alt="Preview" className="mt-2 max-h-32 rounded-lg border border-border" />
            )}
          </Field>

          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full rounded-lg bg-accent py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {saving ? "Saving..." : existing ? "Save changes" : "Save entry"}
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

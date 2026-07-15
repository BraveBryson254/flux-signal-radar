/**
 * MOCK performance data — trading journal entries and analytics.
 * Shaped to match the future Supabase schema so the Journal and
 * Analytics pages won't change when real data is wired in.
 */

export type TradeDirection = "long" | "short";
export type TradeOutcome = "win" | "loss" | "breakeven";
export type Emotion = "calm" | "confident" | "anxious" | "greedy" | "fearful";
export type TradeGrade = "A" | "B" | "C" | "D" | "F";

export interface JournalEntry {
  id: string;
  date: string; // ISO date
  instrument: string;
  direction: TradeDirection;
  outcome: TradeOutcome;
  rMultiple: number; // realized R
  emotion: Emotion;
  strategy: string;
  mistake?: string;
  lesson?: string;
  notes?: string;
  /** Multiple free-form tags (setup type, mistake type, condition, etc.) —
   * independent of the single `strategy` field. */
  tags?: string[];
  /** Process quality grade, independent of outcome — a good trade can
   * lose, a bad trade can win. */
  grade?: TradeGrade;
  screenshotUrl?: string;
}

export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    date: "2026-07-09",
    instrument: "XAUUSD",
    direction: "long",
    outcome: "win",
    rMultiple: 2.4,
    emotion: "calm",
    strategy: "SMC",
    lesson: "Waited for the H1 confirmation instead of front-running.",
    notes: "Clean liquidity sweep into H4 demand.",
  },
  {
    id: "j2",
    date: "2026-07-09",
    instrument: "EURUSD",
    direction: "short",
    outcome: "loss",
    rMultiple: -1.0,
    emotion: "anxious",
    strategy: "ICT",
    mistake: "Entered before London confirmed direction.",
    lesson: "Respect the kill zone timing.",
  },
  {
    id: "j3",
    date: "2026-07-08",
    instrument: "NAS100",
    direction: "long",
    outcome: "win",
    rMultiple: 1.8,
    emotion: "confident",
    strategy: "SMC",
    notes: "Textbook order block retest.",
  },
  {
    id: "j4",
    date: "2026-07-08",
    instrument: "XAUUSD",
    direction: "short",
    outcome: "breakeven",
    rMultiple: 0,
    emotion: "calm",
    strategy: "Wyckoff",
    lesson: "Moved to breakeven correctly when structure stalled.",
  },
  {
    id: "j5",
    date: "2026-07-07",
    instrument: "GBPUSD",
    direction: "short",
    outcome: "win",
    rMultiple: 3.1,
    emotion: "confident",
    strategy: "ICT",
    notes: "Let the runner breathe to a full 3R.",
  },
  {
    id: "j6",
    date: "2026-07-07",
    instrument: "EURUSD",
    direction: "long",
    outcome: "loss",
    rMultiple: -1.0,
    emotion: "greedy",
    strategy: "SMC",
    mistake: "Oversized after two wins.",
    lesson: "Fixed risk regardless of recent streak.",
  },
];

export const emotionLabels: Record<Emotion, string> = {
  calm: "Calm",
  confident: "Confident",
  anxious: "Anxious",
  greedy: "Greedy",
  fearful: "Fearful",
};

// ---- Derived analytics (computed from entries) --------------------------

export function computeAnalytics(entries: JournalEntry[]) {
  const total = entries.length;
  const wins = entries.filter((e) => e.outcome === "win").length;
  const losses = entries.filter((e) => e.outcome === "loss").length;
  const winRate = total ? Math.round((wins / total) * 100) : 0;

  const grossWin = entries.filter((e) => e.rMultiple > 0).reduce((s, e) => s + e.rMultiple, 0);
  const grossLoss = Math.abs(
    entries.filter((e) => e.rMultiple < 0).reduce((s, e) => s + e.rMultiple, 0)
  );
  const profitFactor = grossLoss ? Number((grossWin / grossLoss).toFixed(2)) : grossWin;
  const totalR = Number(entries.reduce((s, e) => s + e.rMultiple, 0).toFixed(1));
  const avgR = total ? Number((totalR / total).toFixed(2)) : 0;

  // Equity curve in R
  let running = 0;
  const equityCurve = [...entries]
    .reverse()
    .map((e) => {
      running += e.rMultiple;
      return Number(running.toFixed(1));
    });

  // Max drawdown in R
  let peak = 0;
  let maxDd = 0;
  let cum = 0;
  [...entries].reverse().forEach((e) => {
    cum += e.rMultiple;
    peak = Math.max(peak, cum);
    maxDd = Math.max(maxDd, peak - cum);
  });

  // By strategy
  const byStrategy: Record<string, { count: number; totalR: number }> = {};
  entries.forEach((e) => {
    byStrategy[e.strategy] ??= { count: 0, totalR: 0 };
    byStrategy[e.strategy].count += 1;
    byStrategy[e.strategy].totalR += e.rMultiple;
  });

  // Consistency: lower stdev of R = higher score (mock heuristic)
  const mean = avgR;
  const variance = total
    ? entries.reduce((s, e) => s + (e.rMultiple - mean) ** 2, 0) / total
    : 0;
  const consistency = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(variance) * 25)));

  // Psychology: win rate weighted by calm/confident share
  const composed = entries.filter((e) => e.emotion === "calm" || e.emotion === "confident").length;
  const psychology = total ? Math.round((composed / total) * 100) : 0;

  return {
    total,
    wins,
    losses,
    winRate,
    profitFactor,
    totalR,
    avgR,
    maxDd: Number(maxDd.toFixed(1)),
    equityCurve,
    byStrategy,
    consistency,
    psychology,
  };
}

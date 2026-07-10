/**
 * MOCK AI coach content — frontend only. Responses are canned/heuristic
 * placeholders; the real chat wires to an LLM endpoint later. No live
 * model calls happen here.
 */

export const suggestedPrompts = [
  "Review my last XAUUSD trade",
  "Explain what a fair value gap is",
  "Why did the market sweep my stop?",
  "How should I size a trade on gold?",
  "What should I focus on to be consistent?",
];

export interface CoachMessage {
  id: string;
  role: "user" | "coach";
  text: string;
}

// A small canned-response map so the interface feels alive without a
// real backend. Matches on keywords; falls back to a general reply.
export function mockCoachReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("fair value gap") || q.includes("fvg")) {
    return "A fair value gap is an imbalance left when price moves so fast that it skips a range of prices — you'll see a gap between the wick of one candle and the wick two candles later. Traders watch these as areas price may return to 'fill' before continuing. Treat them as points of interest, not guaranteed reversals.";
  }
  if (q.includes("stop") && (q.includes("sweep") || q.includes("hunt"))) {
    return "If price hit your stop then reversed, your stop was likely resting at an obvious level where many others placed theirs — a liquidity pool. Larger participants need those resting orders to fill size. The fix isn't a new indicator; it's placing stops where structure protects them rather than at the most obvious level everyone can see.";
  }
  if (q.includes("siz") || q.includes("risk")) {
    return "Risk a small, fixed fraction of your account per trade — commonly 0.5–1% — regardless of how confident you feel. On gold specifically, its wide range means you'll often need a wider stop, so your position size should shrink to keep that fixed risk constant. Fixed risk is what makes a losing streak survivable.";
  }
  if (q.includes("consistent") || q.includes("consistency")) {
    return "Consistency is a process, not a feeling: same setup, same risk, same execution, then measure how often you followed your plan regardless of the result. Separate 'was it a good trade?' from 'did it win?' — a good trade can lose. Journaling that distinction is what builds real consistency over time.";
  }
  if (q.includes("review") && q.includes("trade")) {
    return "Happy to review it. Tell me the instrument, your entry reason, where your stop was, and how you exited. In the full version I'll pull the trade straight from your journal and highlight whether the entry aligned with higher-timeframe structure and whether risk was fixed.";
  }
  return "Good question. In the full version I'll tailor this to your journal, your tier, and the markets you follow. For now: anchor every decision to higher-timeframe structure first, keep risk fixed and small, and judge trades on process rather than outcome.";
}

export const tradeReviewSample = {
  instrument: "XAUUSD",
  verdict: "Solid process",
  points: [
    { label: "Structure alignment", good: true, note: "Entry was with the H4 uptrend." },
    { label: "Risk fixed at 1%", good: true, note: "Sizing stayed disciplined." },
    { label: "Entry timing", good: false, note: "Entered slightly before London confirmed." },
  ],
};

import { Signal } from "./types";
import { strategies } from "./mockData";

/**
 * Generates a structured "Why This Trade?" rationale from a signal's
 * actual data fields (direction, confluence, session, strategies,
 * entry/stop/target, R:R). This is templated/deterministic — it reads
 * real numbers off the signal and turns them into readable sentences.
 * It is NOT a live AI call; the coach page uses the same honest pattern.
 * Wiring this to a real model is future backend/API scope.
 */

export interface TradeRationale {
  setupReason: string;
  entryReason: string;
  stopReason: string;
  liquidityNote: string;
  confidenceLabel: string;
  confidenceNote: string;
  sentiment: string;
  commonMistakes: string[];
}

const sessionLabel: Record<Signal["session"], string> = {
  asian: "the Asian session",
  london: "the London session",
  "new-york": "the New York session",
};

function confidenceBand(confluence: number): { label: string; note: string } {
  if (confluence >= 88) {
    return {
      label: "Very high",
      note: "Multiple independent strategies agree on this setup — that overlap is what pushes confluence this high.",
    };
  }
  if (confluence >= 75) {
    return {
      label: "High",
      note: "Most of the strategy stack lines up, with only minor disagreement between models.",
    };
  }
  if (confluence >= 60) {
    return {
      label: "Moderate",
      note: "The core structure supports the trade, but fewer strategies confirm it — worth tighter risk.",
    };
  }
  return {
    label: "Low",
    note: "Only partial confluence here. Treat this as a lower-conviction setup if you take it at all.",
  };
}

export function generateRationale(signal: Signal): TradeRationale {
  const dirWord = signal.direction === "long" ? "buy-side" : "sell-side";
  const stratNames = signal.strategies
    .map((id) => strategies.find((s) => s.id === id)?.short ?? id)
    .join(", ");
  const risk = Math.abs(signal.entry - signal.stop);
  const reward = Math.abs(signal.target - signal.entry);
  const { label, note } = confidenceBand(signal.confluence);

  return {
    setupReason: `${signal.instrument} printed a ${dirWord} setup on the ${signal.timeframe} timeframe during ${sessionLabel[signal.session]}, flagged by ${stratNames}. That combination is what triggered the scan.`,
    entryReason:
      signal.direction === "long"
        ? `Entry sits at ${signal.entry}, just above the level where the setups above agree demand is strongest — entering earlier risks the move not being confirmed yet.`
        : `Entry sits at ${signal.entry}, just below the level where the setups above agree supply is strongest — entering earlier risks the move not being confirmed yet.`,
    stopReason: `The stop at ${signal.stop} sits beyond the structure that would invalidate this idea — a risk of ${risk.toFixed(signal.assetClass === "forex" ? 4 : 2)} price units, giving a ${signal.riskReward.toFixed(1)}R target at ${signal.target}.`,
    liquidityNote:
      signal.direction === "long"
        ? "Resting liquidity below the entry is what likely fuels the initial move — that's the pool this setup expects to be swept before continuation."
        : "Resting liquidity above the entry is what likely fuels the initial move — that's the pool this setup expects to be swept before continuation.",
    confidenceLabel: label,
    confidenceNote: note,
    sentiment: `Reward of ${reward.toFixed(signal.assetClass === "forex" ? 4 : 2)} against risk of ${risk.toFixed(signal.assetClass === "forex" ? 4 : 2)} works out to roughly ${signal.riskReward.toFixed(1)}R — evaluate that against your own risk tolerance before sizing.`,
    commonMistakes: [
      "Entering before the level is actually tapped, rather than waiting for confirmation.",
      "Moving the stop further away after entry instead of respecting the original invalidation point.",
      "Oversizing because the confluence score looks high — confidence in a setup isn't confidence in the outcome.",
    ],
  };
}

import { Tier } from "./mockAuth";

/**
 * MOCK trading games data. The candlestick/pattern quiz is fully
 * playable frontend; other games are presented as coming-soon cards
 * within the Arena. Original questions written for Flux.
 */

export interface GameCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  minTier: Tier;
  playable: boolean;
  xpReward: number;
}

export const games: GameCard[] = [
  { id: "g-pattern", name: "Pattern Recognition", description: "Identify the setup from a described chart scenario.", icon: "ScanSearch", minTier: "free", playable: true, xpReward: 50 },
  { id: "g-direction", name: "Market Direction Challenge", description: "Call the next move from structure clues.", icon: "TrendingUp", minTier: "free", playable: false, xpReward: 40 },
  { id: "g-liquidity", name: "Liquidity Hunt", description: "Spot where the stops are resting.", icon: "Crosshair", minTier: "basic", playable: false, xpReward: 60 },
  { id: "g-risk", name: "Risk Simulator", description: "Size positions to survive a losing streak.", icon: "ShieldAlert", minTier: "basic", playable: false, xpReward: 55 },
  { id: "g-replay", name: "Replay Mode", description: "Trade a historical move bar by bar.", icon: "Rewind", minTier: "pro", playable: false, xpReward: 80 },
  { id: "g-speed", name: "Speed Challenge", description: "Rapid-fire concept recall against the clock.", icon: "Timer", minTier: "free", playable: false, xpReward: 45 },
];

export interface PatternQuestion {
  id: string;
  scenario: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const patternQuestions: PatternQuestion[] = [
  {
    id: "pq1",
    scenario:
      "Price makes a higher high, then a higher low, then another higher high. What is the structure?",
    options: ["Downtrend", "Uptrend", "Range", "Reversal confirmed"],
    answerIndex: 1,
    explanation: "Higher highs and higher lows define an uptrend.",
  },
  {
    id: "pq2",
    scenario:
      "Price sweeps below an obvious equal-lows level, then sharply reverses upward. What likely happened?",
    options: [
      "A liquidity sweep of resting stops",
      "A permanent trend change",
      "An indicator error",
      "Nothing meaningful",
    ],
    answerIndex: 0,
    explanation:
      "Equal lows attract stops; price swept that liquidity pool before reversing.",
  },
  {
    id: "pq3",
    scenario:
      "In a clean uptrend, price pulls back into the last bullish order block and holds. What's the higher-probability bias?",
    options: ["Short into the trend", "Long continuation", "Close everything", "Ignore it"],
    answerIndex: 1,
    explanation:
      "A pullback into a valid order block within an uptrend favours long continuation.",
  },
  {
    id: "pq4",
    scenario:
      "Price rapidly leaves a gap between candle wicks during a strong move. What is this called?",
    options: ["Order block", "Fair value gap", "Support", "Doji"],
    answerIndex: 1,
    explanation: "A fast move leaving an unfilled gap between wicks is a fair value gap.",
  },
  {
    id: "pq5",
    scenario:
      "The first structural break against a prevailing trend appears. What is the correct term?",
    options: ["Break of Structure (BOS)", "Change of Character (CHoCH)", "Doji", "Range"],
    answerIndex: 1,
    explanation:
      "The first break signalling a possible trend shift is a Change of Character (CHoCH).",
  },
];

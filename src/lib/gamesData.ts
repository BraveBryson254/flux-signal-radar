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
  { id: "g-ninja", name: "Candlestick Ninja", description: "Slice only the matching candles before they fall. Reflex training.", icon: "Swords", minTier: "free", playable: true, xpReward: 45 },
  { id: "g-pattern", name: "Pattern Recognition", description: "Identify the setup from a described chart scenario.", icon: "ScanSearch", minTier: "free", playable: true, xpReward: 50 },
  { id: "g-direction", name: "Market Direction Challenge", description: "Predict the next tick on a live-moving chart. Streaks pay.", icon: "TrendingUp", minTier: "free", playable: true, xpReward: 40 },
  { id: "g-liquidity", name: "Liquidity Hunt", description: "Click the level most likely to get swept first.", icon: "Crosshair", minTier: "basic", playable: true, xpReward: 60 },
  { id: "g-risk", name: "Risk Simulator", description: "Size positions across 15 trades. Survive the streak.", icon: "ShieldAlert", minTier: "basic", playable: true, xpReward: 55 },
  { id: "g-replay", name: "Replay Mode", description: "Trade a historical move bar by bar, blind to what's next.", icon: "Rewind", minTier: "pro", playable: true, xpReward: 80 },
  { id: "g-speed", name: "Speed Challenge", description: "Rapid-fire concept recall — 60 seconds on the clock.", icon: "Timer", minTier: "free", playable: true, xpReward: 45 },
];

// ---- Liquidity Hunt — click the marker most likely to get swept first ----

export interface LiquidityScenario {
  id: string;
  prompt: string;
  markers: { id: string; label: string; x: number; y: number }[];
  correctId: string;
  explanation: string;
}

export const liquidityScenarios: LiquidityScenario[] = [
  {
    id: "lh1",
    prompt: "Price is ranging beneath three resistance touches. Where do stops likely cluster?",
    markers: [
      { id: "A", label: "A", x: 60, y: 40 },
      { id: "B", label: "B", x: 140, y: 38 },
      { id: "C", label: "C", x: 220, y: 90 },
    ],
    correctId: "B",
    explanation: "B sits at the third, most obvious equal-high — the pool everyone can see, and the one most likely swept.",
  },
  {
    id: "lh2",
    prompt: "An uptrend just broke a minor swing low. Which level holds the bigger liquidity pool?",
    markers: [
      { id: "A", label: "A", x: 70, y: 100 },
      { id: "B", label: "B", x: 150, y: 60 },
      { id: "C", label: "C", x: 230, y: 130 },
    ],
    correctId: "C",
    explanation: "C is the deeper, older swing low — stops accumulate there over a longer time, making it the larger pool.",
  },
  {
    id: "lh3",
    prompt: "Price is coiling under a steep trendline traders have leaned on for a week.",
    markers: [
      { id: "A", label: "A", x: 80, y: 50 },
      { id: "B", label: "B", x: 160, y: 45 },
      { id: "C", label: "C", x: 240, y: 100 },
    ],
    correctId: "B",
    explanation: "B sits right on the trendline itself — the most obvious, most-watched line has the densest resting stops.",
  },
  {
    id: "lh4",
    prompt: "Multiple failed breakout attempts have printed just above one level.",
    markers: [
      { id: "A", label: "A", x: 90, y: 110 },
      { id: "B", label: "B", x: 170, y: 70 },
      { id: "C", label: "C", x: 250, y: 55 },
    ],
    correctId: "C",
    explanation: "Repeated failed breakouts stack fresh stops just above C each time — it becomes the freshest, most attractive pool.",
  },
  {
    id: "lh5",
    prompt: "A daily equal-low sits far below current price alongside a minor intraday dip nearby.",
    markers: [
      { id: "A", label: "A", x: 100, y: 130 },
      { id: "B", label: "B", x: 180, y: 95 },
      { id: "C", label: "C", x: 260, y: 60 },
    ],
    correctId: "A",
    explanation: "The daily equal-low (A) carries far more resting size than a minor intraday dip — higher timeframe pools win.",
  },
];

// ---- Replay Mode — a fixed synthetic historical move, bar by bar --------

export interface ReplayBar {
  o: number;
  h: number;
  l: number;
  c: number;
}

// A hand-shaped synthetic uptrend-into-distribution move. Values are
// abstract price units, not tied to any real instrument.
export const replayBars: ReplayBar[] = [
  { o: 100, h: 102, l: 99, c: 101 }, { o: 101, h: 103, l: 100, c: 102 },
  { o: 102, h: 104, l: 101, c: 103 }, { o: 103, h: 103.5, l: 101.5, c: 102 },
  { o: 102, h: 102.5, l: 99.5, c: 100.2 }, { o: 100.2, h: 102, l: 99.8, c: 101.6 },
  { o: 101.6, h: 104, l: 101, c: 103.8 }, { o: 103.8, h: 106, l: 103.2, c: 105.5 },
  { o: 105.5, h: 107.2, l: 105, c: 106.8 }, { o: 106.8, h: 107, l: 104.5, c: 105 },
  { o: 105, h: 105.5, l: 102.8, c: 103.2 }, { o: 103.2, h: 104, l: 101.5, c: 102 },
  { o: 102, h: 104.5, l: 101.8, c: 104.1 }, { o: 104.1, h: 107, l: 103.9, c: 106.6 },
  { o: 106.6, h: 109.5, l: 106.2, c: 109 }, { o: 109, h: 111, l: 108.5, c: 110.4 },
  { o: 110.4, h: 112.5, l: 110, c: 112 }, { o: 112, h: 113, l: 109.5, c: 110 },
  { o: 110, h: 110.5, l: 106, c: 106.8 }, { o: 106.8, h: 108, l: 104.5, c: 105.2 },
  { o: 105.2, h: 106, l: 102, c: 102.6 }, { o: 102.6, h: 104, l: 100.5, c: 101 },
  { o: 101, h: 103, l: 100.2, c: 102.5 }, { o: 102.5, h: 105, l: 102, c: 104.6 },
  { o: 104.6, h: 107, l: 104, c: 106.5 }, { o: 106.5, h: 109, l: 106, c: 108.7 },
  { o: 108.7, h: 111, l: 108.3, c: 110.5 }, { o: 110.5, h: 113.5, l: 110, c: 113 },
  { o: 113, h: 115, l: 112.5, c: 114.6 }, { o: 114.6, h: 116, l: 113, c: 113.5 },
  { o: 113.5, h: 114, l: 110, c: 110.8 }, { o: 110.8, h: 111.5, l: 107.5, c: 108 },
  { o: 108, h: 108.5, l: 105, c: 105.6 }, { o: 105.6, h: 107, l: 103.5, c: 104.2 },
  { o: 104.2, h: 106, l: 103.8, c: 105.5 }, { o: 105.5, h: 108, l: 105, c: 107.6 },
  { o: 107.6, h: 110, l: 107.2, c: 109.4 }, { o: 109.4, h: 112, l: 109, c: 111.5 },
  { o: 111.5, h: 114, l: 111, c: 113.6 }, { o: 113.6, h: 116.5, l: 113.2, c: 116 },
];

// ---- Speed Challenge — rapid true/false recall pool ----------------------

export interface SpeedQuestion {
  id: string;
  statement: string;
  answer: boolean;
}

export const speedQuestions: SpeedQuestion[] = [
  { id: "sq1", statement: "A break of structure confirms trend continuation.", answer: true },
  { id: "sq2", statement: "Change of character (CHoCH) is the same thing as a fair value gap.", answer: false },
  { id: "sq3", statement: "Fixed fractional risk keeps a losing streak survivable.", answer: true },
  { id: "sq4", statement: "Equal highs typically repel price permanently.", answer: false },
  { id: "sq5", statement: "An order block is the last opposing candle before a strong move.", answer: true },
  { id: "sq6", statement: "Trading psychology is only about willpower, not process.", answer: false },
  { id: "sq7", statement: "A fair value gap forms when price moves fast enough to skip a range.", answer: true },
  { id: "sq8", statement: "Higher highs and higher lows define a downtrend.", answer: false },
  { id: "sq9", statement: "R-multiple expresses a trade's result in units of initial risk.", answer: true },
  { id: "sq10", statement: "Prop firm accounts have no daily loss limits.", answer: false },
  { id: "sq11", statement: "A liquidity sweep often precedes a reversal off a key level.", answer: true },
  { id: "sq12", statement: "Journaling only matters after a losing trade.", answer: false },
];

// ---- Arena leaderboard & prize structure ----------------------------------
//
// Prize funding is explicitly platform-funded (Flux), never pooled from
// user deposits or wagers. No deposit/withdrawal flow exists here — this
// is a points leaderboard only, ready to attach a funded prize later.

export interface ArenaLeader {
  rank: number;
  name: string;
  points: number;
  region: string;
  you?: boolean;
}

export const arenaLeaderboard: ArenaLeader[] = [
  { rank: 1, name: "KipTrades", points: 4820, region: "Nairobi" },
  { rank: 2, name: "AminaFX", points: 4110, region: "Mombasa" },
  { rank: 3, name: "DomoTrader", points: 3705, region: "Kampala" },
  { rank: 4, name: "PipQueen", points: 2990, region: "Nairobi" },
  { rank: 5, name: "You", points: 1240, region: "Nairobi", you: true },
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

import { Tier } from "./mockAuth";

/**
 * ORIGINAL articles and market learning paths, written specifically for
 * Flux Signal Radar. Synthesized from widely-taught concepts in original
 * language — no copyrighted text reproduced.
 */

export interface Article {
  id: string;
  title: string;
  category: string;
  readMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  excerpt: string;
  body: string[];
  minTier: Tier;
}

export const articles: Article[] = [
  {
    id: "a-structure",
    title: "Reading Market Structure Without Overthinking It",
    category: "Market Structure",
    readMinutes: 6,
    difficulty: "Beginner",
    minTier: "free",
    excerpt:
      "The single skill that makes every other strategy make sense — told simply.",
    body: [
      "Most trading confusion comes from skipping structure. Before any indicator or entry model, the market is just printing swing highs and swing lows. Learning to read that sequence is the foundation everything else rests on.",
      "Start higher, not lower. On a 4-hour or daily chart, mark the obvious swing points. Are highs and lows generally rising, falling, or going sideways? That single read tells you which kind of setup even belongs on the screen — trend-continuation in a trend, reversal only once structure genuinely breaks.",
      "The most common mistake is zooming in until noise looks like signal. If every small pullback seems like a reversal, you are almost certainly on too low a timeframe for the decision you are trying to make. Structure is a higher-timeframe conversation you then execute on a lower one.",
      "Practise by narrating the chart out loud: 'higher high, higher low, still an uptrend.' It sounds basic, but traders who can do this reliably avoid the majority of avoidable losses.",
    ],
  },
  {
    id: "a-liquidity",
    title: "Liquidity, Explained Like You Actually Trade",
    category: "Liquidity",
    readMinutes: 7,
    difficulty: "Intermediate",
    minTier: "free",
    excerpt:
      "Why price keeps 'stopping you out then reversing' — and how to stop being the fuel.",
    body: [
      "If price seems to hit your stop and immediately reverse, you are experiencing liquidity in action. Your stop, sitting at an obvious level, was part of a pool that larger participants needed to fill their orders.",
      "The fix is not a magic indicator. It is placing stops where they are protected by structure rather than exposed at the most obvious level everyone else uses. If the whole market can see equal lows, assume the stops beneath them are a target.",
      "This does not mean the market is 'out to get you' — it is simply mechanical. Big orders need opposing orders to fill against, and the most orders sit where the most traders have placed them. Trade with that reality instead of against it.",
      "A practical habit: before entering, ask 'where is the obvious liquidity, and am I trading toward it or away from it?' Entering just after a sweep of obvious liquidity, in the direction of higher-timeframe structure, is one of the more robust ideas in modern price action.",
    ],
  },
  {
    id: "a-risk",
    title: "The Risk Rule That Outperforms Most Strategies",
    category: "Risk Management",
    readMinutes: 5,
    difficulty: "Beginner",
    minTier: "free",
    excerpt: "Fixed fractional risk — boring, unglamorous, and the reason accounts survive.",
    body: [
      "Ask a room of struggling traders what they are working on and most will say 'a better strategy.' Ask survivors and they will talk about risk. The difference between the two groups is rarely edge — it is position sizing.",
      "The core rule is simple: risk a small, fixed fraction of your account on every trade — commonly 0.5% to 1%. Fixed means fixed, regardless of how confident you feel. Confidence is exactly the feeling that precedes oversizing.",
      "Why it works: fixed fractional risk makes a losing streak survivable. Ten losses in a row at 1% leaves you down about 10%; the same streak at 5% risk leaves you down closer to 40% and emotionally wrecked. Survival keeps you in the game long enough for your edge to show.",
      "For prop-firm traders this is doubly important, because a single oversized loss can breach a daily or maximum drawdown limit and end a funded account instantly. The discipline that feels boring is the discipline that keeps you funded.",
    ],
  },
  {
    id: "a-consistency",
    title: "Building Consistency: The Unspoken Skill",
    category: "Psychology",
    readMinutes: 6,
    difficulty: "Intermediate",
    minTier: "basic",
    excerpt: "Consistency is a process you can measure, not a personality trait.",
    body: [
      "Consistency is often talked about as if it were willpower. It is better understood as a process: the same setup, the same risk, the same execution, repeated — and measured.",
      "The measurement part is what most people skip. Without a journal, 'being consistent' is a vibe. With one, it becomes a number: how often did you follow your plan, regardless of whether the trade won? That process-adherence metric predicts long-term results better than any single week's profit.",
      "Aim to separate two questions that beginners fuse together: 'was it a good trade?' and 'did it win?' A good trade can lose and a bad trade can win. Judging yourself on process rather than outcome is what lets you keep doing the right thing through inevitable losing stretches.",
    ],
  },
];

export interface MarketPath {
  id: string;
  market: string;
  symbol: string;
  icon: string;
  characteristics: string;
  volatility: string;
  bestSessions: string;
  commonMistake: string;
  minTier: Tier;
}

export const marketPaths: MarketPath[] = [
  {
    id: "mp-gold",
    market: "Gold",
    symbol: "XAUUSD",
    icon: "Gem",
    characteristics:
      "Reacts strongly to the US dollar, real yields, and risk sentiment. Trends hard but whipsaws around news.",
    volatility: "High — wide stops and disciplined sizing are essential.",
    bestSessions: "London and the London–New York overlap.",
    commonMistake: "Oversizing because of gold's big moves, then getting stopped by normal noise.",
    minTier: "free",
  },
  {
    id: "mp-forex",
    market: "Forex Majors",
    symbol: "EURUSD / GBPUSD",
    icon: "DollarSign",
    characteristics:
      "Deep liquidity and cleaner structure. Driven by rate expectations and session flows.",
    volatility: "Moderate — respects technical levels more predictably than gold.",
    bestSessions: "London open and New York open.",
    commonMistake: "Trading the low-liquidity Asian range as if it were a trend.",
    minTier: "free",
  },
  {
    id: "mp-nas",
    market: "NAS100",
    symbol: "US Tech 100",
    icon: "TrendingUp",
    characteristics:
      "Momentum-driven and sentiment-sensitive. Gaps and fast expansions are common.",
    volatility: "High during the US session; thinner overnight.",
    bestSessions: "New York cash open.",
    commonMistake: "Fading strong momentum instead of trading with it.",
    minTier: "basic",
  },
  {
    id: "mp-us30",
    market: "US30",
    symbol: "Dow 30",
    icon: "BarChart3",
    characteristics:
      "Large index moves in points; behaves similarly to NAS100 but often smoother.",
    volatility: "High during US session news.",
    bestSessions: "New York cash open.",
    commonMistake: "Ignoring point-value when sizing, leading to accidental over-risk.",
    minTier: "basic",
  },
];

export const glossary = [
  { term: "BOS", definition: "Break of Structure — price breaks a prior swing point, confirming trend continuation." },
  { term: "CHoCH", definition: "Change of Character — the first structural break signalling a possible trend shift." },
  { term: "FVG", definition: "Fair Value Gap — an imbalance where price moved so fast it left an unfilled gap between wicks." },
  { term: "Order block", definition: "The last opposing candle before a strong move; often acts as future support/resistance." },
  { term: "Liquidity", definition: "Orders available to trade against; price is drawn toward clustered resting orders." },
  { term: "R-multiple", definition: "A trade's result expressed in units of initial risk. +2R means twice the amount risked." },
  { term: "Drawdown", definition: "The decline from a peak in account equity, usually measured as a percentage." },
];

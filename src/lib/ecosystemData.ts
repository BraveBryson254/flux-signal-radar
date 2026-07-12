import { Tier } from "./mockAuth";

/**
 * MOCK ecosystem data. Every export here is shaped to match what the
 * Supabase backend will return, so widgets consuming it won't change
 * when the real data source is wired in.
 */

export interface Mission {
  id: string;
  label: string;
  xp: number;
  done: boolean;
}

export const dailyMissions: Mission[] = [
  { id: "m1", label: "Check today's signal", xp: 20, done: true },
  { id: "m2", label: "Read one Academy lesson", xp: 30, done: true },
  { id: "m3", label: "Log a trade in your journal", xp: 40, done: false },
  { id: "m4", label: "Play one trading game", xp: 25, done: false },
];

export const weeklyMissions: Mission[] = [
  { id: "w1", label: "Maintain a 5-day login streak", xp: 100, done: false },
  { id: "w2", label: "Complete a learning module", xp: 150, done: false },
  { id: "w3", label: "Enter the weekly competition", xp: 120, done: false },
];

export interface Achievement {
  id: string;
  label: string;
  icon: string; // lucide icon name
  unlocked: boolean;
}

export const achievements: Achievement[] = [
  { id: "a1", label: "Arena Debut", icon: "Radar", unlocked: true },
  { id: "a2", label: "3-Day Streak", icon: "Flame", unlocked: true },
  { id: "a3", label: "First Journal Entry", icon: "BookOpen", unlocked: true },
  { id: "a4", label: "Academy Graduate", icon: "GraduationCap", unlocked: false },
  { id: "a5", label: "Competitor", icon: "Trophy", unlocked: false },
  { id: "a6", label: "Sharp Shooter", icon: "Target", unlocked: false },
];

export const marketOutlook = {
  date: "Today",
  sentiment: "Risk-on" as const,
  headline: "Dollar softens ahead of NY session; gold holds above support.",
  bias: [
    { market: "XAUUSD", bias: "Bullish", note: "Holding H4 demand" },
    { market: "EURUSD", bias: "Bullish", note: "London liquidity sweep done" },
    { market: "NAS100", bias: "Neutral", note: "Awaiting session open" },
  ],
};

export const marketSessions = [
  { name: "Sydney", open: false },
  { name: "Tokyo", open: false },
  { name: "London", open: true },
  { name: "New York", open: true },
];

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  region: string;
  you?: boolean;
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "KipTrades", xp: 8420, region: "Nairobi" },
  { rank: 2, name: "AminaFX", xp: 7980, region: "Mombasa" },
  { rank: 3, name: "DomoTrader", xp: 7310, region: "Kampala" },
  { rank: 4, name: "You", xp: 1240, region: "Nairobi", you: true },
  { rank: 5, name: "SnrEmperor", xp: 1180, region: "Dar es Salaam" },
];

export interface ActivityItem {
  id: string;
  label: string;
  time: string;
}

export const recentActivity: ActivityItem[] = [
  { id: "r1", label: "Earned 30 XP — read 'What is Liquidity?'", time: "10m ago" },
  { id: "r2", label: "Unlocked '3-Day Streak' badge", time: "2h ago" },
  { id: "r3", label: "Logged a XAUUSD trade", time: "5h ago" },
  { id: "r4", label: "Placed #4 on the weekly leaderboard", time: "1d ago" },
];

export const learningProgress = {
  currentCourse: "Smart Money Concepts: Foundations",
  lessonsDone: 6,
  lessonsTotal: 10,
  nextLesson: "Order Blocks in Practice",
};

export const competition = {
  name: "Weekly Demo Cup",
  endsInHours: 52,
  entrants: 214,
  prizePool: "1 month Elite × 3",
  yourRank: 18,
};

export const trendingAssets = [
  { symbol: "XAUUSD", change: 0.82 },
  { symbol: "EURUSD", change: 0.31 },
  { symbol: "NAS100", change: -0.44 },
  { symbol: "BTCUSD", change: 2.15 },
  { symbol: "US30", change: -0.12 },
];

// Widgets shown per tier are additive — higher tiers see everything
// lower tiers see, plus their own. This maps a widget id to the
// minimum tier required to see it.
export const widgetMinTier: Record<string, Tier> = {
  welcome: "free",
  dailySignal: "free",
  marketOutlook: "free",
  missions: "free",
  streak: "free",
  xpLevel: "free",
  achievements: "free",
  leaderboard: "free",
  marketSessions: "free",
  learningProgress: "free",
  recentActivity: "free",
  competition: "free",
  trendingAssets: "basic",
  watchlist: "basic",
  performanceAnalytics: "basic",
  multiMarket: "pro",
  riskAnalytics: "pro",
  aiLab: "elite",
  orderFlow: "elite",
};

import { Tier } from "./mockAuth";

/**
 * MOCK education data. Shaped to match what Supabase will return so the
 * Academy, Library, and Video Center won't change when real content is
 * uploaded. Books/videos will be populated via the admin panel later.
 */

export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  done: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: Level;
  minTier: Tier;
  summary: string;
  lessons: Lesson[];
  color: string; // accent used on the card
}

export const courseCategories = [
  "All",
  "Beginner",
  "SMC",
  "ICT",
  "Wyckoff",
  "Risk Management",
  "Psychology",
  "Prop Firm",
];

export const courses: Course[] = [
  {
    id: "c1",
    title: "Smart Money Concepts: Foundations",
    category: "SMC",
    level: "Beginner",
    minTier: "free",
    summary: "Liquidity, order blocks, and market structure from the ground up.",
    color: "var(--color-accent)",
    lessons: [
      { id: "c1l1", title: "What is liquidity?", minutes: 8, done: true },
      { id: "c1l2", title: "Market structure basics", minutes: 12, done: true },
      { id: "c1l3", title: "Identifying order blocks", minutes: 15, done: true },
      { id: "c1l4", title: "Breaker blocks", minutes: 11, done: true },
      { id: "c1l5", title: "Fair value gaps", minutes: 14, done: true },
      { id: "c1l6", title: "Liquidity sweeps", minutes: 10, done: true },
      { id: "c1l7", title: "Order blocks in practice", minutes: 18, done: false },
      { id: "c1l8", title: "Entry models", minutes: 16, done: false },
      { id: "c1l9", title: "Risk placement", minutes: 9, done: false },
      { id: "c1l10", title: "Putting it together", minutes: 20, done: false },
    ],
  },
  {
    id: "c2",
    title: "ICT Concepts Deep Dive",
    category: "ICT",
    level: "Intermediate",
    minTier: "basic",
    summary: "BOS, CHoCH, and the ICT entry framework explained clearly.",
    color: "var(--color-bull)",
    lessons: [
      { id: "c2l1", title: "Break of structure", minutes: 10, done: false },
      { id: "c2l2", title: "Change of character", minutes: 13, done: false },
      { id: "c2l3", title: "Optimal trade entry", minutes: 17, done: false },
      { id: "c2l4", title: "Kill zones", minutes: 12, done: false },
    ],
  },
  {
    id: "c3",
    title: "Wyckoff Accumulation & Distribution",
    category: "Wyckoff",
    level: "Advanced",
    minTier: "pro",
    summary: "Read institutional phases and position with the smart money.",
    color: "var(--color-bear)",
    lessons: [
      { id: "c3l1", title: "The Wyckoff method", minutes: 14, done: false },
      { id: "c3l2", title: "Accumulation schematics", minutes: 19, done: false },
      { id: "c3l3", title: "Distribution schematics", minutes: 19, done: false },
      { id: "c3l4", title: "Spring and upthrust", minutes: 16, done: false },
    ],
  },
  {
    id: "c4",
    title: "Risk Management for Prop Firms",
    category: "Risk Management",
    level: "Intermediate",
    minTier: "basic",
    summary: "Survive drawdown limits and pass funded challenges.",
    color: "var(--color-accent)",
    lessons: [
      { id: "c4l1", title: "Position sizing", minutes: 11, done: false },
      { id: "c4l2", title: "Daily loss limits", minutes: 9, done: false },
      { id: "c4l3", title: "Max drawdown discipline", minutes: 13, done: false },
    ],
  },
  {
    id: "c5",
    title: "Trading Psychology",
    category: "Psychology",
    level: "Beginner",
    minTier: "free",
    summary: "Build the discipline that separates consistent traders.",
    color: "var(--color-bull)",
    lessons: [
      { id: "c5l1", title: "Fear and greed", minutes: 10, done: false },
      { id: "c5l2", title: "Journaling for growth", minutes: 12, done: false },
      { id: "c5l3", title: "Handling a losing streak", minutes: 14, done: false },
    ],
  },
];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  minTier: Tier;
  pages: number;
  progress: number; // 0-100
  sample: boolean;
}

export const books: Book[] = [
  { id: "b1", title: "The Language of Liquidity", author: "Flux Editorial", category: "SMC", minTier: "free", pages: 120, progress: 34, sample: true },
  { id: "b2", title: "Structure & Flow", author: "Flux Editorial", category: "ICT", minTier: "basic", pages: 210, progress: 0, sample: false },
  { id: "b3", title: "Wyckoff in Modern Markets", author: "Flux Editorial", category: "Wyckoff", minTier: "pro", pages: 260, progress: 0, sample: false },
  { id: "b4", title: "The Disciplined Trader's Journal", author: "Flux Editorial", category: "Psychology", minTier: "basic", pages: 90, progress: 0, sample: false },
  { id: "b5", title: "Prop Firm Playbook", author: "Flux Editorial", category: "Prop Firm", minTier: "basic", pages: 150, progress: 0, sample: false },
  { id: "b6", title: "Gold: Reading the Metal", author: "Flux Editorial", category: "Gold", minTier: "pro", pages: 180, progress: 0, sample: false },
];

// Placeholder chapter text for the reader preview. Real book content is
// uploaded later and served per-page; this is lorem-style filler only.
export const sampleChapters = [
  {
    title: "Chapter 1 — What Liquidity Really Means",
    paragraphs: [
      "Liquidity is the fuel every market runs on. Before price can move meaningfully in any direction, there must be orders resting on the other side to absorb it.",
      "Retail traders are taught to see support and resistance as walls. Institutions see them as pools — clusters of stop orders waiting to be collected before the real move begins.",
      "In this chapter we reframe the chart entirely: not as a battle between buyers and sellers, but as a search for liquidity to fill large positions with minimal slippage.",
    ],
  },
  {
    title: "Chapter 2 — Where Liquidity Hides",
    paragraphs: [
      "Equal highs and equal lows are the most obvious liquidity pools on any chart. They act like magnets because everyone can see them.",
      "Trendline liquidity is subtler. As traders lean on an obvious trendline, their stops stack just beyond it — an inviting target for a sweep.",
      "By the end of this chapter you will start to see the chart the way a desk trader does: as a map of where other people's stops are resting.",
    ],
  },
];

export interface Video {
  id: string;
  title: string;
  channel: string;
  category: string;
  minTier: Tier;
  duration: string;
  youtubeId: string; // real embeds wired via admin later
  progress: number;
}

export const videos: Video[] = [
  { id: "v1", title: "Market Structure Explained", channel: "Flux Academy", category: "SMC", minTier: "free", duration: "12:40", youtubeId: "", progress: 100 },
  { id: "v2", title: "Order Blocks Live Example", channel: "Flux Academy", category: "SMC", minTier: "free", duration: "18:22", youtubeId: "", progress: 45 },
  { id: "v3", title: "ICT Kill Zones Session", channel: "Flux Academy", category: "ICT", minTier: "basic", duration: "24:10", youtubeId: "", progress: 0 },
  { id: "v4", title: "Wyckoff Distribution Breakdown", channel: "Flux Academy", category: "Wyckoff", minTier: "pro", duration: "31:05", youtubeId: "", progress: 0 },
  { id: "v5", title: "Passing Your First Funded Challenge", channel: "Flux Academy", category: "Prop Firm", minTier: "basic", duration: "20:33", youtubeId: "", progress: 0 },
];

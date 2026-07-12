/**
 * Platform-defined social content — competitions and rooms are things
 * Flux creates (like Schools), not per-user data. Real per-user
 * activity (joins, leaderboards, posts, likes, member/message counts,
 * top learners) lives in competitionsService.ts and communityService.ts.
 */

export interface Competition {
  id: string;
  name: string;
  status: "live" | "upcoming" | "ended";
  endsInHours?: number;
  startsInHours?: number;
  entrants: number; // fallback shown only before the real count loads
  prize: string;
  type: "Weekly" | "Monthly" | "Seasonal";
}

export const competitions: Competition[] = [
  { id: "cmp1", name: "Weekly Demo Cup", status: "live", endsInHours: 52, entrants: 0, prize: "1 month Elite × 3", type: "Weekly" },
  { id: "cmp2", name: "Gold Sniper Challenge", status: "live", endsInHours: 18, entrants: 0, prize: "500 coins + badge", type: "Weekly" },
  { id: "cmp3", name: "July Monthly Championship", status: "upcoming", startsInHours: 96, entrants: 0, prize: "Elite annual + trophy", type: "Monthly" },
  { id: "cmp4", name: "Consistency League — Season 3", status: "upcoming", startsInHours: 240, entrants: 0, prize: "Season crown + 2000 coins", type: "Seasonal" },
];

// ---- Earned identity titles ---------------------------------------------

export interface EarnedTitle {
  id: string;
  label: string;
  requirement: string;
  icon: string; // lucide name
  earned: boolean;
}

export const earnedTitles: EarnedTitle[] = [
  { id: "t1", label: "Market Explorer", requirement: "Complete your profile & first lesson", icon: "Compass", earned: true },
  { id: "t2", label: "Risk Guardian", requirement: "Finish the Risk Management course", icon: "Shield", earned: true },
  { id: "t3", label: "Gold Specialist", requirement: "Log 10 XAUUSD trades", icon: "Gem", earned: false },
  { id: "t4", label: "Forex Strategist", requirement: "Win a forex-focused competition", icon: "TrendingUp", earned: false },
  { id: "t5", label: "Consistency Champion", requirement: "Maintain a 30-day streak", icon: "Flame", earned: false },
  { id: "t6", label: "Competition Finalist", requirement: "Place top 3 in any competition", icon: "Medal", earned: false },
  { id: "t7", label: "Master Analyst", requirement: "Reach Level 20", icon: "Brain", earned: false },
  { id: "t8", label: "Institutional Trader", requirement: "Complete all Advanced courses", icon: "Building2", earned: false },
];

export function activeTitle(): EarnedTitle {
  const earned = earnedTitles.filter((t) => t.earned);
  return earned[earned.length - 1] ?? earnedTitles[0];
}

// ---- Community rooms — structure only, real posts/presence are separate --

export interface CommunityRoom {
  id: string;
  name: string;
  topic: string;
  icon: string;
}

export const communityRooms: CommunityRoom[] = [
  { id: "r1", name: "General Chat", topic: "Open floor for all traders", icon: "MessageSquare" },
  { id: "r2", name: "Gold Room", topic: "XAUUSD setups & discussion", icon: "Gem" },
  { id: "r3", name: "Prop Firm Support", topic: "Passing & managing funded accounts", icon: "Building2" },
  { id: "r4", name: "SMC Study Group", topic: "Smart Money Concepts deep dives", icon: "BookOpen" },
  { id: "r5", name: "Mentorship Lounge", topic: "Pro & Elite mentorship", icon: "GraduationCap" },
];

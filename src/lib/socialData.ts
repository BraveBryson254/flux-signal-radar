/**
 * MOCK social data — competitions, community, and the earned-title
 * identity system. Titles are earned through activity (distinct from
 * paid tiers). Shaped for the future Supabase backend.
 */

export interface Competition {
  id: string;
  name: string;
  status: "live" | "upcoming" | "ended";
  endsInHours?: number;
  startsInHours?: number;
  entrants: number;
  prize: string;
  type: "Weekly" | "Monthly" | "Seasonal";
}

export const competitions: Competition[] = [
  { id: "cmp1", name: "Weekly Demo Cup", status: "live", endsInHours: 52, entrants: 214, prize: "1 month Elite × 3", type: "Weekly" },
  { id: "cmp2", name: "Gold Sniper Challenge", status: "live", endsInHours: 18, entrants: 96, prize: "500 coins + badge", type: "Weekly" },
  { id: "cmp3", name: "July Monthly Championship", status: "upcoming", startsInHours: 96, entrants: 41, prize: "Elite annual + trophy", type: "Monthly" },
  { id: "cmp4", name: "Consistency League — Season 3", status: "upcoming", startsInHours: 240, entrants: 12, prize: "Season crown + 2000 coins", type: "Seasonal" },
];

export interface CompetitionRank {
  rank: number;
  name: string;
  score: string;
  region: string;
  you?: boolean;
}

export const competitionLeaderboard: CompetitionRank[] = [
  { rank: 1, name: "KipTrades", score: "+18.4R", region: "Nairobi" },
  { rank: 2, name: "AminaFX", score: "+15.1R", region: "Mombasa" },
  { rank: 3, name: "DomoTrader", score: "+12.8R", region: "Kampala" },
  { rank: 4, name: "GoldHunterKE", score: "+9.6R", region: "Nakuru" },
  { rank: 5, name: "You", score: "+7.2R", region: "Nairobi", you: true },
  { rank: 6, name: "SnrEmperor", score: "+6.9R", region: "Dar es Salaam" },
  { rank: 7, name: "PipQueen", score: "+5.4R", region: "Nairobi" },
];

export const recentWinners = [
  { name: "KipTrades", event: "Weekly Demo Cup #23", prize: "1 month Elite", region: "Nairobi" },
  { name: "AminaFX", event: "Gold Sniper #11", prize: "500 coins", region: "Mombasa" },
  { name: "DomoTrader", event: "June Championship", prize: "Elite annual", region: "Kampala" },
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

// ---- Community ----------------------------------------------------------

export interface CommunityRoom {
  id: string;
  name: string;
  topic: string;
  members: number;
  online: number;
  icon: string;
}

export const communityRooms: CommunityRoom[] = [
  { id: "r1", name: "General Chat", topic: "Open floor for all traders", members: 612, online: 48, icon: "MessageSquare" },
  { id: "r2", name: "Gold Room", topic: "XAUUSD setups & discussion", members: 341, online: 27, icon: "Gem" },
  { id: "r3", name: "Prop Firm Support", topic: "Passing & managing funded accounts", members: 289, online: 19, icon: "Building2" },
  { id: "r4", name: "SMC Study Group", topic: "Smart Money Concepts deep dives", members: 198, online: 12, icon: "BookOpen" },
  { id: "r5", name: "Mentorship Lounge", topic: "Pro & Elite mentorship", members: 74, online: 5, icon: "GraduationCap" },
];

export interface CommunityMessage {
  id: string;
  author: string;
  title: string;
  body: string;
  replies: number;
  likes: number;
  time: string;
}

export const communityFeed: CommunityMessage[] = [
  { id: "m1", author: "AminaFX", title: "Gold held H4 demand exactly as scanned", body: "Anyone else catch the London sweep this morning? Textbook setup.", replies: 14, likes: 38, time: "22m ago" },
  { id: "m2", author: "KipTrades", title: "Passed my first funded challenge 🎉", body: "The Risk Management course honestly made the difference. Discipline over everything.", replies: 27, likes: 91, time: "1h ago" },
  { id: "m3", author: "SnrEmperor", title: "Weekly Cup strategy thread", body: "Sharing my approach for this week's demo cup — happy to compare notes.", replies: 9, likes: 22, time: "3h ago" },
];

export const communityMilestones = [
  { label: "Community members", value: 612 },
  { label: "Messages this week", value: 1840 },
  { label: "Countries represented", value: 6 },
];

export const topLearners = [
  { name: "PipQueen", detail: "12 courses complete", region: "Nairobi" },
  { name: "DomoTrader", detail: "41-day learning streak", region: "Kampala" },
  { name: "GoldHunterKE", detail: "Master Analyst title", region: "Nakuru" },
];

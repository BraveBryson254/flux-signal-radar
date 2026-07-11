/**
 * MOCK ambassador/referral data. Referral attribution, reward granting,
 * and fraud checks are backend concerns (marked as such); this powers the
 * frontend module only. No real reward logic runs here.
 */

export interface AmbassadorRank {
  id: string;
  label: string;
  icon: string; // lucide name
  minReferrals: number;
  perks: string[];
}

export const ambassadorRanks: AmbassadorRank[] = [
  { id: "starter", label: "Starter Ambassador", icon: "Sprout", minReferrals: 0, perks: ["Referral link", "XP on verified signups"] },
  { id: "bronze", label: "Bronze Ambassador", icon: "Medal", minReferrals: 3, perks: ["Profile badge", "Higher reward limit"] },
  { id: "silver", label: "Silver Ambassador", icon: "Award", minReferrals: 10, perks: ["Silver badge", "Exclusive competitions"] },
  { id: "gold", label: "Gold Ambassador", icon: "Trophy", minReferrals: 25, perks: ["Gold badge", "Special webinars", "Early feature access"] },
  { id: "diamond", label: "Diamond Ambassador", icon: "Gem", minReferrals: 50, perks: ["Diamond badge", "VIP recognition", "Highest reward ceiling"] },
  { id: "platinum", label: "Platinum Ambassador", icon: "Crown", minReferrals: 100, perks: ["Platinum crown", "Elite ambassador status"] },
];

export interface ReferralStats {
  code: string;
  link: string;
  total: number;
  verified: number;
  active: number;
  paying: number;
  lifetimeCoins: number;
  monthlyCoins: number;
  trialDaysEarned: number;
}

export const referralStats: ReferralStats = {
  code: "BRYSON254",
  link: "https://flux-signal-radar.vercel.app/?ref=BRYSON254",
  total: 7,
  verified: 5,
  active: 4,
  paying: 2,
  lifetimeCoins: 640,
  monthlyCoins: 180,
  trialDaysEarned: 14,
};

export interface ReferralMilestone {
  id: string;
  label: string;
  reward: string;
  done: boolean;
}

// Milestone-based rewards — never reward unverified signups alone (V10).
export const referralMilestones: ReferralMilestone[] = [
  { id: "rm1", label: "Friend creates an account", reward: "50 XP", done: true },
  { id: "rm2", label: "Friend verifies their email", reward: "20 coins", done: true },
  { id: "rm3", label: "Friend completes their profile", reward: "30 coins", done: true },
  { id: "rm4", label: "Friend finishes first lesson", reward: "40 coins", done: false },
  { id: "rm5", label: "Friend joins a competition", reward: "50 coins", done: false },
  { id: "rm6", label: "Friend subscribes to a paid plan", reward: "7 trial days + 100 coins", done: false },
  { id: "rm7", label: "Friend stays active for 30 days", reward: "Bronze rank progress", done: false },
];

export interface ReferralActivity {
  id: string;
  name: string;
  status: "clicked" | "signed up" | "verified" | "subscribed";
  time: string;
}

export const referralActivity: ReferralActivity[] = [
  { id: "ra1", name: "james****", status: "subscribed", time: "2d ago" },
  { id: "ra2", name: "wanjiku****", status: "verified", time: "4d ago" },
  { id: "ra3", name: "otieno****", status: "signed up", time: "6d ago" },
  { id: "ra4", name: "amina****", status: "subscribed", time: "1w ago" },
  { id: "ra5", name: "brian****", status: "clicked", time: "1w ago" },
];

export interface AmbassadorLeader {
  rank: number;
  name: string;
  referrals: number;
  region: string;
  you?: boolean;
}

export const ambassadorLeaderboard: AmbassadorLeader[] = [
  { rank: 1, name: "KipTrades", referrals: 84, region: "Nairobi" },
  { rank: 2, name: "AminaFX", referrals: 61, region: "Mombasa" },
  { rank: 3, name: "DomoTrader", referrals: 47, region: "Kampala" },
  { rank: 4, name: "PipQueen", referrals: 22, region: "Nairobi" },
  { rank: 5, name: "You", referrals: 7, region: "Nairobi", you: true },
];

export function rankForReferrals(count: number): { current: AmbassadorRank; next: AmbassadorRank | null } {
  let current = ambassadorRanks[0];
  for (const r of ambassadorRanks) {
    if (count >= r.minReferrals) current = r;
  }
  const next = ambassadorRanks.find((r) => r.minReferrals > count) ?? null;
  return { current, next };
}

// ---- Referral conversion funnel ------------------------------------------

export interface FunnelStage {
  label: string;
  count: number;
}

export const referralFunnel: FunnelStage[] = [
  { label: "Link clicked", count: 22 },
  { label: "Account created", count: 11 },
  { label: "Email verified", count: 8 },
  { label: "Profile completed", count: 6 },
  { label: "Subscribed", count: 2 },
];

// ---- Campaigns -------------------------------------------------------------

export interface AmbassadorCampaign {
  id: string;
  name: string;
  description: string;
  endsInHours: number;
  reward: string;
}

export const activeCampaign: AmbassadorCampaign = {
  id: "camp-gold-month",
  name: "Gold Trading Month",
  description: "Referrals who subscribe this month earn you double coins.",
  endsInHours: 312,
  reward: "2x coin rewards",
};

/**
 * Illustrative/platform-level ambassador content — ranks, the reward
 * ladder, and the active campaign banner. Per-user referral stats,
 * activity, and the leaderboard are real and live in ambassadorService.ts.
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

export interface ReferralMilestone {
  id: string;
  label: string;
  reward: string;
}

// Informational reward ladder — not tied to per-friend event tracking yet
// (lesson completion, competition joins by a specific referred friend).
export const referralMilestones: ReferralMilestone[] = [
  { id: "rm1", label: "Friend creates an account", reward: "50 XP" },
  { id: "rm2", label: "Friend completes their profile", reward: "30 coins" },
  { id: "rm3", label: "Friend finishes first lesson", reward: "40 coins" },
  { id: "rm4", label: "Friend joins a competition", reward: "50 coins" },
  { id: "rm5", label: "Friend subscribes to a paid plan", reward: "7 trial days + 100 coins" },
  { id: "rm6", label: "Friend stays active for 30 days", reward: "Bronze rank progress" },
];

export function rankForReferrals(count: number): { current: AmbassadorRank; next: AmbassadorRank | null } {
  let current = ambassadorRanks[0];
  for (const r of ambassadorRanks) {
    if (count >= r.minReferrals) current = r;
  }
  const next = ambassadorRanks.find((r) => r.minReferrals > count) ?? null;
  return { current, next };
}

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

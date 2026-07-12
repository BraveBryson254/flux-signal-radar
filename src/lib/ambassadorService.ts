import { supabase } from "./supabaseClient";

/**
 * Real referral tracking. Rather than broadening RLS on the profiles
 * table (which also holds tier/billing data), cross-user visibility is
 * exposed through two narrow SQL views:
 *   - my_referrals: only the rows a user themselves referred
 *   - referral_leaderboard: an aggregate count per referrer, no PII
 * Both are read-only from the client's perspective.
 */

export function buildReferralLink(code: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/?ref=${code}`;
}

export interface ReferredUser {
  id: string;
  name: string;
  tier: string;
  createdAt: string;
}

export interface ReferralData {
  code: string;
  link: string;
  total: number;
  paying: number;
  last30Days: number;
  referred: ReferredUser[];
}

export async function fetchReferralData(userId: string, referralCode: string): Promise<ReferralData> {
  const { data } = await supabase
    .from("my_referrals")
    .select("id, name, tier, created_at")
    .order("created_at", { ascending: false });

  const referred: ReferredUser[] = (data ?? []).map(
    (r: { id: string; name: string; tier: string; created_at: string }) => ({
      id: r.id,
      name: r.name,
      tier: r.tier,
      createdAt: r.created_at,
    })
  );

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return {
    code: referralCode,
    link: buildReferralLink(referralCode),
    total: referred.length,
    paying: referred.filter((r) => r.tier !== "free").length,
    last30Days: referred.filter((r) => new Date(r.createdAt) > thirtyDaysAgo).length,
    referred,
  };
}

export interface AmbassadorLeaderRow {
  userId: string;
  name: string;
  referrals: number;
}

export async function fetchAmbassadorLeaderboard(limit = 10): Promise<AmbassadorLeaderRow[]> {
  const { data } = await supabase
    .from("referral_leaderboard")
    .select("user_id, name, referral_count")
    .limit(limit);

  return (data ?? []).map((row: { user_id: string; name: string; referral_count: number }) => ({
    userId: row.user_id,
    name: row.name,
    referrals: row.referral_count,
  }));
}

import { supabase } from "./supabaseClient";

/**
 * Competition definitions (name/status/prize/type) stay as platform-set
 * content — like Schools or the ambassador campaign banner, these are
 * things Flux creates, not per-user data. What's real here: who actually
 * joined, real entrant counts, and a real leaderboard ranking entrants by
 * their genuine total Arena points.
 */

export async function fetchEntrantCount(competitionId: string): Promise<number> {
  const { count } = await supabase
    .from("competition_entries")
    .select("*", { count: "exact", head: true })
    .eq("competition_id", competitionId);
  return count ?? 0;
}

export async function hasJoined(competitionId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("competition_entries")
    .select("id")
    .eq("competition_id", competitionId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function joinCompetition(competitionId: string, userId: string) {
  await supabase.from("competition_entries").insert({ competition_id: competitionId, user_id: userId });
}

export async function leaveCompetition(competitionId: string, userId: string) {
  await supabase
    .from("competition_entries")
    .delete()
    .eq("competition_id", competitionId)
    .eq("user_id", userId);
}

/** Every competition a user has personally joined — used to power the
 * "Competitor" achievement without guessing. */
export async function fetchMyCompetitionEntries(userId: string): Promise<string[]> {
  const { data } = await supabase.from("competition_entries").select("competition_id").eq("user_id", userId);
  return (data ?? []).map((r: { competition_id: string }) => r.competition_id);
}

export interface CompetitionLeaderRow {
  userId: string;
  name: string;
  score: number;
}

export async function fetchCompetitionLeaderboard(
  competitionId: string,
  limit = 10
): Promise<CompetitionLeaderRow[]> {
  const { data } = await supabase
    .from("competition_leaderboard")
    .select("user_id, name, total_score")
    .eq("competition_id", competitionId)
    .order("total_score", { ascending: false })
    .limit(limit);

  return (data ?? []).map((row: { user_id: string; name: string; total_score: number }) => ({
    userId: row.user_id,
    name: row.name,
    score: row.total_score,
  }));
}

import { supabase } from "./supabaseClient";

/**
 * Real Arena scores — replaces the localStorage version. Leaderboards
 * need to be visible across users (not just the row owner), so the
 * table denormalizes user_name at write time rather than joining against
 * profiles, keeping the RLS story simple: anyone can read scores, only
 * the owner can write their own.
 */

export async function getBestScore(userId: string, gameId: string): Promise<number> {
  const { data } = await supabase
    .from("arena_scores")
    .select("best_score")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .maybeSingle();
  return data?.best_score ?? 0;
}

export async function getAllBestScores(userId: string): Promise<Record<string, number>> {
  const { data } = await supabase.from("arena_scores").select("game_id, best_score").eq("user_id", userId);
  const map: Record<string, number> = {};
  (data ?? []).forEach((row: { game_id: string; best_score: number }) => {
    map[row.game_id] = row.best_score;
  });
  return map;
}

/** Submits a score, keeping only the higher of the new and existing best. */
export async function submitScore(
  userId: string,
  userName: string,
  gameId: string,
  score: number
): Promise<number> {
  const current = await getBestScore(userId, gameId);
  if (score <= current) return current;

  await supabase.from("arena_scores").upsert(
    {
      user_id: userId,
      user_name: userName,
      game_id: gameId,
      best_score: score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,game_id" }
  );
  return score;
}

export interface ArenaLeaderRow {
  userId: string;
  name: string;
  points: number;
}

/** Total points per user across all games, highest first. */
export async function fetchArenaLeaderboard(limit = 10): Promise<ArenaLeaderRow[]> {
  const { data } = await supabase.from("arena_scores").select("user_id, user_name, best_score");
  const totals = new Map<string, { name: string; points: number }>();
  (data ?? []).forEach((row: { user_id: string; user_name: string; best_score: number }) => {
    const existing = totals.get(row.user_id);
    totals.set(row.user_id, {
      name: row.user_name,
      points: (existing?.points ?? 0) + row.best_score,
    });
  });
  return Array.from(totals.entries())
    .map(([userId, v]) => ({ userId, name: v.name, points: v.points }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

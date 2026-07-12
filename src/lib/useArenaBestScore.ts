"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./mockAuth";
import { getBestScore, submitScore } from "./arenaScoresService";

/**
 * Fetches a user's real best score for a game on mount, and exposes a
 * submit() that optimistically updates local state while persisting the
 * higher score to Supabase in the background.
 */
export function useArenaBestScore(gameId: string) {
  const { user } = useAuth();
  const [best, setBest] = useState(0);

  useEffect(() => {
    if (!user) return;
    getBestScore(user.id, gameId).then(setBest);
  }, [user, gameId]);

  const submit = useCallback(
    (score: number) => {
      if (!user) return;
      setBest((prev) => Math.max(prev, score));
      submitScore(user.id, user.name, gameId, score);
    },
    [user, gameId]
  );

  return { best, submit };
}

"use client";

const PREFIX = "flux-arena-best:";

export function getBestScore(gameId: string): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(PREFIX + gameId);
  return raw ? Number(raw) || 0 : 0;
}

export function setBestScore(gameId: string, score: number): number {
  const current = getBestScore(gameId);
  if (score > current) {
    window.localStorage.setItem(PREFIX + gameId, String(score));
    return score;
  }
  return current;
}

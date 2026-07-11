/**
 * Arena meta-progression: ranks and league divisions computed from the
 * user's existing XP (cosmetic only — never a trading advantage, per the
 * brief). Daily challenge rotates deterministically by date so every
 * user sees the same challenge on a given day without a backend.
 */

import { games, GameCard } from "./gamesData";

export interface ArenaRank {
  id: string;
  label: string;
  minXp: number;
  icon: string;
}

export const arenaRanks: ArenaRank[] = [
  { id: "student", label: "Market Student", minXp: 0, icon: "GraduationCap" },
  { id: "survivor", label: "Retail Survivor", minXp: 500, icon: "Shield" },
  { id: "hunter", label: "Liquidity Hunter", minXp: 1200, icon: "Crosshair" },
  { id: "specialist", label: "Trend Specialist", minXp: 2200, icon: "TrendingUp" },
  { id: "analyst", label: "Institutional Analyst", minXp: 3500, icon: "LineChart" },
  { id: "elite", label: "Elite Trader", minXp: 5200, icon: "Award" },
  { id: "master", label: "Master Trader", minXp: 7500, icon: "Trophy" },
  { id: "wizard", label: "Market Wizard", minXp: 10500, icon: "Sparkles" },
  { id: "legend", label: "Legend", minXp: 15000, icon: "Crown" },
];

export function rankForXp(xp: number): { current: ArenaRank; next: ArenaRank | null; progress: number } {
  let current = arenaRanks[0];
  for (const r of arenaRanks) {
    if (xp >= r.minXp) current = r;
  }
  const next = arenaRanks.find((r) => r.minXp > xp) ?? null;
  const progress = next
    ? Math.min(100, ((xp - current.minXp) / (next.minXp - current.minXp)) * 100)
    : 100;
  return { current, next, progress };
}

// ---- League divisions — cosmetic seasonal ladder, frontend display only --

export interface LeagueDivision {
  id: string;
  label: string;
  minXp: number;
  color: string;
}

export const leagueDivisions: LeagueDivision[] = [
  { id: "bronze", label: "Bronze", minXp: 0, color: "#c08552" },
  { id: "silver", label: "Silver", minXp: 800, color: "#adb5bd" },
  { id: "gold", label: "Gold", minXp: 2000, color: "#e8b923" },
  { id: "platinum", label: "Platinum", minXp: 4000, color: "#7fd8d8" },
  { id: "diamond", label: "Diamond", minXp: 7000, color: "#9d4edd" },
  { id: "elite", label: "Elite", minXp: 11000, color: "#ff5c7a" },
];

export function divisionForXp(xp: number): LeagueDivision {
  let current = leagueDivisions[0];
  for (const d of leagueDivisions) {
    if (xp >= d.minXp) current = d;
  }
  return current;
}

export const currentSeason = {
  name: "Season 1 — Foundations",
  endsInDays: 18,
};

// ---- Daily challenge — deterministic by date, no backend required -------

export function dailyChallenge(): GameCard & { bonusXp: number } {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const game = games[dayIndex % games.length];
  return { ...game, bonusXp: Math.round(game.xpReward * 0.5) };
}

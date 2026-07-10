"use client";

export interface LeaderboardRow {
  rank: number;
  name: string;
  region?: string;
  value: string; // pre-formatted (xp, R, etc.)
  you?: boolean;
}

/**
 * Shared leaderboard row list — previously duplicated in the dashboard
 * widget, competitions page, and community-adjacent views.
 */
export default function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <div className="space-y-1">
      {rows.map((e) => (
        <div
          key={e.rank}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5"
          style={{ background: e.you ? "rgba(157,78,221,0.1)" : "transparent" }}
        >
          <span
            className="w-5 font-mono text-xs"
            style={{ color: e.rank <= 3 ? "var(--color-accent)" : "var(--color-text-faint)" }}
          >
            {e.rank}
          </span>
          <span
            className="flex-1 font-body text-sm"
            style={{ color: e.you ? "var(--color-accent)" : "var(--color-text)" }}
          >
            {e.name}
          </span>
          {e.region && <span className="font-mono text-xs text-text-faint">{e.region}</span>}
          <span className="font-mono text-xs text-text-muted">{e.value}</span>
        </div>
      ))}
    </div>
  );
}

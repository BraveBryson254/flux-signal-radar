"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, Users, Medal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import { competitions, Competition } from "@/lib/socialData";
import {
  fetchEntrantCount,
  hasJoined,
  joinCompetition,
  leaveCompetition,
  fetchCompetitionLeaderboard,
  CompetitionLeaderRow,
} from "@/lib/competitionsService";
import { useAuth } from "@/lib/mockAuth";
import Leaderboard from "@/components/Leaderboard";

const statusStyle: Record<Competition["status"], { label: string; color: string }> = {
  live: { label: "LIVE", color: "var(--color-bull)" },
  upcoming: { label: "UPCOMING", color: "var(--color-accent)" },
  ended: { label: "ENDED", color: "var(--color-text-faint)" },
};

// The competition the sidebar leaderboard focuses on — the flagship live cup.
const FEATURED_COMPETITION_ID = "cmp1";

export default function CompetitionsPage() {
  const { user } = useAuth();
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [entrantCounts, setEntrantCounts] = useState<Record<string, number>>({});
  const [leaderboard, setLeaderboard] = useState<CompetitionLeaderRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all(competitions.map((c) => fetchEntrantCount(c.id).then((n) => [c.id, n] as const))).then(
      (counts) => {
        const countMap: Record<string, number> = {};
        counts.forEach(([id, n]) => (countMap[id] = n));
        setEntrantCounts(countMap);
      }
    );

    if (user) {
      Promise.all(competitions.map((c) => hasJoined(c.id, user.id).then((j) => [c.id, j] as const))).then(
        (flags) => {
          const joinedSet = new Set<string>();
          flags.forEach(([id, j]) => {
            if (j) joinedSet.add(id);
          });
          setJoined(joinedSet);
        }
      );
    }

    fetchCompetitionLeaderboard(FEATURED_COMPETITION_ID).then((board) => {
      setLeaderboard(board);
      setLoaded(true);
    });
  }, [user]);

  const toggleJoin = async (id: string) => {
    if (!user) return;
    const isJoined = joined.has(id);
    setJoined((prev) => {
      const next = new Set(prev);
      if (isJoined) next.delete(id);
      else next.add(id);
      return next;
    });
    setEntrantCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + (isJoined ? -1 : 1) }));

    if (isJoined) await leaveCompetition(id, user.id);
    else await joinCompetition(id, user.id);

    if (id === FEATURED_COMPETITION_ID) {
      fetchCompetitionLeaderboard(FEATURED_COMPETITION_ID).then(setLeaderboard);
    }
  };

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">SOCIAL</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Competitions
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Weekly cups, monthly championships, and seasonal leagues. Entrants,
            join state, and the leaderboard below are all real.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Stagger className="space-y-4">
              {competitions.map((c) => {
                const s = statusStyle[c.status];
                const isJoined = joined.has(c.id);
                const entrants = loaded ? entrantCounts[c.id] ?? 0 : c.entrants;
                return (
                  <StaggerItem key={c.id} variants={fadeUp}>
                    <motion.div {...hoverLift} className="rounded-xl border border-border bg-panel p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-panel-raised">
                            <Trophy size={18} className="text-accent" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display text-base font-semibold text-text">{c.name}</h3>
                              <span
                                className="rounded-full px-2 py-0.5 font-mono text-[9px]"
                                style={{ color: s.color, background: "rgba(157,78,221,0.1)" }}
                              >
                                {s.label}
                              </span>
                            </div>
                            <p className="mt-0.5 font-mono text-[11px] text-text-faint">{c.type} competition</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs">
                        <div>
                          <p className="flex items-center gap-1 text-text-faint">
                            <Clock size={11} />
                            {c.status === "live" ? "Ends in" : "Starts in"}
                          </p>
                          <p className="mt-0.5 text-text">
                            {c.status === "live" ? c.endsInHours : c.startsInHours}h
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-text-faint">
                            <Users size={11} /> Entrants
                          </p>
                          <p className="mt-0.5 text-text">{entrants}</p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-text-faint">
                            <Medal size={11} /> Prize
                          </p>
                          <p className="mt-0.5 truncate text-accent">{c.prize}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleJoin(c.id)}
                        disabled={!user}
                        className="mt-4 w-full rounded-lg py-2 font-body text-sm font-semibold transition-transform hover:scale-[1.01] disabled:opacity-50"
                        style={{
                          background: isJoined ? "transparent" : "var(--color-accent)",
                          color: isJoined ? "var(--color-accent)" : "var(--color-bg)",
                          border: isJoined ? "1px solid var(--color-accent)" : "none",
                        }}
                      >
                        {isJoined ? "Entered ✓" : c.status === "live" ? "Join now" : "Register"}
                      </button>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-panel p-5">
              <h3 className="mb-4 font-display text-sm font-semibold text-text">Weekly Demo Cup — live board</h3>
              <p className="mb-3 font-mono text-[10px] text-text-faint">
                Ranked by total Arena points among entrants.
              </p>
              {leaderboard.length > 0 ? (
                <Leaderboard
                  rows={leaderboard.map((e, i) => ({
                    rank: i + 1,
                    name: e.name,
                    value: `${e.score.toLocaleString()} pts`,
                    you: e.userId === user?.id,
                  }))}
                />
              ) : (
                <p className="font-body text-sm text-text-muted">
                  No entrants yet — join to be the first on the board.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

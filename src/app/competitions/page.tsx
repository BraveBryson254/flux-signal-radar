"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, Users, Medal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import {
  competitions,
  competitionLeaderboard,
  recentWinners,
  Competition,
} from "@/lib/socialData";
import Leaderboard from "@/components/Leaderboard";

const statusStyle: Record<Competition["status"], { label: string; color: string }> = {
  live: { label: "LIVE", color: "var(--color-bull)" },
  upcoming: { label: "UPCOMING", color: "var(--color-accent)" },
  ended: { label: "ENDED", color: "var(--color-text-faint)" },
};

export default function CompetitionsPage() {
  const [joined, setJoined] = useState<string[]>([]);

  const toggleJoin = (id: string) =>
    setJoined((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

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
            Weekly cups, monthly championships, and seasonal leagues. Climb the
            board, earn titles, and win subscription time.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Stagger className="space-y-4">
              {competitions.map((c) => {
                const s = statusStyle[c.status];
                const isJoined = joined.includes(c.id);
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
                          <p className="mt-0.5 text-text">{c.entrants}</p>
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
                        className="mt-4 w-full rounded-lg py-2 font-body text-sm font-semibold transition-transform hover:scale-[1.01]"
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
              <Leaderboard
                rows={competitionLeaderboard.map((e) => ({
                  rank: e.rank,
                  name: e.name,
                  region: e.region,
                  value: e.score,
                  you: e.you,
                }))}
              />
            </div>

            <div className="rounded-xl border border-border bg-panel p-5">
              <h3 className="mb-4 font-display text-sm font-semibold text-text">Recent winners</h3>
              <div className="space-y-3">
                {recentWinners.map((w, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-panel-raised">
                      <Trophy size={14} className="text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm text-text">
                        {w.name} · <span className="text-text-faint">{w.region}</span>
                      </p>
                      <p className="truncate font-mono text-[10px] text-text-faint">
                        {w.event} — {w.prize}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

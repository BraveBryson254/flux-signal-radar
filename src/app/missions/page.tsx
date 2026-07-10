"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import XpToast, { ToastItem } from "@/components/XpToast";
import { useAuth } from "@/lib/mockAuth";
import { dailyMissions, weeklyMissions, Mission } from "@/lib/ecosystemData";

export default function MissionsPage() {
  const { user, isLoading, claimMission } = useAuth();
  const router = useRouter();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">LOADING...</p>
      </main>
    );
  }

  const handleClaim = (mission: Mission) => {
    if (user.claimedMissionIds.includes(mission.id)) return;
    const result = claimMission(mission.id, mission.xp, 5);
    const toastId = `${mission.id}-${Date.now()}`;
    setToasts((prev) => [
      ...prev,
      { id: toastId, xp: mission.xp, coins: 5, leveledUp: result.leveledUp, newLevel: result.newLevel },
    ]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toastId)), 2400);
  };

  const isClaimed = (id: string) => user.claimedMissionIds.includes(id);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs tracking-widest text-accent">GAMIFICATION</span>
            <h1 className="mt-2 font-display text-2xl font-semibold text-text">Missions</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1.5">
            <Flame size={14} className="text-accent" />
            <span className="font-mono text-xs text-text-muted">{user.loginStreak}-day streak</span>
          </div>
        </div>

        <MissionGroup
          title="Today"
          missions={dailyMissions}
          isClaimed={isClaimed}
          onClaim={handleClaim}
        />
        <MissionGroup
          title="This week"
          missions={weeklyMissions}
          isClaimed={isClaimed}
          onClaim={handleClaim}
        />
      </div>
      <Footer />
      <XpToast toasts={toasts} />
    </main>
  );
}

function MissionGroup({
  title,
  missions,
  isClaimed,
  onClaim,
}: {
  title: string;
  missions: Mission[];
  isClaimed: (id: string) => boolean;
  onClaim: (m: Mission) => void;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-sm font-semibold text-text">{title}</h2>
      <div className="space-y-3">
        {missions.map((m, i) => {
          const claimed = isClaimed(m.id) || m.done;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-lg border border-border bg-panel p-4"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                style={{
                  borderColor: claimed ? "var(--color-bull)" : "var(--color-border)",
                  background: claimed ? "var(--color-bull)" : "transparent",
                }}
              >
                {claimed && <Check size={16} className="text-bg" />}
              </div>
              <div className="flex-1">
                <p
                  className="font-body text-sm text-text"
                  style={{ color: claimed ? "var(--color-text-faint)" : "var(--color-text)" }}
                >
                  {m.label}
                </p>
              </div>
              <span className="font-mono text-xs text-accent">+{m.xp} XP</span>
              <button
                onClick={() => onClaim(m)}
                disabled={claimed}
                className="rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-transform disabled:opacity-40"
                style={{
                  background: claimed ? "transparent" : "var(--color-accent)",
                  color: claimed ? "var(--color-text-faint)" : "var(--color-bg)",
                }}
              >
                {claimed ? "Claimed" : "Claim"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Flame, Coins, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import { tierById } from "@/lib/tiers";
import { earnedTitles, activeTitle } from "@/lib/socialData";
import { achievements } from "@/lib/ecosystemData";

function Icon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Award) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

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

  const title = activeTitle();
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const earnedTitleCount = earnedTitles.filter((t) => t.earned).length;

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        {/* Identity header */}
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-panel to-panel-raised p-6">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
              style={{ background: "var(--color-accent)" }}
            />
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-accent bg-panel-raised font-display text-2xl font-semibold text-accent">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="font-display text-2xl font-semibold text-text">{user.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-panel-raised px-2.5 py-1">
                    <Icon name={title.icon} size={12} className="text-accent" />
                    <span className="font-mono text-[11px] text-accent">{title.label}</span>
                  </span>
                  <span className="rounded-full bg-panel-raised px-2.5 py-1 font-mono text-[11px] text-text-muted">
                    {tierById(user.tier).name} · Level {user.level}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-body text-xs text-text-muted transition-colors hover:text-text">
                <Share2 size={13} /> Share
              </button>
            </div>

            {/* quick stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickStat label="XP" value={user.xp.toLocaleString()} />
              <QuickStat label="Streak" value={`${user.loginStreak}d`} icon={<Flame size={13} className="text-accent" />} />
              <QuickStat label="Coins" value={user.coins.toString()} icon={<Coins size={13} className="text-bull" />} />
              <QuickStat label="Titles" value={`${earnedTitleCount}/${earnedTitles.length}`} />
            </div>
          </div>
        </Reveal>

        {/* Earned titles */}
        <section className="mt-10">
          <h2 className="mb-1 font-display text-lg font-semibold text-text">Titles</h2>
          <p className="mb-5 font-body text-sm text-text-muted">
            Earned through what you do — not what you pay for.
          </p>
          <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {earnedTitles.map((t) => (
              <StaggerItem key={t.id} variants={fadeUp}>
                <div
                  className="flex items-center gap-3 rounded-xl border p-4"
                  style={{
                    borderColor: t.earned ? "var(--color-accent)" : "var(--color-border)",
                    opacity: t.earned ? 1 : 0.5,
                  }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: t.earned ? "rgba(157,78,221,0.15)" : "var(--color-panel-raised)" }}
                  >
                    <Icon name={t.icon} size={18} className={t.earned ? "text-accent" : "text-text-faint"} />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-text">{t.label}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-text-faint">{t.requirement}</p>
                  </div>
                  {t.earned && (
                    <span className="ml-auto font-mono text-[10px] text-bull">EARNED</span>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Achievement summary */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-text">Achievements</h2>
            <a href="/achievements" className="font-mono text-xs text-accent hover:underline">
              View all ({unlockedAchievements}/{achievements.length})
            </a>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {achievements.map((a) => (
              <div
                key={a.id}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center"
                style={{ opacity: a.unlocked ? 1 : 0.4 }}
              >
                <Icon name={a.icon} size={18} className={a.unlocked ? "text-accent" : "text-text-faint"} />
                <span className="font-mono text-[9px] leading-tight text-text-muted">{a.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

function QuickStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-bg/40 p-3">
      <p className="flex items-center gap-1 font-mono text-[10px] tracking-wide text-text-faint">
        {icon} {label.toUpperCase()}
      </p>
      <p className="mt-1 font-display text-lg font-semibold text-text">{value}</p>
    </div>
  );
}

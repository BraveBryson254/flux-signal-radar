"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/mockAuth";
import { achievements } from "@/lib/ecosystemData";

type Filter = "all" | "unlocked" | "locked";

export default function AchievementsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");

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

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const filtered = achievements.filter((a) => {
    if (filter === "unlocked") return a.unlocked;
    if (filter === "locked") return !a.unlocked;
    return true;
  });

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs tracking-widest text-accent">GAMIFICATION</span>
            <h1 className="mt-2 font-display text-2xl font-semibold text-text">Achievements</h1>
          </div>
          <span className="font-mono text-xs text-text-faint">
            {unlockedCount}/{achievements.length} unlocked
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-panel-raised">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            transition={{ duration: 0.7 }}
          />
        </div>

        <div className="mt-6 flex gap-2">
          {(["all", "unlocked", "locked"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full border px-3 py-1.5 font-mono text-xs capitalize transition-colors"
              style={{
                borderColor: filter === f ? "var(--color-accent)" : "var(--color-border)",
                color: filter === f ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((a, i) => {
            const Icon = (Icons[a.icon as keyof typeof Icons] ??
              Icons.Award) as React.ComponentType<{ size?: number; className?: string }>;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                className="flex flex-col items-center gap-2 rounded-xl border p-5 text-center"
                style={{
                  borderColor: a.unlocked ? "var(--color-accent)" : "var(--color-border)",
                  opacity: a.unlocked ? 1 : 0.45,
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: a.unlocked ? "rgba(157,78,221,0.15)" : "var(--color-panel-raised)" }}
                >
                  <Icon size={22} className={a.unlocked ? "text-accent" : "text-text-faint"} />
                </div>
                <span className="font-body text-xs text-text">{a.label}</span>
                {!a.unlocked && (
                  <span className="font-mono text-[9px] text-text-faint">LOCKED</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}

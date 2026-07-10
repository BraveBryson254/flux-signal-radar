"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Coins, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/mockAuth";

const storeItems = [
  { id: "s1", label: "1 extra watchlist slot", cost: 150 },
  { id: "s2", label: "Custom profile badge", cost: 200 },
  { id: "s3", label: "7-day tier trial extension", cost: 500 },
  { id: "s4", label: "Priority competition entry", cost: 350 },
];

export default function RewardsPage() {
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

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <span className="font-mono text-xs tracking-widest text-accent">GAMIFICATION</span>
        <h1 className="mt-2 font-display text-2xl font-semibold text-text">Rewards store</h1>

        <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-panel p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-panel-raised">
            <Coins size={20} className="text-bull" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-text">{user.coins}</p>
            <p className="font-mono text-xs text-text-faint">coins earned from missions & streaks</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {storeItems.map((item, i) => {
            const affordable = user.coins >= item.cost;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between rounded-lg border border-border bg-panel p-4"
              >
                <div>
                  <p className="font-body text-sm text-text">{item.label}</p>
                  <p className="mt-1 flex items-center gap-1 font-mono text-xs text-text-faint">
                    <Coins size={11} />
                    {item.cost}
                  </p>
                </div>
                <button
                  disabled={!affordable}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-text-muted disabled:opacity-40"
                >
                  {!affordable && <Lock size={11} />}
                  Redeem
                </button>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-6 font-mono text-[10px] text-text-faint">
          Redemption is a preview — connects to real fulfillment once the backend is wired in.
        </p>
      </div>
      <Footer />
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignalCard from "@/components/SignalCard";
import { useAuth, Tier } from "@/lib/mockAuth";
import { mockSignals } from "@/lib/mockData";
import { hasAccess, tiers } from "@/lib/tiers";

function daysLeft(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function DashboardPage() {
  const { user, isLoading, setTier, logout } = useAuth();
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

  const trialDays = daysLeft(user.trialEndsAt);
  const canSeeWatchlist = hasAccess(user.tier, "moderate");
  const canSeeAlerts = hasAccess(user.tier, "moderate");
  const canSeeApi = hasAccess(user.tier, "pro");

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text">
              Welcome back, {user.name}
            </h1>
            <p className="mt-1 font-mono text-xs text-text-faint">
              {user.tier.toUpperCase()} tier
              {trialDays !== null && trialDays > 0 && ` · trial ends in ${trialDays}d`}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-fit rounded-lg border border-border px-4 py-2 font-body text-sm text-text-muted transition-colors hover:border-text-faint"
          >
            Log out
          </button>
        </div>

        {/* Dev-only tier switcher — lets you preview gating before real billing exists */}
        <div className="mb-10 rounded-lg border border-dashed border-border bg-panel p-4">
          <p className="mb-2 font-mono text-[10px] tracking-widest text-text-faint">
            DEV PREVIEW — SIMULATE TIER (remove once Pesapal is wired in)
          </p>
          <div className="flex flex-wrap gap-2">
            {tiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setTier(t.id as Tier)}
                className="rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
                style={{
                  borderColor: user.tier === t.id ? "var(--color-accent)" : "var(--color-border)",
                  color: user.tier === t.id ? "var(--color-accent)" : "var(--color-text-muted)",
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live feed */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-lg font-semibold text-text">Your live feed</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockSignals.map((signal, i) => (
              <SignalCard key={signal.id} signal={signal} index={i} />
            ))}
          </div>
        </section>

        {/* Watchlist — gated at Moderate */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-lg font-semibold text-text">Watchlist</h2>
          <GatedPanel
            unlocked={canSeeWatchlist}
            requiredLabel="Moderate"
            description="Track unlimited instruments and get notified the moment a setup appears."
          />
        </section>

        {/* Alerts — gated at Moderate */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-lg font-semibold text-text">Alerts</h2>
          <GatedPanel
            unlocked={canSeeAlerts}
            requiredLabel="Moderate"
            description="Email and Telegram alerts the instant a high-confluence setup appears."
          />
        </section>

        {/* API — gated at Pro */}
        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-text">API access</h2>
          <GatedPanel
            unlocked={canSeeApi}
            requiredLabel="Pro"
            description="Pipe live signals straight into your own MQL5 EA via webhook."
          />
        </section>
      </div>
      <Footer />
    </main>
  );
}

function GatedPanel({
  unlocked,
  requiredLabel,
  description,
}: {
  unlocked: boolean;
  requiredLabel: string;
  description: string;
}) {
  if (unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border border-border bg-panel p-6"
      >
        <p className="font-body text-sm text-text-muted">{description}</p>
        <p className="mt-3 font-mono text-xs text-bull">Unlocked on your plan.</p>
      </motion.div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-panel/50 p-8 text-center">
      <Lock size={18} className="text-text-faint" />
      <p className="font-body text-sm text-text-muted">{description}</p>
      <Link
        href="/pricing"
        className="mt-1 rounded-lg bg-accent px-4 py-2 font-body text-xs font-semibold text-bg"
      >
        Upgrade to {requiredLabel}
      </Link>
    </div>
  );
}

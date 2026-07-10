"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth, Tier } from "@/lib/mockAuth";
import { tiers, hasAccess, tierById } from "@/lib/tiers";
import {
  WelcomeWidget,
  DailySignalWidget,
  MarketOutlookWidget,
  MarketSessionsWidget,
  TrendingWidget,
  LearningProgressWidget,
  CompetitionWidget,
  LeaderboardWidget,
  RecentActivityWidget,
} from "@/components/widgets/EcosystemWidgets";
import {
  XpLevelWidget,
  StreakWidget,
  MissionsWidget,
  AchievementsWidget,
} from "@/components/widgets/GamificationWidgets";
import { NextLevelWidget } from "@/components/widgets/NextLevelWidget";

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

  const persona = tierById(user.tier).persona;

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        {/* Header row */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text">Command center</h1>
            <p className="mt-1 font-mono text-xs text-text-faint">
              {user.tier.toUpperCase()} · {persona}
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

        {/* Tier preview switcher */}
        <div className="mb-8 rounded-lg border border-dashed border-border bg-panel/50 p-4">
          <p className="mb-2 font-mono text-[10px] tracking-widest text-text-faint">
            PREVIEW MODE — SEE HOW THE DASHBOARD GROWS PER TIER
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
                  backgroundColor: user.tier === t.id ? "rgba(157,78,221,0.1)" : "transparent",
                }}
              >
                {t.name} {t.price > 0 ? `$${t.price}` : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Widget grid — composes based on tier */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Row: welcome spans, gamification alongside */}
          <div className="md:col-span-2">
            <WelcomeWidget name={user.name} index={0} />
          </div>
          <XpLevelWidget user={user} index={1} />

          {/* Core free-tier ecosystem — everyone sees these */}
          <DailySignalWidget index={2} />
          <MarketOutlookWidget index={3} />
          <MissionsWidget index={4} />

          <StreakWidget user={user} index={5} />
          <LearningProgressWidget index={6} />
          <CompetitionWidget index={7} />

          <MarketSessionsWidget index={8} />
          <AchievementsWidget index={9} />
          <RecentActivityWidget index={10} />

          <div className="md:col-span-2">
            <LeaderboardWidget index={11} />
          </div>

          {/* Basic-tier additions */}
          {hasAccess(user.tier, "basic") ? (
            <TrendingWidget index={12} />
          ) : (
            <NextLevelWidget
              requiredTier="basic"
              title="Trending assets & watchlists"
              description="Track what's moving and build custom watchlists across every market."
              index={12}
            />
          )}

          {/* Pro-tier additions */}
          {hasAccess(user.tier, "pro") ? (
            <ProWidgets />
          ) : (
            <NextLevelWidget
              requiredTier="pro"
              title="Multi-market analytics"
              description="Gold, Forex, NASDAQ and US30 analytics with trade replay and AI reviews."
              index={13}
            />
          )}

          {/* Elite-tier additions */}
          {hasAccess(user.tier, "elite") ? (
            <EliteWidgets />
          ) : (
            <NextLevelWidget
              requiredTier="elite"
              title="AI Trading Lab & order flow"
              description="Institutional liquidity mapping, Smart Money analytics, and an AI trade lab."
              index={14}
            />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

// Placeholder premium widgets — full builds land in later phases.
function ProWidgets() {
  return (
    <section className="rounded-xl border border-border bg-panel p-5">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-panel-raised px-2.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="font-mono text-[10px] tracking-widest text-accent">PRO</span>
      </div>
      <h3 className="font-display text-sm font-semibold text-text">Multi-market analytics</h3>
      <p className="mt-1 font-body text-sm text-text-muted">
        Gold, Forex, NASDAQ & US30 analytics unlocked. Full workstation lands in an upcoming phase.
      </p>
    </section>
  );
}

function EliteWidgets() {
  return (
    <section className="rounded-xl border border-border bg-panel p-5">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-panel-raised px-2.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-bull" />
        <span className="font-mono text-[10px] tracking-widest text-bull">ELITE</span>
      </div>
      <h3 className="font-display text-sm font-semibold text-text">AI Trading Lab</h3>
      <p className="mt-1 font-body text-sm text-text-muted">
        Institutional order flow & liquidity mapping unlocked. Full lab lands in an upcoming phase.
      </p>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/motion/Motion";
import { MetricCard, ScoreRing, Panel } from "@/components/AnalyticsPrimitives";
import EquityCurve from "@/components/EquityCurve";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess } from "@/lib/tiers";
import { journalEntries, computeAnalytics } from "@/lib/performanceData";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function AnalyticsPage() {
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

  const a = computeAnalytics(journalEntries);
  const canSeeAdvanced = hasAccess(user.tier, "pro");

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">PERFORMANCE</span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-text md:text-3xl">
            Analytics
          </h1>
          <p className="mt-2 font-body text-text-muted">
            Computed live from your journal — {a.total} trades logged.
          </p>
        </Reveal>

        {/* Core metrics */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard label="WIN RATE" value={a.winRate} suffix="%" accent="var(--color-bull)" index={0} />
          <MetricCard label="PROFIT FACTOR" value={a.profitFactor} index={1} />
          <MetricCard label="TOTAL R" value={a.totalR} suffix="R" accent={a.totalR >= 0 ? "var(--color-bull)" : "var(--color-bear)"} index={2} />
          <MetricCard label="MAX DRAWDOWN" value={a.maxDd} suffix="R" accent="var(--color-bear)" index={3} />
        </div>

        {/* Equity curve */}
        <div className="mt-6">
          <Panel title="Equity curve (R)">
            <EquityCurve points={a.equityCurve} />
          </Panel>
        </div>

        {/* Strategy breakdown + scores */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="By strategy">
            <div className="space-y-3">
              {Object.entries(a.byStrategy).map(([name, data]) => {
                const positive = data.totalR >= 0;
                const maxAbs = Math.max(
                  ...Object.values(a.byStrategy).map((d) => Math.abs(d.totalR))
                ) || 1;
                const widthPct = (Math.abs(data.totalR) / maxAbs) * 100;
                return (
                  <div key={name}>
                    <div className="mb-1 flex items-center justify-between font-mono text-xs">
                      <span className="text-text">{name}</span>
                      <span style={{ color: positive ? "var(--color-bull)" : "var(--color-bear)" }}>
                        {data.totalR > 0 ? "+" : ""}
                        {data.totalR.toFixed(1)}R · {data.count} trades
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-panel-raised">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: positive ? "var(--color-bull)" : "var(--color-bear)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${widthPct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-4">
            <ScoreRing label="Consistency" score={a.consistency} index={0} />
            <ScoreRing label="Psychology" score={a.psychology} index={1} />
          </div>
        </div>

        {/* Advanced — Pro gated */}
        <div className="mt-6">
          {canSeeAdvanced ? (
            <Panel title="Advanced insights">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <MiniStat label="Best trade" value={`+${Math.max(...journalEntries.map((e) => e.rMultiple))}R`} />
                <MiniStat label="Worst trade" value={`${Math.min(...journalEntries.map((e) => e.rMultiple))}R`} />
                <MiniStat label="Avg R / trade" value={`${a.avgR}R`} />
                <MiniStat label="Wins / losses" value={`${a.wins} / ${a.losses}`} />
              </div>
            </Panel>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-accent bg-panel/50 p-8 text-center">
              <Lock size={18} className="text-accent" />
              <p className="font-body text-sm text-text-muted">
                Advanced insights — psychology deep-dives, session breakdowns, and risk analytics.
              </p>
              <Link
                href="/pricing"
                className="rounded-lg bg-accent px-4 py-2 font-body text-xs font-semibold text-bg"
              >
                Unlock with Pro
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-panel-raised p-3 text-center">
      <p className="font-display text-lg font-semibold text-text">{value}</p>
      <p className="mt-1 font-mono text-[9px] tracking-wide text-text-faint">{label.toUpperCase()}</p>
    </div>
  );
}

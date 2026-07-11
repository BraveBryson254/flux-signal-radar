"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Copy, Check, Users, BadgeCheck, Activity, DollarSign, Clock, ImageDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Leaderboard from "@/components/Leaderboard";
import QrCode from "@/components/QrCode";
import { generateShareCard, downloadDataUrl } from "@/lib/shareCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import {
  referralStats,
  referralMilestones,
  referralActivity,
  ambassadorLeaderboard,
  ambassadorRanks,
  rankForReferrals,
  referralFunnel,
  activeCampaign,
} from "@/lib/ambassadorData";

function Icon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Star) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

const statusColor: Record<string, string> = {
  clicked: "var(--color-text-faint)",
  "signed up": "var(--color-neutral)",
  verified: "var(--color-accent)",
  subscribed: "var(--color-bull)",
};

export default function AmbassadorPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

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

  const { current, next } = rankForReferrals(referralStats.verified);
  const progressToNext = next
    ? Math.min(100, (referralStats.verified / next.minReferrals) * 100)
    : 100;

  const copy = () => {
    navigator.clipboard?.writeText(referralStats.link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">GROWTH</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Flux Ambassador
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Grow the community and earn recognition. Rewards unlock as the people
            you invite reach real milestones — never for empty signups.
          </p>
        </Reveal>

        {/* Active campaign */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-accent bg-panel-raised p-4 sm:flex-row sm:items-center"
        >
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-accent">
              <Clock size={11} /> ACTIVE CAMPAIGN — ENDS IN {Math.floor(activeCampaign.endsInHours / 24)}D
            </p>
            <p className="mt-1 font-body text-sm font-semibold text-text">{activeCampaign.name}</p>
            <p className="font-body text-sm text-text-muted">{activeCampaign.description}</p>
          </div>
          <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 font-mono text-xs font-semibold text-bg">
            {activeCampaign.reward}
          </span>
        </motion.div>

        {/* Rank + progress */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-panel to-panel-raised p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-accent bg-panel-raised">
                <Icon name={current.icon} size={24} className="text-accent" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-text">{current.label}</p>
                <p className="font-mono text-[11px] text-text-faint">
                  {referralStats.verified} verified referrals
                </p>
              </div>
            </div>
            {next && (
              <div className="w-full sm:w-64">
                <div className="flex items-center justify-between font-mono text-[11px] text-text-faint">
                  <span>Progress to {next.label}</span>
                  <span>{referralStats.verified}/{next.minReferrals}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bg/40">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Referral link + QR + share card */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-xl border border-border bg-panel p-5">
            <p className="mb-2 font-mono text-[10px] tracking-widest text-text-faint">YOUR REFERRAL LINK</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1 truncate rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-mono text-sm text-text-muted">
                {referralStats.link}
              </div>
              <Button onClick={copy} className="shrink-0">
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy link</>}
              </Button>
            </div>
            <p className="mt-2 font-mono text-[10px] text-text-faint">
              Code: <span className="text-accent">{referralStats.code}</span>
            </p>

            <button
              onClick={() => {
                const url = generateShareCard({
                  headline: `${current.label}`,
                  subline: "Growing the Flux Signal Radar community",
                  statLabel: "Verified referrals",
                  statValue: String(referralStats.verified),
                });
                if (url) downloadDataUrl(url, "flux-ambassador-card.png");
              }}
              className="mt-4 flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-body text-xs text-text-muted transition-colors hover:border-accent hover:text-text"
            >
              <ImageDown size={13} /> Download share card
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-panel p-5">
            <QrCode value={referralStats.link} size={120} />
            <span className="font-mono text-[9px] text-text-faint">Scan to join</span>
          </div>
        </div>

        {/* Stats */}
        <Stagger className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={<Users size={15} />} label="Total" value={referralStats.total} />
          <StatCard icon={<BadgeCheck size={15} />} label="Verified" value={referralStats.verified} />
          <StatCard icon={<Activity size={15} />} label="Active" value={referralStats.active} />
          <StatCard icon={<DollarSign size={15} />} label="Paying" value={referralStats.paying} />
        </Stagger>

        {/* Conversion funnel */}
        <div className="mt-6 rounded-xl border border-border bg-panel p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-text">Referral conversion funnel</h3>
          <div className="space-y-3">
            {referralFunnel.map((stage, i) => {
              const max = referralFunnel[0].count || 1;
              const widthPct = (stage.count / max) * 100;
              return (
                <div key={stage.label}>
                  <div className="mb-1 flex items-center justify-between font-mono text-xs">
                    <span className="text-text">{stage.label}</span>
                    <span className="text-text-muted">{stage.count}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-panel-raised">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${widthPct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Milestones */}
          <div className="rounded-xl border border-border bg-panel p-5">
            <h3 className="mb-4 font-display text-sm font-semibold text-text">Reward milestones (per referral)</h3>
            <div className="space-y-2">
              {referralMilestones.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                    style={{ borderColor: m.done ? "var(--color-bull)" : "var(--color-border)", background: m.done ? "var(--color-bull)" : "transparent" }}
                  >
                    {m.done && <Check size={12} className="text-bg" />}
                  </div>
                  <span className="flex-1 font-body text-sm" style={{ color: m.done ? "var(--color-text-faint)" : "var(--color-text)" }}>
                    {m.label}
                  </span>
                  <span className="font-mono text-[10px] text-accent">{m.reward}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-xl border border-border bg-panel p-5">
            <h3 className="mb-4 font-display text-sm font-semibold text-text">Referral activity</h3>
            <div className="space-y-2">
              {referralActivity.map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <span className="font-mono text-sm text-text-muted">{a.name}</span>
                  <span className="font-mono text-xs capitalize" style={{ color: statusColor[a.status] }}>
                    {a.status}
                  </span>
                  <span className="font-mono text-[10px] text-text-faint">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ranks overview */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-text">Ambassador ranks</h2>
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ambassadorRanks.map((r) => {
              const reached = referralStats.verified >= r.minReferrals;
              return (
                <StaggerItem key={r.id} variants={fadeUp}>
                  <div
                    className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center"
                    style={{ borderColor: reached ? "var(--color-accent)" : "var(--color-border)", opacity: reached ? 1 : 0.5 }}
                  >
                    <Icon name={r.icon} size={20} className={reached ? "text-accent" : "text-text-faint"} />
                    <span className="font-mono text-[10px] leading-tight text-text-muted">{r.label.replace(" Ambassador", "")}</span>
                    <span className="font-mono text-[9px] text-text-faint">{r.minReferrals}+</span>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        {/* Leaderboard */}
        <section className="mt-10">
          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-text">Top ambassadors</h3>
              <span className="font-mono text-xs text-text-faint">Kenya · This month</span>
            </div>
            <Leaderboard
              rows={ambassadorLeaderboard.map((e) => ({
                rank: e.rank,
                name: e.name,
                region: e.region,
                value: `${e.referrals} refs`,
                you: e.you,
              }))}
            />
          </div>
        </section>

        <p className="mt-6 text-center font-mono text-[10px] text-text-faint">
          Rewards, attribution, and fraud checks are handled server-side once the backend is live. This is an ethical, milestone-based program — no multi-level commissions.
        </p>
      </div>
      <Footer />
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <StaggerItem variants={fadeUp}>
      <div className="rounded-xl border border-border bg-panel p-4">
        <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-text-faint">
          {icon} {label.toUpperCase()}
        </p>
        <p className="mt-2 font-display text-2xl font-semibold text-text">{value}</p>
      </div>
    </StaggerItem>
  );
}

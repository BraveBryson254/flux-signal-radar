"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Copy, Check, Users, DollarSign, TrendingUp, Clock, ImageDown } from "lucide-react";
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
  referralMilestones,
  ambassadorRanks,
  rankForReferrals,
  activeCampaign,
} from "@/lib/ambassadorData";
import {
  fetchReferralData,
  fetchAmbassadorLeaderboard,
  ReferralData,
  AmbassadorLeaderRow,
} from "@/lib/ambassadorService";

function Icon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Star) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function AmbassadorPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<ReferralData | null>(null);
  const [leaderboard, setLeaderboard] = useState<AmbassadorLeaderRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDataLoading(true);
    Promise.all([fetchReferralData(user.id, user.referralCode), fetchAmbassadorLeaderboard()]).then(
      ([referral, board]) => {
        setData(referral);
        setLeaderboard(board);
        setDataLoading(false);
      }
    );
  }, [user]);

  if (isLoading || !user || dataLoading || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">LOADING...</p>
      </main>
    );
  }

  const { current, next } = rankForReferrals(data.total);
  const progressToNext = next ? Math.min(100, (data.total / next.minReferrals) * 100) : 100;

  const copy = () => {
    navigator.clipboard?.writeText(data.link).catch(() => {});
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
            Grow the community and earn recognition. Every number on this page reflects
            people who actually signed up through your link.
          </p>
        </Reveal>

        {/* Active campaign — platform-wide promotion, not per-user data */}
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

        {/* Rank + progress — computed from real referral count */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-panel to-panel-raised p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-accent bg-panel-raised">
                <Icon name={current.icon} size={24} className="text-accent" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-text">{current.label}</p>
                <p className="font-mono text-[11px] text-text-faint">{data.total} people referred</p>
              </div>
            </div>
            {next && (
              <div className="w-full sm:w-64">
                <div className="flex items-center justify-between font-mono text-[11px] text-text-faint">
                  <span>Progress to {next.label}</span>
                  <span>{data.total}/{next.minReferrals}</span>
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
                {data.link}
              </div>
              <Button onClick={copy} className="shrink-0">
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy link</>}
              </Button>
            </div>
            <p className="mt-2 font-mono text-[10px] text-text-faint">
              Code: <span className="text-accent">{data.code}</span>
            </p>

            <button
              onClick={() => {
                const url = generateShareCard({
                  headline: `${current.label}`,
                  subline: "Growing the Flux Signal Radar community",
                  statLabel: "People referred",
                  statValue: String(data.total),
                });
                if (url) downloadDataUrl(url, "flux-ambassador-card.png");
              }}
              className="mt-4 flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-body text-xs text-text-muted transition-colors hover:border-accent hover:text-text"
            >
              <ImageDown size={13} /> Download share card
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-panel p-5">
            <QrCode value={data.link} size={120} />
            <span className="font-mono text-[9px] text-text-faint">Scan to join</span>
          </div>
        </div>

        {/* Stats — every number here is a real count from your referrals */}
        <Stagger className="mt-6 grid grid-cols-3 gap-4">
          <StatCard icon={<Users size={15} />} label="Total" value={data.total} />
          <StatCard icon={<DollarSign size={15} />} label="Paying" value={data.paying} />
          <StatCard icon={<TrendingUp size={15} />} label="Last 30 days" value={data.last30Days} />
        </Stagger>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Rewards ladder — informational; per-friend milestone tracking
              (lesson completion, competition joins) isn't computed yet. */}
          <div className="rounded-xl border border-border bg-panel p-5">
            <h3 className="mb-4 font-display text-sm font-semibold text-text">Reward ladder (per referral)</h3>
            <div className="space-y-2">
              {referralMilestones.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <span className="flex-1 font-body text-sm text-text-muted">{m.label}</span>
                  <span className="font-mono text-[10px] text-accent">{m.reward}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity — real people who signed up through your link */}
          <div className="rounded-xl border border-border bg-panel p-5">
            <h3 className="mb-4 font-display text-sm font-semibold text-text">Referral activity</h3>
            {data.referred.length === 0 ? (
              <p className="font-body text-sm text-text-muted">
                No referrals yet — share your link to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {data.referred.map((r) => (
                  <div key={r.id} className="flex items-center justify-between">
                    <span className="font-mono text-sm text-text-muted">{r.name}</span>
                    <span
                      className="font-mono text-xs capitalize"
                      style={{ color: r.tier !== "free" ? "var(--color-bull)" : "var(--color-neutral)" }}
                    >
                      {r.tier !== "free" ? "subscribed" : "signed up"}
                    </span>
                    <span className="font-mono text-[10px] text-text-faint">{timeAgo(r.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ranks overview */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-text">Ambassador ranks</h2>
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ambassadorRanks.map((r) => {
              const reached = data.total >= r.minReferrals;
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

        {/* Leaderboard — real, cross-user, from the referral_leaderboard view */}
        <section className="mt-10">
          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-text">Top ambassadors</h3>
              <span className="font-mono text-xs text-text-faint">All time</span>
            </div>
            {leaderboard.length > 0 ? (
              <Leaderboard
                rows={leaderboard.map((e, i) => ({
                  rank: i + 1,
                  name: e.name,
                  value: `${e.referrals} refs`,
                  you: e.userId === user.id,
                }))}
              />
            ) : (
              <p className="font-body text-sm text-text-muted">No ambassadors on the board yet.</p>
            )}
          </div>
        </section>

        <p className="mt-6 text-center font-mono text-[10px] text-text-faint">
          Reward payouts and fraud review are handled server-side once payments are live. This is an
          ethical, milestone-based program — no multi-level commissions.
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

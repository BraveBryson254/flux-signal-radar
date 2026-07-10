"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowDownRight, Trophy } from "lucide-react";
import Widget from "./Widget";
import SignalCard from "../SignalCard";
import { mockSignals } from "@/lib/mockData";
import {
  marketOutlook,
  marketSessions,
  trendingAssets,
  learningProgress,
  competition,
  leaderboard,
  recentActivity,
} from "@/lib/ecosystemData";

export function WelcomeWidget({ name, index }: { name: string; index: number }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <Widget index={index} className="bg-gradient-to-br from-panel to-panel-raised">
      <p className="font-mono text-xs tracking-widest text-accent">{greeting.toUpperCase()}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-text">{name}</h2>
      <p className="mt-1 font-body text-sm text-text-muted">
        London and New York are both live. Here&apos;s your command center.
      </p>
    </Widget>
  );
}

export function DailySignalWidget({ index }: { index: number }) {
  const signal = mockSignals[0];
  return (
    <Widget
      title="Today's free signal"
      index={index}
      action={
        <Link href="/feed" className="font-mono text-xs text-accent hover:underline">
          Full feed
        </Link>
      }
    >
      <SignalCard signal={signal} index={0} />
    </Widget>
  );
}

export function MarketOutlookWidget({ index }: { index: number }) {
  return (
    <Widget title="Daily market outlook" index={index}>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-panel-raised px-2.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-bull" />
        <span className="font-mono text-xs text-bull">{marketOutlook.sentiment}</span>
      </div>
      <p className="font-body text-sm text-text-muted">{marketOutlook.headline}</p>
      <div className="mt-4 space-y-2">
        {marketOutlook.bias.map((b) => (
          <div key={b.market} className="flex items-center justify-between font-mono text-xs">
            <span className="text-text">{b.market}</span>
            <span className="text-text-faint">{b.note}</span>
            <span
              style={{
                color:
                  b.bias === "Bullish"
                    ? "var(--color-bull)"
                    : b.bias === "Bearish"
                    ? "var(--color-bear)"
                    : "var(--color-neutral)",
              }}
            >
              {b.bias}
            </span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

export function MarketSessionsWidget({ index }: { index: number }) {
  return (
    <Widget title="Market sessions" index={index}>
      <div className="grid grid-cols-2 gap-2">
        {marketSessions.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
          >
            <span className="font-body text-sm text-text">{s.name}</span>
            <span
              className="font-mono text-[10px]"
              style={{ color: s.open ? "var(--color-bull)" : "var(--color-text-faint)" }}
            >
              {s.open ? "OPEN" : "closed"}
            </span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

export function TrendingWidget({ index }: { index: number }) {
  return (
    <Widget title="Trending assets" index={index}>
      <div className="space-y-2">
        {trendingAssets.map((a) => {
          const up = a.change >= 0;
          return (
            <div key={a.symbol} className="flex items-center justify-between">
              <span className="font-mono text-sm text-text">{a.symbol}</span>
              <span
                className="flex items-center gap-1 font-mono text-xs"
                style={{ color: up ? "var(--color-bull)" : "var(--color-bear)" }}
              >
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {up ? "+" : ""}
                {a.change}%
              </span>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}

export function LearningProgressWidget({ index }: { index: number }) {
  const pct = (learningProgress.lessonsDone / learningProgress.lessonsTotal) * 100;
  return (
    <Widget
      title="Continue learning"
      index={index}
      action={
        <Link href="/academy" className="font-mono text-xs text-accent hover:underline">
          Academy
        </Link>
      }
    >
      <p className="font-body text-sm text-text">{learningProgress.currentCourse}</p>
      <div className="mt-3 flex items-center justify-between font-mono text-xs text-text-faint">
        <span>
          {learningProgress.lessonsDone}/{learningProgress.lessonsTotal} lessons
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-panel-raised">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7 }}
        />
      </div>
      <Link
        href="/academy"
        className="group mt-4 flex items-center gap-1.5 font-body text-sm font-medium text-accent"
      >
        Next: {learningProgress.nextLesson}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </Widget>
  );
}

export function CompetitionWidget({ index }: { index: number }) {
  return (
    <Widget
      title="Weekly competition"
      index={index}
      action={
        <Link href="/competitions" className="font-mono text-xs text-accent hover:underline">
          Lobby
        </Link>
      }
    >
      <div className="flex items-center gap-2">
        <Trophy size={16} className="text-accent" />
        <span className="font-display text-base font-semibold text-text">
          {competition.name}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
        <div>
          <p className="text-text-faint">Ends in</p>
          <p className="mt-0.5 text-text">{competition.endsInHours}h</p>
        </div>
        <div>
          <p className="text-text-faint">Entrants</p>
          <p className="mt-0.5 text-text">{competition.entrants}</p>
        </div>
        <div>
          <p className="text-text-faint">Your rank</p>
          <p className="mt-0.5 text-accent">#{competition.yourRank}</p>
        </div>
      </div>
    </Widget>
  );
}

export function LeaderboardWidget({ index }: { index: number }) {
  return (
    <Widget
      title="Leaderboard"
      index={index}
      action={<span className="font-mono text-xs text-text-faint">Kenya · Weekly</span>}
    >
      <div className="space-y-1">
        {leaderboard.map((e) => (
          <div
            key={e.rank}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5"
            style={{ background: e.you ? "rgba(157,78,221,0.1)" : "transparent" }}
          >
            <span
              className="w-5 font-mono text-xs"
              style={{ color: e.rank <= 3 ? "var(--color-accent)" : "var(--color-text-faint)" }}
            >
              {e.rank}
            </span>
            <span
              className="flex-1 font-body text-sm"
              style={{ color: e.you ? "var(--color-accent)" : "var(--color-text)" }}
            >
              {e.name}
            </span>
            <span className="font-mono text-xs text-text-faint">{e.region}</span>
            <span className="font-mono text-xs text-text-muted">{e.xp.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

export function RecentActivityWidget({ index }: { index: number }) {
  return (
    <Widget title="Recent activity" index={index}>
      <div className="divide-y divide-border">
        {recentActivity.map((a) => (
          <div key={a.id} className="flex items-center justify-between py-2.5">
            <span className="font-body text-sm text-text-muted">{a.label}</span>
            <span className="whitespace-nowrap font-mono text-xs text-text-faint">{a.time}</span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

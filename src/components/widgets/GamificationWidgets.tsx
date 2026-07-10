"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Flame, Coins, Check } from "lucide-react";
import Widget from "./Widget";
import { MockUser } from "@/lib/mockAuth";
import {
  dailyMissions,
  weeklyMissions,
  achievements,
  Mission,
} from "@/lib/ecosystemData";

// XP needed for the next level scales linearly for the mock.
function levelProgress(xp: number, level: number) {
  const base = level * 250;
  const into = xp % 250;
  return { into, needed: 250, pct: (into / 250) * 100, base };
}

export function XpLevelWidget({ user, index }: { user: MockUser; index: number }) {
  const { into, needed, pct } = levelProgress(user.xp, user.level);
  return (
    <Widget title="Level & XP" index={index}>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-panel-raised">
          <span className="font-display text-lg font-semibold text-accent">
            {user.level}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-text-muted">{user.xp.toLocaleString()} XP</span>
            <span className="text-text-faint">
              {into}/{needed} to L{user.level + 1}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-panel-raised">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5 font-mono text-xs text-bull">
            <Coins size={13} />
            {user.coins} coins
          </div>
        </div>
      </div>
    </Widget>
  );
}

export function StreakWidget({ user, index }: { user: MockUser; index: number }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <Widget title="Login streak" index={index}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Flame size={22} className="text-accent" />
          <span className="font-display text-2xl font-semibold text-text">
            {user.loginStreak}
          </span>
        </div>
        <div className="ml-auto flex gap-1.5">
          {days.map((d, i) => (
            <div
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-md font-mono text-[10px]"
              style={{
                background: i < user.loginStreak ? "var(--color-accent)" : "var(--color-panel-raised)",
                color: i < user.loginStreak ? "var(--color-bg)" : "var(--color-text-faint)",
              }}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 font-mono text-[11px] text-text-faint">
        Keep it going — day 5 unlocks a bonus 100 XP.
      </p>
    </Widget>
  );
}

function MissionRow({ mission }: { mission: Mission }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
        style={{
          borderColor: mission.done ? "var(--color-bull)" : "var(--color-border)",
          background: mission.done ? "var(--color-bull)" : "transparent",
        }}
      >
        {mission.done && <Check size={12} className="text-bg" />}
      </div>
      <span
        className="flex-1 font-body text-sm"
        style={{
          color: mission.done ? "var(--color-text-faint)" : "var(--color-text)",
          textDecoration: mission.done ? "line-through" : "none",
        }}
      >
        {mission.label}
      </span>
      <span className="font-mono text-xs text-accent">+{mission.xp}</span>
    </div>
  );
}

export function MissionsWidget({ index }: { index: number }) {
  const doneCount = dailyMissions.filter((m) => m.done).length;
  return (
    <Widget
      title="Daily missions"
      index={index}
      action={
        <span className="font-mono text-xs text-text-faint">
          {doneCount}/{dailyMissions.length}
        </span>
      }
    >
      <div className="divide-y divide-border">
        {dailyMissions.map((m) => (
          <MissionRow key={m.id} mission={m} />
        ))}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <p className="mb-1 font-mono text-[10px] tracking-widest text-text-faint">
          THIS WEEK
        </p>
        {weeklyMissions.slice(0, 2).map((m) => (
          <MissionRow key={m.id} mission={m} />
        ))}
      </div>
    </Widget>
  );
}

export function AchievementsWidget({ index }: { index: number }) {
  return (
    <Widget title="Achievements" index={index}>
      <div className="grid grid-cols-3 gap-3">
        {achievements.map((a) => {
          const Icon = (Icons[a.icon as keyof typeof Icons] ??
            Icons.Award) as React.ComponentType<{ size?: number; className?: string }>;
          return (
            <div
              key={a.id}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center"
              style={{ opacity: a.unlocked ? 1 : 0.4 }}
            >
              <Icon
                size={20}
                className={a.unlocked ? "text-accent" : "text-text-faint"}
              />
              <span className="font-mono text-[9px] leading-tight text-text-muted">
                {a.label}
              </span>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}

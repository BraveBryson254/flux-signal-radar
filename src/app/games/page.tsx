"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Lock, Check, X, Trophy, RotateCcw, ArrowLeft, Info, Flame, Coins, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Leaderboard from "@/components/Leaderboard";
import XpToast, { ToastItem } from "@/components/XpToast";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess, tierById } from "@/lib/tiers";
import { games, patternQuestions, arenaLeaderboard } from "@/lib/gamesData";
import { getBestScore } from "@/lib/arenaScores";
import { rankForXp, divisionForXp, leagueDivisions, currentSeason, dailyChallenge } from "@/lib/arenaProgression";
import CandlestickNinjaGame from "@/components/games/CandlestickNinjaGame";
import MarketDirectionGame from "@/components/games/MarketDirectionGame";
import LiquidityHuntGame from "@/components/games/LiquidityHuntGame";
import RiskSimulatorGame from "@/components/games/RiskSimulatorGame";
import ReplayModeGame from "@/components/games/ReplayModeGame";
import SpeedChallengeGame from "@/components/games/SpeedChallengeGame";

function Icon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Gamepad2) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function GamesPage() {
  const { user, claimMission } = useAuth();
  const router = useRouter();
  const userTier = user?.tier ?? "free";
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const xp = user?.xp ?? 0;
  const { current: rank, next: nextRank, progress: rankProgress } = rankForXp(xp);
  const division = divisionForXp(xp);
  const challenge = dailyChallenge();

  const awardXp = (xp: number) => {
    const result = claimMission(`game-${Date.now()}`, xp, 10);
    const tid = `${Date.now()}`;
    setToasts((p) => [...p, { id: tid, xp, coins: 10, leveledUp: result.leveledUp, newLevel: result.newLevel }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== tid)), 2400);
  };

  const playGame = (id: string) => {
    if (activeGame) return;
    setActiveGame(id);
  };

  if (activeGame) {
    const game = games.find((g) => g.id === activeGame);
    return (
      <main>
        <Header />
        <div className="mx-auto max-w-2xl px-6 pt-28 pb-20">
          <button
            onClick={() => setActiveGame(null)}
            className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text"
          >
            <ArrowLeft size={13} /> Arena
          </button>
          <h1 className="mb-4 font-display text-xl font-semibold text-text">{game?.name}</h1>
          {activeGame === "g-ninja" && <CandlestickNinjaGame onFinish={awardXp} />}
          {activeGame === "g-pattern" && <PatternGame onFinish={(score) => awardXp(score * 10)} />}
          {activeGame === "g-direction" && <MarketDirectionGame onFinish={awardXp} />}
          {activeGame === "g-liquidity" && <LiquidityHuntGame onFinish={awardXp} />}
          {activeGame === "g-risk" && <RiskSimulatorGame onFinish={awardXp} />}
          {activeGame === "g-replay" && <ReplayModeGame onFinish={awardXp} />}
          {activeGame === "g-speed" && <SpeedChallengeGame onFinish={awardXp} />}
        </div>
        <Footer />
        <XpToast toasts={toasts} />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        {/* Arena hero */}
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-panel to-panel-raised p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs tracking-widest text-accent">🏟 FLUX TRADING ARENA</span>
                <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
                  Train like a professional trader.
                </h1>
                <p className="mt-2 max-w-lg font-body text-text-muted">
                  Become faster. Become sharper. Become disciplined. Earn XP, climb the
                  ranks, and master the markets — no real money at stake.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-accent bg-panel-raised px-4 py-3">
                <Icon name={rank.icon} size={22} className="text-accent" />
                <div>
                  <p className="font-display text-sm font-semibold text-text">{rank.label}</p>
                  <p className="font-mono text-[10px] text-text-faint">{xp.toLocaleString()} XP</p>
                </div>
              </div>
            </div>

            {/* Rank progress */}
            {nextRank && (
              <div className="mt-6">
                <div className="flex items-center justify-between font-mono text-[11px] text-text-faint">
                  <span>Progress to {nextRank.label}</span>
                  <span>{Math.round(rankProgress)}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bg/40">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${rankProgress}%` }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>
            )}

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ArenaStat icon={<Flame size={13} className="text-accent" />} label="Streak" value={`${user?.loginStreak ?? 0}d`} />
              <ArenaStat icon={<Coins size={13} className="text-bull" />} label="Arena Coins" value={String(user?.coins ?? 0)} />
              <ArenaStat
                icon={<span className="h-2.5 w-2.5 rounded-full" style={{ background: division.color }} />}
                label="Division"
                value={division.label}
              />
              <ArenaStat icon={<Zap size={13} className="text-accent" />} label="Season" value={`${currentSeason.endsInDays}d left`} />
            </div>
          </div>
        </Reveal>

        {/* Daily challenge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-accent bg-panel-raised p-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-panel">
              <Icon name={challenge.icon} size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest text-accent">DAILY CHALLENGE</p>
              <p className="font-body text-sm font-semibold text-text">{challenge.name}</p>
            </div>
          </div>
          <Button onClick={() => playGame(challenge.id)}>
            Play for +{challenge.bonusXp} bonus XP
          </Button>
        </motion.div>

        {/* Prize model disclosure */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-panel/50 p-3">
          <Info size={14} className="mt-0.5 shrink-0 text-text-faint" />
          <p className="font-mono text-[10px] leading-relaxed text-text-faint">
            Arena points, ranks, and leaderboard positions are for XP and recognition only.
            There is no deposit, withdrawal, or cash-wagering feature — any future prize
            would be funded by Flux directly, never pooled from user funds.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Game grid */}
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">GAMES</p>
            <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {games.map((game) => {
                const unlocked = hasAccess(userTier, game.minTier);
                const best = getBestScore(game.id);
                return (
                  <StaggerItem key={game.id} variants={fadeUp}>
                    <motion.div {...hoverLift} className="flex h-full flex-col rounded-xl border border-border bg-panel p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-panel-raised">
                          <Icon name={game.icon} size={20} className="text-accent" />
                        </div>
                        <span className="font-mono text-[10px] text-accent">+{game.xpReward} XP</span>
                      </div>
                      <h3 className="mt-3 font-display text-base font-semibold text-text">{game.name}</h3>
                      <p className="mt-1 flex-1 font-body text-sm text-text-muted">{game.description}</p>
                      {best > 0 && (
                        <p className="mt-2 font-mono text-[10px] text-text-faint">Personal best: {best}</p>
                      )}
                      <div className="mt-4">
                        {!unlocked ? (
                          <Button variant="secondary" size="sm" onClick={() => router.push("/pricing")} className="w-full">
                            <Lock size={12} /> {tierById(game.minTier).name}
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => playGame(game.id)} className="w-full">
                            Play now
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </Stagger>

            {/* League divisions */}
            <div className="mt-8">
              <p className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">{currentSeason.name.toUpperCase()}</p>
              <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-panel p-4">
                {leagueDivisions.map((d) => {
                  const reached = xp >= d.minXp;
                  const isCurrent = d.id === division.id;
                  return (
                    <div
                      key={d.id}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5"
                      style={{
                        background: isCurrent ? `${d.color}22` : "transparent",
                        border: `1px solid ${isCurrent ? d.color : "var(--color-border)"}`,
                        opacity: reached ? 1 : 0.45,
                      }}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      <span className="font-mono text-[11px]" style={{ color: isCurrent ? d.color : "var(--color-text-muted)" }}>
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Arena leaderboard */}
          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-text">Arena leaderboard</h3>
              <span className="font-mono text-xs text-text-faint">{currentSeason.name}</span>
            </div>
            <Leaderboard
              rows={arenaLeaderboard.map((e) => ({
                rank: e.rank,
                name: e.name,
                region: e.region,
                value: `${e.points.toLocaleString()} pts`,
                you: e.you,
              }))}
            />
          </div>
        </div>
      </div>
      <Footer />
      <XpToast toasts={toasts} />
    </main>
  );
}

function ArenaStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg/30 p-3">
      <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-text-faint">
        {icon} {label.toUpperCase()}
      </p>
      <p className="mt-1 font-display text-base font-semibold text-text">{value}</p>
    </div>
  );
}

function PatternGame({ onFinish }: { onFinish: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = patternQuestions[current];

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= patternQuestions.length) {
      setDone(true);
      onFinish(score + (selected === q.answerIndex ? 0 : 0));
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-border bg-panel p-8 text-center">
        <Trophy size={28} className="mx-auto text-accent" />
        <p className="mt-3 font-display text-3xl font-semibold text-text">
          {score}/{patternQuestions.length}
        </p>
        <p className="mt-1 font-body text-sm text-text-muted">
          You earned {score * 10} XP and 10 coins.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-5"
          onClick={() => {
            setCurrent(0);
            setSelected(null);
            setAnswered(false);
            setScore(0);
            setDone(false);
          }}
        >
          <RotateCcw size={13} /> Play again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="mb-4 flex items-center justify-between font-mono text-xs text-text-faint">
        <span>Pattern Recognition · {current + 1}/{patternQuestions.length}</span>
        <span>Score {score}</span>
      </div>
      <p className="font-display text-base font-semibold text-text">{q.scenario}</p>
      <div className="mt-4 space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answerIndex;
          const isChosen = i === selected;
          let border = "var(--color-border)";
          let bg = "transparent";
          if (answered && isCorrect) { border = "var(--color-bull)"; bg = "rgba(200,255,77,0.08)"; }
          else if (answered && isChosen && !isCorrect) { border = "var(--color-bear)"; bg = "rgba(255,92,122,0.08)"; }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={answered}
              className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left font-body text-sm text-text transition-colors"
              style={{ borderColor: border, background: bg }}
            >
              {opt}
              {answered && isCorrect && <Check size={15} className="text-bull" />}
              {answered && isChosen && !isCorrect && <X size={15} className="text-bear" />}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <p className="mt-4 rounded-lg bg-panel-raised p-3 font-body text-sm text-text-muted">{q.explanation}</p>
            <Button className="mt-4 w-full" onClick={next}>
              {current + 1 >= patternQuestions.length ? "Finish" : "Next"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

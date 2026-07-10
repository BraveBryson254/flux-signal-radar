"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Lock, Check, X, Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import XpToast, { ToastItem } from "@/components/XpToast";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess, tierById } from "@/lib/tiers";
import { games, patternQuestions } from "@/lib/gamesData";

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
  const [playing, setPlaying] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const awardXp = (xp: number) => {
    const result = claimMission(`game-${Date.now()}`, xp, 10);
    const tid = `${Date.now()}`;
    setToasts((p) => [...p, { id: tid, xp, coins: 10, leveledUp: result.leveledUp, newLevel: result.newLevel }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== tid)), 2400);
  };

  if (playing) {
    return (
      <main>
        <Header />
        <div className="mx-auto max-w-2xl px-6 pt-28 pb-20">
          <button
            onClick={() => setPlaying(false)}
            className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text"
          >
            <ArrowLeft size={13} /> Arena
          </button>
          <PatternGame onFinish={(score) => awardXp(score * 10)} />
        </div>
        <Footer />
        <XpToast toasts={toasts} />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">FLUX ARENA</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Trading Games
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Sharpen your eye and earn XP. Practice pattern recognition, liquidity
            reads, and risk discipline — no real money at stake.
          </p>
        </Reveal>

        <Stagger className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => {
            const unlocked = hasAccess(userTier, game.minTier);
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
                  <div className="mt-4">
                    {!unlocked ? (
                      <Button variant="secondary" size="sm" onClick={() => router.push("/pricing")} className="w-full">
                        <Lock size={12} /> {tierById(game.minTier).name}
                      </Button>
                    ) : game.playable ? (
                      <Button size="sm" onClick={() => setPlaying(true)} className="w-full">
                        Play now
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled className="w-full opacity-60">
                        Coming soon
                      </Button>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
      <Footer />
      <XpToast toasts={toasts} />
    </main>
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

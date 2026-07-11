"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Trophy, Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { speedQuestions } from "@/lib/gamesData";
import { getBestScore, setBestScore } from "@/lib/arenaScores";

const DURATION = 60;

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SpeedChallengeGame({ onFinish }: { onFinish: (xp: number) => void }) {
  const [pool] = useState(() => shuffled(speedQuestions));
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);
  const best = getBestScore("g-speed");

  useEffect(() => {
    if (!started || done) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          if (!finishedRef.current) {
            finishedRef.current = true;
            setDone(true);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, done]);

  useEffect(() => {
    if (done) {
      setBestScore("g-speed", score);
      onFinish(Math.round(score * 4));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const answer = (choice: boolean) => {
    if (done || flash) return;
    const q = pool[index % pool.length];
    const correct = choice === q.answer;
    setFlash(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setFlash(null);
      setIndex((i) => i + 1);
    }, 220);
  };

  if (!started) {
    return (
      <div className="rounded-xl border border-border bg-panel p-8 text-center">
        <p className="font-display text-lg font-semibold text-text">60 seconds. True or false.</p>
        <p className="mt-2 font-body text-sm text-text-muted">Rapid concept recall — answer as many as you can.</p>
        <Button className="mt-5" onClick={() => setStarted(true)}>
          Start
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-panel p-8 text-center">
        <Trophy size={28} className="mx-auto text-accent" />
        <p className="mt-3 font-display text-3xl font-semibold text-text">{score} correct</p>
        <p className="mt-1 font-mono text-xs text-text-faint">Personal best: {Math.max(best, score)}</p>
      </div>
    );
  }

  const q = pool[index % pool.length];

  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="mb-4 flex items-center justify-between font-mono text-xs">
        <span className="text-text-faint">Score {score}</span>
        <span style={{ color: timeLeft <= 10 ? "var(--color-bear)" : "var(--color-text-faint)" }}>{timeLeft}s</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-raised">
        <motion.div
          className="h-full rounded-full bg-accent"
          animate={{ width: `${(timeLeft / DURATION) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.p
        key={index}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 min-h-[64px] text-center font-display text-lg font-semibold text-text"
        style={{
          color: flash === "correct" ? "var(--color-bull)" : flash === "wrong" ? "var(--color-bear)" : "var(--color-text)",
        }}
      >
        {q.statement}
      </motion.p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button onClick={() => answer(true)} className="justify-center bg-bull py-3 text-bg hover:brightness-110">
          <Check size={16} /> True
        </Button>
        <Button onClick={() => answer(false)} className="justify-center bg-bear py-3 text-bg hover:brightness-110">
          <X size={16} /> False
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Flame, Trophy } from "lucide-react";
import Button from "@/components/ui/Button";
import { useArenaBestScore } from "@/lib/useArenaBestScore";

const ROUNDS = 12;

function nextPoint(last: number): number {
  const move = (Math.random() - 0.48) * 6; // slight upward drift, still noisy
  return Math.max(20, Math.min(180, last + move));
}

export default function MarketDirectionGame({ onFinish }: { onFinish: (xp: number) => void }) {
  const [points, setPoints] = useState<number[]>(() => {
    const arr = [100];
    for (let i = 0; i < 14; i++) arr.push(nextPoint(arr[arr.length - 1]));
    return arr;
  });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [done, setDone] = useState(false);
  const { best, submit } = useArenaBestScore("g-direction");

  const guess = (dir: "up" | "down") => {
    if (round >= ROUNDS || feedback) return;
    const last = points[points.length - 1];
    const next = nextPoint(last);
    const actual = next >= last ? "up" : "down";
    const correct = actual === dir;

    setFeedback(actual);
    setPoints((p) => [...p, next]);

    setTimeout(() => {
      setFeedback(null);
      setRound((r) => r + 1);
      if (correct) {
        setScore((s) => s + 10 + streak * 2);
        setStreak((s) => {
          const ns = s + 1;
          setBestStreak((b) => Math.max(b, ns));
          return ns;
        });
      } else {
        setStreak(0);
      }
      if (round + 1 >= ROUNDS) {
        setDone(true);
        const finalScore = score + (correct ? 10 + streak * 2 : 0);
        submit(finalScore);
        onFinish(Math.round(finalScore / 3));
      }
    }, 550);
  };

  const width = 560;
  const height = 200;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * width,
    y: height - ((p - min) / range) * (height - 20) - 10,
  }));
  const path = `M${coords.map((c) => `${c.x},${c.y}`).join(" L")}`;

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-panel p-8 text-center">
        <Trophy size={28} className="mx-auto text-accent" />
        <p className="mt-3 font-display text-3xl font-semibold text-text">{score} pts</p>
        <p className="mt-1 font-body text-sm text-text-muted">Best streak this run: {bestStreak}</p>
        <p className="mt-1 font-mono text-xs text-text-faint">Personal best: {Math.max(best, score)}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="mb-3 flex items-center justify-between font-mono text-xs text-text-faint">
        <span>Round {round + 1}/{ROUNDS}</span>
        <span className="flex items-center gap-1">
          <Flame size={12} className={streak > 0 ? "text-accent" : "text-text-faint"} /> Streak {streak}
        </span>
        <span>Score {score}</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <motion.path
          d={path}
          fill="none"
          stroke={feedback === "down" ? "var(--color-bear)" : "var(--color-bull)"}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {coords.length > 0 && (
          <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r={4} fill="var(--color-accent)" />
        )}
      </svg>

      <p className="mt-2 text-center font-body text-sm text-text-muted">Will the next tick go up or down?</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button
          onClick={() => guess("up")}
          disabled={!!feedback}
          className="justify-center bg-bull py-3 text-bg hover:brightness-110"
        >
          <ArrowUp size={16} /> Up
        </Button>
        <Button
          onClick={() => guess("down")}
          disabled={!!feedback}
          className="justify-center bg-bear py-3 text-bg hover:brightness-110"
        >
          <ArrowDown size={16} /> Down
        </Button>
      </div>
    </div>
  );
}

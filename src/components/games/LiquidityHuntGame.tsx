"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import Button from "@/components/ui/Button";
import { liquidityScenarios } from "@/lib/gamesData";
import { getBestScore, setBestScore } from "@/lib/arenaScores";

export default function LiquidityHuntGame({ onFinish }: { onFinish: (xp: number) => void }) {
  const [round, setRound] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const best = getBestScore("g-liquidity");

  const scenario = liquidityScenarios[round];

  const choose = (id: string) => {
    if (chosen) return;
    setChosen(id);
    if (id === scenario.correctId) setScore((s) => s + 1);
  };

  const next = () => {
    if (round + 1 >= liquidityScenarios.length) {
      const finalScore = score;
      setBestScore("g-liquidity", finalScore);
      setDone(true);
      onFinish(finalScore * 12);
      return;
    }
    setRound((r) => r + 1);
    setChosen(null);
  };

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-panel p-8 text-center">
        <Trophy size={28} className="mx-auto text-accent" />
        <p className="mt-3 font-display text-3xl font-semibold text-text">
          {score}/{liquidityScenarios.length}
        </p>
        <p className="mt-1 font-mono text-xs text-text-faint">Personal best: {Math.max(best, score)}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="mb-3 flex items-center justify-between font-mono text-xs text-text-faint">
        <span>Round {round + 1}/{liquidityScenarios.length}</span>
        <span>Score {score}</span>
      </div>

      <p className="font-display text-base font-semibold text-text">{scenario.prompt}</p>

      <svg viewBox="0 0 300 160" className="mt-4 w-full rounded-lg bg-panel-raised">
        <line x1={10} y1={140} x2={290} y2={140} stroke="var(--color-border)" strokeWidth={1} />
        {scenario.markers.map((m) => {
          const isChosen = chosen === m.id;
          const isCorrect = m.id === scenario.correctId;
          let color = "var(--color-text-faint)";
          if (chosen) color = isCorrect ? "var(--color-bull)" : isChosen ? "var(--color-bear)" : "var(--color-text-faint)";
          return (
            <g key={m.id} onClick={() => choose(m.id)} style={{ cursor: chosen ? "default" : "pointer" }}>
              <circle cx={m.x} cy={m.y} r={10} fill={color} opacity={0.2} />
              <circle cx={m.x} cy={m.y} r={5} fill={color} />
              <text x={m.x} y={m.y - 14} textAnchor="middle" fill={color} fontSize={11} fontFamily="monospace">
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {chosen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <p className="mt-4 rounded-lg bg-panel-raised p-3 font-body text-sm text-text-muted">{scenario.explanation}</p>
            <Button className="mt-4 w-full" onClick={next}>
              {round + 1 >= liquidityScenarios.length ? "Finish" : "Next scenario"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

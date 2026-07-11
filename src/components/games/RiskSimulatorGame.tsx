"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Skull } from "lucide-react";
import Button from "@/components/ui/Button";
import { getBestScore, setBestScore } from "@/lib/arenaScores";

const ROUNDS = 15;
const WIN_RATE = 0.42;
const REWARD_R = 2.4;
const START_BALANCE = 10000;
const RISK_OPTIONS = [0.5, 1, 2, 5];

function rollTradeOutcome(balance: number, riskPct: number): { win: boolean; newBalance: number } {
  const win = Math.random() < WIN_RATE;
  const riskAmount = balance * (riskPct / 100);
  const delta = win ? riskAmount * REWARD_R : -riskAmount;
  return { win, newBalance: Math.max(0, balance + delta) };
}

export default function RiskSimulatorGame({ onFinish }: { onFinish: (xp: number) => void }) {
  const [round, setRound] = useState(0);
  const [balance, setBalance] = useState(START_BALANCE);
  const [history, setHistory] = useState<number[]>([START_BALANCE]);
  const [lastResult, setLastResult] = useState<"win" | "loss" | null>(null);
  const [blown, setBlown] = useState(false);
  const [done, setDone] = useState(false);
  const best = getBestScore("g-risk");

  const playRisk = (riskPct: number) => {
    if (done || blown) return;
    const { win, newBalance } = rollTradeOutcome(balance, riskPct);

    setLastResult(win ? "win" : "loss");
    setBalance(newBalance);
    setHistory((h) => [...h, newBalance]);

    const isBlown = newBalance < START_BALANCE * 0.2;
    const nextRound = round + 1;

    setTimeout(() => {
      setLastResult(null);
      if (isBlown) {
        setBlown(true);
        setDone(true);
        setBestScore("g-risk", Math.round(newBalance));
        onFinish(10);
        return;
      }
      setRound(nextRound);
      if (nextRound >= ROUNDS) {
        setDone(true);
        setBestScore("g-risk", Math.round(newBalance));
        const growth = Math.max(0, newBalance - START_BALANCE) / START_BALANCE;
        onFinish(Math.round(30 + growth * 100));
      }
    }, 500);
  };

  const width = 560;
  const height = 160;
  const min = Math.min(...history, START_BALANCE * 0.9);
  const max = Math.max(...history, START_BALANCE * 1.1);
  const range = max - min || 1;
  const coords = history.map((v, i) => ({
    x: (i / Math.max(1, history.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 16) - 8,
  }));
  const path = `M${coords.map((c) => `${c.x},${c.y}`).join(" L")}`;
  const positive = balance >= START_BALANCE;

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-panel p-8 text-center">
        {blown ? (
          <Skull size={28} className="mx-auto text-bear" />
        ) : (
          <Trophy size={28} className="mx-auto text-accent" />
        )}
        <p className="mt-3 font-display text-3xl font-semibold text-text">${Math.round(balance).toLocaleString()}</p>
        <p className="mt-1 font-body text-sm text-text-muted">
          {blown ? "Account blown — oversized risk caught up with you." : `Survived ${ROUNDS} rounds from a $${START_BALANCE.toLocaleString()} start.`}
        </p>
        <p className="mt-1 font-mono text-xs text-text-faint">Personal best balance: ${Math.max(best, Math.round(balance)).toLocaleString()}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="mb-3 flex items-center justify-between font-mono text-xs text-text-faint">
        <span>Round {round + 1}/{ROUNDS}</span>
        <span style={{ color: positive ? "var(--color-bull)" : "var(--color-bear)" }}>
          ${Math.round(balance).toLocaleString()}
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <line
          x1={0}
          y1={height - ((START_BALANCE - min) / range) * (height - 16) - 8}
          x2={width}
          y2={height - ((START_BALANCE - min) / range) * (height - 16) - 8}
          stroke="var(--color-border)"
          strokeDasharray="3 3"
        />
        <motion.path
          d={path}
          fill="none"
          stroke={positive ? "var(--color-bull)" : "var(--color-bear)"}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <p className="mt-2 text-center font-body text-sm text-text-muted">
        Choose your risk for this trade. Higher risk grows faster — and blows up faster.
      </p>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {RISK_OPTIONS.map((r) => (
          <Button key={r} variant="secondary" onClick={() => playRisk(r)} disabled={!!lastResult} className="justify-center">
            {r}%
          </Button>
        ))}
      </div>

      {lastResult && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center font-mono text-xs"
          style={{ color: lastResult === "win" ? "var(--color-bull)" : "var(--color-bear)" }}
        >
          {lastResult === "win" ? `+${REWARD_R}R win` : "-1R loss"}
        </motion.p>
      )}
    </div>
  );
}

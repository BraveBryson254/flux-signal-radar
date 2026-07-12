"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame } from "lucide-react";
import { useArenaBestScore } from "@/lib/useArenaBestScore";

const DURATION = 45;

type CandleKind = "bull" | "bear";

interface FlyingCandle {
  id: number;
  kind: CandleKind;
  isTarget: boolean; // matches the current round's target kind
  x: number; // % across width
  delay: number; // seconds before launch
  duration: number; // flight duration
  sliced: boolean;
  missed: boolean;
}

let idCounter = 0;

function spawnCandle(target: CandleKind, forceTarget: boolean): FlyingCandle {
  const isTarget = forceTarget || Math.random() < 0.55;
  return {
    id: idCounter++,
    kind: isTarget ? target : target === "bull" ? "bear" : "bull",
    isTarget,
    x: 10 + Math.random() * 80,
    delay: Math.random() * 0.4,
    duration: 1.6 + Math.random() * 0.6,
    sliced: false,
    missed: false,
  };
}

export default function CandlestickNinjaGame({ onFinish }: { onFinish: (xp: number) => void }) {
  const [target, setTarget] = useState<CandleKind>("bull");
  const [candles, setCandles] = useState<FlyingCandle[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const { best, submit } = useArenaBestScore("g-ninja");
  const spawnTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetSwitchTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (spawnTimer.current) clearInterval(spawnTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    if (targetSwitchTimer.current) clearInterval(targetSwitchTimer.current);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = () => {
    setStarted(true);
    spawnTimer.current = setInterval(() => {
      setCandles((prev) => [...prev.filter((c) => !c.sliced && !c.missed), spawnCandle(target, false)]);
    }, 650);

    targetSwitchTimer.current = setInterval(() => {
      setTarget((t) => (t === "bull" ? "bear" : "bull"));
    }, 6000);

    countdownTimer.current = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          cleanup();
          setDone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (done) {
      const finalScore = score;
      submit(finalScore);
      onFinish(Math.round(finalScore * 1.2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const slice = (id: number) => {
    setCandles((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.sliced) return c;
        if (c.isTarget) {
          setScore((s) => s + 10 + combo * 2);
          setCombo((cb) => {
            const nc = cb + 1;
            setBestCombo((b) => Math.max(b, nc));
            return nc;
          });
        } else {
          setScore((s) => Math.max(0, s - 5));
          setCombo(0);
        }
        return { ...c, sliced: true };
      })
    );
  };

  const handleFlightEnd = (id: number) => {
    setCandles((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.sliced) return c;
        if (c.isTarget) setCombo(0); // missed a target candle
        return { ...c, missed: true };
      })
    );
  };

  if (!started) {
    return (
      <div className="rounded-xl border border-border bg-panel p-8 text-center">
        <p className="font-display text-lg font-semibold text-text">Slice only the matching candles.</p>
        <p className="mt-2 font-body text-sm text-text-muted">
          The target flips between bullish and bearish every few seconds. Slice the wrong
          one and your combo resets.
        </p>
        <button
          onClick={start}
          className="mt-5 rounded-lg bg-accent px-5 py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
        >
          Start
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-panel p-8 text-center">
        <Trophy size={28} className="mx-auto text-accent" />
        <p className="mt-3 font-display text-3xl font-semibold text-text">{score} pts</p>
        <p className="mt-1 font-body text-sm text-text-muted">Best combo this run: {bestCombo}</p>
        <p className="mt-1 font-mono text-xs text-text-faint">Personal best: {Math.max(best, score)}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-xs">
        <span className="flex items-center gap-1 text-text-faint">
          <Flame size={12} className={combo > 0 ? "text-accent" : "text-text-faint"} /> Combo {combo}
        </span>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[10px]"
          style={{
            color: target === "bull" ? "var(--color-bull)" : "var(--color-bear)",
            background: target === "bull" ? "rgba(200,255,77,0.12)" : "rgba(255,92,122,0.12)",
          }}
        >
          Slice: {target === "bull" ? "BULLISH" : "BEARISH"} only
        </span>
        <span style={{ color: timeLeft <= 10 ? "var(--color-bear)" : "var(--color-text-faint)" }}>{timeLeft}s</span>
      </div>

      <div className="relative h-80 w-full overflow-hidden rounded-lg bg-panel-raised">
        <AnimatePresence>
          {candles
            .filter((c) => !c.missed)
            .map((c) => (
              <motion.button
                key={c.id}
                onClick={() => slice(c.id)}
                initial={{ y: 340, opacity: 0 }}
                animate={{ y: -40, opacity: 1 }}
                exit={{ opacity: 0, scale: c.sliced ? 1.6 : 0.8 }}
                transition={{
                  y: { duration: c.duration, delay: c.delay, ease: "linear" },
                  opacity: { duration: 0.2 },
                }}
                onAnimationComplete={() => !c.sliced && handleFlightEnd(c.id)}
                className="absolute flex flex-col items-center"
                style={{ left: `${c.x}%`, cursor: "pointer" }}
              >
                <div
                  className="w-1 rounded-full"
                  style={{ height: 10, background: c.kind === "bull" ? "var(--color-bull)" : "var(--color-bear)" }}
                />
                <div
                  className="w-5 rounded-sm"
                  style={{
                    height: 34,
                    background: c.kind === "bull" ? "var(--color-bull)" : "var(--color-bear)",
                    boxShadow: c.sliced ? "0 0 18px 4px currentColor" : "none",
                    opacity: c.sliced ? 0.4 : 1,
                  }}
                />
                <div
                  className="w-1 rounded-full"
                  style={{ height: 10, background: c.kind === "bull" ? "var(--color-bull)" : "var(--color-bear)" }}
                />
              </motion.button>
            ))}
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-mono text-[9px] text-text-faint">
          Score {score}
        </div>
      </div>
    </div>
  );
}

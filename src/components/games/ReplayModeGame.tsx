"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, ArrowUp, ArrowDown, Trophy } from "lucide-react";
import Button from "@/components/ui/Button";
import { replayBars } from "@/lib/gamesData";
import { useArenaBestScore } from "@/lib/useArenaBestScore";

const HOLD_BARS = 6;

export default function ReplayModeGame({ onFinish }: { onFinish: (xp: number) => void }) {
  const [visibleCount, setVisibleCount] = useState(15);
  const [playing, setPlaying] = useState(false);
  const [entry, setEntry] = useState<{ index: number; price: number; dir: "long" | "short" } | null>(null);
  const [result, setResult] = useState<{ rMultiple: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { best, submit } = useArenaBestScore("g-replay");

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= replayBars.length) {
          setPlaying(false);
          return c;
        }
        return c + 1;
      });
    }, 350);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing]);

  useEffect(() => {
    // Resolve trade automatically once enough bars have passed. This is a
    // legitimate effect-driven state transition (game logic reacting to
    // time passing), not a render-purity issue.
    if (entry && !result && visibleCount >= entry.index + 1 + HOLD_BARS) {
      const exitBar = replayBars[Math.min(entry.index + HOLD_BARS, replayBars.length - 1)];
      const raw = exitBar.c - entry.price;
      const signed = entry.dir === "long" ? raw : -raw;
      const risk = 1.5; // fixed abstract risk unit for scoring
      const rMultiple = Number((signed / risk).toFixed(2));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult({ rMultiple });
      setPlaying(false);
      const finalScore = Math.round(rMultiple * 20 + 40);
      submit(Math.max(finalScore, 0));
      onFinish(Math.max(finalScore, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount, entry, result]);

  const enter = (dir: "long" | "short") => {
    if (entry || visibleCount >= replayBars.length) return;
    const bar = replayBars[visibleCount - 1];
    setEntry({ index: visibleCount - 1, price: bar.c, dir });
    setPlaying(true);
  };

  const bars = replayBars.slice(0, visibleCount);
  const width = 620;
  const height = 220;
  const allVals = bars.flatMap((b) => [b.h, b.l]);
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const range = max - min || 1;
  const barW = width / Math.max(replayBars.length, 20);

  const yFor = (v: number) => height - ((v - min) / range) * (height - 16) - 8;

  if (result) {
    const positive = result.rMultiple >= 0;
    return (
      <div className="rounded-xl border border-border bg-panel p-8 text-center">
        <Trophy size={28} className="mx-auto text-accent" />
        <p className="mt-3 font-display text-3xl font-semibold" style={{ color: positive ? "var(--color-bull)" : "var(--color-bear)" }}>
          {positive ? "+" : ""}
          {result.rMultiple}R
        </p>
        <p className="mt-1 font-body text-sm text-text-muted">
          Entered {entry?.dir}, held {HOLD_BARS} bars blind to what came next.
        </p>
        <p className="mt-1 font-mono text-xs text-text-faint">Personal best score: {best}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="mb-3 flex items-center justify-between font-mono text-xs text-text-faint">
        <span>Bar {visibleCount}/{replayBars.length}</span>
        {entry && <span className="text-accent">In {entry.dir} from {entry.price.toFixed(1)}</span>}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {bars.map((b, i) => {
          const isUp = b.c >= b.o;
          const x = i * barW + barW * 0.2;
          const bodyTop = yFor(Math.max(b.o, b.c));
          const bodyBottom = yFor(Math.min(b.o, b.c));
          return (
            <g key={i}>
              <line x1={x + barW * 0.3} x2={x + barW * 0.3} y1={yFor(b.h)} y2={yFor(b.l)} stroke={isUp ? "var(--color-bull)" : "var(--color-bear)"} strokeWidth={1} />
              <rect
                x={x}
                y={bodyTop}
                width={barW * 0.6}
                height={Math.max(1, bodyBottom - bodyTop)}
                fill={isUp ? "var(--color-bull)" : "var(--color-bear)"}
              />
            </g>
          );
        })}
        {entry && (
          <line
            x1={0}
            x2={width}
            y1={yFor(entry.price)}
            y2={yFor(entry.price)}
            stroke="var(--color-accent)"
            strokeDasharray="4 3"
            strokeWidth={1.5}
          />
        )}
      </svg>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Button variant="secondary" size="sm" onClick={() => setPlaying((p) => !p)} disabled={!!entry}>
          {playing ? <Pause size={13} /> : <Play size={13} />} {playing ? "Pause" : "Play"}
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => enter("long")} disabled={!!entry} className="bg-bull text-bg hover:brightness-110">
            <ArrowUp size={14} /> Long
          </Button>
          <Button onClick={() => enter("short")} disabled={!!entry} className="bg-bear text-bg hover:brightness-110">
            <ArrowDown size={14} /> Short
          </Button>
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] text-text-faint">
        Enter long or short whenever you like — the tape keeps moving either way.
      </p>
    </div>
  );
}

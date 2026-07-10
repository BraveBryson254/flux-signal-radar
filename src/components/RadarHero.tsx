"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SCAN_INTERVAL_SECONDS = 60;

// Fixed blip positions (radius = confluence strength, angle = arbitrary spread).
// Static values keep the sweep animation deterministic between server/client render.
const blips = [
  { angle: 40, radius: 0.82, color: "var(--color-bull)", delay: 0.2 },
  { angle: 120, radius: 0.55, color: "var(--color-bear)", delay: 1.1 },
  { angle: 210, radius: 0.7, color: "var(--color-bull)", delay: 2.4 },
  { angle: 290, radius: 0.38, color: "var(--color-accent)", delay: 0.7 },
  { angle: 340, radius: 0.65, color: "var(--color-bear)", delay: 3.0 },
];

function polarToXY(angleDeg: number, radiusFraction: number, size: number) {
  const angle = (angleDeg * Math.PI) / 180;
  const r = (size / 2) * radiusFraction;
  const cx = size / 2 + r * Math.cos(angle);
  const cy = size / 2 + r * Math.sin(angle);
  return { cx, cy };
}

export default function RadarHero() {
  const size = 480;
  const rings = [0.25, 0.5, 0.75, 1];
  const [secondsLeft, setSecondsLeft] = useState(SCAN_INTERVAL_SECONDS);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? SCAN_INTERVAL_SECONDS : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-b border-border px-6 pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Ambient grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text-faint) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-faint) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-16 md:flex-row md:items-center md:justify-between">
        {/* Copy */}
        <div className="max-w-xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ opacity: badgeOpacity }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1 font-mono text-xs text-accent"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            LIVE SCAN — NEXT PASS IN {String(secondsLeft).padStart(2, "0")}S
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text md:text-6xl"
          >
            Every high-confluence
            <br />
            setup, before you
            <br />
            <span className="text-accent">see it yourself.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-md font-body text-base leading-relaxed text-text-muted md:mx-0"
          >
            Flux Signal Radar scans forex, metals, and indices across every
            session, scoring setups against six institutional strategies at
            once — so you only look up when something worth trading appears.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
          >
            <a
              href="/feed"
              className="w-full rounded-lg bg-accent px-6 py-3 text-center font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              View live signals
            </a>
            <a
              href="/methodology"
              className="w-full rounded-lg border border-border px-6 py-3 text-center font-body text-sm font-semibold text-text transition-colors hover:border-text-faint sm:w-auto"
            >
              How scoring works
            </a>
          </motion.div>
        </div>

        {/* Radar scope */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative shrink-0"
          style={{ width: size, height: size }}
          aria-hidden="true"
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <radialGradient id="scopeFade" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
              </radialGradient>
              <clipPath id="scopeClip">
                <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} />
              </clipPath>
            </defs>

            <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="url(#scopeFade)" />

            {rings.map((r) => (
              <circle
                key={r}
                cx={size / 2}
                cy={size / 2}
                r={(size / 2 - 2) * r}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth={1}
              />
            ))}
            <line x1={size / 2} y1={2} x2={size / 2} y2={size - 2} stroke="var(--color-border)" strokeWidth={1} />
            <line x1={2} y1={size / 2} x2={size - 2} y2={size / 2} stroke="var(--color-border)" strokeWidth={1} />

            {/* Rotating sweep, clipped to the scope circle */}
            <g clipPath="url(#scopeClip)">
              <motion.g
                style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <path
                  d={`M ${size / 2} ${size / 2} L ${size / 2} -${size} A ${size} ${size} 0 0 1 ${
                    size / 2 + size * Math.sin((60 * Math.PI) / 180)
                  } ${size / 2 - size * Math.cos((60 * Math.PI) / 180)} Z`}
                  fill="var(--color-accent)"
                  opacity={0.08}
                />
                <line
                  x1={size / 2}
                  y1={size / 2}
                  x2={size / 2}
                  y2={-size}
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  opacity={0.5}
                />
              </motion.g>
            </g>

            {/* Signal blips */}
            {blips.map((b, i) => {
              const { cx, cy } = polarToXY(b.angle, b.radius, size - 8);
              return (
                <g key={i} transform={`translate(${(size - (size - 8)) / 2}, ${(size - (size - 8)) / 2})`}>
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={b.color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.4, 1, 1] }}
                    transition={{
                      duration: 2.2,
                      delay: b.delay,
                      repeat: Infinity,
                      repeatDelay: 3.8,
                    }}
                  />
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="none"
                    stroke={b.color}
                    strokeWidth={1.5}
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: [0.6, 0], scale: [1, 3.2] }}
                    transition={{
                      duration: 2.2,
                      delay: b.delay,
                      repeat: Infinity,
                      repeatDelay: 3.8,
                    }}
                  />
                </g>
              );
            })}

            <circle cx={size / 2} cy={size / 2} r={3} fill="var(--color-accent)" />
          </svg>

          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <span className="rounded-full border border-border bg-panel/80 px-3 py-1 font-mono text-[10px] tracking-widest text-text-faint backdrop-blur">
              SCOPE.RADIUS = CONFLUENCE
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

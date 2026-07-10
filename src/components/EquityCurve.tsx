"use client";

import { motion } from "framer-motion";

/**
 * Minimal SVG equity curve. Kept dependency-free (no charting lib) for
 * bundle size — draws a filled area + animated line from R-value points.
 */
export default function EquityCurve({ points }: { points: number[] }) {
  const width = 600;
  const height = 200;
  const pad = 12;

  if (points.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center font-mono text-xs text-text-faint">
        Not enough trades yet.
      </div>
    );
  }

  const min = Math.min(0, ...points);
  const max = Math.max(0, ...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (p - min) / range) * (height - pad * 2);
    return { x, y };
  });

  const linePath = `M${coords.map((c) => `${c.x},${c.y}`).join(" L")}`;
  const areaPath =
    `${linePath} L${coords[coords.length - 1].x},${height - pad} L${coords[0].x},${height - pad} Z`;
  const zeroY = pad + (1 - (0 - min) / range) * (height - pad * 2);
  const last = points[points.length - 1];
  const positive = last >= 0;
  const stroke = positive ? "var(--color-bull)" : "var(--color-bear)";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* zero baseline */}
      <line
        x1={pad}
        y1={zeroY}
        x2={width - pad}
        y2={zeroY}
        stroke="var(--color-border)"
        strokeWidth={1}
        strokeDasharray="3 3"
      />

      <motion.path
        d={areaPath}
        fill="url(#equityFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}

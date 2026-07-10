"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { mockSignals, strategies, sessionMeta } from "@/lib/mockData";
import { Session, StrategyId } from "@/lib/types";
import SignalCard from "./SignalCard";

const sessionTabs: { id: Session | "all"; label: string }[] = [
  { id: "all", label: "All sessions" },
  { id: "asian", label: sessionMeta.asian.label },
  { id: "london", label: sessionMeta.london.label },
  { id: "new-york", label: sessionMeta["new-york"].label },
];

export default function SignalFeed() {
  const [activeSession, setActiveSession] = useState<Session | "all">("all");
  const [minConfluence, setMinConfluence] = useState(0);
  const [activeStrategies, setActiveStrategies] = useState<StrategyId[]>([]);

  const toggleStrategy = (id: StrategyId) => {
    setActiveStrategies((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const filteredSignals = useMemo(() => {
    return mockSignals.filter((signal) => {
      const sessionMatch = activeSession === "all" || signal.session === activeSession;
      const confluenceMatch = signal.confluence >= minConfluence;
      const strategyMatch =
        activeStrategies.length === 0 ||
        activeStrategies.some((s) => signal.strategies.includes(s));
      return sessionMatch && confluenceMatch && strategyMatch;
    });
  }, [activeSession, minConfluence, activeStrategies]);

  return (
    <section id="feed" className="bg-bg px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs tracking-widest text-accent">LIVE FEED</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
              Top setups right now
            </h2>
          </div>
          <p className="font-mono text-xs text-text-faint">
            {filteredSignals.length} of {mockSignals.length} signals matching filters
          </p>
        </div>

        {/* Session tabs */}
        <div className="relative mb-6 flex flex-wrap gap-1 rounded-lg border border-border bg-panel p-1">
          {sessionTabs.map((tab) => {
            const isActive = activeSession === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSession(tab.id)}
                className="relative rounded-md px-4 py-2 font-body text-sm font-medium transition-colors"
                style={{ color: isActive ? "var(--color-bg)" : "var(--color-text-muted)" }}
              >
                {isActive && (
                  <motion.span
                    layoutId="session-pill"
                    className="absolute inset-0 rounded-md bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Confluence + strategy filters */}
        <div className="mb-10 grid grid-cols-1 gap-6 rounded-lg border border-border bg-panel p-5 md:grid-cols-[240px_1fr]">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="confluence" className="font-body text-sm text-text-muted">
                Min. confluence
              </label>
              <span className="font-mono text-sm text-accent">{minConfluence}%</span>
            </div>
            <input
              id="confluence"
              type="range"
              min={0}
              max={95}
              step={5}
              value={minConfluence}
              onChange={(e) => setMinConfluence(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--color-accent)]"
            />
          </div>

          <div>
            <p className="mb-3 font-body text-sm text-text-muted">Strategy</p>
            <div className="flex flex-wrap gap-2">
              {strategies.map((s) => {
                const isActive = activeStrategies.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleStrategy(s.id)}
                    className="rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
                    style={{
                      borderColor: isActive ? "var(--color-accent)" : "var(--color-border)",
                      color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                      backgroundColor: isActive ? "var(--color-accent-dim)1a" : "transparent",
                    }}
                  >
                    {s.short}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results grid */}
        {filteredSignals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSignals.map((signal, i) => (
              <SignalCard key={signal.id} signal={signal} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-16 text-center">
            <p className="font-body text-sm text-text-muted">
              No setups match these filters right now.
            </p>
            <p className="mt-1 font-mono text-xs text-text-faint">
              Try lowering the minimum confluence or clearing a strategy filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

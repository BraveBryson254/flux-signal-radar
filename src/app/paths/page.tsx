"use client";

import * as Icons from "lucide-react";
import { AlertTriangle, Clock, Lock } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess, tierById } from "@/lib/tiers";
import { marketPaths } from "@/lib/articleData";

function Icon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.LineChart) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function PathsPage() {
  const { user } = useAuth();
  const userTier = user?.tier ?? "free";

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">KNOWLEDGE</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Market learning paths
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Every market behaves differently. These paths cover the character,
            volatility, best sessions, and common mistakes for each.
          </p>
        </Reveal>

        <Stagger className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {marketPaths.map((path) => {
            const unlocked = hasAccess(userTier, path.minTier);
            return (
              <StaggerItem key={path.id} variants={fadeUp}>
                <div className="flex h-full flex-col rounded-xl border border-border bg-panel p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-panel-raised">
                        <Icon name={path.icon} size={18} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold text-text">{path.market}</h3>
                        <p className="font-mono text-[10px] text-text-faint">{path.symbol}</p>
                      </div>
                    </div>
                    {!unlocked && (
                      <Link href="/pricing" className="flex items-center gap-1 font-mono text-[10px] text-text-faint">
                        <Lock size={10} /> {tierById(path.minTier).name}
                      </Link>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <PathRow label="Character" value={path.characteristics} />
                    <PathRow label="Volatility" value={path.volatility} />
                    <PathRow label="Best sessions" value={path.bestSessions} icon={<Clock size={11} />} />
                    <div className="rounded-lg bg-panel-raised p-3">
                      <p className="mb-1 flex items-center gap-1 font-mono text-[10px] tracking-widest text-bear">
                        <AlertTriangle size={11} /> COMMON MISTAKE
                      </p>
                      <p className="font-body text-sm text-text-muted">{path.commonMistake}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
      <Footer />
    </main>
  );
}

function PathRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-1 font-mono text-[10px] tracking-widest text-text-faint">
        {icon} {label.toUpperCase()}
      </p>
      <p className="mt-0.5 font-body text-sm text-text-muted">{value}</p>
    </div>
  );
}

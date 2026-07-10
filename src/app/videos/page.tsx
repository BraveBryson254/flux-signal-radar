"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Lock, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/motion/Motion";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess, tierById } from "@/lib/tiers";
import { videos } from "@/lib/educationData";

export default function VideosPage() {
  const { user } = useAuth();
  const userTier = user?.tier ?? "free";
  const [activeId, setActiveId] = useState(videos[0].id);
  const active = videos.find((v) => v.id === activeId)!;
  const activeUnlocked = hasAccess(userTier, active.minTier);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">EDUCATION</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Video Center
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Guided lessons and live breakdowns. Resume where you left off,
            take notes, and follow structured playlists.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Player */}
          <div>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-border"
              style={{
                background: "linear-gradient(150deg, var(--color-panel-raised), var(--color-panel))",
              }}
            >
              {activeUnlocked ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                    <Play size={26} className="ml-1 text-bg" fill="currentColor" />
                  </div>
                  <p className="font-mono text-xs text-text-faint">
                    Embedded player — YouTube source wired via admin
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Lock size={26} className="text-text-faint" />
                  <p className="font-mono text-xs text-text-faint">
                    Unlock with {tierById(active.minTier).name}
                  </p>
                </div>
              )}
            </motion.div>

            <h2 className="mt-4 font-display text-lg font-semibold text-text">{active.title}</h2>
            <p className="mt-1 font-mono text-xs text-text-faint">
              {active.channel} · {active.duration}
            </p>

            {/* Notes placeholder */}
            <div className="mt-4 rounded-lg border border-border bg-panel p-4">
              <p className="mb-2 font-mono text-[10px] tracking-widest text-text-faint">YOUR NOTES</p>
              <textarea
                placeholder="Jot down key takeaways as you watch..."
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-panel-raised px-3 py-2 font-body text-sm text-text outline-none transition-colors focus:border-accent"
              />
            </div>
          </div>

          {/* Playlist */}
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">PLAYLIST</p>
            <div className="space-y-2">
              {videos.map((video) => {
                const unlocked = hasAccess(userTier, video.minTier);
                const isActive = video.id === activeId;
                return (
                  <motion.button
                    key={video.id}
                    whileHover={{ x: 3 }}
                    onClick={() => setActiveId(video.id)}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors"
                    style={{
                      borderColor: isActive ? "var(--color-accent)" : "var(--color-border)",
                      background: isActive ? "rgba(157,78,221,0.08)" : "var(--color-panel)",
                    }}
                  >
                    <div className="relative flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-panel-raised">
                      {unlocked ? (
                        video.progress === 100 ? (
                          <Check size={16} className="text-bull" />
                        ) : (
                          <Play size={14} className="text-text-muted" />
                        )
                      ) : (
                        <Lock size={14} className="text-text-faint" />
                      )}
                      {video.progress > 0 && video.progress < 100 && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-bg/40">
                          <div className="h-full bg-accent" style={{ width: `${video.progress}%` }} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm text-text">{video.title}</p>
                      <p className="font-mono text-[10px] text-text-faint">{video.duration}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

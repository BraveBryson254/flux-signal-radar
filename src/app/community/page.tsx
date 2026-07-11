"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Heart, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import {
  communityRooms,
  communityFeed,
  communityMilestones,
  topLearners,
} from "@/lib/socialData";

function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Hash) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function CommunityPage() {
  const [activeRoom, setActiveRoom] = useState(communityRooms[0].id);
  const [liked, setLiked] = useState<string[]>([]);

  const toggleLike = (id: string) =>
    setLiked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">SOCIAL</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Community
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Trade ideas, ask questions, and grow alongside traders across Kenya,
            East Africa, and beyond.
          </p>
        </Reveal>

        {/* Milestones */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {communityMilestones.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border bg-panel p-4 text-center sm:text-left"
            >
              <p className="font-display text-xl font-semibold text-text">
                <CountUp value={m.value} suffix="+" />
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-wide text-text-faint">{m.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr_1fr]">
          {/* Rooms */}
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">ROOMS</p>
            <div className="space-y-2">
              {communityRooms.map((room) => {
                const isActive = room.id === activeRoom;
                return (
                  <motion.button
                    key={room.id}
                    whileHover={{ x: 3 }}
                    onClick={() => setActiveRoom(room.id)}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors"
                    style={{
                      borderColor: isActive ? "var(--color-accent)" : "var(--color-border)",
                      background: isActive ? "rgba(157,78,221,0.08)" : "var(--color-panel)",
                    }}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel-raised">
                      <Icon name={room.icon} size={15} className="text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm text-text">{room.name}</p>
                      <p className="truncate font-mono text-[10px] text-text-faint">
                        {room.online} online · {room.members}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Feed */}
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">DISCUSSION</p>
            <Stagger className="space-y-3">
              {communityFeed.map((msg) => {
                const isLiked = liked.includes(msg.id);
                const likeCount = msg.likes + (isLiked ? 1 : 0);
                return (
                  <StaggerItem key={msg.id} variants={fadeUp}>
                    <motion.div {...hoverLift} className="rounded-xl border border-border bg-panel p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-panel-raised font-mono text-[10px] text-accent">
                          {msg.author.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-body text-sm text-text">{msg.author}</span>
                        <span className="font-mono text-[10px] text-text-faint">{msg.time}</span>
                      </div>
                      <p className="mt-3 font-display text-sm font-semibold text-text">{msg.title}</p>
                      <p className="mt-1 font-body text-sm text-text-muted">{msg.body}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <button
                          onClick={() => toggleLike(msg.id)}
                          className="flex items-center gap-1.5 font-mono text-xs transition-colors"
                          style={{ color: isLiked ? "var(--color-bear)" : "var(--color-text-faint)" }}
                        >
                          <motion.span animate={{ scale: isLiked ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}>
                            <Heart size={13} fill={isLiked ? "var(--color-bear)" : "none"} />
                          </motion.span>
                          {likeCount}
                        </button>
                        <span className="flex items-center gap-1.5 font-mono text-xs text-text-faint">
                          <MessageCircle size={13} />
                          {msg.replies}
                        </span>
                      </div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </Stagger>

            {/* Composer placeholder */}
            <div className="mt-4 rounded-xl border border-border bg-panel p-3">
              <input
                placeholder="Share an idea with the room..."
                className="w-full rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-body text-sm text-text outline-none transition-colors focus:border-accent"
              />
            </div>
          </div>

          {/* Top learners */}
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">TOP LEARNERS</p>
            <div className="space-y-3">
              {topLearners.map((l, i) => (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-border bg-panel p-4"
                >
                  <p className="font-body text-sm text-text">{l.name}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-accent">{l.detail}</p>
                  <p className="mt-1 font-mono text-[10px] text-text-faint">{l.region}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

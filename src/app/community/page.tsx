"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Heart, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import { communityRooms } from "@/lib/socialData";
import { useAuth } from "@/lib/mockAuth";
import {
  fetchPosts,
  createPost,
  toggleLike,
  fetchCommunityStats,
  fetchTopLearners,
  CommunityPost,
  CommunityStats,
  TopLearnerRow,
} from "@/lib/communityService";

function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Hash) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState(communityRooms[0].id);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [stats, setStats] = useState<CommunityStats>({ memberCount: 0, messagesThisWeek: 0 });
  const [topLearners, setTopLearners] = useState<TopLearnerRow[]>([]);

  useEffect(() => {
    fetchCommunityStats().then(setStats);
    fetchTopLearners().then(setTopLearners);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPostsLoading(true);
    fetchPosts(activeRoom, user?.id).then((data) => {
      setPosts(data);
      setPostsLoading(false);
    });
  }, [activeRoom, user]);

  const handleLike = (post: CommunityPost) => {
    if (!user) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likeCount + (p.likedByMe ? -1 : 1) }
          : p
      )
    );
    toggleLike(post.id, user.id, post.likedByMe);
  };

  const handlePost = async () => {
    if (!user || !draft.trim()) return;
    setPosting(true);
    await createPost(user.id, user.name, activeRoom, draft.trim());
    setDraft("");
    const fresh = await fetchPosts(activeRoom, user.id);
    setPosts(fresh);
    setPosting(false);
  };

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
            Trade ideas, ask questions, and grow alongside other traders on the platform.
          </p>
        </Reveal>

        {/* Milestones — real counts */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-panel p-4 text-center sm:text-left"
          >
            <p className="font-display text-xl font-semibold text-text">
              <CountUp value={stats.memberCount} suffix="+" />
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-wide text-text-faint">Community members</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="rounded-xl border border-border bg-panel p-4 text-center sm:text-left"
          >
            <p className="font-display text-xl font-semibold text-text">
              <CountUp value={stats.messagesThisWeek} />
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-wide text-text-faint">Messages this week</p>
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr_1fr]">
          {/* Rooms — platform-defined structure, real presence is future scope */}
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
                      <p className="truncate font-mono text-[10px] text-text-faint">{room.topic}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Feed — real posts and likes */}
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">DISCUSSION</p>
            {postsLoading ? (
              <p className="font-mono text-xs text-text-faint">Loading...</p>
            ) : posts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-10 text-center">
                <p className="font-body text-sm text-text-muted">No posts in this room yet — start the conversation.</p>
              </div>
            ) : (
              <Stagger className="space-y-3">
                {posts.map((msg) => (
                  <StaggerItem key={msg.id} variants={fadeUp}>
                    <motion.div {...hoverLift} className="rounded-xl border border-border bg-panel p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-panel-raised font-mono text-[10px] text-accent">
                          {msg.author.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-body text-sm text-text">{msg.author}</span>
                        <span className="font-mono text-[10px] text-text-faint">{msg.createdAt}</span>
                      </div>
                      <p className="mt-3 font-body text-sm text-text-muted">{msg.body}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <button
                          onClick={() => handleLike(msg)}
                          disabled={!user}
                          className="flex items-center gap-1.5 font-mono text-xs transition-colors"
                          style={{ color: msg.likedByMe ? "var(--color-bear)" : "var(--color-text-faint)" }}
                        >
                          <motion.span animate={{ scale: msg.likedByMe ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}>
                            <Heart size={13} fill={msg.likedByMe ? "var(--color-bear)" : "none"} />
                          </motion.span>
                          {msg.likeCount}
                        </button>
                        <span className="flex items-center gap-1.5 font-mono text-xs text-text-faint">
                          <MessageCircle size={13} />
                          0
                        </span>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}

            {/* Real composer */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-panel p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePost()}
                placeholder={user ? "Share an idea with the room..." : "Log in to post"}
                disabled={!user || posting}
                className="w-full rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-body text-sm text-text outline-none transition-colors focus:border-accent disabled:opacity-60"
              />
              <button
                onClick={handlePost}
                disabled={!user || posting || !draft.trim()}
                className="shrink-0 rounded-lg bg-accent px-4 py-2.5 font-body text-sm font-semibold text-bg disabled:opacity-50"
              >
                {posting ? "..." : "Post"}
              </button>
            </div>
          </div>

          {/* Top learners — real, from academy_progress counts */}
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">TOP LEARNERS</p>
            {topLearners.length === 0 ? (
              <p className="font-body text-sm text-text-muted">No completions yet.</p>
            ) : (
              <div className="space-y-3">
                {topLearners.map((l, i) => (
                  <motion.div
                    key={l.userId}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-border bg-panel p-4"
                  >
                    <p className="font-body text-sm text-text">{l.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-accent">{l.itemsCompleted} items completed</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

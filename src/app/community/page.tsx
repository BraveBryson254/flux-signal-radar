"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { ChevronUp, ChevronDown, MessageCircle } from "lucide-react";
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
  castVote,
  fetchComments,
  createComment,
  fetchCommunityStats,
  fetchTopLearners,
  CommunityPost,
  CommunityComment,
  CommunityStats,
  TopLearnerRow,
  SortMode,
} from "@/lib/communityService";

function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Hash) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "hot", label: "Hot" },
  { id: "new", label: "New" },
  { id: "top", label: "Top" },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState(communityRooms[0].id);
  const [sort, setSort] = useState<SortMode>("hot");
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
    fetchPosts(activeRoom, user?.id, sort).then((data) => {
      setPosts(data);
      setPostsLoading(false);
    });
  }, [activeRoom, user, sort]);

  const handleVote = (post: CommunityPost, value: 1 | -1) => {
    if (!user) return;
    const removing = post.myVote === value;
    const delta = removing ? -value : post.myVote === 0 ? value : value * 2;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, score: p.score + delta, myVote: removing ? 0 : value } : p
      )
    );
    castVote(post.id, user.id, value, post.myVote);
  };

  const handlePost = async () => {
    if (!user || !draft.trim()) return;
    setPosting(true);
    await createPost(user.id, user.name, activeRoom, draft.trim());
    setDraft("");
    const fresh = await fetchPosts(activeRoom, user.id, sort);
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

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-widest text-text-faint">DISCUSSION</p>
              <div className="flex gap-1">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSort(s.id)}
                    className="rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors"
                    style={{
                      borderColor: sort === s.id ? "var(--color-accent)" : "var(--color-border)",
                      color: sort === s.id ? "var(--color-accent)" : "var(--color-text-muted)",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {postsLoading ? (
              <p className="font-mono text-xs text-text-faint">Loading...</p>
            ) : posts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-10 text-center">
                <p className="font-body text-sm text-text-muted">No posts in this room yet — start the conversation.</p>
              </div>
            ) : (
              <Stagger className="space-y-3">
                {posts.map((post) => (
                  <StaggerItem key={post.id} variants={fadeUp}>
                    <PostCard post={post} onVote={handleVote} loggedIn={!!user} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}

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

function PostCard({
  post,
  onVote,
  loggedIn,
}: {
  post: CommunityPost;
  onVote: (post: CommunityPost, value: 1 | -1) => void;
  loggedIn: boolean;
}) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  const toggleComments = async () => {
    setShowComments((v) => !v);
    if (!commentsLoaded) {
      const data = await fetchComments(post.id);
      setComments(data);
      setCommentsLoaded(true);
    }
  };

  const handleComment = async () => {
    if (!user || !draft.trim()) return;
    setPosting(true);
    await createComment(post.id, user.id, user.name, draft.trim());
    setDraft("");
    const fresh = await fetchComments(post.id);
    setComments(fresh);
    setPosting(false);
  };

  return (
    <motion.div {...hoverLift} className="flex gap-3 rounded-xl border border-border bg-panel p-4">
      {/* Vote column */}
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <button
          onClick={() => onVote(post, 1)}
          disabled={!loggedIn}
          aria-label="Upvote"
          className="rounded p-0.5 transition-colors disabled:opacity-40"
          style={{ color: post.myVote === 1 ? "var(--color-bull)" : "var(--color-text-faint)" }}
        >
          <ChevronUp size={18} />
        </button>
        <span className="font-mono text-xs font-semibold text-text">{post.score}</span>
        <button
          onClick={() => onVote(post, -1)}
          disabled={!loggedIn}
          aria-label="Downvote"
          className="rounded p-0.5 transition-colors disabled:opacity-40"
          style={{ color: post.myVote === -1 ? "var(--color-bear)" : "var(--color-text-faint)" }}
        >
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-panel-raised font-mono text-[9px] text-accent">
            {post.author.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-body text-sm text-text">{post.author}</span>
          <span className="font-mono text-[10px] text-text-faint">{post.createdAt}</span>
        </div>
        <p className="mt-2 font-body text-sm text-text-muted">{post.body}</p>
        <button
          onClick={toggleComments}
          className="mt-3 flex items-center gap-1.5 font-mono text-xs text-text-faint transition-colors hover:text-accent"
        >
          <MessageCircle size={13} />
          {post.commentCount} comment{post.commentCount === 1 ? "" : "s"}
        </button>

        <AnimatePresence initial={false}>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3 border-t border-border pt-3">
                {comments.length === 0 ? (
                  <p className="font-mono text-[11px] text-text-faint">No comments yet.</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-panel-raised font-mono text-[8px] text-accent">
                        {c.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-mono text-[10px] text-text-faint">
                          {c.author} · {c.createdAt}
                        </p>
                        <p className="font-body text-sm text-text-muted">{c.body}</p>
                      </div>
                    </div>
                  ))
                )}
                {user && (
                  <div className="flex gap-2">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleComment()}
                      placeholder="Add a comment..."
                      disabled={posting}
                      className="w-full rounded-lg border border-border bg-panel-raised px-3 py-1.5 font-body text-xs text-text outline-none transition-colors focus:border-accent"
                    />
                    <button
                      onClick={handleComment}
                      disabled={posting || !draft.trim()}
                      className="shrink-0 rounded-lg bg-accent px-3 py-1.5 font-mono text-[10px] font-semibold text-bg disabled:opacity-50"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

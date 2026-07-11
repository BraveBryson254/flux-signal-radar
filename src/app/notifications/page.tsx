"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Search, Settings, Check } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/motion/Motion";
import { useAuth } from "@/lib/mockAuth";
import {
  notifications as seed,
  notificationCategories,
  NotificationType,
} from "@/lib/notificationData";

function Icon({ name, size = 15, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Bell) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function NotificationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">LOADING...</p>
      </main>
    );
  }

  const filtered = items.filter((n) => {
    const catMatch = filter === "all" || n.type === filter;
    const q = query.toLowerCase();
    const queryMatch = !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
    return catMatch && queryMatch;
  });

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <Reveal>
            <h1 className="font-display text-2xl font-semibold text-text">Notifications</h1>
          </Reveal>
          <div className="flex items-center gap-2">
            <button onClick={markAllRead} className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-text-muted transition-colors hover:text-text">
              Mark all read
            </button>
            <Link href="/notifications/settings" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:text-text">
              <Settings size={15} />
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full rounded-lg border border-border bg-panel-raised py-2.5 pl-9 pr-3 font-body text-sm text-text outline-none transition-colors focus:border-accent"
          />
        </div>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {notificationCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className="rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
              style={{
                borderColor: filter === c.id ? "var(--color-accent)" : "var(--color-border)",
                color: filter === c.id ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.2) }}
                className="flex gap-3 rounded-xl border border-border p-4"
                style={{ background: n.read ? "var(--color-panel)" : "rgba(157,78,221,0.05)" }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel-raised">
                  <Icon name={n.icon} size={15} className="text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-medium text-text">{n.title}</p>
                  <p className="font-body text-sm text-text-muted">{n.body}</p>
                  <p className="mt-1 font-mono text-[10px] text-text-faint">{n.time}</p>
                </div>
                <button
                  onClick={() => toggleRead(n.id)}
                  aria-label={n.read ? "Mark unread" : "Mark read"}
                  className="shrink-0 self-start rounded-md p-1 text-text-faint transition-colors hover:text-accent"
                >
                  {n.read ? <span className="block h-1.5 w-1.5 rounded-full border border-text-faint" /> : <Check size={14} />}
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="font-body text-sm text-text-muted">No notifications match your filters.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

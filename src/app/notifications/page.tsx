"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Search, Settings, Check, Pin, Archive, Trash2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/motion/Motion";
import { useAuth } from "@/lib/mockAuth";
import {
  notificationCategories,
  lifecycleStageLabels,
  NotificationType,
  AppNotification,
} from "@/lib/notificationData";
import { fetchNotifications, updateNotification, deleteNotification, markAllRead as markAllReadService } from "@/lib/notificationService";

function Icon({ name, size = 15, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Bell) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

type ViewNotification = AppNotification | { kind: "lifecycle"; tradeId: string; items: AppNotification[] };

export default function NotificationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [openTrade, setOpenTrade] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItemsLoading(true);
    fetchNotifications(user.id).then((data) => {
      setItems(data);
      setItemsLoading(false);
    });
  }, [user]);

  // Group signal-lifecycle events sharing a tradeId into one journey card;
  // everything else stays as an individual item. Computed unconditionally
  // (before any early return) to satisfy the rules of hooks.
  const grouped: ViewNotification[] = useMemo(() => {
    const byTrade = new Map<string, AppNotification[]>();
    const singles: AppNotification[] = [];
    for (const n of items) {
      if (n.tradeId) {
        const arr = byTrade.get(n.tradeId) ?? [];
        arr.push(n);
        byTrade.set(n.tradeId, arr);
      } else {
        singles.push(n);
      }
    }
    const lifecycleGroups: ViewNotification[] = Array.from(byTrade.entries()).map(([tradeId, evts]) => ({
      kind: "lifecycle" as const,
      tradeId,
      items: evts,
    }));
    return [...singles, ...lifecycleGroups];
  }, [items]);

  if (isLoading || !user || itemsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">LOADING...</p>
      </main>
    );
  }

  const markAllRead = () => {
    if (!user) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllReadService(user.id);
  };
  const toggleRead = (id: string) => {
    const next = !items.find((n) => n.id === id)?.read;
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: next } : n)));
    updateNotification(id, { read: next });
  };
  const togglePin = (id: string) => {
    const next = !items.find((n) => n.id === id)?.pinned;
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: next } : n)));
    updateNotification(id, { pinned: next });
  };
  const toggleArchive = (id: string) => {
    const next = !items.find((n) => n.id === id)?.archived;
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, archived: next } : n)));
    updateNotification(id, { archived: next });
  };
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    deleteNotification(id);
  };

  const isGroup = (v: ViewNotification): v is { kind: "lifecycle"; tradeId: string; items: AppNotification[] } =>
    "kind" in v;

  const filtered = grouped.filter((v) => {
    const archived = isGroup(v) ? v.items.some((i) => i.archived) : !!v.archived;
    if (showArchived !== archived) return false;
    const type: NotificationType = isGroup(v) ? "signal" : v.type;
    const catMatch = filter === "all" || type === filter;
    const q = query.toLowerCase();
    const text = isGroup(v)
      ? v.items.map((i) => `${i.title} ${i.body}`).join(" ")
      : `${v.title} ${v.body}`;
    const queryMatch = !q || text.toLowerCase().includes(q);
    return catMatch && queryMatch;
  });

  // Pinned singles float to the top.
  const sorted = [...filtered].sort((a, b) => {
    const aPinned = !isGroup(a) && !!a.pinned ? 1 : 0;
    const bPinned = !isGroup(b) && !!b.pinned ? 1 : 0;
    return bPinned - aPinned;
  });

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

        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full rounded-lg border border-border bg-panel-raised py-2.5 pl-9 pr-3 font-body text-sm text-text outline-none transition-colors focus:border-accent"
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
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
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
            style={{
              borderColor: showArchived ? "var(--color-accent)" : "var(--color-border)",
              color: showArchived ? "var(--color-accent)" : "var(--color-text-muted)",
            }}
          >
            <Archive size={11} /> {showArchived ? "Archived" : "Inbox"}
          </button>
        </div>

        {sorted.length > 0 ? (
          <div className="space-y-2">
            {sorted.map((v, i) =>
              isGroup(v) ? (
                <LifecycleCard
                  key={v.tradeId}
                  tradeId={v.tradeId}
                  events={v.items}
                  open={openTrade === v.tradeId}
                  onToggle={() => setOpenTrade(openTrade === v.tradeId ? null : v.tradeId)}
                  index={i}
                />
              ) : (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  className="flex gap-3 rounded-xl border p-4"
                  style={{
                    background: v.read ? "var(--color-panel)" : "rgba(157,78,221,0.05)",
                    borderColor: v.pinned ? "var(--color-accent)" : "var(--color-border)",
                  }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel-raised">
                    <Icon name={v.icon} size={15} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-body text-sm font-medium text-text">{v.title}</p>
                      {v.priority === "high" && (
                        <span className="rounded-full bg-bear/15 px-1.5 py-0.5 font-mono text-[9px] text-bear">PRIORITY</span>
                      )}
                      {v.pinned && <Pin size={11} className="text-accent" />}
                    </div>
                    <p className="font-body text-sm text-text-muted">{v.body}</p>
                    <p className="mt-1 font-mono text-[10px] text-text-faint">{v.time}</p>
                  </div>
                  <div className="flex shrink-0 items-start gap-1">
                    <button onClick={() => togglePin(v.id)} aria-label="Pin" className="rounded-md p-1 text-text-faint transition-colors hover:text-accent">
                      <Pin size={13} fill={v.pinned ? "var(--color-accent)" : "none"} />
                    </button>
                    <button onClick={() => toggleRead(v.id)} aria-label={v.read ? "Mark unread" : "Mark read"} className="rounded-md p-1 text-text-faint transition-colors hover:text-accent">
                      {v.read ? <span className="block h-1.5 w-1.5 rounded-full border border-text-faint" /> : <Check size={13} />}
                    </button>
                    <button onClick={() => toggleArchive(v.id)} aria-label="Archive" className="rounded-md p-1 text-text-faint transition-colors hover:text-accent">
                      <Archive size={13} />
                    </button>
                    <button onClick={() => removeItem(v.id)} aria-label="Delete" className="rounded-md p-1 text-text-faint transition-colors hover:text-bear">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="font-body text-sm text-text-muted">
              {showArchived ? "No archived notifications." : "No notifications match your filters."}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

const stageOrder: (keyof typeof lifecycleStageLabels)[] = [
  "published",
  "entry",
  "activated",
  "tp1",
  "breakeven",
  "tp2",
  "closed",
];

function LifecycleCard({
  tradeId,
  events,
  open,
  onToggle,
  index,
}: {
  tradeId: string;
  events: AppNotification[];
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const sortedEvents = [...events].sort(
    (a, b) => stageOrder.indexOf(a.stage ?? "published") - stageOrder.indexOf(b.stage ?? "published")
  );
  const latest = sortedEvents[sortedEvents.length - 1];
  const [instrument] = tradeId.split("-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.2) }}
      className="overflow-hidden rounded-xl border border-border bg-panel"
    >
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-panel-raised">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel-raised">
          <Icon name="Radar" size={15} className="text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-body text-sm font-medium text-text">
            {instrument.toUpperCase()} trade journey · {sortedEvents.length} events
          </p>
          <p className="font-body text-sm text-text-muted">Latest: {latest.title}</p>
        </div>
        <span className="font-mono text-[10px] text-text-faint">{latest.time}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="space-y-4 p-4">
              {sortedEvents.map((e, i) => (
                <div key={e.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                      <Icon name={e.icon} size={12} className="text-bg" />
                    </div>
                    {i < sortedEvents.length - 1 && <div className="mt-1 h-full w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-mono text-[10px] text-accent">{lifecycleStageLabels[e.stage ?? "published"]}</p>
                    <p className="font-body text-sm text-text">{e.body}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-text-faint">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

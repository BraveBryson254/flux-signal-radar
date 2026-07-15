"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Bell } from "lucide-react";
import { useAuth } from "@/lib/mockAuth";
import { fetchNotifications, markAllRead as markAllReadService } from "@/lib/notificationService";
import { supabase } from "@/lib/supabaseClient";

function Icon({ name, size = 15, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.Bell) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchNotifications>>>([]);
  const unread = items.filter((n) => !n.read && !n.archived).length;

  useEffect(() => {
    if (user) fetchNotifications(user.id).then(setItems);
  }, [user]);

  // Live updates: any new notification row for this user appears
  // instantly, without needing a page refresh or re-fetch poll.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => {
          fetchNotifications(user.id).then(setItems);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAllRead = () => {
    if (!user) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllReadService(user.id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:text-text"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] font-semibold text-bg">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-panel shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="font-display text-sm font-semibold text-text">Notifications</span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="font-mono text-[10px] text-accent hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {items.filter((n) => !n.archived).slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className="flex gap-3 border-b border-border px-4 py-3 last:border-0"
                    style={{ background: n.read ? "transparent" : "rgba(157,78,221,0.05)" }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-panel-raised">
                      <Icon name={n.icon} size={14} className="text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm font-medium text-text">{n.title}</p>
                      <p className="font-body text-xs text-text-muted">{n.body}</p>
                      <p className="mt-1 font-mono text-[10px] text-text-faint">{n.time}</p>
                    </div>
                    {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                  </div>
                ))}
              </div>
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="block border-t border-border px-4 py-3 text-center font-mono text-xs text-accent hover:underline"
              >
                View all notifications
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

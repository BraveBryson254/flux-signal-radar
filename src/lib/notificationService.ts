import { supabase } from "./supabaseClient";
import { AppNotification, NotificationPreferences, defaultPreferences } from "./notificationData";

/**
 * Real per-user notifications and preferences. The `time` field shown in
 * the UI is derived on read from `created_at` rather than stored, so it
 * stays accurate without needing updates.
 *
 * Honest scope note: this provides real storage, read/update/delete, and
 * real preference persistence. It does NOT yet include automatic
 * notification generation from live events (a new signal publishing, an
 * achievement unlocking, a competition reminder) — each of those is its
 * own integration with the feature that produces the event, not
 * something to fabricate here. New accounts currently receive one real
 * welcome notification from the signup trigger.
 */

interface NotificationRow {
  id: string;
  type: AppNotification["type"];
  title: string;
  body: string;
  icon: string;
  priority: "normal" | "high" | null;
  pinned: boolean;
  archived: boolean;
  read: boolean;
  trade_id: string | null;
  stage: AppNotification["stage"] | null;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function rowToNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    time: timeAgo(row.created_at),
    read: row.read,
    icon: row.icon,
    priority: row.priority ?? undefined,
    pinned: row.pinned,
    archived: row.archived,
    tradeId: row.trade_id ?? undefined,
    stage: row.stage ?? undefined,
  };
}

export async function fetchNotifications(userId: string): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as NotificationRow[]).map(rowToNotification);
}

export async function updateNotification(
  id: string,
  patch: Partial<Pick<AppNotification, "read" | "pinned" | "archived">>
) {
  await supabase.from("notifications").update(patch).eq("id", id);
}

export async function deleteNotification(id: string) {
  await supabase.from("notifications").delete().eq("id", id);
}

export async function markAllRead(userId: string) {
  await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
}

// ---- Preferences ----------------------------------------------------------

export async function fetchPreferences(userId: string): Promise<NotificationPreferences> {
  const { data } = await supabase
    .from("notification_preferences")
    .select("preferences")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data?.preferences) return defaultPreferences;
  return { ...defaultPreferences, ...data.preferences };
}

export async function savePreferences(userId: string, prefs: NotificationPreferences) {
  await supabase
    .from("notification_preferences")
    .upsert({ user_id: userId, preferences: prefs, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
}

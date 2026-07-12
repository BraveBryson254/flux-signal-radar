/**
 * MOCK notifications. Shaped for the future Supabase notifications table
 * with support for signal/competition/achievement/community/learning
 * types. Real push/email/in-app delivery wired later.
 */

export type NotificationType =
  | "signal"
  | "competition"
  | "achievement"
  | "community"
  | "learning"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string; // lucide name
  priority?: "normal" | "high";
  pinned?: boolean;
  archived?: boolean;
  /** Groups related signal-lifecycle events into one trade journey. */
  tradeId?: string;
  /** Stage within a trade's lifecycle, used to order/label the journey. */
  stage?: "published" | "entry" | "activated" | "tp1" | "breakeven" | "tp2" | "closed";
}

export const notificationCategories: { id: NotificationType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "signal", label: "Signals" },
  { id: "competition", label: "Competitions" },
  { id: "achievement", label: "Achievements" },
  { id: "community", label: "Community" },
  { id: "learning", label: "Learning" },
  { id: "system", label: "System" },
];

export interface NotificationPreferences {
  markets: Record<string, boolean>;
  types: Record<string, boolean>;
  channels: Record<string, boolean>;
  frequency: "instant" | "hourly" | "daily" | "weekly";
  quietHours: boolean;
}

export const defaultPreferences: NotificationPreferences = {
  markets: { Gold: true, Forex: true, NAS100: false, US30: false, Crypto: false },
  types: {
    "New signals": true,
    "Take profit hit": true,
    "Trade closed": true,
    Competitions: true,
    Learning: true,
    Rewards: true,
    Community: false,
  },
  channels: { "In-app": true, "Browser push": false, Email: true },
  frequency: "instant",
  quietHours: false,
};

export const lifecycleStageLabels: Record<NonNullable<AppNotification["stage"]>, string> = {
  published: "Published",
  entry: "Entry triggered",
  activated: "Trade activated",
  tp1: "TP1 hit",
  breakeven: "Break-even",
  tp2: "TP2 hit",
  closed: "Closed",
};

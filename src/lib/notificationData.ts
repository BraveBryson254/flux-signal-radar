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

export const notifications: AppNotification[] = [
  { id: "n1", type: "signal", title: "New high-confluence signal", body: "XAUUSD long · 91% confluence just appeared.", time: "3m ago", read: false, icon: "Radar", priority: "high" },
  { id: "n2", type: "achievement", title: "Badge unlocked", body: "You earned the '3-Day Streak' badge.", time: "2h ago", read: false, icon: "Award" },
  { id: "n3", type: "competition", title: "Weekly Demo Cup", body: "Ends in 52 hours — you're currently #4.", time: "5h ago", read: false, icon: "Trophy" },
  { id: "n4", type: "community", title: "New reply", body: "AminaFX replied in the Gold Room.", time: "8h ago", read: true, icon: "MessageSquare" },
  { id: "n5", type: "learning", title: "Continue learning", body: "You're 60% through 'SMC Foundations'.", time: "1d ago", read: true, icon: "GraduationCap" },
  { id: "n6", type: "system", title: "Welcome to Flux", body: "Your 7-day trial is active. Explore everything.", time: "2d ago", read: true, icon: "Sparkles" },
  { id: "n8", type: "learning", title: "Course milestone", body: "You completed 6 of 10 SMC lessons.", time: "4d ago", read: true, icon: "GraduationCap" },

  // Signal lifecycle — one trade, multiple linked events. Grouped in the
  // UI by tradeId rather than shown as unrelated one-off alerts.
  { id: "s1", type: "signal", title: "Signal published", body: "EURUSD long · 86% confluence.", time: "3d ago", read: true, icon: "Radar", tradeId: "eurusd-0912", stage: "published" },
  { id: "s2", type: "signal", title: "Entry triggered", body: "EURUSD long filled at 1.0842.", time: "3d ago", read: true, icon: "LogIn", tradeId: "eurusd-0912", stage: "entry" },
  { id: "s3", type: "signal", title: "Take profit 1 hit", body: "EURUSD long reached TP1 (+1.4R).", time: "3d ago", read: true, icon: "Target", tradeId: "eurusd-0912", stage: "tp1", priority: "high" },
  { id: "s4", type: "signal", title: "Stop moved to break-even", body: "Risk on EURUSD long is now zero.", time: "3d ago", read: true, icon: "ShieldCheck", tradeId: "eurusd-0912", stage: "breakeven" },
  { id: "s5", type: "signal", title: "Trade closed", body: "EURUSD long closed at +2.4R total.", time: "3d ago", read: true, icon: "CheckCircle2", tradeId: "eurusd-0912", stage: "closed" },
];

export const lifecycleStageLabels: Record<NonNullable<AppNotification["stage"]>, string> = {
  published: "Published",
  entry: "Entry triggered",
  activated: "Trade activated",
  tp1: "TP1 hit",
  breakeven: "Break-even",
  tp2: "TP2 hit",
  closed: "Closed",
};

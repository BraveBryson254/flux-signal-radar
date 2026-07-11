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
  { id: "n1", type: "signal", title: "New high-confluence signal", body: "XAUUSD long · 91% confluence just appeared.", time: "3m ago", read: false, icon: "Radar" },
  { id: "n2", type: "achievement", title: "Badge unlocked", body: "You earned the '3-Day Streak' badge.", time: "2h ago", read: false, icon: "Award" },
  { id: "n3", type: "competition", title: "Weekly Demo Cup", body: "Ends in 52 hours — you're currently #4.", time: "5h ago", read: false, icon: "Trophy" },
  { id: "n4", type: "community", title: "New reply", body: "AminaFX replied in the Gold Room.", time: "8h ago", read: true, icon: "MessageSquare" },
  { id: "n5", type: "learning", title: "Continue learning", body: "You're 60% through 'SMC Foundations'.", time: "1d ago", read: true, icon: "GraduationCap" },
  { id: "n6", type: "system", title: "Welcome to Flux", body: "Your 7-day trial is active. Explore everything.", time: "2d ago", read: true, icon: "Sparkles" },
  { id: "n7", type: "signal", title: "Take profit hit", body: "EURUSD long reached TP1 (+1.4R).", time: "3d ago", read: true, icon: "Target" },
  { id: "n8", type: "learning", title: "Course milestone", body: "You completed 6 of 10 SMC lessons.", time: "4d ago", read: true, icon: "GraduationCap" },
];

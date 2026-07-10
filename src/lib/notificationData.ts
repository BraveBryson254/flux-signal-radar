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

export const notifications: AppNotification[] = [
  { id: "n1", type: "signal", title: "New high-confluence signal", body: "XAUUSD long · 91% confluence just appeared.", time: "3m ago", read: false, icon: "Radar" },
  { id: "n2", type: "achievement", title: "Badge unlocked", body: "You earned the '3-Day Streak' badge.", time: "2h ago", read: false, icon: "Award" },
  { id: "n3", type: "competition", title: "Weekly Demo Cup", body: "Ends in 52 hours — you're currently #4.", time: "5h ago", read: false, icon: "Trophy" },
  { id: "n4", type: "community", title: "New reply", body: "AminaFX replied in the Gold Room.", time: "8h ago", read: true, icon: "MessageSquare" },
  { id: "n5", type: "learning", title: "Continue learning", body: "You're 60% through 'SMC Foundations'.", time: "1d ago", read: true, icon: "GraduationCap" },
  { id: "n6", type: "system", title: "Welcome to Flux", body: "Your 7-day trial is active. Explore everything.", time: "2d ago", read: true, icon: "Sparkles" },
];

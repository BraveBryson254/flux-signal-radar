"use client";

/**
 * MOCK AUTH LAYER — replace with real Supabase Auth.
 *
 * Simulates a logged-in user so every gated page is fully clickable
 * today. To go live: swap the provider internals for Supabase Auth
 * hooks, keeping the same Tier/User shape so no consuming component
 * needs to change.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Tier = "free" | "basic" | "pro" | "elite";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  tier: Tier;
  trialEndsAt: string | null;
  // Gamification state — backend-ready, persisted in Supabase later.
  xp: number;
  level: number;
  coins: number;
  loginStreak: number;
  claimedMissionIds: string[];
}

interface AuthContextValue {
  user: MockUser | null;
  isLoading: boolean;
  login: (email: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  setTier: (tier: Tier) => void;
  claimMission: (id: string, xp: number, coins?: number) => { leveledUp: boolean; newLevel: number };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "flux-signal-radar:mock-user";

function seedUser(email: string, name: string): MockUser {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);
  return {
    id: "mock-user-1",
    email,
    name,
    tier: "basic",
    trialEndsAt: trialEnd.toISOString(),
    xp: 1240,
    level: 7,
    coins: 380,
    loginStreak: 4,
    claimedMissionIds: [],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore corrupt storage
      }
    }
    setIsLoading(false);
  }, []);

  const persist = (u: MockUser | null) => {
    setUser(u);
    if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  const login = (email: string) => persist(seedUser(email, email.split("@")[0]));
  const signup = (email: string, name: string) => persist(seedUser(email, name));
  const logout = () => persist(null);
  const setTier = (tier: Tier) => {
    if (!user) return;
    persist({ ...user, tier });
  };

  const XP_PER_LEVEL = 250;

  const claimMission = (id: string, xp: number, coins = 0) => {
    if (!user || user.claimedMissionIds.includes(id)) {
      return { leveledUp: false, newLevel: user?.level ?? 1 };
    }
    const newXp = user.xp + xp;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > user.level;
    persist({
      ...user,
      xp: newXp,
      level: newLevel,
      coins: user.coins + coins,
      claimedMissionIds: [...user.claimedMissionIds, id],
    });
    return { leveledUp, newLevel };
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, setTier, claimMission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

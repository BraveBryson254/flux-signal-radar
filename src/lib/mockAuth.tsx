"use client";

/**
 * MOCK AUTH LAYER — replace with real Clerk or Supabase Auth.
 *
 * This context simulates a logged-in user so every page (dashboard,
 * admin, tier-gated content) is fully built and clickable today.
 * To go live: swap the provider's internals for your chosen auth
 * SDK's hooks (e.g. Clerk's useUser()) and keep the same Tier/User
 * shape so no consuming component needs to change.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Tier = "free" | "basic" | "moderate" | "pro";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  tier: Tier;
  trialEndsAt: string | null; // ISO date, null if not on trial
}

interface AuthContextValue {
  user: MockUser | null;
  isLoading: boolean;
  login: (email: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  setTier: (tier: Tier) => void; // dev helper to preview each tier
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "flux-signal-radar:mock-user";

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

  const login = (email: string) => {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);
    persist({
      id: "mock-user-1",
      email,
      name: email.split("@")[0],
      tier: "basic",
      trialEndsAt: trialEnd.toISOString(),
    });
  };

  const signup = (email: string, name: string) => {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);
    persist({
      id: "mock-user-1",
      email,
      name,
      tier: "basic",
      trialEndsAt: trialEnd.toISOString(),
    });
  };

  const logout = () => persist(null);

  const setTier = (tier: Tier) => {
    if (!user) return;
    persist({ ...user, tier });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, setTier }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

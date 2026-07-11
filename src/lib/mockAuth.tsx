"use client";

/**
 * REAL AUTH LAYER — backed by Supabase Auth + a `profiles` table.
 *
 * File path and export names (`useAuth`, `AuthProvider`, `MockUser`) are
 * kept stable on purpose: 28 files import from this exact path, and
 * renaming would touch every one of them for no functional benefit.
 * Everything below this line is real now — no more localStorage mock.
 */

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export type Tier = "free" | "basic" | "pro" | "elite";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  tier: Tier;
  trialEndsAt: string | null;
  xp: number;
  level: number;
  coins: number;
  loginStreak: number;
  claimedMissionIds: string[];
}

interface ProfileRow {
  id: string;
  email: string;
  name: string;
  tier: Tier;
  xp: number;
  level: number;
  coins: number;
  login_streak: number;
  last_login_date: string;
  claimed_mission_ids: string[];
  trial_ends_at: string | null;
}

function rowToUser(row: ProfileRow): MockUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    tier: row.tier,
    trialEndsAt: row.trial_ends_at,
    xp: row.xp,
    level: row.level,
    coins: row.coins,
    loginStreak: row.login_streak,
    claimedMissionIds: row.claimed_mission_ids ?? [],
  };
}

interface AuthContextValue {
  user: MockUser | null;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  setTier: (tier: Tier) => Promise<void>;
  claimMission: (id: string, xp: number, coins?: number) => Promise<{ leveledUp: boolean; newLevel: number }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const XP_PER_LEVEL = 250;

// Increments the daily login streak once per calendar day, based on the
// previously stored last_login_date — resets to 1 if a day was missed.
function computeStreakUpdate(lastLoginDate: string, currentStreak: number) {
  const today = new Date().toISOString().slice(0, 10);
  if (lastLoginDate === today) return { login_streak: currentStreak, last_login_date: today };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = lastLoginDate === yesterday.toISOString().slice(0, 10);
  return {
    login_streak: wasYesterday ? currentStreak + 1 : 1,
    last_login_date: today,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error || !data) {
      setUser(null);
      return;
    }
    const row = data as ProfileRow;
    const streakUpdate = computeStreakUpdate(row.last_login_date, row.login_streak);
    if (streakUpdate.last_login_date !== row.last_login_date) {
      await supabase.from("profiles").update(streakUpdate).eq("id", userId);
      setUser(rowToUser({ ...row, ...streakUpdate }));
    } else {
      setUser(rowToUser(row));
    }
  }, []);

  const handleSession = useCallback(
    async (session: Session | null) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      await loadProfile(session.user.id);
    },
    [loadProfile]
  );

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      handleSession(data.session).finally(() => {
        if (mounted) setIsLoading(false);
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [handleSession]);

  const login = async (email: string, password: string) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    return { error: null };
  };

  const signup = async (email: string, password: string, name: string) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      setAuthError(error.message);
      return { error: error.message, needsEmailConfirmation: false };
    }
    // If email confirmation is required (default Supabase setting), no
    // session exists yet — the page should show a "check your email"
    // message rather than redirecting into a logged-out dashboard.
    const needsEmailConfirmation = !data.session;
    return { error: null, needsEmailConfirmation };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const setTier = async (tier: Tier) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ tier }).eq("id", user.id);
    if (!error) setUser({ ...user, tier });
  };

  const claimMission = async (id: string, xp: number, coins = 0) => {
    if (!user || user.claimedMissionIds.includes(id)) {
      return { leveledUp: false, newLevel: user?.level ?? 1 };
    }
    const newXp = user.xp + xp;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > user.level;
    const newClaimed = [...user.claimedMissionIds, id];

    const { error } = await supabase
      .from("profiles")
      .update({
        xp: newXp,
        level: newLevel,
        coins: user.coins + coins,
        claimed_mission_ids: newClaimed,
      })
      .eq("id", user.id);

    if (!error) {
      setUser({ ...user, xp: newXp, level: newLevel, coins: user.coins + coins, claimedMissionIds: newClaimed });
    }
    return { leveledUp, newLevel };
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, authError, login, signup, logout, setTier, claimMission }}
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

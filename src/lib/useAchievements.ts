"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./mockAuth";
import { computeAchievements } from "./achievementsService";
import { Achievement } from "./ecosystemData";

export function useAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    computeAchievements(user.id, user.loginStreak).then((data) => {
      setAchievements(data);
      setLoading(false);
    });
  }, [user]);

  return { achievements, loading };
}

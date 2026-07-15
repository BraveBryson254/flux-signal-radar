"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./mockAuth";
import { fetchJournalEntries } from "./journalService";
import { fetchAcademyProgress } from "./academyProgressService";
import { getAllBestScores } from "./arenaScoresService";
import { fetchMyCompetitionEntries } from "./competitionsService";

export interface JourneyStep {
  id: string;
  label: string;
  href: string;
  done: boolean;
}

export function useTraderJourney() {
  const { user } = useAuth();
  const [steps, setSteps] = useState<JourneyStep[]>([
    { id: "s1", label: "Complete your profile", href: "/profile", done: false },
    { id: "s2", label: "Read your first lesson", href: "/academy", done: false },
    { id: "s3", label: "Log your first trade", href: "/journal", done: false },
    { id: "s4", label: "Play a trading game", href: "/games", done: false },
    { id: "s5", label: "Join your first competition", href: "/competitions", done: false },
    { id: "s6", label: "Reach Level 10", href: "/dashboard", done: false },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetchJournalEntries(user.id),
      fetchAcademyProgress(user.id),
      getAllBestScores(user.id),
      fetchMyCompetitionEntries(user.id),
    ]).then(([journal, academy, arena, competitions]) => {
      const hasLesson = Object.values(academy.lessonsByCourse).some((arr) => arr.length > 0);
      setSteps([
        { id: "s1", label: "Complete your profile", href: "/profile", done: true },
        { id: "s2", label: "Read your first lesson", href: "/academy", done: hasLesson },
        { id: "s3", label: "Log your first trade", href: "/journal", done: journal.length > 0 },
        { id: "s4", label: "Play a trading game", href: "/games", done: Object.keys(arena).length > 0 },
        { id: "s5", label: "Join your first competition", href: "/competitions", done: competitions.length > 0 },
        { id: "s6", label: "Reach Level 10", href: "/dashboard", done: user.level >= 10 },
      ]);
      setLoading(false);
    });
  }, [user]);

  return { steps, loading };
}

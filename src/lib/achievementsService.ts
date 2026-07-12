import { fetchJournalEntries } from "./journalService";
import { fetchAcademyProgress } from "./academyProgressService";
import { getAllBestScores } from "./arenaScoresService";
import { fetchMyCompetitionEntries } from "./competitionsService";
import { courses } from "./educationData";
import { achievements as achievementDefs, Achievement } from "./ecosystemData";

/**
 * Every achievement here is computed from real, verifiable data — not
 * stored as a flag anywhere. Re-evaluated fresh each time this is called.
 */
export async function computeAchievements(userId: string, loginStreak: number): Promise<Achievement[]> {
  const [journalEntries, progress, bestScores, competitionEntries] = await Promise.all([
    fetchJournalEntries(userId),
    fetchAcademyProgress(userId),
    getAllBestScores(userId),
    fetchMyCompetitionEntries(userId),
  ]);

  const hasCompletedCourse = courses.some((c) => {
    const done = progress.lessonsByCourse[c.id]?.length ?? 0;
    return c.lessons.length > 0 && done >= c.lessons.length;
  });
  const bestR = journalEntries.length > 0 ? Math.max(...journalEntries.map((e) => e.rMultiple)) : 0;

  const conditions: Record<string, boolean> = {
    a1: Object.keys(bestScores).length > 0, // Arena Debut — played any game
    a2: loginStreak >= 3, // 3-Day Streak
    a3: journalEntries.length >= 1, // First Journal Entry
    a4: hasCompletedCourse, // Academy Graduate
    a5: competitionEntries.length >= 1, // Competitor
    a6: bestR >= 3, // Sharp Shooter — a trade at +3R or better
  };

  return achievementDefs.map((a) => ({ ...a, unlocked: conditions[a.id] ?? a.unlocked }));
}

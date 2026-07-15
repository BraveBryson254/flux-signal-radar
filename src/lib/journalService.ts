import { supabase } from "./supabaseClient";
import { JournalEntry } from "./performanceData";

/**
 * Real per-user journal persistence. Row Level Security on the
 * journal_entries table ensures every query here is already scoped to
 * the signed-in user — no user_id filtering needed beyond what RLS
 * enforces server-side, though we still pass it explicitly for clarity
 * and to satisfy the insert's NOT NULL constraint.
 */

interface JournalRow {
  id: string;
  date: string;
  instrument: string;
  direction: string;
  outcome: string;
  r_multiple: number;
  emotion: string;
  strategy: string;
  mistake: string | null;
  lesson: string | null;
  notes: string | null;
  tags: string[] | null;
  grade: string | null;
  screenshot_url: string | null;
}

function rowToEntry(row: JournalRow): JournalEntry {
  return {
    id: row.id,
    date: row.date,
    instrument: row.instrument,
    direction: row.direction as JournalEntry["direction"],
    outcome: row.outcome as JournalEntry["outcome"],
    rMultiple: row.r_multiple,
    emotion: row.emotion as JournalEntry["emotion"],
    strategy: row.strategy,
    mistake: row.mistake ?? undefined,
    lesson: row.lesson ?? undefined,
    notes: row.notes ?? undefined,
    tags: row.tags ?? undefined,
    grade: (row.grade as JournalEntry["grade"]) ?? undefined,
    screenshotUrl: row.screenshot_url ?? undefined,
  };
}

export async function fetchJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as JournalRow[]).map(rowToEntry);
}

export async function createJournalEntry(
  userId: string,
  entry: Omit<JournalEntry, "id">
): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: userId,
      date: entry.date,
      instrument: entry.instrument,
      direction: entry.direction,
      outcome: entry.outcome,
      r_multiple: entry.rMultiple,
      emotion: entry.emotion,
      strategy: entry.strategy,
      mistake: entry.mistake ?? null,
      lesson: entry.lesson ?? null,
      notes: entry.notes ?? null,
      tags: entry.tags ?? [],
      grade: entry.grade ?? null,
      screenshot_url: entry.screenshotUrl ?? null,
    })
    .select()
    .single();

  if (error || !data) return null;
  return rowToEntry(data as JournalRow);
}

export async function updateJournalEntry(
  id: string,
  patch: Partial<Omit<JournalEntry, "id">>
): Promise<boolean> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.instrument !== undefined) dbPatch.instrument = patch.instrument;
  if (patch.direction !== undefined) dbPatch.direction = patch.direction;
  if (patch.outcome !== undefined) dbPatch.outcome = patch.outcome;
  if (patch.rMultiple !== undefined) dbPatch.r_multiple = patch.rMultiple;
  if (patch.emotion !== undefined) dbPatch.emotion = patch.emotion;
  if (patch.strategy !== undefined) dbPatch.strategy = patch.strategy;
  if (patch.mistake !== undefined) dbPatch.mistake = patch.mistake;
  if (patch.lesson !== undefined) dbPatch.lesson = patch.lesson;
  if (patch.notes !== undefined) dbPatch.notes = patch.notes;
  if (patch.tags !== undefined) dbPatch.tags = patch.tags;
  if (patch.grade !== undefined) dbPatch.grade = patch.grade;
  if (patch.screenshotUrl !== undefined) dbPatch.screenshot_url = patch.screenshotUrl;

  const { error } = await supabase.from("journal_entries").update(dbPatch).eq("id", id);
  return !error;
}

export async function deleteJournalEntry(id: string): Promise<boolean> {
  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  return !error;
}

/** Uploads a trade screenshot to the user's own folder in the
 * journal-screenshots bucket and returns a public URL. */
export async function uploadScreenshot(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("journal-screenshots").upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from("journal-screenshots").getPublicUrl(path);
  return data.publicUrl;
}

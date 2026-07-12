import { supabase } from "./supabaseClient";

/**
 * Real per-user academy progress — replaces the earlier localStorage
 * version. One unified table covers lessons, books, and articles since
 * they share the same shape (a user completed/read a specific item).
 * RLS scopes every row to its owner.
 */

type ItemType = "lesson" | "book" | "article";

interface ProgressRow {
  item_type: ItemType;
  item_id: string;
  course_id: string | null;
}

export interface AcademyProgress {
  lessonsByCourse: Record<string, string[]>;
  books: string[];
  articles: string[];
}

export async function fetchAcademyProgress(userId: string): Promise<AcademyProgress> {
  const { data, error } = await supabase
    .from("academy_progress")
    .select("item_type, item_id, course_id")
    .eq("user_id", userId);

  const result: AcademyProgress = { lessonsByCourse: {}, books: [], articles: [] };
  if (error || !data) return result;

  for (const row of data as ProgressRow[]) {
    if (row.item_type === "lesson" && row.course_id) {
      result.lessonsByCourse[row.course_id] ??= [];
      result.lessonsByCourse[row.course_id].push(row.item_id);
    } else if (row.item_type === "book") {
      result.books.push(row.item_id);
    } else if (row.item_type === "article") {
      result.articles.push(row.item_id);
    }
  }
  return result;
}

async function markComplete(userId: string, itemType: ItemType, itemId: string, courseId?: string) {
  await supabase
    .from("academy_progress")
    .upsert(
      { user_id: userId, item_type: itemType, item_id: itemId, course_id: courseId ?? null },
      { onConflict: "user_id,item_type,item_id", ignoreDuplicates: true }
    );
}

export function markLessonComplete(userId: string, courseId: string, lessonId: string) {
  return markComplete(userId, "lesson", lessonId, courseId);
}

export function markBookRead(userId: string, bookId: string) {
  return markComplete(userId, "book", bookId);
}

export function markArticleRead(userId: string, articleId: string) {
  return markComplete(userId, "article", articleId);
}

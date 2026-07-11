"use client";

/**
 * localStorage-backed progress tracking so the Academy Progress dashboard
 * can aggregate completion across courses/books/articles without a
 * backend. Mirrors the pattern used by arenaScores.ts.
 */

const LESSON_KEY = "flux-academy-lessons"; // { [courseId]: string[] completed lesson ids }
const BOOK_KEY = "flux-academy-books-read"; // string[] book ids marked read
const ARTICLE_KEY = "flux-academy-articles-read"; // string[] article ids marked read

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCompletedLessons(courseId: string): string[] {
  const all = readJson<Record<string, string[]>>(LESSON_KEY, {});
  return all[courseId] ?? [];
}

export function getAllCompletedLessons(): Record<string, string[]> {
  return readJson<Record<string, string[]>>(LESSON_KEY, {});
}

export function toggleLessonComplete(courseId: string, lessonId: string): string[] {
  const all = readJson<Record<string, string[]>>(LESSON_KEY, {});
  const current = all[courseId] ?? [];
  const next = current.includes(lessonId)
    ? current.filter((id) => id !== lessonId)
    : [...current, lessonId];
  all[courseId] = next;
  writeJson(LESSON_KEY, all);
  return next;
}

export function markLessonComplete(courseId: string, lessonId: string): string[] {
  const all = readJson<Record<string, string[]>>(LESSON_KEY, {});
  const current = all[courseId] ?? [];
  if (current.includes(lessonId)) return current;
  const next = [...current, lessonId];
  all[courseId] = next;
  writeJson(LESSON_KEY, all);
  return next;
}

export function getReadBooks(): string[] {
  return readJson<string[]>(BOOK_KEY, []);
}

export function markBookRead(bookId: string) {
  const current = getReadBooks();
  if (!current.includes(bookId)) writeJson(BOOK_KEY, [...current, bookId]);
}

export function getReadArticles(): string[] {
  return readJson<string[]>(ARTICLE_KEY, []);
}

export function markArticleRead(articleId: string) {
  const current = getReadArticles();
  if (!current.includes(articleId)) writeJson(ARTICLE_KEY, [...current, articleId]);
}

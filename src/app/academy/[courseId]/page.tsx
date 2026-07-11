"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, Clock, Play, ArrowLeft, Award, ChevronDown, Target, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import XpToast, { ToastItem } from "@/components/XpToast";
import Quiz from "@/components/Quiz";
import Flashcards from "@/components/Flashcards";
import { Reveal } from "@/components/motion/Motion";
import { accordion } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess } from "@/lib/tiers";
import { courses } from "@/lib/educationData";
import { getLessonContent } from "@/lib/lessonContent";
import { getCompletedLessons, markLessonComplete } from "@/lib/academyProgress";

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { user, isLoading, claimMission } = useAuth();
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const course = courses.find((c) => c.id === courseId);
  const idCounter = useRef(0);
  const nextId = () => `id-${idCounter.current++}`;

  useEffect(() => {
    if (course) {
      const seeded = course.lessons.filter((l) => l.done).map((l) => l.id);
      const persisted = getCompletedLessons(course.id);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompleted(Array.from(new Set([...seeded, ...persisted])));
    }
  }, [course]);

  useEffect(() => {
    if (!isLoading && user && course && !hasAccess(user.tier, course.minTier)) {
      router.push("/pricing");
    }
  }, [isLoading, user, course, router]);

  if (!course) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">Course not found.</p>
      </main>
    );
  }

  const markComplete = (id: string, minutes: number) => {
    if (completed.includes(id)) return;
    setCompleted((prev) => [...prev, id]);
    markLessonComplete(course.id, id);
    const xp = Math.round(minutes * 2);
    const result = claimMission(`lesson-${id}-${nextId()}`, xp, 2);
    const tid = `${id}-${nextId()}`;
    setToasts((p) => [...p, { id: tid, xp, coins: 2, leveledUp: result.leveledUp, newLevel: result.newLevel }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== tid)), 2400);
  };

  const pct = (completed.length / course.lessons.length) * 100;
  const finished = completed.length === course.lessons.length;

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <Link href="/academy" className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text">
          <ArrowLeft size={13} /> Academy
        </Link>

        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">
            {course.category.toUpperCase()} · {course.level.toUpperCase()}
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-text md:text-3xl">{course.title}</h1>
          <p className="mt-2 font-body text-text-muted">{course.summary}</p>
        </Reveal>

        <div className="mt-6 rounded-xl border border-border bg-panel p-5">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-text-muted">{completed.length}/{course.lessons.length} lessons complete</span>
            <span className="text-accent">{Math.round(pct)}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-panel-raised">
            <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
          </div>
          {finished && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 rounded-lg border border-accent bg-panel-raised p-3">
              <Award size={16} className="text-accent" />
              <span className="font-mono text-xs text-text">Course complete — certificate unlocked!</span>
            </motion.div>
          )}
        </div>

        <div className="mt-6 space-y-2">
          {course.lessons.map((lesson, i) => {
            const done = completed.includes(lesson.id);
            const isOpen = openLesson === lesson.id;
            const content = getLessonContent(lesson.id);
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="overflow-hidden rounded-lg border border-border bg-panel"
              >
                <button
                  onClick={() => setOpenLesson(isOpen ? null : lesson.id)}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-panel-raised"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                    style={{ borderColor: done ? "var(--color-bull)" : "var(--color-border)", background: done ? "var(--color-bull)" : "transparent" }}
                  >
                    {done ? <Check size={15} className="text-bg" /> : <Play size={13} className="text-text-muted" />}
                  </div>
                  <span className="flex-1 font-body text-sm" style={{ color: done ? "var(--color-text-faint)" : "var(--color-text)" }}>
                    {lesson.title}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-text-faint">
                    <Clock size={12} />{lesson.minutes}m
                  </span>
                  {content && (
                    <ChevronDown size={16} className="text-text-faint transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && content && (
                    <motion.div variants={accordion} initial="hidden" animate="show" exit="exit" className="overflow-hidden">
                      <div className="space-y-6 border-t border-border p-5">
                        {/* Objectives */}
                        <div>
                          <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-accent">
                            <Target size={11} /> LEARNING OBJECTIVES
                          </p>
                          <ul className="space-y-1">
                            {content.objectives.map((o, k) => (
                              <li key={k} className="flex gap-2 font-body text-sm text-text-muted">
                                <span className="text-accent">·</span> {o}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Body */}
                        <div className="space-y-3">
                          {content.body.map((p, k) => (
                            <p key={k} className="font-body text-sm leading-relaxed text-text-muted">{p}</p>
                          ))}
                        </div>

                        {/* Key takeaways */}
                        <div className="rounded-lg bg-panel-raised p-4">
                          <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-bull">
                            <Lightbulb size={11} /> KEY TAKEAWAYS
                          </p>
                          <ul className="space-y-1">
                            {content.keyTakeaways.map((t, k) => (
                              <li key={k} className="flex gap-2 font-body text-sm text-text">
                                <Check size={14} className="mt-0.5 shrink-0 text-bull" /> {t}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Flashcards */}
                        <div>
                          <p className="mb-2 font-mono text-[10px] tracking-widest text-text-faint">FLASHCARDS</p>
                          <Flashcards cards={content.flashcards} />
                        </div>

                        {/* Quiz */}
                        <div>
                          <p className="mb-2 font-mono text-[10px] tracking-widest text-text-faint">MINI QUIZ</p>
                          <Quiz questions={content.quiz} />
                        </div>

                        {/* Assignment + reflection */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-lg border border-border p-4">
                            <p className="mb-1 font-mono text-[10px] tracking-widest text-accent">ASSIGNMENT</p>
                            <p className="font-body text-sm text-text-muted">{content.assignment}</p>
                          </div>
                          <div className="rounded-lg border border-border p-4">
                            <p className="mb-1 font-mono text-[10px] tracking-widest text-accent">REFLECT</p>
                            <p className="font-body text-sm text-text-muted">{content.reflection}</p>
                          </div>
                        </div>

                        {!done && (
                          <button
                            onClick={() => markComplete(lesson.id, lesson.minutes)}
                            className="w-full rounded-lg bg-accent py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.01]"
                          >
                            Mark lesson complete (+{Math.round(lesson.minutes * 2)} XP)
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* No rich content: allow quick complete inline */}
                {isOpen && !content && (
                  <div className="border-t border-border p-5">
                    <p className="font-body text-sm text-text-muted">
                      Full lesson content for this module is being written and will appear here.
                    </p>
                    {!done && (
                      <button
                        onClick={() => markComplete(lesson.id, lesson.minutes)}
                        className="mt-4 w-full rounded-lg bg-accent py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.01]"
                      >
                        Mark complete (+{Math.round(lesson.minutes * 2)} XP)
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
      <XpToast toasts={toasts} />
    </main>
  );
}

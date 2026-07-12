"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Newspaper, Flame } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/motion/Motion";
import { useAuth } from "@/lib/mockAuth";
import { courses } from "@/lib/educationData";
import { books } from "@/lib/educationData";
import { articles } from "@/lib/articleData";
import { fetchAcademyProgress } from "@/lib/academyProgressService";

export default function AcademyProgressPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [completedByCourse, setCompletedByCourse] = useState<Record<string, string[]>>({});
  const [readBooks, setReadBooks] = useState<string[]>([]);
  const [readArticles, setReadArticles] = useState<string[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgressLoading(true);
    fetchAcademyProgress(user.id).then((progress) => {
      setCompletedByCourse(progress.lessonsByCourse);
      setReadBooks(progress.books);
      setReadArticles(progress.articles);
      setProgressLoading(false);
    });
  }, [user]);

  if (isLoading || !user || progressLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">LOADING...</p>
      </main>
    );
  }

  const coursesStarted = courses.filter((c) => (completedByCourse[c.id] ?? []).length > 0);
  const coursesCompleted = courses.filter(
    (c) => (completedByCourse[c.id] ?? []).length === c.lessons.length && c.lessons.length > 0
  );
  const totalLessonsDone = Object.values(completedByCourse).reduce((s, arr) => s + arr.length, 0);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <Link href="/academy" className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text">
          <ArrowLeft size={13} /> Academy
        </Link>

        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">YOUR PROGRESS</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">Academy Progress</h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Everything you&apos;ve completed across courses, books, and articles, in one place.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={<GraduationCap size={15} />} label="Courses started" value={coursesStarted.length} />
          <StatCard icon={<GraduationCap size={15} />} label="Courses completed" value={coursesCompleted.length} />
          <StatCard icon={<BookOpen size={15} />} label="Lessons finished" value={totalLessonsDone} />
          <StatCard icon={<Flame size={15} />} label="Learning streak" value={user.loginStreak} suffix="d" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-panel p-5">
            <h3 className="mb-4 flex items-center gap-1.5 font-display text-sm font-semibold text-text">
              <GraduationCap size={15} className="text-accent" /> Course progress
            </h3>
            {coursesStarted.length === 0 ? (
              <p className="font-body text-sm text-text-muted">No courses started yet.</p>
            ) : (
              <div className="space-y-3">
                {courses.map((c) => {
                  const done = (completedByCourse[c.id] ?? []).length;
                  if (done === 0) return null;
                  const pct = (done / c.lessons.length) * 100;
                  return (
                    <div key={c.id}>
                      <div className="mb-1 flex items-center justify-between font-mono text-xs">
                        <span className="text-text">{c.title}</span>
                        <span className="text-text-faint">{done}/{c.lessons.length}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-raised">
                        <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-panel p-5">
              <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-semibold text-text">
                <BookOpen size={15} className="text-accent" /> Books read ({readBooks.length}/{books.length})
              </h3>
              <p className="font-body text-sm text-text-muted">
                {readBooks.length === 0 ? "None marked read yet." : books.filter((b) => readBooks.includes(b.id)).map((b) => b.title).join(", ")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-panel p-5">
              <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-semibold text-text">
                <Newspaper size={15} className="text-accent" /> Articles read ({readArticles.length}/{articles.length})
              </h3>
              <p className="font-body text-sm text-text-muted">
                {readArticles.length === 0 ? "None marked read yet." : articles.filter((a) => readArticles.includes(a.id)).map((a) => a.title).join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function StatCard({ icon, label, value, suffix = "" }: { icon: React.ReactNode; label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-text-faint">
        {icon} {label.toUpperCase()}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold text-text">{value}{suffix}</p>
    </div>
  );
}

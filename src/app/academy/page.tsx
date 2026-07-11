"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Lock, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess, tierById } from "@/lib/tiers";
import { courses, courseCategories } from "@/lib/educationData";
import { schools } from "@/lib/schoolsData";
import AcademySearch from "@/components/AcademySearch";
import * as Icons from "lucide-react";

function SchoolIcon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.GraduationCap) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function AcademyPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState("All");
  const userTier = user?.tier ?? "free";

  const filtered = courses.filter(
    (c) => category === "All" || c.category === category || c.level === category
  );

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        <Reveal>
          <span className="font-mono text-xs tracking-widest text-accent">EDUCATION</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Learning Academy
          </h1>
          <p className="mt-3 max-w-xl font-body text-text-muted">
            Structured paths from your first order block to institutional Wyckoff
            reads. Track progress, earn XP, and unlock certificates.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/paths"
              className="rounded-lg border border-border px-4 py-2 font-body text-sm text-text transition-colors hover:border-accent"
            >
              Market learning paths
            </Link>
            <Link
              href="/articles"
              className="rounded-lg border border-border px-4 py-2 font-body text-sm text-text transition-colors hover:border-accent"
            >
              Articles & glossary
            </Link>
            <Link
              href="/library"
              className="rounded-lg border border-border px-4 py-2 font-body text-sm text-text transition-colors hover:border-accent"
            >
              Digital library
            </Link>
            <Link
              href="/videos"
              className="rounded-lg border border-border px-4 py-2 font-body text-sm text-text transition-colors hover:border-accent"
            >
              Video center
            </Link>
            <Link
              href="/academy/reading-list"
              className="rounded-lg border border-border px-4 py-2 font-body text-sm text-text transition-colors hover:border-accent"
            >
              Recommended reading
            </Link>
            <Link
              href="/academy/research"
              className="rounded-lg border border-border px-4 py-2 font-body text-sm text-text transition-colors hover:border-accent"
            >
              Research library
            </Link>
            <Link
              href="/academy/progress"
              className="rounded-lg border border-border px-4 py-2 font-body text-sm text-text transition-colors hover:border-accent"
            >
              My progress
            </Link>
          </div>

          <div className="mt-6 max-w-lg">
            <AcademySearch />
          </div>
        </Reveal>

        {/* Schools */}
        <section className="mt-10">
          <p className="mb-3 font-mono text-[10px] tracking-widest text-text-faint">SCHOOLS</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {schools.map((school) => (
              <Link
                key={school.id}
                href={`/academy/schools/${school.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-panel p-4 transition-colors hover:border-accent"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-panel-raised">
                  <SchoolIcon name={school.icon} size={18} className="text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-body text-sm font-semibold text-text">{school.name}</p>
                  <p className="truncate font-mono text-[10px] text-text-faint">{school.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Category filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          {courseCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
              style={{
                borderColor: category === cat ? "var(--color-accent)" : "var(--color-border)",
                color: category === cat ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <Stagger className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const unlocked = hasAccess(userTier, course.minTier);
            const doneCount = course.lessons.filter((l) => l.done).length;
            const pct = (doneCount / course.lessons.length) * 100;
            const totalMin = course.lessons.reduce((s, l) => s + l.minutes, 0);
            return (
              <StaggerItem key={course.id} variants={fadeUp}>
                <motion.div {...hoverLift} className="h-full">
                  <Link
                    href={unlocked ? `/academy/${course.id}` : "/pricing"}
                    className="flex h-full flex-col rounded-xl border border-border bg-panel p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                        style={{ background: "rgba(157,78,221,0.12)", color: course.color }}
                      >
                        {course.level}
                      </span>
                      {!unlocked && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-text-faint">
                          <Lock size={11} />
                          {tierById(course.minTier).name}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-base font-semibold text-text">
                      {course.title}
                    </h3>
                    <p className="mt-1.5 flex-1 font-body text-sm text-text-muted">
                      {course.summary}
                    </p>

                    <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-text-faint">
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} />
                        {course.lessons.length} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {totalMin}m
                      </span>
                    </div>

                    {unlocked && pct > 0 && (
                      <div className="mt-3">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-raised">
                          <motion.div
                            className="h-full rounded-full bg-accent"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                          />
                        </div>
                        <p className="mt-1.5 font-mono text-[10px] text-text-faint">
                          {doneCount}/{course.lessons.length} complete
                        </p>
                      </div>
                    )}
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
      <Footer />
    </main>
  );
}

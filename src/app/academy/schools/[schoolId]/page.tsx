"use client";

import { use } from "react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { ArrowLeft, Clock, Lock, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Motion";
import { fadeUp, hoverLift } from "@/lib/motionSystem";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/mockAuth";
import { hasAccess, tierById } from "@/lib/tiers";
import { schools, coursesForSchool } from "@/lib/schoolsData";

function Icon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons[name as keyof typeof Icons] ?? Icons.GraduationCap) as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Cmp size={size} className={className} />;
}

export default function SchoolPage({ params }: { params: Promise<{ schoolId: string }> }) {
  const { schoolId } = use(params);
  const { user } = useAuth();
  const userTier = user?.tier ?? "free";
  const school = schools.find((s) => s.id === schoolId);

  if (!school) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">School not found.</p>
      </main>
    );
  }

  const schoolCourses = coursesForSchool(school);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <Link href="/academy" className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text">
          <ArrowLeft size={13} /> Academy
        </Link>

        <Reveal>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-panel-raised">
              <Icon name={school.icon} size={22} className="text-accent" />
            </div>
            <div>
              <span className="font-mono text-xs tracking-widest text-accent">SCHOOL</span>
              <h1 className="font-display text-2xl font-semibold text-text md:text-3xl">{school.name}</h1>
            </div>
          </div>
          <p className="mt-3 max-w-xl font-body text-text-muted">{school.description}</p>
        </Reveal>

        <Stagger className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {schoolCourses.map((course) => {
            const unlocked = hasAccess(userTier, course.minTier);
            const totalMin = course.lessons.reduce((s, l) => s + l.minutes, 0);
            return (
              <StaggerItem key={course.id} variants={fadeUp}>
                <motion.div {...hoverLift} className="h-full">
                  <Link
                    href={unlocked ? `/academy/${course.id}` : "/pricing"}
                    className="flex h-full flex-col rounded-xl border border-border bg-panel p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-panel-raised px-2 py-0.5 font-mono text-[10px] text-accent">
                        {course.level}
                      </span>
                      {!unlocked && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-text-faint">
                          <Lock size={11} /> {tierById(course.minTier).name}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-display text-base font-semibold text-text">{course.title}</h3>
                    <p className="mt-1.5 flex-1 font-body text-sm text-text-muted">{course.summary}</p>
                    <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-text-faint">
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} /> {course.lessons.length} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {totalMin}m
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {schoolCourses.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-border py-16 text-center">
            <p className="font-body text-sm text-text-muted">Courses for this school are being written.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

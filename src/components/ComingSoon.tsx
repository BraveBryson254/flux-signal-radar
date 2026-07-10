"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as Icons from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ComingSoon({
  icon,
  title,
  description,
  phase,
}: {
  icon: keyof typeof Icons;
  title: string;
  description: string;
  phase: string;
}) {
  const Icon = Icons[icon] as React.ComponentType<{ size?: number; className?: string }>;
  return (
    <main>
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-accent">
            <Icon size={22} className="text-accent" />
          </div>
          <span className="font-mono text-xs tracking-widest text-accent">{phase}</span>
          <h1 className="mt-3 font-display text-2xl font-semibold text-text">{title}</h1>
          <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">
            {description}
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
          >
            Back to dashboard
          </Link>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}

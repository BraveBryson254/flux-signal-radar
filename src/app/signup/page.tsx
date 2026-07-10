"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Radar, Check } from "lucide-react";
import { useAuth } from "@/lib/mockAuth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // MOCK — swap for real Clerk/Supabase sign-up call
    signup(email, name);
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-xl border border-border bg-panel p-8"
      >
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Radar size={18} className="text-accent" />
          <span className="font-display text-sm font-semibold text-text">
            FLUX SIGNAL RADAR
          </span>
        </Link>

        <h1 className="text-center font-display text-xl font-semibold text-text">
          Start your 7-day trial
        </h1>
        <p className="mt-1 text-center font-body text-sm text-text-muted">
          No card required. We&apos;ll ask you to pick a plan on day 7.
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-panel-raised px-3 py-2">
          <Check size={14} className="shrink-0 text-bull" />
          <span className="font-mono text-xs text-text-muted">
            Full Basic-tier access unlocked immediately
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block font-body text-xs text-text-muted">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Trader"
              className="w-full rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-body text-sm text-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block font-body text-xs text-text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-body text-sm text-text outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-accent px-4 py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start free trial
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

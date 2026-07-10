"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Radar } from "lucide-react";
import { useAuth } from "@/lib/mockAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // MOCK — swap for real Clerk/Supabase sign-in call
    login(email);
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
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
          Welcome back
        </h1>
        <p className="mt-1 text-center font-body text-sm text-text-muted">
          Log in to see your live feed
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
          <div>
            <label htmlFor="password" className="mb-1.5 block font-body text-xs text-text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-body text-sm text-text outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-accent px-4 py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Start your free trial
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

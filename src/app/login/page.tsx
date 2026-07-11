"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Radar, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/mockAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const { error: loginError } = await login(email, password);
    setSubmitting(false);

    if (loginError) {
      setError(loginError);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="mb-8 flex items-center gap-2">
            <Radar size={18} className="text-accent" />
            <span className="font-display text-sm font-semibold text-text">
              FLUX SIGNAL RADAR
            </span>
          </Link>

          <h1 className="font-display text-2xl font-semibold text-text">Welcome back</h1>
          <p className="mt-1 font-body text-sm text-text-muted">
            Log in to see your live feed
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
                className="w-full rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-body text-sm text-text outline-none transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block font-body text-xs text-text-muted">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-panel-raised px-3 py-2.5 pr-10 font-body text-sm text-text outline-none transition-colors focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint transition-colors hover:text-text-muted"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-mono text-xs text-bear">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 font-body text-sm text-text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Start your free trial
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Visual side — particle field shows through here, just some framing copy */}
      <div className="relative hidden items-center justify-center overflow-hidden border-l border-border lg:flex">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-sm px-10 text-center"
        >
          <p className="font-mono text-xs tracking-widest text-accent">LIVE SCAN ACTIVE</p>
          <h2 className="mt-4 font-display text-2xl font-semibold text-text">
            Six strategies. One score. Zero noise.
          </h2>
          <p className="mt-3 font-body text-sm text-text-muted">
            Trusted by traders running SMC, ICT, and Wyckoff-based systems on
            prop firm accounts.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

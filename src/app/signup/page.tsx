"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Radar, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useAuth } from "@/lib/mockAuth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const { error: signupError, needsEmailConfirmation } = await signup(email, password, name);
    setSubmitting(false);

    if (signupError) {
      setError(signupError);
      return;
    }
    if (needsEmailConfirmation) {
      setConfirmationSent(true);
      return;
    }
    router.push("/dashboard");
  };

  if (confirmationSent) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm text-center"
        >
          <Check size={32} className="mx-auto text-bull" />
          <h1 className="mt-4 font-display text-xl font-semibold text-text">Check your email</h1>
          <p className="mt-2 font-body text-sm text-text-muted">
            We sent a confirmation link to <span className="text-text">{email}</span>. Click it
            to activate your account, then come back and log in.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
          >
            Go to login
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden items-center justify-center overflow-hidden border-r border-border lg:flex">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-sm px-10 text-center"
        >
          <p className="font-mono text-xs tracking-widest text-accent">7-DAY FREE TRIAL</p>
          <h2 className="mt-4 font-display text-2xl font-semibold text-text">
            Full access, no card required.
          </h2>
          <p className="mt-3 font-body text-sm text-text-muted">
            See every setup across forex, metals, and indices before you
            decide on a plan.
          </p>
        </motion.div>
      </div>

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

          <h1 className="font-display text-2xl font-semibold text-text">
            Start your 7-day trial
          </h1>
          <p className="mt-1 font-body text-sm text-text-muted">
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
                className="w-full rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-body text-sm text-text outline-none transition-colors focus:border-accent"
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
                  placeholder="At least 6 characters"
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

            {error && <p className="font-mono text-xs text-bear">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "Creating account..." : "Start free trial"}
            </button>
          </form>

          <p className="mt-6 font-body text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

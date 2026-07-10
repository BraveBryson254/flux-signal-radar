"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // MOCK — wire to a real mailing list provider (e.g. Resend, Mailchimp) later
    setSubscribed(true);
  };

  return (
    <div>
      <p className="font-display text-sm font-semibold text-text">Stay ahead of the market</p>
      <p className="mt-1 font-body text-xs text-text-muted">
        Weekly market outlook and product updates. No spam.
      </p>
      <AnimatePresence mode="wait">
        {subscribed ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-panel-raised px-3 py-2.5"
          >
            <Check size={14} className="text-bull" />
            <span className="font-mono text-xs text-text-muted">You&apos;re on the list.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="mt-3 flex gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full min-w-0 rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-body text-sm text-text outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex shrink-0 items-center justify-center rounded-lg bg-accent px-3.5 transition-transform hover:scale-[1.05] active:scale-[0.95]"
            >
              <Send size={15} className="text-bg" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

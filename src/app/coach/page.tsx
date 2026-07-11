"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/mockAuth";
import { suggestedPrompts, mockCoachReply, CoachMessage, tradeReviewSample } from "@/lib/coachData";

export default function CoachPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: "intro",
      role: "coach",
      text: "I'm your Flux AI coach. Ask me about a setup, a concept, or paste details of a trade for review. Try one of the suggestions below to start.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const nextId = () => `msg-${idCounter.current++}`;

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-xs text-text-faint">LOADING...</p>
      </main>
    );
  }

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: CoachMessage = { id: `u-${nextId()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `c-${nextId()}`, role: "coach", text: mockCoachReply(text) },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-panel-raised">
            <Sparkles size={17} className="text-accent" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-text">Flux AI Coach</h1>
            <p className="font-mono text-[10px] text-text-faint">Standard · frontend preview</p>
          </div>
        </div>

        {/* Trade review sample card */}
        <div className="mb-6 rounded-xl border border-border bg-panel p-5">
          <p className="mb-3 font-mono text-[10px] tracking-widest text-accent">SAMPLE TRADE REVIEW</p>
          <p className="font-display text-sm font-semibold text-text">
            {tradeReviewSample.instrument} — {tradeReviewSample.verdict}
          </p>
          <div className="mt-3 space-y-2">
            {tradeReviewSample.points.map((p) => (
              <div key={p.label} className="flex items-start gap-2">
                {p.good ? (
                  <Check size={14} className="mt-0.5 shrink-0 text-bull" />
                ) : (
                  <X size={14} className="mt-0.5 shrink-0 text-bear" />
                )}
                <div>
                  <span className="font-body text-sm text-text">{p.label}</span>
                  <span className="font-body text-sm text-text-faint"> — {p.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="rounded-xl border border-border bg-panel p-5">
          <div className="max-h-[380px] space-y-4 overflow-y-auto">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-4 py-2.5 font-body text-sm"
                  style={{
                    background: m.role === "user" ? "var(--color-accent)" : "var(--color-panel-raised)",
                    color: m.role === "user" ? "var(--color-bg)" : "var(--color-text)",
                  }}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            <AnimatePresence>
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl bg-panel-raised px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-text-faint"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border border-border px-3 py-1.5 font-body text-xs text-text-muted transition-colors hover:border-accent hover:text-text"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask your coach anything..."
              className="w-full rounded-lg border border-border bg-panel-raised px-3 py-2.5 font-body text-sm text-text outline-none transition-colors focus:border-accent"
            />
            <Button onClick={() => send(input)} className="shrink-0" aria-label="Send">
              <Send size={15} />
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] text-text-faint">
          Preview responses are illustrative. The full coach connects to your journal and a live model.
        </p>
      </div>
      <Footer />
    </main>
  );
}

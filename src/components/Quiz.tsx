"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";
import { QuizQuestion } from "@/lib/lessonContent";

export default function Quiz({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      onComplete?.(score);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-border bg-panel p-6 text-center"
      >
        <p className="font-mono text-xs tracking-widest text-accent">QUIZ COMPLETE</p>
        <p className="mt-3 font-display text-3xl font-semibold text-text">
          {score}/{questions.length}
        </p>
        <p className="mt-1 font-body text-sm text-text-muted">
          {pct >= 80 ? "Excellent — concept locked in." : pct >= 50 ? "Good — review the misses." : "Worth another pass."}
        </p>
        <button
          onClick={restart}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 font-body text-sm text-text-muted transition-colors hover:text-text"
        >
          <RotateCcw size={14} /> Retry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="mb-4 flex items-center justify-between font-mono text-xs text-text-faint">
        <span>Question {current + 1} of {questions.length}</span>
        <span>Score {score}</span>
      </div>

      <p className="font-display text-base font-semibold text-text">{q.question}</p>

      <div className="mt-4 space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answerIndex;
          const isChosen = i === selected;
          let border = "var(--color-border)";
          let bg = "transparent";
          if (answered && isCorrect) {
            border = "var(--color-bull)";
            bg = "rgba(200,255,77,0.08)";
          } else if (answered && isChosen && !isCorrect) {
            border = "var(--color-bear)";
            bg = "rgba(255,92,122,0.08)";
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={answered}
              className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left font-body text-sm text-text transition-colors"
              style={{ borderColor: border, background: bg }}
            >
              {opt}
              {answered && isCorrect && <Check size={15} className="text-bull" />}
              {answered && isChosen && !isCorrect && <X size={15} className="text-bear" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-4 rounded-lg bg-panel-raised p-3 font-body text-sm text-text-muted">
              {q.explanation}
            </p>
            <button
              onClick={next}
              className="mt-4 w-full rounded-lg bg-accent py-2.5 font-body text-sm font-semibold text-bg transition-transform hover:scale-[1.01]"
            >
              {current + 1 >= questions.length ? "See results" : "Next question"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flashcard } from "@/lib/lessonContent";

export default function Flashcards({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;
  const card = cards[index];

  const advance = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  return (
    <div>
      <div className="[perspective:1200px]">
        <motion.button
          onClick={() => setFlipped((f) => !f)}
          className="relative h-40 w-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-border bg-panel p-6 [backface-visibility:hidden]"
          >
            <p className="text-center font-display text-lg font-semibold text-text">{card.front}</p>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-accent bg-panel-raised p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <p className="text-center font-body text-sm text-text-muted">{card.back}</p>
          </div>
        </motion.button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-xs text-text-faint">
          {index + 1} / {cards.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-faint">tap card to flip</span>
          <button
            onClick={advance}
            className="rounded-lg border border-border px-3 py-1.5 font-body text-xs text-text-muted transition-colors hover:text-text"
          >
            Next card
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ArrowUp } from "lucide-react";

export interface ToastItem {
  id: string;
  xp: number;
  coins?: number;
  leveledUp?: boolean;
  newLevel?: number;
}

export default function XpToast({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 rounded-lg border border-accent bg-panel px-4 py-2.5 shadow-lg"
            style={{ boxShadow: "0 0 24px -6px var(--color-accent)" }}
          >
            {t.leveledUp ? (
              <>
                <ArrowUp size={15} className="text-accent" />
                <span className="font-mono text-xs font-semibold text-accent">
                  LEVEL UP — L{t.newLevel}
                </span>
              </>
            ) : (
              <>
                <Sparkles size={15} className="text-accent" />
                <span className="font-mono text-xs font-semibold text-text">
                  +{t.xp} XP{t.coins ? ` · +${t.coins} coins` : ""}
                </span>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  streak: number;
};

export function StreakDisplay({ streak }: Props) {
  const heat =
    streak >= 10
      ? "🔥🔥"
      : streak >= 5
        ? "🔥"
        : streak >= 3
          ? "✨"
          : "";

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={streak}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs ${
          streak >= 5
            ? "border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-200"
            : streak >= 3
              ? "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200"
              : "border-zinc-200 bg-white text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400"
        }`}
      >
        {heat && <span className="text-sm leading-none">{heat}</span>}
        <span className="font-semibold tabular-nums">{streak}</span>
        <span className="opacity-70">streak</span>
      </motion.div>
    </AnimatePresence>
  );
}

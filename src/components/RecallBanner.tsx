"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { allQuestions } from "@/data/all-questions";
import { loadProgress } from "@/lib/storage";
import { recallCandidates, summarize } from "@/lib/recall";

/**
 * 復習推奨件数を表示するスリムバナー。
 * 候補 0 件 or LocalStorage 未読時は何も表示しない (邪魔しない)。
 */
export function RecallBanner() {
  const [count, setCount] = useState<number | null>(null);
  const [marked, setMarked] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const p = loadProgress();
      const cs = recallCandidates(p, allQuestions);
      const sum = summarize(cs);
      setCount(cs.length);
      setMarked(sum.markedReview);
    };
    refresh();
    const handler = () => refresh();
    window.addEventListener("rrq:progress-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("rrq:progress-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  if (count === null || count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link
        href="/review"
        className="group flex items-center gap-3 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/60 to-rose-50/40 px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-sm dark:border-amber-500/30 dark:from-amber-500/[0.08] dark:via-orange-500/[0.06] dark:to-rose-500/[0.04] dark:hover:border-amber-400/60"
      >
        <span className="text-xl" aria-hidden>
          🔁
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            Spaced Recall · 忘却曲線リマインド
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
            そろそろ復習したい問題が <strong>{count} 問</strong>
            {marked > 0 ? ` (うち見直し ${marked} 問)` : ""} あります
          </p>
        </div>
        <span
          className="text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-amber-600 dark:text-zinc-600 dark:group-hover:text-amber-300"
          aria-hidden
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { loadProgress, resetProgress } from "@/lib/storage";
import type { Progress } from "@/lib/types";

type Props = {
  totalQuestions: number;
};

export function ProgressSummary({ totalQuestions }: Props) {
  const [progress, setProgress] = useState<Progress | null>(null);

  const refresh = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    // 初回マウント時に localStorage から読み出して state を埋める
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    window.addEventListener("rrq:progress-updated", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("rrq:progress-updated", handler);
    };
  }, [refresh]);

  if (!progress) {
    return (
      <div className="h-32 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/50 dark:border-white/5 dark:bg-white/[0.02]" />
    );
  }

  const solvedRate =
    totalQuestions === 0
      ? 0
      : Math.round((progress.totalSolved / totalQuestions) * 100);
  const accuracy =
    progress.totalAttempts === 0
      ? 0
      : Math.round((progress.totalSolved / progress.totalAttempts) * 100);

  const handleReset = () => {
    if (confirm("進捗をリセットします。よろしいですか？")) {
      resetProgress();
      refresh();
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-white/5 dark:via-white/[0.03] dark:to-transparent">
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-500/10" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
              あなたの進捗
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/stats"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
            >
              📈 詳しい統計を見る
              <span aria-hidden>→</span>
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-zinc-500 transition hover:text-rose-600 hover:underline dark:hover:text-rose-300"
            >
              リセット
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat
            label="完答した問題"
            value={`${progress.totalSolved}`}
            suffix={`/ ${totalQuestions}`}
            accent="text-emerald-600 dark:text-emerald-300"
          />
          <Stat
            label="正解率"
            value={`${accuracy}%`}
            accent="text-rose-600 dark:text-rose-300"
          />
          <Stat
            label="進捗率"
            value={`${solvedRate}%`}
            accent="text-fuchsia-600 dark:text-fuchsia-300"
          />
          <Stat
            label="最高ストリーク"
            value={`${progress.bestStreak}`}
            suffix="連続"
            accent="text-amber-600 dark:text-amber-300"
          />
        </div>

        <div className="relative mt-6 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${solvedRate}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className="mt-1.5 flex items-baseline gap-1">
        <span className={`text-2xl font-bold tabular-nums ${accent}`}>
          {value}
        </span>
        {suffix && (
          <span className="text-xs text-zinc-500">{suffix}</span>
        )}
      </p>
    </div>
  );
}

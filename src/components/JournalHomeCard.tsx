"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type StreakInfo,
  computeStreak,
  loadEntries,
  templates,
} from "@/lib/journal";

export function JournalHomeCard() {
  const [entryCount, setEntryCount] = useState<number | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);

  useEffect(() => {
    const refresh = () => {
      const entries = loadEntries();
      setEntryCount(entries.length);
      setStreak(computeStreak(entries));
    };
    refresh();
    window.addEventListener("rrq:journal-updated", refresh);
    return () => window.removeEventListener("rrq:journal-updated", refresh);
  }, []);

  const streakLabel = (() => {
    if (!streak || streak.current === 0) return null;
    if (streak.todayWritten) return `🔥 ${streak.current} 日連続`;
    return `⏳ ${streak.current} 日連続 (今日まだ)`;
  })();

  return (
    <Link
      href="/journal"
      className="group relative block overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-rose-50/80 via-white to-fuchsia-50/60 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-zinc-800 dark:from-rose-950/30 dark:via-zinc-900/40 dark:to-fuchsia-950/30 dark:hover:border-rose-400/40 dark:hover:bg-zinc-900/60"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 text-7xl opacity-15 transition-transform group-hover:rotate-12 group-hover:scale-110">
        📝
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Journal · 構造化言語訓練
          </p>
          {entryCount !== null && entryCount > 0 && (
            <span className="rounded-full bg-rose-500/15 px-2 py-0.5 font-mono text-[10px] text-rose-700 dark:text-rose-300">
              {entryCount} 件記録済
            </span>
          )}
          {streakLabel && (
            <span className="rounded-full bg-orange-500/15 px-2 py-0.5 font-mono text-[10px] text-orange-700 dark:text-orange-300">
              {streakLabel}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          学びを言語化して、説明力を鍛える
        </h3>
        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          KPT / STAR / 5W1H / YWT / PREP / 日報 の{" "}
          <strong>{templates.length} 種類のテンプレート</strong>
          で日々の学習を構造化。毎日 5 分続けるだけで、説明力・報告力が階段状に伸びます。
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {templates.slice(0, 6).map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white/70 px-2.5 py-0.5 text-[11px] text-zinc-700 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300"
            >
              <span>{t.emoji}</span>
              <span>{t.name}</span>
            </span>
          ))}
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-500/20 transition group-hover:bg-rose-600">
          <span>
            {entryCount !== null && entryCount > 0
              ? "ジャーナルを開く"
              : "今日の学びを書き始める"}
          </span>
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

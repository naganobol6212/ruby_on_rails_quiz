"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  type JournalEntry,
  type Template,
  findTemplate,
  templates,
} from "@/lib/journal";

type Props = {
  todayEntries: JournalEntry[];
  /** 前回使ったテンプレ ID — 1 タップで再開する『毎日同じ型』導線 */
  lastTemplateId: string | null;
  /** 連続記録継続中か (current >= 1) */
  hasStreak: boolean;
};

/**
 * 『今日の記録』セクション。
 * - 今日のエントリがあれば一覧
 * - 無ければ大きな CTA で前回テンプレを 1 タップ起動
 */
export function TodaysJournal({ todayEntries, lastTemplateId, hasStreak }: Props) {
  const lastTemplate: Template | null = lastTemplateId
    ? (findTemplate(lastTemplateId) ?? null)
    : null;

  // 推奨テンプレ: 前回使ったもの → なければ最も軽量な YWT
  const recommended = lastTemplate ?? findTemplate("yww") ?? templates[0];

  if (todayEntries.length === 0) {
    // 今日まだ書いてない → 大きな CTA
    return (
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border-2 border-rose-300/70 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50 p-6 shadow-md dark:border-rose-400/30 dark:from-rose-950/30 dark:via-zinc-900/40 dark:to-fuchsia-950/30"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              {new Date().toLocaleDateString("ja-JP", {
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
            <h2 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">
              今日の記録を書く
            </h2>
            <p className="mt-1.5 text-sm text-zinc-700 dark:text-zinc-300">
              {hasStreak
                ? "🔥 連続記録更新中。今日も 1 行でも残しましょう"
                : lastTemplate
                  ? `前回は ${lastTemplate.emoji} ${lastTemplate.name} で書きました`
                  : "5 分で書ける YWT (やった / わかった / 次やる) がおすすめ"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              href={`/journal/new?template=${recommended.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-500/30 transition hover:bg-rose-600 hover:shadow-lg"
            >
              <span className="text-lg">{recommended.emoji}</span>
              <span>{recommended.name} で書く</span>
              <span aria-hidden>→</span>
            </Link>
            <details className="text-[11px] text-zinc-600 dark:text-zinc-400">
              <summary className="cursor-pointer hover:text-rose-600 dark:hover:text-rose-300">
                別のテンプレで書く
              </summary>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {templates
                  .filter((t) => t.id !== recommended.id)
                  .map((t) => (
                    <Link
                      key={t.id}
                      href={`/journal/new?template=${t.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-rose-400/40"
                    >
                      <span>{t.emoji}</span>
                      <span>{t.name}</span>
                    </Link>
                  ))}
              </div>
            </details>
          </div>
        </div>
      </motion.section>
    );
  }

  // 今日のエントリがある → 一覧 + 追加ボタン
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-300/70 bg-gradient-to-br from-emerald-50 to-teal-50/60 p-5 dark:border-emerald-400/30 dark:from-emerald-500/[0.10] dark:to-teal-500/[0.06]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
            {new Date().toLocaleDateString("ja-JP", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>
          <h2 className="mt-0.5 flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden>✅</span>
            <span>今日の記録 ({todayEntries.length})</span>
          </h2>
        </div>
        <Link
          href={`/journal/new?template=${recommended.id}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-400/60 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
        >
          <span>+</span>
          <span>もう 1 件書く</span>
        </Link>
      </div>
      <ul className="space-y-1.5">
        {todayEntries.map((e) => {
          const t = findTemplate(e.templateId);
          const time = new Date(e.createdAt).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <li key={e.id}>
              <Link
                href={`/journal/${e.id}`}
                className="flex items-center gap-3 rounded-lg border border-emerald-200/60 bg-white/80 px-3 py-2 text-xs transition hover:border-emerald-400 hover:bg-white dark:border-emerald-400/20 dark:bg-zinc-900/40 dark:hover:border-emerald-400/40 dark:hover:bg-zinc-900/70"
              >
                <span className="shrink-0 text-base">{t?.emoji ?? "📝"}</span>
                <span className="line-clamp-1 flex-1 font-medium text-zinc-800 dark:text-zinc-100">
                  {e.title}
                </span>
                <time className="shrink-0 font-mono text-[10px] tabular-nums text-emerald-700 dark:text-emerald-300">
                  {time}
                </time>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}

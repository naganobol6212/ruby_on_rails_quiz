"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { allQuestions } from "@/data/all-questions";
import { findCategory } from "@/data/categories";
import { loadProgress } from "@/lib/storage";
import { recallCandidates, summarize } from "@/lib/recall";
import { computeStreak, loadEntries } from "@/lib/journal";
import { TrackDiagnosis } from "./TrackDiagnosis";
import type { Progress, Question } from "@/lib/types";

type ResumeCategory = {
  categoryId: string;
  categoryName: string;
  emoji: string;
  solved: number;
  total: number;
  lastAnsweredAt: number;
  /** 次に解くべき未完答問題 (なければ undefined — 全完答済) */
  nextQuestionId?: string;
};

type TodayStats = {
  todaySolved: number;
  totalSolved: number;
  totalQuestions: number;
};

type Action =
  | {
      kind: "review";
      total: number;
      marked: number;
      over30d: number;
      over7d: number;
    }
  | { kind: "resume"; resume: ResumeCategory }
  | { kind: "fresh-start"; suggestedTrackId: string | null };

const MS_DAY = 86400000;

function computeResumeList(
  progress: Progress,
  questions: Question[],
): ResumeCategory[] {
  // カテゴリ ID → { 最終解答日時, 解いた数, 未完答リスト, 全問数 }
  const map = new Map<
    string,
    {
      lastAnsweredAt: number;
      solved: number;
      total: number;
      unsolvedIds: string[];
    }
  >();
  // まずカテゴリ全問題数を初期化
  for (const q of questions) {
    if (!map.has(q.categoryId)) {
      map.set(q.categoryId, {
        lastAnsweredAt: 0,
        solved: 0,
        total: 0,
        unsolvedIds: [],
      });
    }
    const m = map.get(q.categoryId)!;
    m.total++;
    const a = progress.attempts[q.id];
    if (a?.solved) m.solved++;
    else m.unsolvedIds.push(q.id);
    if (a?.lastAnsweredAt) {
      const t = new Date(a.lastAnsweredAt).getTime();
      if (t > m.lastAnsweredAt) m.lastAnsweredAt = t;
    }
  }

  const out: ResumeCategory[] = [];
  for (const [categoryId, m] of map) {
    if (m.lastAnsweredAt === 0) continue; // 一度も触っていない
    if (m.solved === m.total) continue; // 全完答済 (やりかけではない)
    const cat = findCategory(categoryId);
    if (!cat) continue;
    out.push({
      categoryId,
      categoryName: cat.name,
      emoji: cat.emoji,
      solved: m.solved,
      total: m.total,
      lastAnsweredAt: m.lastAnsweredAt,
      nextQuestionId: m.unsolvedIds[0],
    });
  }

  return out.sort((a, b) => b.lastAnsweredAt - a.lastAnsweredAt);
}

function decideAction(
  progress: Progress,
  questions: Question[],
  resume: ResumeCategory[],
): Action {
  const recall = recallCandidates(progress, questions);
  const sum = summarize(recall);

  // 復習候補がたまっていれば最優先
  if (recall.length >= 3 || sum.markedReview > 0) {
    return {
      kind: "review",
      total: recall.length,
      marked: sum.markedReview,
      over30d: sum.over30d,
      over7d: sum.over7d,
    };
  }

  // 直近 14 日以内にやりかけがあれば「続きから」
  const now = Date.now();
  const recentResume = resume.find(
    (r) => (now - r.lastAnsweredAt) / MS_DAY <= 14,
  );
  if (recentResume) {
    return { kind: "resume", resume: recentResume };
  }

  // 新規ユーザー → 推奨 Track (固定で ruby)
  return { kind: "fresh-start", suggestedTrackId: "ruby" };
}

function relativeDays(ts: number): string {
  const d = Math.floor((Date.now() - ts) / MS_DAY);
  if (d <= 0) return "今日";
  if (d === 1) return "昨日";
  return `${d} 日前`;
}

export function TodaysDashboard() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [streakCurrent, setStreakCurrent] = useState(0);
  const [streakTodayWritten, setStreakTodayWritten] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setProgress(loadProgress());
      const s = computeStreak(loadEntries());
      setStreakCurrent(s.current);
      setStreakTodayWritten(s.todayWritten);
    };
    refresh();
    window.addEventListener("rrq:progress-updated", refresh);
    window.addEventListener("rrq:journal-updated", refresh);
    return () => {
      window.removeEventListener("rrq:progress-updated", refresh);
      window.removeEventListener("rrq:journal-updated", refresh);
    };
  }, []);

  const resume = useMemo(
    () => (progress ? computeResumeList(progress, allQuestions) : []),
    [progress],
  );

  const action = useMemo<Action | null>(
    () => (progress ? decideAction(progress, allQuestions, resume) : null),
    [progress, resume],
  );

  const todayStats = useMemo<TodayStats>(() => {
    if (!progress) {
      return {
        todaySolved: 0,
        totalSolved: 0,
        totalQuestions: allQuestions.length,
      };
    }
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    let todaySolved = 0;
    for (const a of Object.values(progress.attempts)) {
      if (!a.solved || !a.lastAnsweredAt) continue;
      if (new Date(a.lastAnsweredAt).getTime() >= startOfToday.getTime()) {
        todaySolved++;
      }
    }
    return {
      todaySolved,
      totalSolved: progress.totalSolved,
      totalQuestions: allQuestions.length,
    };
  }, [progress]);

  if (!progress || !action) {
    return (
      <div className="h-48 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/50 dark:border-white/5 dark:bg-white/[0.02]" />
    );
  }

  return (
    <section className="space-y-3">
      {/* 「今日のおすすめ」 アクションヒーロー (新規ユーザーには診断 UI を出す) */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {action.kind === "fresh-start" ? (
          <TrackDiagnosis />
        ) : (
          <ActionHero action={action} />
        )}
      </motion.div>

      {/* 今日の数字 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <MiniStat
          label="今日解いた"
          value={String(todayStats.todaySolved)}
          icon="✅"
          tone="emerald"
        />
        <MiniStat
          label="累積"
          value={`${todayStats.totalSolved}`}
          suffix={`/ ${todayStats.totalQuestions}`}
          icon="📊"
          tone="rose"
        />
        <MiniStat
          label="ジャーナル連続"
          value={`${streakCurrent}`}
          suffix={streakCurrent > 0 ? (streakTodayWritten ? "日 🔥" : "日 ⏳") : "日"}
          icon="🔥"
          tone="amber"
        />
      </div>

      {/* やりかけリスト (2 件目以降) */}
      {resume.length > 0 && (
        <details className="group rounded-xl border border-zinc-200 bg-white/60 dark:border-white/10 dark:bg-zinc-900/40">
          <summary className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-rose-300">
            <span>🚧 やりかけ {resume.length} カテゴリ</span>
            <span className="text-zinc-400 transition group-open:rotate-180">
              ▾
            </span>
          </summary>
          <ul className="divide-y divide-zinc-100 dark:divide-white/5">
            {resume.slice(0, 5).map((r) => (
              <li key={r.categoryId}>
                <Link
                  href={
                    r.nextQuestionId
                      ? `/quiz/${r.categoryId}/${r.nextQuestionId}`
                      : `/quiz/${r.categoryId}`
                  }
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-rose-50/50 dark:hover:bg-rose-500/5"
                >
                  <span className="text-xl">{r.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-zinc-800 dark:text-zinc-100">
                      {r.categoryName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      {r.solved} / {r.total} 問正解 · {relativeDays(r.lastAnsweredAt)}に最後
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-300">
                    続ける →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function ActionHero({ action }: { action: Action }) {
  if (action.kind === "review") {
    return (
      <Link
        href="/review"
        className="group block overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50/60 to-rose-50/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-amber-500/40 dark:from-amber-500/[0.12] dark:via-orange-500/[0.08] dark:to-rose-500/[0.06]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
          📍 今日のおすすめ · 復習
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          🔁 そろそろ復習したい問題が <span className="text-amber-700 dark:text-amber-200">{action.total} 問</span> あります
        </h2>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
          {action.marked > 0 && (
            <span className="mr-3">🔁 見直しマーク {action.marked}</span>
          )}
          {action.over30d > 0 && (
            <span className="mr-3">🌀 30 日経過 {action.over30d}</span>
          )}
          {action.over7d > 0 && <span>⏳ 7 日経過 {action.over7d}</span>}
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 transition group-hover:translate-x-0.5 dark:text-amber-300">
          復習ページを開く →
        </p>
      </Link>
    );
  }

  if (action.kind === "resume") {
    const r = action.resume;
    const href = r.nextQuestionId
      ? `/quiz/${r.categoryId}/${r.nextQuestionId}`
      : `/quiz/${r.categoryId}`;
    const pct = Math.round((r.solved / r.total) * 100);
    return (
      <Link
        href={href}
        className="group block overflow-hidden rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-md dark:border-rose-500/40 dark:from-rose-500/[0.12] dark:via-zinc-900/30 dark:to-fuchsia-500/[0.06]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-300">
          📍 今日のおすすめ · 続きから
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          <span className="text-2xl sm:text-3xl">{r.emoji}</span>
          <span>
            『{r.categoryName}』 の続きから
          </span>
        </h2>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
          進捗 <strong>{r.solved} / {r.total}</strong> 問正解 ({pct}%) ·{" "}
          {relativeDays(r.lastAnsweredAt)}に最後に挑戦
        </p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-rose-100/70 dark:bg-rose-500/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 transition group-hover:translate-x-0.5 dark:text-rose-300">
          {r.nextQuestionId ? "次の問題へ →" : "カテゴリトップへ →"}
        </p>
      </Link>
    );
  }

  // fresh-start
  return (
    <Link
      href={
        action.suggestedTrackId
          ? `/track/${action.suggestedTrackId}`
          : "#tracks"
      }
      className="group block overflow-hidden rounded-2xl border-2 border-sky-300 bg-gradient-to-br from-sky-50 via-white to-emerald-50/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-md dark:border-sky-500/40 dark:from-sky-500/[0.10] dark:via-zinc-900/30 dark:to-emerald-500/[0.06]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
        📍 今日のおすすめ · スタート
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
        🚀 まずは Ruby から始めよう
      </h2>
      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
        Ruby Track の参考書を 1 章読んで、 問題を 3 問解くだけで 10 分。
        毎日のリズムができれば 1 週間で習慣化します。
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 transition group-hover:translate-x-0.5 dark:text-sky-300">
        Ruby Track を開く →
      </p>
    </Link>
  );
}

function MiniStat({
  label,
  value,
  suffix,
  icon,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: string;
  tone: "rose" | "amber" | "emerald";
}) {
  const toneClass = {
    rose: "text-rose-600 dark:text-rose-300",
    amber: "text-amber-600 dark:text-amber-300",
    emerald: "text-emerald-600 dark:text-emerald-300",
  }[tone];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white/70 px-3 py-2.5 dark:border-white/10 dark:bg-zinc-900/40">
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        <span>{icon}</span>
        <span>{label}</span>
      </p>
      <p className="mt-1 flex items-baseline gap-1">
        <span className={`text-xl font-bold tabular-nums sm:text-2xl ${toneClass}`}>
          {value}
        </span>
        {suffix && (
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

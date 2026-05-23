"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Question, QuestionAttempt, ReviewMark } from "@/lib/types";
import { loadProgress, setReviewMark } from "@/lib/storage";

type Props = {
  questions: Question[];
  categoryName: string;
  categoryEmoji: string;
  categoryId: string;
};

type Filter = "all" | "unattempted" | "review" | "wrong" | "mastered";

const difficultyLabel = (d: string) =>
  d === "beginner" ? "初級" : d === "intermediate" ? "中級" : "上級";

const difficultyClass = (d: string) =>
  d === "beginner"
    ? "text-emerald-600 dark:text-emerald-400"
    : d === "intermediate"
      ? "text-amber-600 dark:text-amber-400"
      : "text-rose-600 dark:text-rose-400";

function statusOf(
  attempt: QuestionAttempt | undefined,
): { label: string; dotClass: string; cardClass: string } {
  if (!attempt) {
    return {
      label: "未挑戦",
      dotClass: "bg-zinc-300 dark:bg-zinc-600",
      cardClass: "",
    };
  }
  if (attempt.mark === "mastered") {
    return {
      label: "完璧",
      dotClass: "bg-emerald-500",
      cardClass:
        "border-emerald-300/70 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-500/[0.06]",
    };
  }
  if (attempt.mark === "review") {
    return {
      label: "要見直し",
      dotClass: "bg-amber-500",
      cardClass:
        "border-amber-300/70 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-500/[0.06]",
    };
  }
  if (attempt.solved) {
    return {
      label: "正解済",
      dotClass: "bg-sky-500",
      cardClass:
        "border-sky-300/70 bg-sky-50/40 dark:border-sky-500/30 dark:bg-sky-500/[0.05]",
    };
  }
  return {
    label: "不正解あり",
    dotClass: "bg-rose-500",
    cardClass:
      "border-rose-300/60 bg-rose-50/40 dark:border-rose-500/30 dark:bg-rose-500/[0.05]",
  };
}

export function QuestionPicker({
  questions,
  categoryName,
  categoryEmoji,
  categoryId,
}: Props) {
  const [attempts, setAttempts] = useState<Record<string, QuestionAttempt>>({});
  const [filter, setFilter] = useState<Filter>("all");

  const refresh = useCallback(() => {
    setAttempts(loadProgress().attempts);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const h = () => refresh();
    window.addEventListener("rrq:progress-updated", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("rrq:progress-updated", h);
      window.removeEventListener("storage", h);
    };
  }, [refresh]);

  const counts = useMemo(() => {
    const c = {
      all: questions.length,
      unattempted: 0,
      review: 0,
      wrong: 0,
      mastered: 0,
    };
    for (const q of questions) {
      const a = attempts[q.id];
      if (!a) c.unattempted++;
      else if (a.mark === "review") c.review++;
      else if (a.mark === "mastered") c.mastered++;
      else if (!a.solved) c.wrong++;
    }
    return c;
  }, [questions, attempts]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const a = attempts[q.id];
      switch (filter) {
        case "unattempted":
          return !a;
        case "review":
          return a?.mark === "review";
        case "wrong":
          return a && !a.solved && a.mark !== "review";
        case "mastered":
          return a?.mark === "mastered";
        default:
          return true;
      }
    });
  }, [questions, attempts, filter]);

  const firstUnattempted = questions.find((q) => !attempts[q.id]);
  const firstReview = questions.find((q) => attempts[q.id]?.mark === "review");

  const solvedCount = questions.filter((q) => attempts[q.id]?.solved).length;
  const masteredCount = questions.filter(
    (q) => attempts[q.id]?.mark === "mastered",
  ).length;
  const progressPct = Math.round((solvedCount / questions.length) * 100);

  const handleMark = (questionId: string, mark: ReviewMark) => {
    setReviewMark(questionId, mark);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          <span>カテゴリ選択</span>
        </Link>
      </div>

      {/* カテゴリ概要 */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{categoryEmoji}</span>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {categoryName}
            </h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              全 {questions.length} 問 / 正解 {solvedCount} / 完璧{" "}
              {masteredCount}
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/quiz/${categoryId}/${questions[0].id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-500/20 transition hover:from-rose-400 hover:to-fuchsia-400"
          >
            <span>▶</span>
            <span>最初から順番に</span>
          </Link>
          {firstUnattempted && firstUnattempted.id !== questions[0].id && (
            <Link
              href={`/quiz/${categoryId}/${firstUnattempted.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              <span>↻</span>
              <span>続きから (未挑戦)</span>
            </Link>
          )}
          {firstReview && (
            <Link
              href={`/quiz/${categoryId}/${firstReview.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:bg-amber-500/15"
            >
              <span>🔁</span>
              <span>見直し問題から</span>
            </Link>
          )}
        </div>
      </section>

      {/* フィルター */}
      <section>
        <div className="mb-3 flex flex-wrap gap-2">
          {(
            [
              ["all", "すべて", counts.all],
              ["unattempted", "未挑戦", counts.unattempted],
              ["wrong", "不正解あり", counts.wrong],
              ["review", "要見直し", counts.review],
              ["mastered", "完璧", counts.mastered],
            ] as const
          ).map(([key, label, n]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filter === key
                  ? "border-rose-400 bg-rose-500 text-white shadow-sm"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 hover:bg-rose-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
              }`}
            >
              <span>{label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  filter === key
                    ? "bg-white/20"
                    : "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                }`}
              >
                {n}
              </span>
            </button>
          ))}
        </div>

        {/* 問題リスト */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
              該当する問題はありません
            </div>
          ) : (
            filtered.map((q, displayIndex) => {
              const originalIndex = questions.indexOf(q);
              const a = attempts[q.id];
              const status = statusOf(a);
              return (
                <div
                  key={q.id}
                  className={`group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-rose-300 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-rose-400/30 ${status.cardClass}`}
                >
                  {/* ステータスドット */}
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.dotClass}`}
                    title={status.label}
                  />
                  {/* 番号 */}
                  <span className="w-8 shrink-0 font-mono text-xs text-zinc-400 tabular-nums dark:text-zinc-500">
                    {String(originalIndex + 1).padStart(3, "0")}
                  </span>
                  {/* 難易度 */}
                  <span
                    className={`w-10 shrink-0 text-[10px] font-bold uppercase ${difficultyClass(
                      q.difficulty,
                    )}`}
                  >
                    {difficultyLabel(q.difficulty)}
                  </span>
                  {/* 問題タイトル */}
                  <Link
                    href={`/quiz/${categoryId}/${q.id}`}
                    className="line-clamp-1 flex-1 text-sm text-zinc-800 transition group-hover:text-rose-600 dark:text-zinc-200 dark:group-hover:text-rose-300"
                  >
                    {q.question}
                  </Link>
                  {/* レビューマーク */}
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleMark(
                          q.id,
                          a?.mark === "mastered" ? null : "mastered",
                        )
                      }
                      aria-label="完璧マーク"
                      title="完璧にする"
                      className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition ${
                        a?.mark === "mastered"
                          ? "bg-emerald-500 text-white"
                          : "border border-zinc-200 bg-white text-zinc-400 hover:border-emerald-400 hover:text-emerald-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-500 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
                      }`}
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleMark(q.id, a?.mark === "review" ? null : "review")
                      }
                      aria-label="見直しマーク"
                      title="見直し対象にする"
                      className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition ${
                        a?.mark === "review"
                          ? "bg-amber-500 text-white"
                          : "border border-zinc-200 bg-white text-zinc-400 hover:border-amber-400 hover:text-amber-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-500 dark:hover:border-amber-400/40 dark:hover:text-amber-300"
                      }`}
                    >
                      🔁
                    </button>
                  </div>
                  {/* displayIndex 表示は不要 */}
                  <span className="sr-only">{displayIndex}</span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

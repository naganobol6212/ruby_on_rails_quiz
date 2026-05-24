"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { roadmap, totalSteps, type RoadmapStep } from "@/data/roadmap";
import { loadProgress } from "@/lib/storage";

const PHASE_COLORS: Record<
  string,
  { border: string; bg: string; chip: string; dot: string }
> = {
  emerald: {
    border: "border-emerald-300 dark:border-emerald-500/30",
    bg: "from-emerald-50 to-white dark:from-emerald-500/[0.08] dark:to-transparent",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  sky: {
    border: "border-sky-300 dark:border-sky-500/30",
    bg: "from-sky-50 to-white dark:from-sky-500/[0.08] dark:to-transparent",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  violet: {
    border: "border-violet-300 dark:border-violet-500/30",
    bg: "from-violet-50 to-white dark:from-violet-500/[0.08] dark:to-transparent",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  amber: {
    border: "border-amber-300 dark:border-amber-500/30",
    bg: "from-amber-50 to-white dark:from-amber-500/[0.08] dark:to-transparent",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  rose: {
    border: "border-rose-300 dark:border-rose-500/30",
    bg: "from-rose-50 to-white dark:from-rose-500/[0.08] dark:to-transparent",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

type StepProgress = {
  solvedIds: Set<string>;
};

function stepCompletion(step: RoadmapStep, solvedIds: Set<string>): {
  done: number;
  total: number;
  percent: number;
} {
  let total = 0;
  let done = 0;
  for (const item of step.items) {
    if (item.requiredQuestionIds && item.requiredQuestionIds.length > 0) {
      for (const id of item.requiredQuestionIds) {
        total++;
        if (solvedIds.has(id)) done++;
      }
    }
  }
  if (total === 0) return { done: 0, total: 0, percent: 0 };
  return { done, total, percent: Math.round((done / total) * 100) };
}

export function RoadmapView() {
  const [progress, setProgress] = useState<StepProgress | null>(null);

  useEffect(() => {
    const refresh = () => {
      const p = loadProgress();
      const ids = new Set<string>();
      for (const [qid, attempt] of Object.entries(p.attempts)) {
        if (attempt.solved) ids.add(qid);
      }
      setProgress({ solvedIds: ids });
    };
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("rrq:progress-updated", onUpdate);
    return () => window.removeEventListener("rrq:progress-updated", onUpdate);
  }, []);

  const overall = useMemo(() => {
    if (!progress) return null;
    let totalQ = 0;
    let doneQ = 0;
    let completedSteps = 0;
    for (const phase of roadmap) {
      for (const step of phase.steps) {
        const c = stepCompletion(step, progress.solvedIds);
        totalQ += c.total;
        doneQ += c.done;
        if (c.total > 0 && c.done === c.total) completedSteps++;
      }
    }
    return {
      totalQuestions: totalQ,
      doneQuestions: doneQ,
      percent: totalQ === 0 ? 0 : Math.round((doneQ / totalQ) * 100),
      completedSteps,
    };
  }, [progress]);

  return (
    <>
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          ロードマップ
        </span>
      </div>

      <header className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Learning Roadmap
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          🗺️ ゼロから Rails 中級者まで
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          このアプリだけで完結する学習パスです。
          {totalSteps} ステップ・全 8 フェーズ。
          クイズ・参考書・実践課題を組み合わせて、
          自然に必要な前提知識が積み上がるように構成しています。
          上から順に進めれば OK ですが、興味のあるところからつまみ食いしても大丈夫です。
        </p>

        {overall && overall.totalQuestions > 0 && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-900/60">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                あなたの進捗
              </p>
              <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                {overall.doneQuestions} / {overall.totalQuestions} 問 ·{" "}
                {overall.completedSteps} / {totalSteps} ステップ完了
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${overall.percent}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              全 {overall.totalQuestions} 問の {overall.percent}% 完了
            </p>
          </div>
        )}
      </header>

      <div className="relative space-y-12 border-l-2 border-zinc-200 pl-6 dark:border-white/10 sm:pl-8">
        {roadmap.map((phase) => {
          const colors = PHASE_COLORS[phase.color];
          return (
            <section key={phase.id} className="relative">
              <div className="mb-6">
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {phase.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {phase.description}
                </p>
              </div>

              <div className="space-y-5">
                {phase.steps.map((step) => {
                  const c = progress
                    ? stepCompletion(step, progress.solvedIds)
                    : { done: 0, total: 0, percent: 0 };
                  const completed = c.total > 0 && c.done === c.total;
                  return (
                    <article
                      key={step.id}
                      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition ${colors.border} ${colors.bg}`}
                    >
                      <span
                        aria-hidden
                        className={`absolute -left-[33px] top-6 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-sm dark:border-zinc-900 sm:-left-[41px] ${
                          completed ? "bg-emerald-500" : colors.dot
                        }`}
                      >
                        {completed && (
                          <span className="text-[8px] font-bold text-white">
                            ✓
                          </span>
                        )}
                      </span>

                      <div className="flex items-start gap-3">
                        <span className="text-2xl" aria-hidden>
                          {step.emoji}
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${colors.chip}`}
                            >
                              Step {step.number}
                            </span>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                              {step.title}
                            </h3>
                            <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-500">
                              · 約 {step.estimateMinutes} 分
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {step.goal}
                          </p>
                        </div>
                      </div>

                      {c.total > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                            <div
                              className={`h-full transition-all duration-500 ${
                                completed
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                  : "bg-gradient-to-r from-rose-400 to-fuchsia-400"
                              }`}
                              style={{ width: `${c.percent}%` }}
                            />
                          </div>
                          <p className="mt-1 font-mono text-[10px] text-zinc-500 dark:text-zinc-500">
                            {c.done} / {c.total} 問完了 ({c.percent}%)
                          </p>
                        </div>
                      )}

                      <div className="mt-4 space-y-2">
                        {step.items.map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            className="group flex items-start gap-3 rounded-lg border border-zinc-200 bg-white/80 px-3 py-2 transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-400/40"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-zinc-900 group-hover:text-rose-600 dark:text-zinc-100 dark:group-hover:text-rose-300">
                                {item.label}
                              </p>
                              {item.hint && (
                                <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                                  {item.hint}
                                </p>
                              )}
                            </div>
                            <span
                              className="self-center text-zinc-400 transition group-hover:translate-x-1 group-hover:text-rose-500 dark:text-zinc-600 dark:group-hover:text-rose-400"
                              aria-hidden
                            >
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
        💡 進捗はあなたのブラウザの LocalStorage に保存されます。問題を解いて「正解」になると自動でステップが進みます。
      </p>
    </>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { RoadmapPhase } from "@/data/roadmap";
import { loadProgress } from "@/lib/storage";
import {
  type ProgressIndex,
  type RoadmapFilter,
  computePhaseStats,
  computeStepStats,
  countByFilter,
  findNextStep,
  indexProgress,
  stepMatchesFilter,
} from "./stats";
import { NextStepCard } from "./NextStepCard";
import { PhaseProgressBars } from "./PhaseProgressBars";
import { RoadmapFilters } from "./RoadmapFilters";
import { PHASE_COLORS, StepCard } from "./StepCard";

type RoadmapViewProps = {
  /** 表示するトラックの phases 配列 */
  roadmap: RoadmapPhase[];
  /** トラック名 (例: 「Ruby on Rails」) */
  trackName: string;
  /** ヘッドライン (h1 に出すフレーズ。 例: 「ゼロから Rails 中級者まで」) */
  headline: string;
  /** 「すべてのトラック一覧へ」 戻りリンクを出すか (個別トラックページでは true) */
  showTrackBackLink?: boolean;
};

export function RoadmapView({
  roadmap,
  trackName,
  headline,
  showTrackBackLink = false,
}: RoadmapViewProps) {
  const totalSteps = useMemo(
    () => roadmap.reduce((sum, phase) => sum + phase.steps.length, 0),
    [roadmap],
  );
  const [index, setIndex] = useState<ProgressIndex | null>(null);
  const [filter, setFilter] = useState<RoadmapFilter>("all");

  useEffect(() => {
    const refresh = () => {
      setIndex(indexProgress(loadProgress()));
    };
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("rrq:progress-updated", onUpdate);
    return () => window.removeEventListener("rrq:progress-updated", onUpdate);
  }, []);

  // 推奨ステップ (index が無い間は『未着手の状態』として扱い、最初のステップを推す)
  const nextStep = useMemo(
    () =>
      findNextStep(
        roadmap,
        index ?? { solvedIds: new Set(), weakIds: new Set() },
      ),
    [index, roadmap],
  );

  // Phase 別統計
  const phaseInfos = useMemo(() => {
    if (!index)
      return roadmap.map((phase) => ({
        phase,
        stats: computePhaseStats(phase, { solvedIds: new Set(), weakIds: new Set() }),
      }));
    return roadmap.map((phase) => ({
      phase,
      stats: computePhaseStats(phase, index),
    }));
  }, [index, roadmap]);

  const filterCounts = useMemo(
    () =>
      index
        ? countByFilter(roadmap, index)
        : { all: totalSteps, incomplete: totalSteps, completed: 0, weak: 0 },
    [index, roadmap, totalSteps],
  );

  // 全体集計
  const overall = useMemo(() => {
    let totalQ = 0;
    let doneQ = 0;
    let weakQ = 0;
    let completedSteps = 0;
    for (const { stats } of phaseInfos) {
      totalQ += stats.total;
      doneQ += stats.done;
      weakQ += stats.weak;
      completedSteps += stats.completedSteps;
    }
    return {
      totalQuestions: totalQ,
      doneQuestions: doneQ,
      weakQuestions: weakQ,
      percent: totalQ === 0 ? 0 : Math.round((doneQ / totalQ) * 100),
      completedSteps,
    };
  }, [phaseInfos]);

  // スムーズスクロール
  const jumpToPhase = useCallback((phaseId: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(`phase-${phaseId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const showWeakOnly = useCallback(() => setFilter("weak"), []);

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
        {showTrackBackLink ? (
          <>
            <Link
              href="/roadmap"
              className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
            >
              ロードマップ
            </Link>
            <span>›</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-200">
              {trackName}
            </span>
          </>
        ) : (
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            ロードマップ
          </span>
        )}
      </div>

      <header className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          {trackName} · Learning Roadmap
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          🗺️ {headline}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          このアプリだけで完結する学習パスです。 {totalSteps} ステップ・全{" "}
          {roadmap.length} フェーズ。 上から順でも、 興味のあるところからつまみ食いでも OK。
        </p>

        {overall.totalQuestions > 0 && (
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/60">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                あなたの全体進捗
              </p>
              <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                {overall.doneQuestions} / {overall.totalQuestions} 問 ·{" "}
                {overall.completedSteps} / {totalSteps} ステップ完了
                {overall.weakQuestions > 0 && (
                  <>
                    {" · "}
                    <span className="text-amber-600 dark:text-amber-300">
                      🔁 {overall.weakQuestions} 問の見直し
                    </span>
                  </>
                )}
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

      {/* 次にやるステップ (A) */}
      <div className="mb-6">
        <NextStepCard
          next={nextStep}
          weakStepCount={filterCounts.weak}
          onShowWeak={showWeakOnly}
        />
      </div>

      {/* Phase 別ミニバー (C) */}
      <div className="mb-6">
        <PhaseProgressBars phases={phaseInfos} onJump={jumpToPhase} />
      </div>

      {/* フィルタ (B, D) */}
      <div className="mb-6 sticky top-[64px] z-10 -mx-2 rounded-xl border border-zinc-200 bg-zinc-50/95 px-3 py-2.5 backdrop-blur dark:border-white/10 dark:bg-zinc-950/80">
        <RoadmapFilters
          current={filter}
          onChange={setFilter}
          counts={filterCounts}
        />
      </div>

      {/* タイムライン本体 (フィルタ適用済み) */}
      <div className="relative space-y-12 border-l-2 border-zinc-200 pl-6 dark:border-white/10 sm:pl-8">
        {phaseInfos.map(({ phase, stats: phaseStats }) => {
          const colors = PHASE_COLORS[phase.color];

          // このフェーズ内でフィルタに合致するステップを事前計算
          const visibleSteps = phase.steps
            .map((step) => ({
              step,
              stats: index
                ? computeStepStats(step, index)
                : { total: 0, done: 0, weak: 0, percent: 0, status: "not-started" as const },
            }))
            .filter(({ stats }) => stepMatchesFilter(stats, filter));

          if (visibleSteps.length === 0) return null;

          return (
            <section key={phase.id} id={`phase-${phase.id}`} className="relative scroll-mt-32">
              <div className="mb-6">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {phase.title}
                  </h2>
                  <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                    {phaseStats.completedSteps}/{phaseStats.totalSteps} step ·{" "}
                    {phaseStats.percent}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {phase.description}
                </p>
              </div>

              <div className="space-y-5">
                {visibleSteps.map(({ step, stats }) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    stats={stats}
                    colors={colors}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* フィルタ結果 0 件 */}
        {phaseInfos.every(({ phase }) =>
          phase.steps.every((step) => {
            const stats = index
              ? computeStepStats(step, index)
              : { total: 0, done: 0, weak: 0, percent: 0, status: "not-started" as const };
            return !stepMatchesFilter(stats, filter);
          }),
        ) && (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
            <p className="text-2xl">
              {filter === "weak" ? "🎯" : filter === "completed" ? "🚀" : "📋"}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {filter === "weak"
                ? "見直しマーク (🔁) が付いた問題はありません"
                : filter === "completed"
                  ? "まだ完了したステップはありません — 最初の 1 歩から始めましょう"
                  : filter === "incomplete"
                    ? "全ステップ完了! 🎉"
                    : "該当ステップなし"}
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-3 text-xs font-semibold text-rose-600 hover:underline dark:text-rose-300"
            >
              全部表示に戻す
            </button>
          </div>
        )}
      </div>

      <p className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
        💡 進捗はあなたのブラウザの LocalStorage に保存されます。 問題を解いて「正解」になると自動でステップが進みます。
        クイズ画面の 🔁 ボタンで『見直し』マークを付けると、 ここで弱点として可視化されます。
      </p>
    </>
  );
}

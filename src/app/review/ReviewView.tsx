"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { allQuestions } from "@/data/all-questions";
import { findCategory } from "@/data/categories";
import { loadProgress } from "@/lib/storage";
import {
  type RecallCandidate,
  type RecallReason,
  reasonLabel,
  reasonToneClass,
  recallCandidates,
  summarize,
} from "@/lib/recall";
import type { Progress } from "@/lib/types";

type FilterMode = "all" | RecallReason;

export function ReviewView() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    refresh();
    const handler = () => refresh();
    window.addEventListener("rrq:progress-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("rrq:progress-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const candidates = useMemo(
    () => (progress ? recallCandidates(progress, allQuestions) : []),
    [progress],
  );
  const summary = useMemo(() => summarize(candidates), [candidates]);
  const filtered = useMemo(
    () =>
      filter === "all"
        ? candidates
        : candidates.filter((c) => c.reason === filter),
    [candidates, filter],
  );

  const topCandidate = candidates[0] ?? null;

  return (
    <>
      {/* パンくず */}
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          復習推奨
        </span>
      </div>

      <header className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Spaced Recall · 忘却曲線リマインド
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          🔁 そろそろ復習しませんか？
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Ebbinghaus の忘却曲線では、 1 日後で約 50%、 7 日後で約 75% の知識が消えていきます。
          解いてから時間が経った問題や、 自分で『🔁 要見直し』 を付けた問題を優先度順に表示します。
        </p>
      </header>

      {/* === ヒーロー: 推奨 1 問 ============================================= */}
      {topCandidate ? (
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border-2 border-rose-300/70 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50 p-6 shadow-md dark:border-rose-400/30 dark:from-rose-950/30 dark:via-zinc-900/40 dark:to-fuchsia-950/30"
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-300">
            🎯 まず最優先で復習する 1 問
          </p>
          <CandidateRow candidate={topCandidate} large />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link
              href={`/quiz/${topCandidate.question.categoryId}/${topCandidate.question.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-500/30 transition hover:bg-rose-600"
            >
              <span>この問題を復習する</span>
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/flashcards"
              className="inline-flex items-center gap-1 rounded-xl border border-violet-300 bg-white px-4 py-2.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50 dark:border-violet-500/40 dark:bg-zinc-800 dark:text-violet-200 dark:hover:bg-violet-500/10"
            >
              🃏 フラッシュカードも見る
            </Link>
          </div>
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-emerald-300/70 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 dark:border-emerald-400/30 dark:from-emerald-950/30 dark:via-zinc-900/40 dark:to-teal-950/30"
        >
          <p className="text-3xl">🎉</p>
          <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            今日の復習対象はありません
          </h2>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
            新しい問題に挑戦して、 さらに学びを積み上げましょう。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/#tracks"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-600"
            >
              📚 Track を選ぶ →
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500/40 dark:bg-zinc-800 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
            >
              🗺️ ロードマップで次のステップ
            </Link>
          </div>
        </motion.section>
      )}

      {/* === サマリ ============================================= */}
      {candidates.length > 0 && (
        <section className="mt-5 grid grid-cols-3 gap-2">
          <SummaryCard
            label="🔁 見直しマーク"
            value={summary.markedReview}
            tone="amber"
            onClick={() =>
              setFilter(
                summary.markedReview > 0 ? "marked-review" : "all",
              )
            }
            disabled={summary.markedReview === 0}
          />
          <SummaryCard
            label="🌀 30 日以上前"
            value={summary.over30d}
            tone="rose"
            onClick={() =>
              setFilter(summary.over30d > 0 ? "solved-30d" : "all")
            }
            disabled={summary.over30d === 0}
          />
          <SummaryCard
            label="⏳ 7 日以上前"
            value={summary.over7d}
            tone="sky"
            onClick={() =>
              setFilter(summary.over7d > 0 ? "solved-7d" : "all")
            }
            disabled={summary.over7d === 0}
          />
        </section>
      )}

      {/* === フィルタチップ ============================================= */}
      {candidates.length > 0 && (
        <section className="mt-5 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            フィルタ
          </span>
          <FilterChip
            active={filter === "all"}
            count={candidates.length}
            onClick={() => setFilter("all")}
            label="全部"
            emoji="📋"
          />
          {summary.markedReview > 0 && (
            <FilterChip
              active={filter === "marked-review"}
              count={summary.markedReview}
              onClick={() => setFilter("marked-review")}
              label="見直し"
              emoji="🔁"
            />
          )}
          {summary.over30d > 0 && (
            <FilterChip
              active={filter === "solved-30d"}
              count={summary.over30d}
              onClick={() => setFilter("solved-30d")}
              label="30 日+"
              emoji="🌀"
            />
          )}
          {summary.over7d > 0 && (
            <FilterChip
              active={filter === "solved-7d"}
              count={summary.over7d}
              onClick={() => setFilter("solved-7d")}
              label="7 日+"
              emoji="⏳"
            />
          )}
        </section>
      )}

      {/* === 候補リスト ============================================= */}
      {candidates.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            復習リスト ({filtered.length})
          </h2>
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.02]">
              該当する候補はありません
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="ml-2 text-rose-600 underline-offset-2 hover:underline dark:text-rose-300"
              >
                全部表示に戻す
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {filtered.map((c) => (
                <li key={c.question.id}>
                  <Link
                    href={`/quiz/${c.question.categoryId}/${c.question.id}`}
                    className="block rounded-xl border border-zinc-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/40 dark:hover:border-rose-400/40"
                  >
                    <CandidateRow candidate={c} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <p className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
        💡 復習の閾値は『見直しマーク済 = 最優先 / solved 後 7 日 + 30 日 経過』
        の 3 段階。 mastered マークを付けた問題は表示されません。
        間隔反復学習でしっかり長期記憶へ ─ もっと体系的にやりたい人は{" "}
        <Link
          href="/flashcards"
          className="text-rose-600 underline-offset-2 hover:underline dark:text-rose-300"
        >
          フラッシュカード (SM-2)
        </Link>{" "}
        もどうぞ。
      </p>
    </>
  );
}

// ===========================================================================
// パーツ
// ===========================================================================

function CandidateRow({
  candidate,
  large,
}: {
  candidate: RecallCandidate;
  large?: boolean;
}) {
  const cat = findCategory(candidate.question.categoryId);
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[10px]">
          <span
            className={`rounded-full border px-2 py-0.5 font-semibold ${reasonToneClass(candidate.reason)}`}
          >
            {reasonLabel(candidate.reason)}
          </span>
          {cat && (
            <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              {cat.emoji} {cat.name}
            </span>
          )}
          <span className="font-mono text-zinc-500 dark:text-zinc-400">
            {candidate.daysSinceSolved} 日前に挑戦
          </span>
        </div>
        <p
          className={`line-clamp-2 font-medium leading-snug text-zinc-900 dark:text-zinc-100 ${
            large ? "mt-2 text-base" : "text-sm"
          }`}
        >
          {candidate.question.question}
        </p>
      </div>
      {!large && (
        <span
          aria-hidden
          className="self-center text-zinc-300 transition dark:text-zinc-600"
        >
          →
        </span>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
  onClick,
  disabled,
}: {
  label: string;
  value: number;
  tone: "amber" | "rose" | "sky";
  onClick: () => void;
  disabled: boolean;
}) {
  const colors = {
    amber:
      "border-amber-200 bg-amber-50/60 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/[0.07] dark:text-amber-200",
    rose: "border-rose-200 bg-rose-50/60 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/[0.07] dark:text-rose-200",
    sky: "border-sky-200 bg-sky-50/60 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/[0.07] dark:text-sky-200",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border px-3 py-2 text-left transition disabled:cursor-default disabled:opacity-50 enabled:hover:shadow-sm ${colors[tone]}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
        {label}
      </p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums">{value}</p>
    </button>
  );
}

function FilterChip({
  active,
  count,
  onClick,
  label,
  emoji,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  label: string;
  emoji: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
        active
          ? "border-rose-400 bg-rose-500 text-white shadow-sm shadow-rose-500/30"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/40 dark:hover:text-rose-300"
      }`}
    >
      <span aria-hidden>{emoji}</span>
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 py-px font-mono text-[10px] ${active ? "bg-white/25" : "bg-zinc-100 dark:bg-white/10"}`}
      >
        {count}
      </span>
    </button>
  );
}

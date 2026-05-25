/**
 * 忘却曲線ベースの復習推奨。
 *
 * 解いた問題を時間経過 + 自分のマークから『そろそろ復習』と判定する。
 * Ebbinghaus 曲線 (1 日後で約 50% 忘れる → 7 日後で約 75% → 30 日後で
 * ほぼ消える) を簡略化した 3 段階モデル。
 *
 * - marked === "mastered" は除外 (もう習得済)
 * - marked === "review" は最優先 (本人が見直し希望)
 * - solved 7+ 日経過 → 軽い復習推奨
 * - solved 30+ 日経過 → 定着確認の強い推奨
 * - 未挑戦 / 未正解 は対象外 (別ルート)
 */

import type { Progress, Question } from "./types";

const MS_DAY = 86400000;

export type RecallReason =
  | "marked-review" // 本人が 🔁 マークを付けた
  | "solved-30d" // 30 日以上前に解いた (再強化)
  | "solved-7d"; // 7 日以上前に解いた (確認)

export type RecallCandidate = {
  question: Question;
  daysSinceSolved: number;
  reason: RecallReason;
  /** 高いほど優先 */
  priority: number;
};

export const RECALL_THRESHOLDS = {
  weekly: 7,
  monthly: 30,
} as const;

export function reasonLabel(reason: RecallReason): string {
  switch (reason) {
    case "marked-review":
      return "🔁 見直しマーク済";
    case "solved-30d":
      return "🌀 30 日以上経過";
    case "solved-7d":
      return "⏳ 7 日以上経過";
  }
}

export function reasonToneClass(reason: RecallReason): string {
  switch (reason) {
    case "marked-review":
      return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/40";
    case "solved-30d":
      return "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/40";
    case "solved-7d":
      return "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/40";
  }
}

export function recallCandidates(
  progress: Progress,
  questions: Question[],
  now: Date = new Date(),
): RecallCandidate[] {
  const out: RecallCandidate[] = [];
  const today = now.getTime();

  for (const q of questions) {
    const a = progress.attempts[q.id];
    if (!a) continue; // 未挑戦
    if (a.mark === "mastered") continue; // 習得済は除外
    if (!a.lastAnsweredAt) continue;

    const days = Math.floor(
      (today - new Date(a.lastAnsweredAt).getTime()) / MS_DAY,
    );

    // 見直しマーク済は時間関係なく最優先
    if (a.mark === "review") {
      out.push({
        question: q,
        daysSinceSolved: days,
        reason: "marked-review",
        priority: 1000 + days,
      });
      continue;
    }

    // solved 済のみ忘却曲線対象 (未正解の問題は別途扱う)
    if (!a.solved) continue;

    if (days >= RECALL_THRESHOLDS.monthly) {
      out.push({
        question: q,
        daysSinceSolved: days,
        reason: "solved-30d",
        priority: 500 + days,
      });
    } else if (days >= RECALL_THRESHOLDS.weekly) {
      out.push({
        question: q,
        daysSinceSolved: days,
        reason: "solved-7d",
        priority: 100 + days,
      });
    }
  }

  return out.sort((a, b) => b.priority - a.priority);
}

export type RecallSummary = {
  total: number;
  markedReview: number;
  over30d: number;
  over7d: number;
};

export function summarize(candidates: RecallCandidate[]): RecallSummary {
  const s: RecallSummary = {
    total: candidates.length,
    markedReview: 0,
    over30d: 0,
    over7d: 0,
  };
  for (const c of candidates) {
    if (c.reason === "marked-review") s.markedReview++;
    else if (c.reason === "solved-30d") s.over30d++;
    else if (c.reason === "solved-7d") s.over7d++;
  }
  return s;
}

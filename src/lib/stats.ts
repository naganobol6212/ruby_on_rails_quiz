/**
 * 学習統計ダッシュボード用の集計ヘルパー。
 *
 * 制限事項:
 * - QuestionAttempt.lastAnsweredAt は『最後に挑戦した日時』のみ保持。
 *   過去 N 週の細かい時系列は再構築できないため、 週次/月次の
 *   グラフは『その期間内に最後に挑戦した問題』ベースの近似となる。
 */

import { allQuestions } from "@/data/all-questions";
import { categories, findCategory } from "@/data/categories";
import type { Category, Progress, Question } from "@/lib/types";
import type { JournalEntry } from "@/lib/journal";

// ===========================================================================
// 日付ヘルパー
// ===========================================================================

const MS_DAY = 86400000;

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** 月曜始まりの週の開始日 (ISO 風) */
function startOfWeek(d: Date): Date {
  const dt = startOfDay(d);
  const dow = (dt.getDay() + 6) % 7; // Mon=0, Sun=6
  dt.setDate(dt.getDate() - dow);
  return dt;
}

// ===========================================================================
// 型
// ===========================================================================

export type OverallStats = {
  /** 挑戦したことのある問題数 (unique) */
  attemptedQuestions: number;
  /** これまでに解けた問題数 (unique) */
  solvedQuestions: number;
  /** 累計挑戦回数 (重複含む) */
  totalAttempts: number;
  /** 解いた / 挑戦した の比率 (%) — 『定着率』 */
  accuracy: number;
  /** ロードマップ全体に対する達成率 (%) */
  roadmapPercent: number;
  /** 累計ジャーナル件数 */
  journalEntries: number;
  /** クイズ or ジャーナルで活動した日数 (unique) */
  learningDays: number;
};

export type WeeklyActivity = {
  weekStart: string; // YYYY-MM-DD
  label: string; // M/D
  attempts: number; // その週に最後に挑戦した問題数
  solved: number; // うち solved
};

export type MonthlyActivity = {
  ym: string; // YYYY-MM
  label: string; // M月
  attempts: number;
  solved: number;
  journalEntries: number;
};

export type CategoryStats = {
  categoryId: string;
  category: Category;
  total: number;
  attempted: number;
  solved: number;
  weak: number; // review マーク
  /** total に対する solved 率 (%) */
  percent: number;
};

export type DifficultyStats = {
  difficulty: "beginner" | "intermediate" | "advanced";
  total: number;
  attempted: number;
  solved: number;
  percent: number;
};

export type TemplateUsage = {
  templateId: string;
  count: number;
};

// ===========================================================================
// Overall
// ===========================================================================

export function overallStats(
  progress: Progress,
  entries: JournalEntry[],
  roadmapTotalQuestions = 0,
): OverallStats {
  const attemptedQuestions = Object.keys(progress.attempts).length;
  const solvedQuestions = Object.values(progress.attempts).filter(
    (a) => a.solved,
  ).length;
  const accuracy =
    attemptedQuestions > 0
      ? Math.round((solvedQuestions / attemptedQuestions) * 100)
      : 0;
  const roadmapPercent =
    roadmapTotalQuestions > 0
      ? Math.round((solvedQuestions / roadmapTotalQuestions) * 100)
      : 0;

  const days = new Set<string>();
  for (const a of Object.values(progress.attempts)) {
    if (a.lastAnsweredAt) days.add(toDateKey(new Date(a.lastAnsweredAt)));
  }
  for (const e of entries) {
    days.add(toDateKey(new Date(e.createdAt)));
  }

  return {
    attemptedQuestions,
    solvedQuestions,
    totalAttempts: progress.totalAttempts,
    accuracy,
    roadmapPercent,
    journalEntries: entries.length,
    learningDays: days.size,
  };
}

// ===========================================================================
// 週次活動
// ===========================================================================

export function weeklyActivity(
  progress: Progress,
  weeks = 12,
): WeeklyActivity[] {
  const todayWeek = startOfWeek(new Date());
  const buckets: WeeklyActivity[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const ws = new Date(todayWeek.getTime() - i * 7 * MS_DAY);
    buckets.push({
      weekStart: toDateKey(ws),
      label: `${ws.getMonth() + 1}/${ws.getDate()}`,
      attempts: 0,
      solved: 0,
    });
  }
  for (const a of Object.values(progress.attempts)) {
    if (!a.lastAnsweredAt) continue;
    const ws = startOfWeek(new Date(a.lastAnsweredAt));
    const key = toDateKey(ws);
    const b = buckets.find((x) => x.weekStart === key);
    if (b) {
      b.attempts += a.attempts;
      if (a.solved) b.solved++;
    }
  }
  return buckets;
}

// ===========================================================================
// 月次活動
// ===========================================================================

export function monthlyActivity(
  progress: Progress,
  entries: JournalEntry[],
  months = 6,
): MonthlyActivity[] {
  const now = new Date();
  const buckets: MonthlyActivity[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({
      ym,
      label: `${d.getMonth() + 1}月`,
      attempts: 0,
      solved: 0,
      journalEntries: 0,
    });
  }
  const ymOf = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };
  for (const a of Object.values(progress.attempts)) {
    if (!a.lastAnsweredAt) continue;
    const ym = ymOf(a.lastAnsweredAt);
    const b = buckets.find((x) => x.ym === ym);
    if (b) {
      b.attempts += a.attempts;
      if (a.solved) b.solved++;
    }
  }
  for (const e of entries) {
    const ym = ymOf(e.createdAt);
    const b = buckets.find((x) => x.ym === ym);
    if (b) b.journalEntries++;
  }
  return buckets;
}

// ===========================================================================
// カテゴリー別
// ===========================================================================

export function categoryStats(progress: Progress): CategoryStats[] {
  const map = new Map<
    string,
    { total: number; attempted: number; solved: number; weak: number }
  >();
  for (const q of allQuestions) {
    const c = map.get(q.categoryId) ?? {
      total: 0,
      attempted: 0,
      solved: 0,
      weak: 0,
    };
    c.total++;
    const a = progress.attempts[q.id];
    if (a) {
      c.attempted++;
      if (a.solved) c.solved++;
      if (a.mark === "review") c.weak++;
    }
    map.set(q.categoryId, c);
  }
  return categories
    .map((cat) => {
      const s = map.get(cat.id) ?? {
        total: 0,
        attempted: 0,
        solved: 0,
        weak: 0,
      };
      return {
        categoryId: cat.id,
        category: cat,
        total: s.total,
        attempted: s.attempted,
        solved: s.solved,
        weak: s.weak,
        percent: s.total === 0 ? 0 : Math.round((s.solved / s.total) * 100),
      } satisfies CategoryStats;
    })
    .filter((s) => s.total > 0);
}

// ===========================================================================
// 難易度別
// ===========================================================================

export function difficultyStats(progress: Progress): DifficultyStats[] {
  const buckets: Record<
    DifficultyStats["difficulty"],
    { total: number; attempted: number; solved: number }
  > = {
    beginner: { total: 0, attempted: 0, solved: 0 },
    intermediate: { total: 0, attempted: 0, solved: 0 },
    advanced: { total: 0, attempted: 0, solved: 0 },
  };
  for (const q of allQuestions as Question[]) {
    const b = buckets[q.difficulty];
    if (!b) continue;
    b.total++;
    const a = progress.attempts[q.id];
    if (a) {
      b.attempted++;
      if (a.solved) b.solved++;
    }
  }
  return (
    ["beginner", "intermediate", "advanced"] as const
  ).map((diff) => {
    const b = buckets[diff];
    return {
      difficulty: diff,
      total: b.total,
      attempted: b.attempted,
      solved: b.solved,
      percent: b.total === 0 ? 0 : Math.round((b.solved / b.total) * 100),
    };
  });
}

// ===========================================================================
// テンプレ使用比率
// ===========================================================================

export function templateUsage(entries: JournalEntry[]): TemplateUsage[] {
  const c = new Map<string, number>();
  for (const e of entries) c.set(e.templateId, (c.get(e.templateId) ?? 0) + 1);
  return Array.from(c.entries())
    .map(([templateId, count]) => ({ templateId, count }))
    .sort((a, b) => b.count - a.count);
}

// ===========================================================================
// findCategory re-export (UI で表示名取得用)
// ===========================================================================
export { findCategory };

// 既存の questions.ts + 新カテゴリ questions-extra.ts + Track 用 questions-tracks.ts + DB 設計 questions-db.ts を統合
import { questions as base } from "./questions";
import { extraQuestions } from "./questions-extra";
import { trackQuestions } from "./questions-tracks";
import { dbQuestions } from "./questions-db";
import { categories, findCategory } from "./categories";
import type { Question } from "@/lib/types";

export const allQuestions: Question[] = [
  ...base,
  ...extraQuestions,
  ...trackQuestions,
  ...dbQuestions,
];

export const questionsByCategory = (categoryId: string) =>
  allQuestions.filter((q) => q.categoryId === categoryId);

export const findQuestion = (id: string) =>
  allQuestions.find((q) => q.id === id);

// Track 関連の集計ヘルパ
export const questionsByTrack = (trackId: string) => {
  const categoryIds = categories
    .filter((c) => c.trackId === trackId)
    .map((c) => c.id);
  return allQuestions.filter((q) => categoryIds.includes(q.categoryId));
};

export const trackOfCategory = (categoryId: string): string | undefined =>
  findCategory(categoryId)?.trackId;

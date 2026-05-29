// 既存の questions.ts + 新カテゴリ questions-extra.ts + Track 用 questions-tracks.ts + DB 設計 questions-db.ts + 拡充 questions-extra-2.ts + 拡充 questions-extra-3.ts + AI/Claude 5 カテゴリを統合
import { questions as base } from "./questions";
import { extraQuestions } from "./questions-extra";
import { trackQuestions } from "./questions-tracks";
import { dbQuestions } from "./questions-db";
import { extraQuestions2 } from "./questions-extra-2";
import { extraQuestions3 } from "./questions-extra-3";
import { extraQuestions4 } from "./questions-extra-4";
import { aiEngineeringQuestions } from "./questions-ai-engineering";
import { claudeCodeBasicsQuestions } from "./questions-claude-code-basics";
import { claudeCodePracticeQuestions } from "./questions-claude-code-practice";
import { aiSecurityQuestions } from "./questions-ai-security";
import { expertQuestions } from "./questions-expert";
import { expandQuestions } from "./questions-expand";
import { categories, findCategory } from "./categories";
import type { Question } from "@/lib/types";

export const allQuestions: Question[] = [
  ...base,
  ...extraQuestions,
  ...trackQuestions,
  ...dbQuestions,
  ...extraQuestions2,
  ...extraQuestions3,
  ...extraQuestions4,
  ...aiEngineeringQuestions,
  ...claudeCodeBasicsQuestions,
  ...claudeCodePracticeQuestions,
  ...aiSecurityQuestions,
  ...expertQuestions,
  ...expandQuestions,
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

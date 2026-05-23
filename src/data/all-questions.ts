// 既存の questions.ts と新カテゴリ用 questions-extra.ts を統合するエントリポイント
import { questions as base } from "./questions";
import { extraQuestions } from "./questions-extra";
import type { Question } from "@/lib/types";

export const allQuestions: Question[] = [...base, ...extraQuestions];

export const questionsByCategory = (categoryId: string) =>
  allQuestions.filter((q) => q.categoryId === categoryId);

export const findQuestion = (id: string) =>
  allQuestions.find((q) => q.id === id);

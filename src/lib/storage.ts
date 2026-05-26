import type { Progress, QuestionAttempt, ReviewMark } from "./types";
import { syncPushAttempt } from "./sync";

const STORAGE_KEY = "rrq_progress_v3";

const emptyProgress = (): Progress => ({
  attempts: {},
  totalSolved: 0,
  totalAttempts: 0,
  bestStreak: 0,
});

const emit = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("rrq:progress-updated"));
  }
};

export const loadProgress = (): Progress => {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      attempts: parsed.attempts ?? {},
      totalSolved: parsed.totalSolved ?? 0,
      totalAttempts: parsed.totalAttempts ?? 0,
      bestStreak: parsed.bestStreak ?? 0,
    };
  } catch {
    return emptyProgress();
  }
};

export const saveProgress = (progress: Progress) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  emit();
};

export const getAttempt = (questionId: string): QuestionAttempt | undefined =>
  loadProgress().attempts[questionId];

export const recordAttempt = (
  questionId: string,
  solved: boolean,
  hintsUsed: number,
  currentStreak: number,
): Progress => {
  const progress = loadProgress();
  const prev: QuestionAttempt = progress.attempts[questionId] ?? {
    questionId,
    solved: false,
    attempts: 0,
    hintsUsed: 0,
    lastAnsweredAt: new Date().toISOString(),
    mark: null,
  };

  const wasAlreadySolved = prev.solved;
  const updated: QuestionAttempt = {
    ...prev,
    questionId,
    solved: prev.solved || solved,
    attempts: prev.attempts + 1,
    hintsUsed: Math.max(prev.hintsUsed, hintsUsed),
    lastAnsweredAt: new Date().toISOString(),
  };

  const newProgress: Progress = {
    attempts: { ...progress.attempts, [questionId]: updated },
    totalAttempts: progress.totalAttempts + 1,
    totalSolved:
      progress.totalSolved + (solved && !wasAlreadySolved ? 1 : 0),
    bestStreak: Math.max(progress.bestStreak, currentStreak),
  };

  saveProgress(newProgress);
  syncPushAttempt(updated);
  return newProgress;
};

export const setReviewMark = (questionId: string, mark: ReviewMark) => {
  const progress = loadProgress();
  const prev: QuestionAttempt = progress.attempts[questionId] ?? {
    questionId,
    solved: false,
    attempts: 0,
    hintsUsed: 0,
    lastAnsweredAt: new Date().toISOString(),
    mark: null,
  };

  const updated: QuestionAttempt = { ...prev, mark };
  const newProgress: Progress = {
    ...progress,
    attempts: { ...progress.attempts, [questionId]: updated },
  };
  saveProgress(newProgress);
  syncPushAttempt(updated);
  return newProgress;
};

/**
 * 構造化言語訓練: ユーザーが書いた『自分の言葉での説明』を保存。
 */
export const setSelfExplanation = (
  questionId: string,
  text: string,
): Progress => {
  const progress = loadProgress();
  const prev: QuestionAttempt = progress.attempts[questionId] ?? {
    questionId,
    solved: false,
    attempts: 0,
    hintsUsed: 0,
    lastAnsweredAt: new Date().toISOString(),
    mark: null,
  };
  const updated: QuestionAttempt = {
    ...prev,
    selfExplanation: text,
    selfExplanationUpdatedAt: new Date().toISOString(),
  };
  const newProgress: Progress = {
    ...progress,
    attempts: { ...progress.attempts, [questionId]: updated },
  };
  saveProgress(newProgress);
  syncPushAttempt(updated);
  return newProgress;
};

export const resetProgress = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  emit();
};

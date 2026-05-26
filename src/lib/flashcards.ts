/**
 * フラッシュカード機能 (Spaced Repetition)。
 *
 * - データは LocalStorage (key: rrq_flashcards_v1) に Array で保存。
 * - 復習スケジューリングは SM-2 (SuperMemo 2) の簡略版。
 *   Anki 等で使われている定番アルゴリズム。
 * - ratings: again (忘れた) / hard (難しかった) / good (思い出せた) / easy (簡単)
 */

import type { TemplateId } from "./journal";
import { syncDeleteFlashcard, syncPushFlashcard } from "./sync";

// ===========================================================================
// 型
// ===========================================================================

export type FlashcardSource =
  | { type: "manual" }
  | { type: "quiz"; questionId: string; categoryId: string }
  | { type: "journal"; entryId: string; templateId: TemplateId };

export type Flashcard = {
  id: string;
  /** 表面 (問い・単語) */
  front: string;
  /** 裏面 (答え・意味) */
  back: string;
  /** 補足ヒント (任意) */
  hint?: string;
  /** ユーザー定義タグ */
  tags: string[];
  /** カードの出どころ */
  source: FlashcardSource;
  createdAt: string;
  updatedAt: string;

  // ---- SM-2 fields ----
  /** 次回復習日 (ISO 日付) */
  dueAt: string;
  /** 現在の間隔 (日数) */
  interval: number;
  /** Ease Factor (EF) — 難易度係数。 1.3〜 で増減 */
  ease: number;
  /** 連続正解回数 */
  repetitions: number;
  /** これまでに忘れた回数 */
  lapses: number;
  /** 最後にレビューした日時 (履歴を残さない代わりに最終のみ保持) */
  lastReviewedAt?: string;
};

export type SrsRating = "again" | "hard" | "good" | "easy";

// ===========================================================================
// SM-2 algorithm
// ===========================================================================

const MS_DAY = 86400000;
const INITIAL_EASE = 2.5;

/** カードに評価を適用して次回の interval / dueAt を計算 */
export function applyRating(
  card: Flashcard,
  rating: SrsRating,
  now: Date = new Date(),
): Flashcard {
  let { interval, ease, repetitions, lapses } = card;

  if (rating === "again") {
    repetitions = 0;
    interval = 1; // 翌日もう一度
    lapses += 1;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    // q = SM-2 の品質スコア (0-5)、 hard=3 / good=4 / easy=5
    const q = rating === "hard" ? 3 : rating === "good" ? 4 : 5;

    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.max(1, Math.round(interval * ease));

    if (rating === "hard") interval = Math.max(1, Math.round(interval * 0.8));
    if (rating === "easy") interval = Math.round(interval * 1.3);

    repetitions += 1;
    // EF 更新式 (SM-2 オリジナル)
    ease = Math.max(
      1.3,
      ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
    );
  }

  const due = new Date(now.getTime() + interval * MS_DAY);
  return {
    ...card,
    interval,
    ease,
    repetitions,
    lapses,
    dueAt: due.toISOString(),
    updatedAt: now.toISOString(),
    lastReviewedAt: now.toISOString(),
  };
}

/** 新規カード作成時の初期値 (dueAt は今日 = すぐ復習対象になる) */
export function initialSrsFields(now: Date = new Date()): Pick<
  Flashcard,
  "dueAt" | "interval" | "ease" | "repetitions" | "lapses"
> {
  return {
    dueAt: now.toISOString(),
    interval: 0,
    ease: INITIAL_EASE,
    repetitions: 0,
    lapses: 0,
  };
}

// ===========================================================================
// LocalStorage
// ===========================================================================

const STORAGE_KEY = "rrq_flashcards_v1";

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("rrq:flashcards-updated"));
  }
}

export function loadCards(): Flashcard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Flashcard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(cards: Flashcard[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  emit();
}

export function createCard(input: {
  front: string;
  back: string;
  hint?: string;
  tags?: string[];
  source?: FlashcardSource;
}): Flashcard {
  const now = new Date();
  const card: Flashcard = {
    id: `fc_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`,
    front: input.front.trim(),
    back: input.back.trim(),
    hint: input.hint?.trim() || undefined,
    tags: input.tags ?? [],
    source: input.source ?? { type: "manual" },
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    ...initialSrsFields(now),
  };
  saveAll([...loadCards(), card]);
  syncPushFlashcard(card);
  return card;
}

export function updateCard(
  id: string,
  patch: Partial<Pick<Flashcard, "front" | "back" | "hint" | "tags">>,
): Flashcard | null {
  const cards = loadCards();
  const idx = cards.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated: Flashcard = {
    ...cards[idx],
    ...patch,
    front: (patch.front ?? cards[idx].front).trim(),
    back: (patch.back ?? cards[idx].back).trim(),
    hint: patch.hint?.trim() || cards[idx].hint,
    updatedAt: now,
  };
  cards[idx] = updated;
  saveAll(cards);
  syncPushFlashcard(updated);
  return updated;
}

export function reviewCard(id: string, rating: SrsRating): Flashcard | null {
  const cards = loadCards();
  const idx = cards.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  cards[idx] = applyRating(cards[idx], rating);
  saveAll(cards);
  syncPushFlashcard(cards[idx]);
  return cards[idx];
}

export function deleteCard(id: string): boolean {
  const cards = loadCards();
  const next = cards.filter((c) => c.id !== id);
  if (next.length === cards.length) return false;
  saveAll(next);
  syncDeleteFlashcard(id);
  return true;
}

// ===========================================================================
// Selectors / Queries
// ===========================================================================

/** 今日 (またはそれ以前) が dueAt のカード = 復習対象 */
export function dueCards(cards: Flashcard[], now: Date = new Date()): Flashcard[] {
  const cutoff = now.getTime();
  return cards
    .filter((c) => new Date(c.dueAt).getTime() <= cutoff)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export type CardBucket = "new" | "learning" | "review" | "lapsed";

/** カードのライフサイクル分類 */
export function bucketOf(card: Flashcard): CardBucket {
  if (card.repetitions === 0 && card.lapses === 0) return "new"; // 未学習
  if (card.lapses > 0 && card.repetitions < 2) return "lapsed"; // 忘れて再学習中
  if (card.repetitions < 2) return "learning"; // 学習初期
  return "review"; // 安定して復習サイクルに乗っている
}

export type CardStats = {
  total: number;
  due: number;
  new: number;
  learning: number;
  review: number;
  lapsed: number;
};

export function cardStats(cards: Flashcard[], now: Date = new Date()): CardStats {
  const stats: CardStats = {
    total: cards.length,
    due: 0,
    new: 0,
    learning: 0,
    review: 0,
    lapsed: 0,
  };
  const cutoff = now.getTime();
  for (const c of cards) {
    if (new Date(c.dueAt).getTime() <= cutoff) stats.due++;
    const b = bucketOf(c);
    stats[b]++;
  }
  return stats;
}

/** クイズ問題 ID 由来のカードを 1 件取得 (重複防止用) */
export function findCardByQuizId(questionId: string): Flashcard | null {
  return (
    loadCards().find(
      (c) => c.source.type === "quiz" && c.source.questionId === questionId,
    ) ?? null
  );
}

/** 次の復習日まで何日か (人間向けの表示用) */
export function daysUntilDue(card: Flashcard, now: Date = new Date()): number {
  const diff =
    new Date(card.dueAt).getTime() - new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
  return Math.round(diff / MS_DAY);
}

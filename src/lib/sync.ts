/**
 * LocalStorage ↔ Supabase 同期エンジン。
 *
 * 設計方針:
 * - LocalStorage が「実行時の真」 (UI は変更なし、 既存コードはそのまま動く)
 * - 書き込み時は LocalStorage 即時 → Supabase に fire-and-forget で push
 * - ログイン直後は両方を pull してマージ → 両方に書き戻し
 * - コンフリクトは『最後に更新された方が勝ち』 (last-write-wins by timestamp)
 *
 * ログインしていない / Supabase 未設定 の場合は no-op で LocalStorage のみ動作。
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import type { Progress, QuestionAttempt } from "@/lib/types";
import type { JournalEntry } from "@/lib/journal";
import type { Flashcard } from "@/lib/flashcards";

const PROGRESS_KEY = "rrq_progress_v3";
const JOURNAL_KEY = "rrq_journal_v1";
const FLASHCARDS_KEY = "rrq_flashcards_v1";

// ===========================================================================
// 現在のユーザー ID を取得 (キャッシュ)
// ===========================================================================

let cachedUserId: string | null = null;

export function getCurrentUserId(): string | null {
  return cachedUserId;
}

export function setCurrentUserId(id: string | null): void {
  cachedUserId = id;
}

// ===========================================================================
// LocalStorage ヘルパ (各 lib を import すると循環するため最小限を再実装)
// ===========================================================================

function readProgress(): Progress {
  if (typeof window === "undefined")
    return { attempts: {}, totalSolved: 0, totalAttempts: 0, bestStreak: 0 };
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw)
      return { attempts: {}, totalSolved: 0, totalAttempts: 0, bestStreak: 0 };
    return JSON.parse(raw) as Progress;
  } catch {
    return { attempts: {}, totalSolved: 0, totalAttempts: 0, bestStreak: 0 };
  }
}

function writeProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("rrq:progress-updated"));
}

function readJournal(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(JOURNAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

function writeJournal(entries: JournalEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("rrq:journal-updated"));
}

function readFlashcards(): Flashcard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FLASHCARDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Flashcard[];
  } catch {
    return [];
  }
}

function writeFlashcards(cards: Flashcard[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(cards));
  window.dispatchEvent(new Event("rrq:flashcards-updated"));
}

// ===========================================================================
// DB ↔ App の変換
// ===========================================================================

type AttemptRow = {
  user_id: string;
  question_id: string;
  solved: boolean;
  attempts: number;
  hints_used: number;
  last_answered_at: string;
  mark: string | null;
  self_explanation: string | null;
  self_explanation_updated_at: string | null;
};

function attemptToRow(a: QuestionAttempt, userId: string): AttemptRow {
  return {
    user_id: userId,
    question_id: a.questionId,
    solved: a.solved,
    attempts: a.attempts,
    hints_used: a.hintsUsed,
    last_answered_at: a.lastAnsweredAt,
    mark: a.mark,
    self_explanation: a.selfExplanation ?? null,
    self_explanation_updated_at: a.selfExplanationUpdatedAt ?? null,
  };
}

function rowToAttempt(r: AttemptRow): QuestionAttempt {
  return {
    questionId: r.question_id,
    solved: r.solved,
    attempts: r.attempts,
    hintsUsed: r.hints_used,
    lastAnsweredAt: r.last_answered_at,
    mark: (r.mark as QuestionAttempt["mark"]) ?? null,
    selfExplanation: r.self_explanation ?? undefined,
    selfExplanationUpdatedAt: r.self_explanation_updated_at ?? undefined,
  };
}

type JournalRow = {
  id: string;
  user_id: string;
  template_id: string;
  title: string;
  content: Record<string, string>;
  created_at: string;
  updated_at: string;
};

function journalToRow(e: JournalEntry, userId: string): JournalRow {
  return {
    id: e.id,
    user_id: userId,
    template_id: e.templateId,
    title: e.title,
    content: e.content,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  };
}

function rowToJournal(r: JournalRow): JournalEntry {
  return {
    id: r.id,
    templateId: r.template_id as JournalEntry["templateId"],
    title: r.title,
    content: r.content,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

type FlashcardRow = {
  id: string;
  user_id: string;
  front: string;
  back: string;
  hint: string | null;
  tags: string[];
  source: Flashcard["source"];
  due_at: string;
  interval: number;
  ease: number;
  repetitions: number;
  lapses: number;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

function flashcardToRow(c: Flashcard, userId: string): FlashcardRow {
  return {
    id: c.id,
    user_id: userId,
    front: c.front,
    back: c.back,
    hint: c.hint ?? null,
    tags: c.tags,
    source: c.source,
    due_at: c.dueAt,
    interval: c.interval,
    ease: c.ease,
    repetitions: c.repetitions,
    lapses: c.lapses,
    last_reviewed_at: c.lastReviewedAt ?? null,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}

function rowToFlashcard(r: FlashcardRow): Flashcard {
  return {
    id: r.id,
    front: r.front,
    back: r.back,
    hint: r.hint ?? undefined,
    tags: r.tags ?? [],
    source: r.source,
    dueAt: r.due_at,
    interval: r.interval,
    ease: Number(r.ease),
    repetitions: r.repetitions,
    lapses: r.lapses,
    lastReviewedAt: r.last_reviewed_at ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// ===========================================================================
// マージロジック (last-write-wins by timestamp)
// ===========================================================================

function mergeAttempts(
  local: Record<string, QuestionAttempt>,
  remote: QuestionAttempt[],
): Record<string, QuestionAttempt> {
  const merged: Record<string, QuestionAttempt> = { ...local };
  for (const r of remote) {
    const l = merged[r.questionId];
    if (!l) {
      merged[r.questionId] = r;
      continue;
    }
    // 後勝ち
    const lTime = Date.parse(l.lastAnsweredAt);
    const rTime = Date.parse(r.lastAnsweredAt);
    if (rTime >= lTime) {
      merged[r.questionId] = {
        ...r,
        // solved は OR で残す (片方で解けたなら solved)
        solved: l.solved || r.solved,
        attempts: Math.max(l.attempts, r.attempts),
        hintsUsed: Math.max(l.hintsUsed, r.hintsUsed),
      };
    } else {
      merged[r.questionId] = {
        ...l,
        solved: l.solved || r.solved,
        attempts: Math.max(l.attempts, r.attempts),
        hintsUsed: Math.max(l.hintsUsed, r.hintsUsed),
      };
    }
  }
  return merged;
}

function mergeById<T extends { id: string; updatedAt: string }>(
  local: T[],
  remote: T[],
): T[] {
  const map = new Map<string, T>();
  for (const e of local) map.set(e.id, e);
  for (const r of remote) {
    const l = map.get(r.id);
    if (!l) {
      map.set(r.id, r);
    } else {
      const lTime = Date.parse(l.updatedAt);
      const rTime = Date.parse(r.updatedAt);
      map.set(r.id, rTime >= lTime ? r : l);
    }
  }
  return Array.from(map.values());
}

// ===========================================================================
// Pull
// ===========================================================================

async function pullAttempts(
  sb: SupabaseClient,
  userId: string,
): Promise<QuestionAttempt[]> {
  const { data, error } = await sb
    .from("attempts")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("[sync] pullAttempts failed", error);
    return [];
  }
  return (data as AttemptRow[]).map(rowToAttempt);
}

async function pullJournal(
  sb: SupabaseClient,
  userId: string,
): Promise<JournalEntry[]> {
  const { data, error } = await sb
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("[sync] pullJournal failed", error);
    return [];
  }
  return (data as JournalRow[]).map(rowToJournal);
}

async function pullFlashcards(
  sb: SupabaseClient,
  userId: string,
): Promise<Flashcard[]> {
  const { data, error } = await sb
    .from("flashcards")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("[sync] pullFlashcards failed", error);
    return [];
  }
  return (data as FlashcardRow[]).map(rowToFlashcard);
}

// ===========================================================================
// Push (bulk / single)
// ===========================================================================

async function pushAttempts(
  sb: SupabaseClient,
  userId: string,
  attempts: QuestionAttempt[],
): Promise<void> {
  if (attempts.length === 0) return;
  const rows = attempts.map((a) => attemptToRow(a, userId));
  const { error } = await sb
    .from("attempts")
    .upsert(rows, { onConflict: "user_id,question_id" });
  if (error) console.error("[sync] pushAttempts failed", error);
}

async function pushJournalEntries(
  sb: SupabaseClient,
  userId: string,
  entries: JournalEntry[],
): Promise<void> {
  if (entries.length === 0) return;
  const rows = entries.map((e) => journalToRow(e, userId));
  const { error } = await sb.from("journal_entries").upsert(rows);
  if (error) console.error("[sync] pushJournalEntries failed", error);
}

async function pushFlashcards(
  sb: SupabaseClient,
  userId: string,
  cards: Flashcard[],
): Promise<void> {
  if (cards.length === 0) return;
  const rows = cards.map((c) => flashcardToRow(c, userId));
  const { error } = await sb.from("flashcards").upsert(rows);
  if (error) console.error("[sync] pushFlashcards failed", error);
}

// ===========================================================================
// Public: ログイン直後の初回マージ同期
// ===========================================================================

export async function syncOnLogin(
  sb: SupabaseClient,
  userId: string,
): Promise<void> {
  setCurrentUserId(userId);

  // 1) Pull
  const [remoteAttempts, remoteJournal, remoteFlashcards] = await Promise.all([
    pullAttempts(sb, userId),
    pullJournal(sb, userId),
    pullFlashcards(sb, userId),
  ]);

  // 2) Merge with local
  const localProgress = readProgress();
  const mergedAttempts = mergeAttempts(localProgress.attempts, remoteAttempts);
  const mergedSolved = Object.values(mergedAttempts).filter(
    (a) => a.solved,
  ).length;
  const mergedAttemptsCount = Object.values(mergedAttempts).reduce(
    (sum, a) => sum + a.attempts,
    0,
  );
  const mergedProgress: Progress = {
    attempts: mergedAttempts,
    totalSolved: mergedSolved,
    totalAttempts: Math.max(localProgress.totalAttempts, mergedAttemptsCount),
    bestStreak: localProgress.bestStreak, // streak はローカルを尊重 (DB に持たない)
  };
  writeProgress(mergedProgress);

  const localJournal = readJournal();
  const mergedJournal = mergeById(localJournal, remoteJournal);
  writeJournal(mergedJournal);

  const localFlashcards = readFlashcards();
  const mergedFlashcards = mergeById(localFlashcards, remoteFlashcards);
  writeFlashcards(mergedFlashcards);

  // 3) Push merged result back so Supabase も最新になる
  await Promise.all([
    pushAttempts(sb, userId, Object.values(mergedAttempts)),
    pushJournalEntries(sb, userId, mergedJournal),
    pushFlashcards(sb, userId, mergedFlashcards),
  ]);
}

// ===========================================================================
// Public: 単一レコードの fire-and-forget push (LocalStorage と一緒に呼ぶ)
// ===========================================================================

export function syncPushAttempt(a: QuestionAttempt): void {
  const userId = getCurrentUserId();
  if (!userId) return;
  const sb = getSupabase();
  if (!sb) return;
  void pushAttempts(sb, userId, [a]);
}

export function syncPushJournalEntry(e: JournalEntry): void {
  const userId = getCurrentUserId();
  if (!userId) return;
  const sb = getSupabase();
  if (!sb) return;
  void pushJournalEntries(sb, userId, [e]);
}

export function syncDeleteJournalEntry(id: string): void {
  const userId = getCurrentUserId();
  if (!userId) return;
  const sb = getSupabase();
  if (!sb) return;
  void sb
    .from("journal_entries")
    .delete()
    .eq("user_id", userId)
    .eq("id", id)
    .then(({ error }) => {
      if (error) console.error("[sync] delete journal entry failed", error);
    });
}

export function syncPushFlashcard(c: Flashcard): void {
  const userId = getCurrentUserId();
  if (!userId) return;
  const sb = getSupabase();
  if (!sb) return;
  void pushFlashcards(sb, userId, [c]);
}

export function syncDeleteFlashcard(id: string): void {
  const userId = getCurrentUserId();
  if (!userId) return;
  const sb = getSupabase();
  if (!sb) return;
  void sb
    .from("flashcards")
    .delete()
    .eq("user_id", userId)
    .eq("id", id)
    .then(({ error }) => {
      if (error) console.error("[sync] delete flashcard failed", error);
    });
}

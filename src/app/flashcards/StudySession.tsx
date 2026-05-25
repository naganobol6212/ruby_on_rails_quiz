"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type Flashcard,
  type SrsRating,
  reviewCard,
} from "@/lib/flashcards";

type Props = {
  /** セッションで復習するカード (順序固定) */
  initialCards: Flashcard[];
  onClose: () => void;
};

const RATING_META: Record<
  SrsRating,
  { label: string; sub: string; color: string; hotkey: string }
> = {
  again: {
    label: "Again",
    sub: "忘れていた",
    color:
      "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30",
    hotkey: "1",
  },
  hard: {
    label: "Hard",
    sub: "難しかった",
    color:
      "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30",
    hotkey: "2",
  },
  good: {
    label: "Good",
    sub: "思い出せた",
    color:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30",
    hotkey: "3",
  },
  easy: {
    label: "Easy",
    sub: "簡単だった",
    color:
      "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/30",
    hotkey: "4",
  },
};

/**
 * 学習セッション モーダル
 * - 表面を表示 → スペース/Enter で答え開示 → 4 段階で評価
 * - 評価後は次のカードへ自動遷移、 全て終わるとサマリ表示
 * - キーボード: Space=開示, 1=Again 2=Hard 3=Good 4=Easy, Esc=閉じる
 */
export function StudySession({ initialCards, onClose }: Props) {
  const [cards] = useState(initialCards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState<Record<SrsRating, number>>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });
  const total = cards.length;
  const current = cards[index];
  const isDone = index >= total;

  const applyRate = (rating: SrsRating, card: Flashcard) => {
    reviewCard(card.id, rating);
    setTally((t) => {
      const updated = {
        again: t.again,
        hard: t.hard,
        good: t.good,
        easy: t.easy,
      };
      if (rating === "again") updated.again += 1;
      else if (rating === "hard") updated.hard += 1;
      else if (rating === "good") updated.good += 1;
      else updated.easy += 1;
      return updated;
    });
    setIndex((i) => i + 1);
    setRevealed(false);
  };

  const handleRate = (rating: SrsRating) => {
    if (!current) return;
    applyRate(rating, current);
  };

  // キーボードショートカット
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isDone) {
        if (e.key === "Escape") onClose();
        return;
      }
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (!revealed) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setRevealed(true);
        }
        return;
      }
      const map: Record<string, SrsRating> = {
        "1": "again",
        "2": "hard",
        "3": "good",
        "4": "easy",
      };
      const r = map[e.key];
      if (r && current) {
        e.preventDefault();
        applyRate(r, current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, isDone, current]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="フラッシュカード学習セッション"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur"
      onClick={(e) => {
        if (e.target === e.currentTarget && isDone) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900"
      >
        {/* 上部: 進捗 + 閉じる */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/70 px-5 py-3 dark:border-white/10 dark:bg-zinc-800/40">
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
            {isDone ? `完了 ${total} 枚` : `${index + 1} / ${total}`}
          </p>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-fuchsia-500 transition-all duration-300"
              style={{
                width: `${(Math.min(index, total) / Math.max(1, total)) * 100}%`,
              }}
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>

        {/* 本体 */}
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          {isDone ? (
            <SessionSummary tally={tally} total={total} onClose={onClose} />
          ) : current ? (
            <>
              {/* 表面 */}
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                表面 (front)
              </p>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-6 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="whitespace-pre-wrap text-lg font-semibold leading-relaxed text-zinc-900 dark:text-zinc-50">
                  {current.front}
                </p>
                {current.hint && !revealed && (
                  <p className="mt-3 border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                    💡 ヒント: {current.hint}
                  </p>
                )}
              </div>

              {/* 裏面 (revealed) */}
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="mt-5 mb-3 text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-300">
                      裏面 (back)
                    </p>
                    <div className="rounded-xl border-2 border-rose-300 bg-rose-50/40 px-5 py-6 dark:border-rose-500/30 dark:bg-rose-500/[0.05]">
                      <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
                        {current.back}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* アクション */}
              <div className="mt-6">
                {!revealed ? (
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="block w-full rounded-xl border-2 border-rose-300 bg-white py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50 dark:border-rose-500/50 dark:bg-zinc-800 dark:text-rose-200 dark:hover:bg-rose-500/10"
                  >
                    答えを見る (Space)
                  </button>
                ) : (
                  <>
                    <p className="mb-2 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
                      正しく思い出せましたか？ 自己評価で次回の復習間隔が決まります
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {(["again", "hard", "good", "easy"] as SrsRating[]).map(
                        (r) => {
                          const meta = RATING_META[r];
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => handleRate(r)}
                              className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-3 text-xs font-bold shadow-md transition ${meta.color}`}
                            >
                              <span className="text-sm">{meta.label}</span>
                              <span className="text-[10px] font-medium opacity-80">
                                {meta.sub}
                              </span>
                              <span className="mt-1 inline-block rounded bg-black/20 px-1.5 py-0.5 font-mono text-[9px]">
                                {meta.hotkey}
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* メタ情報 */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                <span>復習 {current.repetitions} 回</span>
                {current.lapses > 0 && (
                  <span className="text-amber-700 dark:text-amber-300">
                    🌀 {current.lapses} 回忘れた
                  </span>
                )}
                <span>EF {current.ease.toFixed(2)}</span>
                {current.tags.length > 0 && (
                  <span>🏷 {current.tags.join(", ")}</span>
                )}
              </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

function SessionSummary({
  tally,
  total,
  onClose,
}: {
  tally: Record<SrsRating, number>;
  total: number;
  onClose: () => void;
}) {
  return (
    <div className="text-center">
      <p className="text-5xl">🎉</p>
      <h3 className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        {total} 枚の復習完了！
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        各カードの次回復習日は SM-2 アルゴリズムで自動調整されました
      </p>

      <ul className="mx-auto mt-5 grid max-w-md grid-cols-4 gap-2 text-xs">
        {(["again", "hard", "good", "easy"] as SrsRating[]).map((r) => (
          <li
            key={r}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {RATING_META[r].label}
            </p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
              {tally[r]}
            </p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-500/30 transition hover:bg-rose-600"
      >
        閉じる
      </button>
    </div>
  );
}

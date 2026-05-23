"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Question } from "@/lib/types";
import { recordAttempt } from "@/lib/storage";
import { HintBox } from "./HintBox";
import { CodeBlock } from "./CodeBlock";
import { ExplanationCard } from "./ExplanationCard";
import { StreakDisplay } from "./StreakDisplay";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  questions: Question[];
  categoryName: string;
  categoryEmoji: string;
};

type Status = "answering" | "correct" | "wrong";

const normalizeText = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, " ");

const difficultyLabel = (d: string) =>
  d === "beginner" ? "初級" : d === "intermediate" ? "中級" : "上級";

const difficultyClass = (d: string) =>
  d === "beginner"
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    : d === "intermediate"
      ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
      : "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300";

export function QuizRunner({ questions, categoryName, categoryEmoji }: Props) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState<Status>("answering");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [sessionSolved, setSessionSolved] = useState(0);
  const [streak, setStreak] = useState(0);

  const current = questions[index];
  const total = questions.length;

  const isCorrect = useMemo(() => {
    if (!current) return false;
    if (current.type === "choice") return choice === current.answerIndex;
    return current.answers.some(
      (a) => normalizeText(a) === normalizeText(textInput),
    );
  }, [current, choice, textInput]);

  if (!current) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-4xl">🤔</p>
        <h2 className="mt-3 text-xl font-bold">このカテゴリには問題がありません</h2>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:underline dark:text-rose-300"
        >
          ← トップに戻る
        </Link>
      </div>
    );
  }

  const handleSubmit = () => {
    if (current.type === "choice" && choice === null) return;
    if (current.type === "text" && textInput.trim() === "") return;

    const correct = isCorrect;
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    setStatus(correct ? "correct" : "wrong");
    recordAttempt(current.id, correct, hintsUsed, newStreak);

    if (correct) {
      setSessionSolved((n) => n + 1);
    }
  };

  const handleNext = () => {
    setIndex((i) => i + 1);
    setChoice(null);
    setTextInput("");
    setStatus("answering");
    setHintsUsed(0);
  };

  const handleRetry = () => {
    setStatus("answering");
    setChoice(null);
    setTextInput("");
  };

  const isFinished = index >= total - 1 && status !== "answering";
  const progressPct =
    ((index + (status !== "answering" ? 1 : 0)) / total) * 100;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          <span>カテゴリ選択</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <StreakDisplay streak={streak} />
          <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-xs text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            <span>正解</span>
            <span className="tabular-nums text-emerald-600 dark:text-emerald-300">
              {sessionSolved}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">/</span>
            <span className="tabular-nums">{total}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* カテゴリラベル + 進捗 */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-base">{categoryEmoji}</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {categoryName}
            </span>
          </div>
          <span className="font-mono">
            問題 {index + 1} / {total}
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      {/* 問題本体 */}
      <AnimatePresence mode="wait">
        <motion.article
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/40 dark:shadow-2xl dark:shadow-black/30"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${difficultyClass(
                current.difficulty,
              )}`}
            >
              {difficultyLabel(current.difficulty)}
            </span>
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
              {current.id}
            </span>
          </div>

          <h2 className="text-lg font-semibold leading-relaxed text-zinc-900 dark:text-zinc-100">
            {current.question}
          </h2>

          {current.code && <CodeBlock code={current.code} />}

          {current.type === "choice" ? (
            <div className="space-y-2.5">
              {current.choices.map((c, i) => {
                const isChosen = choice === i;
                const isAnswer = current.answerIndex === i;
                const showResult = status !== "answering";

                let cls =
                  "border-zinc-200 bg-white hover:border-rose-400 hover:bg-rose-50/40 dark:border-white/10 dark:bg-white/5 dark:hover:border-rose-400/40 dark:hover:bg-white/[0.07]";
                if (showResult && isAnswer)
                  cls =
                    "border-emerald-500/60 bg-emerald-50 ring-2 ring-emerald-500/30 dark:bg-emerald-500/10";
                else if (showResult && isChosen)
                  cls =
                    "border-rose-500/60 bg-rose-50 dark:bg-rose-500/10";
                else if (isChosen)
                  cls =
                    "border-rose-400 bg-rose-50/60 ring-2 ring-rose-500/20 dark:bg-rose-500/10";

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={showResult}
                    onClick={() => setChoice(i)}
                    className={`group w-full overflow-hidden rounded-xl border px-4 py-3.5 text-left text-sm transition disabled:cursor-not-allowed ${cls}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-bold ${
                          showResult && isAnswer
                            ? "bg-emerald-500 text-white"
                            : showResult && isChosen
                              ? "bg-rose-500 text-white"
                              : "bg-zinc-100 text-zinc-700 group-hover:bg-rose-100 group-hover:text-rose-700 dark:bg-white/10 dark:text-zinc-300 dark:group-hover:bg-rose-500/30 dark:group-hover:text-rose-100"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <code className="flex-1 font-mono text-[13px] leading-relaxed text-zinc-900 dark:text-zinc-100">
                        {c}
                      </code>
                      {showResult && isAnswer && (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          ✓
                        </span>
                      )}
                      {showResult && isChosen && !isAnswer && (
                        <span className="text-rose-600 dark:text-rose-400">
                          ✕
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && status === "answering") handleSubmit();
                }}
                disabled={status !== "answering"}
                placeholder="ここに答えを入力 (Enter で回答)"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 font-mono text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-rose-400/50"
              />
            </div>
          )}

          <HintBox
            key={current.id}
            hints={current.hints}
            onHintReveal={(n) => setHintsUsed(n)}
          />

          {status === "answering" ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                (current.type === "choice" && choice === null) ||
                (current.type === "text" && textInput.trim() === "")
              }
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:from-rose-400 hover:to-fuchsia-400 hover:shadow-rose-500/30 disabled:cursor-not-allowed disabled:from-zinc-300 disabled:to-zinc-300 disabled:opacity-70 disabled:shadow-none dark:disabled:from-zinc-700 dark:disabled:to-zinc-700"
            >
              <span>回答する</span>
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
          ) : (
            <div className="space-y-4">
              <ExplanationCard
                explanation={current.explanation}
                isCorrect={status === "correct"}
              />

              {current.type === "text" && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    想定解答
                  </p>
                  <code className="mt-1.5 block font-mono text-sm text-rose-700 dark:text-rose-200">
                    {current.answers.join("  /  ")}
                  </code>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {status === "wrong" && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                  >
                    もう一度挑戦
                  </button>
                )}
                {!isFinished ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:from-rose-400 hover:to-fuchsia-400"
                  >
                    <span>次の問題</span>
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-teal-400"
                  >
                    <span>🎉 完了！トップへ</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

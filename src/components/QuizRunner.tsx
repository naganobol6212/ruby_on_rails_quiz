"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type {
  PracticalQuestion,
  Question,
  QuestionAttempt,
  ReviewMark,
} from "@/lib/types";
import {
  loadProgress,
  recordAttempt,
  setReviewMark,
} from "@/lib/storage";
import { HintBox } from "./HintBox";
import { CodeBlock } from "./CodeBlock";
import { CodeEditor } from "./CodeEditor";
import { ExplanationCard } from "./ExplanationCard";
import { SelfExplanationBox } from "./SelfExplanationBox";
import { StreakDisplay } from "./StreakDisplay";

type Props = {
  questions: Question[];
  categoryName: string;
  categoryEmoji: string;
  categoryId: string;
  startIndex?: number;
};

type Status = "answering" | "correct" | "wrong" | "reviewing";

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

export function QuizRunner({
  questions,
  categoryName,
  categoryEmoji,
  categoryId,
  startIndex = 0,
}: Props) {
  const [index, setIndex] = useState(startIndex);
  const [choice, setChoice] = useState<number | null>(null);
  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState<Status>("answering");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [sessionSolved, setSessionSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attemptCache, setAttemptCache] = useState<
    Record<string, QuestionAttempt>
  >({});

  const current = questions[index];
  const total = questions.length;

  const isCorrect = useMemo(() => {
    if (!current) return false;
    if (current.type === "choice") return choice === current.answerIndex;
    if (current.type === "text")
      return current.answers.some(
        (a) => normalizeText(a) === normalizeText(textInput),
      );
    return false;
  }, [current, choice, textInput]);

  // 進捗キャッシュをロード
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttemptCache(loadProgress().attempts);
    const h = () => setAttemptCache(loadProgress().attempts);
    window.addEventListener("rrq:progress-updated", h);
    return () => window.removeEventListener("rrq:progress-updated", h);
  }, []);

  if (!current) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-4xl">🤔</p>
        <h2 className="mt-3 text-xl font-bold">問題が見つかりません</h2>
        <Link
          href={`/quiz/${categoryId}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:underline dark:text-rose-300"
        >
          ← 問題一覧に戻る
        </Link>
      </div>
    );
  }

  const currentMark: ReviewMark = attemptCache[current.id]?.mark ?? null;

  const handleSubmit = () => {
    if (current.type === "choice" && choice === null) return;
    if (current.type === "text" && textInput.trim() === "") return;

    const correct = isCorrect;
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    setStatus(correct ? "correct" : "wrong");
    recordAttempt(current.id, correct, hintsUsed, newStreak);

    if (correct) setSessionSolved((n) => n + 1);
  };

  const handleRevealPractical = () => {
    recordAttempt(current.id, true, hintsUsed, streak);
    setSessionSolved((n) => n + 1);
    setStatus("reviewing");
  };

  const handleNext = () => {
    if (index >= total - 1) return;
    setIndex((i) => i + 1);
    setChoice(null);
    setTextInput("");
    setStatus("answering");
    setHintsUsed(0);
  };

  const handlePrev = () => {
    if (index <= 0) return;
    setIndex((i) => i - 1);
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

  const handleMark = (mark: ReviewMark) => {
    const next = currentMark === mark ? null : mark;
    setReviewMark(current.id, next);
  };

  const isFinished = index >= total - 1 && status !== "answering";
  const progressPct =
    ((index + (status !== "answering" ? 1 : 0)) / total) * 100;
  const answered = status !== "answering";

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/quiz/${categoryId}`}
          className="group inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          <span>問題一覧</span>
        </Link>
        <div className="flex items-center gap-2.5">
          {current.type !== "practical" && <StreakDisplay streak={streak} />}
          <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-xs text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <span>正解</span>
            <span className="tabular-nums text-emerald-600 dark:text-emerald-300">
              {sessionSolved}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">/</span>
            <span className="tabular-nums">{total - startIndex}</span>
          </div>
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/40 dark:shadow-2xl dark:shadow-black/30"
        >
          {/* 上部メタ情報 */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${difficultyClass(
                current.difficulty,
              )}`}
            >
              {difficultyLabel(current.difficulty)}
            </span>
            {current.type === "practical" && (
              <span className="rounded-full border border-orange-400/40 bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300">
                実践課題
              </span>
            )}
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
              {current.id}
            </span>
            {currentMark && (
              <span
                className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  currentMark === "mastered"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                }`}
              >
                <span>{currentMark === "mastered" ? "✓" : "🔁"}</span>
                <span>{currentMark === "mastered" ? "完璧" : "要見直し"}</span>
              </span>
            )}
          </div>

          <h2 className="text-lg font-semibold leading-relaxed text-zinc-900 dark:text-zinc-100">
            {current.question}
          </h2>

          {current.code && <CodeBlock code={current.code} />}

          {/* 回答エリア */}
          {current.type === "choice" ? (
            <ChoiceArea
              question={current}
              choice={choice}
              setChoice={setChoice}
              showResult={status === "correct" || status === "wrong"}
            />
          ) : current.type === "text" ? (
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
          ) : (
            <>
              <PracticalArea question={current} />
              <CodeEditor questionId={current.id} />
            </>
          )}

          <HintBox
            key={current.id}
            hints={current.hints}
            onHintReveal={(n) => setHintsUsed(n)}
          />

          {/* メインアクション */}
          {!answered ? (
            current.type === "practical" ? (
              <button
                type="button"
                onClick={handleRevealPractical}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-amber-400"
              >
                <span>サンプル解答を見る</span>
                <span>→</span>
              </button>
            ) : (
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
            )
          ) : (
            <div className="space-y-4">
              {/* 解説 */}
              {current.type === "practical" ? (
                <PracticalSolution question={current} />
              ) : (
                <>
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
                </>
              )}

              {/* 構造化言語トレーニング: 自分の言葉で説明 */}
              <SelfExplanationBox
                key={current.id}
                questionId={current.id}
                sampleSummary={current.explanation.summary}
                modelSelfExplanation={current.explanation.modelSelfExplanation}
              />

              {/* 回答後のレビューマーク (大きく、目立つ場所) */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="mb-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  この問題の理解度を記録しましょう
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleMark("mastered")}
                    className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      currentMark === "mastered"
                        ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-emerald-400/40 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                    }`}
                  >
                    <span>✓</span>
                    <span>完璧 (もう見直し不要)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMark("review")}
                    className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      currentMark === "review"
                        ? "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-amber-400/40 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
                    }`}
                  >
                    <span>🔁</span>
                    <span>要見直し (あとで復習)</span>
                  </button>
                  {currentMark && (
                    <button
                      type="button"
                      onClick={() => handleMark(currentMark)}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-600 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
                    >
                      マーク解除
                    </button>
                  )}
                </div>
              </div>

              {/* ナビゲーション */}
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
                    href={`/quiz/${categoryId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-teal-400"
                  >
                    <span>🎉 完了！問題一覧へ</span>
                  </Link>
                )}
                <Link
                  href={`/quiz/${categoryId}`}
                  className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                >
                  問題一覧へ
                </Link>
              </div>
            </div>
          )}

          {/* 前後ナビ (常時) */}
          <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-white/5 dark:text-zinc-400">
            <button
              type="button"
              onClick={handlePrev}
              disabled={index === 0}
              className="inline-flex items-center gap-1 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-rose-300"
            >
              <span>←</span>
              <span>前の問題</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={index === total - 1}
              className="inline-flex items-center gap-1 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-rose-300"
            >
              <span>次の問題</span>
              <span>→</span>
            </button>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

function ChoiceArea({
  question,
  choice,
  setChoice,
  showResult,
}: {
  question: Extract<Question, { type: "choice" }>;
  choice: number | null;
  setChoice: (n: number) => void;
  showResult: boolean;
}) {
  return (
    <div className="space-y-2.5">
      {question.choices.map((c, i) => {
        const isChosen = choice === i;
        const isAnswer = question.answerIndex === i;
        const why = question.choiceExplanations?.[i];

        let cls =
          "border-zinc-200 bg-white hover:border-rose-400 hover:bg-rose-50/40 dark:border-white/10 dark:bg-white/5 dark:hover:border-rose-400/40 dark:hover:bg-white/[0.07]";
        if (showResult && isAnswer)
          cls =
            "border-emerald-500/60 bg-emerald-50 ring-2 ring-emerald-500/30 dark:bg-emerald-500/10";
        else if (showResult && isChosen)
          cls = "border-rose-500/60 bg-rose-50 dark:bg-rose-500/10";
        else if (isChosen)
          cls =
            "border-rose-400 bg-rose-50/60 ring-2 ring-rose-500/20 dark:bg-rose-500/10";

        return (
          <div key={i}>
            <button
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
                  <span className="text-rose-600 dark:text-rose-400">✕</span>
                )}
              </div>
            </button>
            {showResult && why && (
              <ChoiceWhy text={why} isAnswer={isAnswer} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChoiceWhy({ text, isAnswer }: { text: string; isAnswer: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ml-9 mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition ${
          isAnswer
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
            : "border-zinc-300 bg-white text-zinc-600 hover:border-rose-300 hover:text-rose-600 dark:border-white/15 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/40 dark:hover:text-rose-300"
        }`}
      >
        <span>{isAnswer ? "なぜこれが正解か" : "なぜこれは違うか"}</span>
        <span
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <p
              className={`mt-1.5 rounded-md border-l-4 px-3 py-2 text-[12px] leading-relaxed ${
                isAnswer
                  ? "border-emerald-400 bg-emerald-50/60 text-zinc-800 dark:border-emerald-500/40 dark:bg-emerald-500/[0.06] dark:text-zinc-100"
                  : "border-zinc-300 bg-zinc-50/70 text-zinc-700 dark:border-white/20 dark:bg-white/[0.03] dark:text-zinc-200"
              }`}
            >
              {text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PracticalArea({ question }: { question: PracticalQuestion }) {
  return (
    <div className="rounded-xl border border-orange-300/60 bg-orange-50/50 px-4 py-3 dark:border-orange-500/30 dark:bg-orange-500/[0.06]">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-700 dark:text-orange-300">
        要件
      </p>
      <ul className="mt-2 space-y-1.5">
        {question.requirements.map((r, i) => (
          <li
            key={i}
            className="flex gap-2 text-sm text-zinc-800 dark:text-zinc-200"
          >
            <span className="font-mono text-orange-600 dark:text-orange-400">
              □
            </span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
        💡 下のエディタで実装してから、サンプル解答ボタンで答え合わせしましょう。入力は自動保存されます。
      </p>
    </div>
  );
}

function PracticalSolution({ question }: { question: PracticalQuestion }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 overflow-hidden rounded-xl border border-orange-300/60 bg-gradient-to-br from-orange-50 to-white dark:border-orange-500/30 dark:from-orange-500/10 dark:via-orange-500/5 dark:to-transparent"
    >
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-white/5">
        <p className="text-base font-bold text-orange-700 dark:text-orange-300">
          📘 サンプル解答
        </p>
        <p className="mt-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          {question.explanation.summary}
        </p>
      </div>
      <div className="space-y-4 px-5 pb-5">
        <CodeBlock code={question.sampleSolution} />
        <section>
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            🧠 解説
          </h4>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {question.explanation.reason}
          </p>
        </section>
        <section>
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            ✅ レビュー観点 (自分のコードと比較)
          </h4>
          <ul className="space-y-1.5">
            {question.reviewPoints.map((p, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <span className="text-emerald-500">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
        {question.explanation.commonMistakes &&
          question.explanation.commonMistakes.length > 0 && (
            <section>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                ⚠️ よくある間違い
              </h4>
              <ul className="space-y-1.5">
                {question.explanation.commonMistakes.map((m, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
      </div>
    </motion.div>
  );
}

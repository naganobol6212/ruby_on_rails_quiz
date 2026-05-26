"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  type DiagnosisAnswers,
  type DiagnosisQuestionId,
  type DiagnosisResult,
  clearDiagnosis,
  diagnose,
  diagnosisQuestions,
  loadDiagnosis,
  saveDiagnosis,
} from "@/lib/track-diagnosis";
import { findTrack } from "@/data/tracks";

type Phase =
  | { kind: "intro" }
  | { kind: "asking"; step: number; answers: Partial<DiagnosisAnswers> }
  | { kind: "result"; answers: DiagnosisAnswers; result: DiagnosisResult };

export function TrackDiagnosis() {
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });

  useEffect(() => {
    const refresh = () => {
      const stored = loadDiagnosis();
      if (stored) {
        setPhase({ kind: "result", answers: stored.answers, result: stored.result });
      } else {
        setPhase({ kind: "intro" });
      }
    };
    refresh();
    window.addEventListener("rrq:diagnosis-updated", refresh);
    return () => window.removeEventListener("rrq:diagnosis-updated", refresh);
  }, []);

  const startDiagnosis = () =>
    setPhase({ kind: "asking", step: 0, answers: {} });

  const pickAnswer = (questionId: DiagnosisQuestionId, value: string) => {
    if (phase.kind !== "asking") return;
    const nextAnswers = { ...phase.answers, [questionId]: value };
    const nextStep = phase.step + 1;
    if (nextStep >= diagnosisQuestions.length) {
      const full = nextAnswers as DiagnosisAnswers;
      const result = diagnose(full);
      saveDiagnosis(full, result);
      setPhase({ kind: "result", answers: full, result });
    } else {
      setPhase({ kind: "asking", step: nextStep, answers: nextAnswers });
    }
  };

  const reset = () => {
    clearDiagnosis();
    setPhase({ kind: "intro" });
  };

  const containerCls =
    "rounded-2xl border-2 border-sky-300 bg-gradient-to-br from-sky-50 via-white to-emerald-50/60 p-5 shadow-sm dark:border-sky-500/40 dark:from-sky-500/[0.10] dark:via-zinc-900/30 dark:to-emerald-500/[0.06]";

  if (phase.kind === "intro") {
    return (
      <div className={containerCls}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
          📍 はじめての方へ
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          🚀 30 秒の診断で、 あなたに合うトラックを選ぼう
        </h2>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
          経験・興味・進めかたを 3 問答えるだけ。 推奨ロードマップへすぐ案内します。
        </p>
        <button
          type="button"
          onClick={startDiagnosis}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          診断を始める →
        </button>
      </div>
    );
  }

  if (phase.kind === "asking") {
    const q = diagnosisQuestions[phase.step];
    const total = diagnosisQuestions.length;
    return (
      <div className={containerCls}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
          📍 トラック診断 · {phase.step + 1} / {total}
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sky-100/70 dark:bg-sky-500/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all"
            style={{ width: `${((phase.step + 1) / total) * 100}%` }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <h2 className="mt-3 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {q.prompt}
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => pickAnswer(q.id, opt.value)}
                    className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white/80 px-3 py-2.5 text-left text-sm font-medium text-zinc-800 transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:border-sky-500/60 dark:hover:bg-sky-500/10 dark:hover:text-sky-200"
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        {phase.step > 0 && (
          <button
            type="button"
            onClick={() =>
              setPhase({
                kind: "asking",
                step: phase.step - 1,
                answers: phase.answers,
              })
            }
            className="mt-4 text-xs text-zinc-500 hover:text-sky-600 dark:text-zinc-400 dark:hover:text-sky-300"
          >
            ← 前の質問に戻る
          </button>
        )}
      </div>
    );
  }

  // result
  return <ResultPanel result={phase.result} onReset={reset} />;
}

function ResultPanel({
  result,
  onReset,
}: {
  result: DiagnosisResult;
  onReset: () => void;
}) {
  const track = findTrack(result.recommendedTrackId);
  const alsoConsider = result.alsoConsider
    ? findTrack(result.alsoConsider)
    : null;

  if (!track) return null;

  return (
    <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-sky-50/60 p-5 shadow-sm dark:border-emerald-500/40 dark:from-emerald-500/[0.10] dark:via-zinc-900/30 dark:to-sky-500/[0.06]">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
        📍 診断結果
      </p>
      <h2 className="mt-1 flex items-baseline gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
        <span className="text-2xl sm:text-3xl">{track.emoji}</span>
        <span>
          あなたへのおすすめは <span className="text-emerald-700 dark:text-emerald-300">{track.name}</span>
        </span>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
        {result.reason}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/roadmap/${track.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          {track.emoji} {track.name} ロードマップへ →
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.04]"
        >
          診断をやり直す
        </button>
      </div>
      {alsoConsider && (
        <p className="mt-4 rounded-lg border border-dashed border-emerald-200 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/[0.06] dark:text-emerald-200">
          {alsoConsider.emoji} <strong>{alsoConsider.name}</strong> も将来的に並行で学ぶと相性が良いです。
        </p>
      )}
    </div>
  );
}

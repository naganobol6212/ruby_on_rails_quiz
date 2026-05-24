"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadProgress } from "@/lib/storage";
import { allQuestions, findQuestion } from "@/data/all-questions";
import { findCategory } from "@/data/categories";
import { findTrack } from "@/data/tracks";
import type { QuestionAttempt } from "@/lib/types";

type Row = {
  attempt: QuestionAttempt;
  question: NonNullable<ReturnType<typeof findQuestion>>;
};

export function ExplanationsList() {
  const [rows, setRows] = useState<Row[] | null>(null);

  const refresh = () => {
    const p = loadProgress();
    const list: Row[] = [];
    for (const a of Object.values(p.attempts)) {
      const text = a.selfExplanation?.trim();
      if (!text) continue;
      const q = findQuestion(a.questionId);
      if (!q) continue;
      list.push({ attempt: a, question: q });
    }
    list.sort((a, b) => {
      const av = a.attempt.selfExplanationUpdatedAt ?? "";
      const bv = b.attempt.selfExplanationUpdatedAt ?? "";
      return bv.localeCompare(av);
    });
    setRows(list);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const handler = () => refresh();
    window.addEventListener("rrq:progress-updated", handler);
    return () => window.removeEventListener("rrq:progress-updated", handler);
  }, []);

  // カテゴリでグルーピング
  const byCategory = useMemo(() => {
    if (!rows) return null;
    const map = new Map<string, Row[]>();
    for (const r of rows) {
      const cid = r.question.categoryId;
      if (!map.has(cid)) map.set(cid, []);
      map.get(cid)!.push(r);
    }
    return Array.from(map.entries());
  }, [rows]);

  const totalQuestions = allQuestions.length;

  return (
    <>
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          自己説明 一覧
        </span>
      </div>

      <header className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
          Structured Language Training
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          🗣️ 自己説明 一覧
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          クイズで「自分の言葉で説明する」欄に書いた内容をまとめて見返せます。
          続きを編集するには問題に戻ってください。
        </p>
        {rows && (
          <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-500">
            {rows.length} / {totalQuestions} 問について自己説明を書いています
          </p>
        )}
      </header>

      {rows === null ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          読み込み中…
        </p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-10 text-center dark:border-white/10 dark:bg-zinc-900/30">
          <p className="text-3xl">🗣️</p>
          <p className="mt-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            まだ自己説明が保存されていません
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            クイズページの「🗣️ 構造化言語トレーニング」欄に書いて保存すると、ここに集まります。
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/40 dark:hover:text-rose-300"
          >
            🏠 Track を選びに行く
          </Link>
        </div>
      ) : (
        <section className="space-y-8">
          {byCategory!.map(([cid, items]) => {
            const cat = findCategory(cid);
            const track = cat ? findTrack(cat.trackId) : null;
            return (
              <div key={cid}>
                <div className="mb-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-xl">{cat?.emoji ?? "📄"}</span>
                  <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {cat?.name ?? cid}
                  </h2>
                  {track && (
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-500">
                      ({track.emoji} {track.name})
                    </span>
                  )}
                  <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                    {items.length} 件
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((r) => (
                    <article
                      key={r.question.id}
                      className="rounded-xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/60"
                    >
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            r.question.difficulty === "beginner"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                              : r.question.difficulty === "intermediate"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                          }`}
                        >
                          {r.question.difficulty}
                        </span>
                        {r.attempt.solved && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                            ✓ 解決済
                          </span>
                        )}
                        {r.attempt.selfExplanationUpdatedAt && (
                          <span className="ml-auto font-mono text-[10px] text-zinc-500 dark:text-zinc-500">
                            {new Date(
                              r.attempt.selfExplanationUpdatedAt,
                            ).toLocaleString("ja-JP")}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Q. {r.question.question}
                      </h3>
                      <blockquote className="mt-3 whitespace-pre-wrap rounded-lg border-l-4 border-sky-400 bg-sky-50/60 px-3 py-2 text-sm leading-relaxed text-zinc-700 dark:border-sky-500/40 dark:bg-sky-500/[0.06] dark:text-zinc-200">
                        {r.attempt.selfExplanation}
                      </blockquote>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        <Link
                          href={`/quiz/${r.question.categoryId}/${r.question.id}`}
                          className="inline-flex items-center gap-1 rounded border border-zinc-300 bg-white px-2 py-0.5 font-medium text-zinc-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/40 dark:hover:text-rose-300"
                        >
                          ✏️ この問題に戻って編集
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}

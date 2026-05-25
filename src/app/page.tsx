import Link from "next/link";
import { tracks } from "@/data/tracks";
import { allQuestions as questions } from "@/data/all-questions";
import { guides } from "@/data/guides";
import { crudChallenges } from "@/data/crud-challenges";
import { ProgressSummary } from "@/components/ProgressSummary";
import { TrackPicker } from "@/components/TrackPicker";
import { JournalHomeCard } from "@/components/JournalHomeCard";

export default function Home() {
  const availableTracks = tracks.filter((t) => t.status === "available").length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      {/* ヒーロー */}
      <header className="mb-12 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-4 py-1.5 text-xs font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500 dark:bg-rose-400" />
          <span>
            {questions.length} 問・{availableTracks} 言語/FW Track
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Code<span className="text-rose-600 dark:text-rose-400">Dojo</span>
        </h1>
        <p className="mt-3 text-xl font-semibold tracking-tight text-zinc-700 dark:text-zinc-200 sm:text-2xl">
          複数の言語/FW を、
          <span className="text-rose-600 dark:text-rose-400">クイズで横断学習</span>
        </p>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          Ruby/Rails・JavaScript・TypeScript・React・Next.js …。
          段階的ヒント・詳しい解説・完璧／見直しマーク + 構造化ジャーナルで、
          現場で活きる総合力を毎日 5 分から。
        </p>
      </header>

      {/* 使い方ガイド (1 行で誘導、 詳細は /about に集約) */}
      <div className="mb-6">
        <Link
          href="/about"
          className="group flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-sm dark:border-sky-500/30 dark:bg-sky-500/[0.07] dark:hover:border-sky-400/60"
        >
          <span className="text-xl" aria-hidden>
            📖
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
              How to use · 使い方ガイド
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
              はじめての方は <strong>学習サイクル</strong> と{" "}
              <strong>各機能の使い方</strong> を 3 分でチェック
            </p>
          </div>
          <span
            className="text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-sky-500 dark:text-zinc-600 dark:group-hover:text-sky-300"
            aria-hidden
          >
            →
          </span>
        </Link>
      </div>

      {/* ジャーナル CTA */}
      <div className="mb-6">
        <JournalHomeCard />
      </div>

      {/* CRUD 課題 CTA */}
      {crudChallenges.length > 0 && (
        <div className="mb-6">
          <Link
            href="/crud"
            className="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-gradient-to-br from-white via-emerald-50/40 to-cyan-50/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-white/10 dark:from-zinc-900/60 dark:via-emerald-500/5 dark:to-cyan-500/5 dark:hover:border-emerald-500/40"
          >
            <span className="text-3xl">🛠️</span>
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                CRUD Challenge
              </p>
              <h3 className="mt-0.5 text-base font-bold tracking-tight text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-300">
                実践課題で一機能を一周 — シナリオから受け入れテストまで
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                データモデル → API → 段階別実装 → レビュー観点 →
                発展課題。読みながら手元で動かし、口頭で説明できるまでが完了。
              </p>
              <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                {crudChallenges.length} 課題 · 計{" "}
                {crudChallenges.reduce((s, c) => s + c.steps.length, 0)} ステップ
              </p>
            </div>
            <span className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-zinc-600 dark:group-hover:text-emerald-400">
              →
            </span>
          </Link>
        </div>
      )}

      {/* 参考書 CTA */}
      {guides.length > 0 && (
        <div className="mb-10">
          <Link
            href="/guide"
            className="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-gradient-to-br from-white via-amber-50/40 to-rose-50/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-white/10 dark:from-zinc-900/60 dark:via-amber-500/5 dark:to-rose-500/5 dark:hover:border-rose-500/40"
          >
            <span className="text-3xl">📚</span>
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                Study Guide
              </p>
              <h3 className="mt-0.5 text-base font-bold tracking-tight text-zinc-900 group-hover:text-rose-600 dark:text-zinc-100 dark:group-hover:text-rose-300">
                参考書で体系的に — 読む → 解く → 説明する
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                公式リファレンスと定番書のエッセンスを章立てで圧縮。クイズで定着、ジャーナルで説明力を磨きます。
              </p>
              <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                {guides.length} ガイド · 計{" "}
                {guides.reduce((s, g) => s + g.chapters.length, 0)} 章
              </p>
            </div>
            <span className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-rose-500 dark:text-zinc-600 dark:group-hover:text-rose-400">
              →
            </span>
          </Link>
        </div>
      )}

      {/* 進捗 */}
      <div className="mb-12">
        <ProgressSummary totalQuestions={questions.length} />
      </div>

      {/* Track 選択 */}
      <section id="tracks" className="scroll-mt-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Track を選ぶ
          </h2>
          <p className="text-xs text-zinc-500">
            言語 / フレームワーク別の学習トラック
          </p>
        </div>
        <TrackPicker />
      </section>
    </div>
  );
}

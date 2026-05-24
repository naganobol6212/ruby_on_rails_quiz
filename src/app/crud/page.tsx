import Link from "next/link";
import { crudChallenges } from "@/data/crud-challenges";
import { findTrack } from "@/data/tracks";

export const metadata = {
  title: "CRUD 実践課題 — CodeDojo",
};

const DIFFICULTY_LABEL: Record<string, { label: string; cls: string }> = {
  beginner: {
    label: "Beginner",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  intermediate: {
    label: "Intermediate",
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  advanced: {
    label: "Advanced",
    cls: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  },
};

export default function CrudIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          CRUD 実践課題
        </span>
      </div>

      <header className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          CRUD Challenge
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          🛠️ CRUD 実践課題 — 一機能を一周する
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          シナリオ → データモデル → API → 段階別実装 → レビュー観点 →
          発展課題、の流れで『実務で使える一機能』を手元で組み上げる。読みながら
          別エディタで動かし、口頭で説明する所まで含めて完了とする構造化訓練。
        </p>
      </header>

      <section className="space-y-4">
        {crudChallenges.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <p className="text-2xl">🚧</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              課題は準備中です
            </p>
          </div>
        ) : (
          crudChallenges.map((c) => {
            const track = findTrack(c.trackId);
            const diff = DIFFICULTY_LABEL[c.difficulty];
            return (
              <Link
                key={c.id}
                href={`/crud/${c.id}`}
                className="group block rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{c.emoji}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {track && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                          {track.emoji} {track.name}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${diff.cls}`}
                      >
                        {diff.label}
                      </span>
                      <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-500">
                        {c.steps.length} ステップ · 約 {c.estimateMinutes} 分
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-lg font-bold tracking-tight text-zinc-900 group-hover:text-rose-600 dark:text-zinc-100 dark:group-hover:text-rose-300">
                      {c.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {c.subtitle}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-rose-500 dark:text-zinc-600 dark:group-hover:text-rose-400">
                    →
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </section>
    </div>
  );
}

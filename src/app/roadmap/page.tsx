import Link from "next/link";
import type { Metadata } from "next";
import { tracks } from "@/data/tracks";
import { getRoadmap, summarize } from "@/data/roadmaps";

export const metadata: Metadata = {
  title: "学習ロードマップ — CodeDojo",
  description:
    "言語・技術ごとに用意された学習ロードマップ一覧。 Ruby on Rails / JavaScript / TypeScript / Python / SQL ほか。",
};

export default function RoadmapIndexPage() {
  const available = tracks.filter((t) => getRoadmap(t.id));
  const comingSoon = tracks.filter((t) => !getRoadmap(t.id));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          ロードマップ
        </span>
      </div>

      <header className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Learning Roadmaps
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          🗺️ どのトラックを学ぶ?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          言語・技術ごとに用意した学習ロードマップ。 クイズ・参考書・実践課題を組み合わせた塊で順番に進めます。
        </p>
      </header>

      {/* 利用可能なトラック */}
      <section className="mb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          🟢 ロードマップ公開中 ({available.length})
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {available.map((track) => {
            const roadmap = getRoadmap(track.id)!;
            const stats = summarize(roadmap);
            return (
              <li key={track.id}>
                <Link
                  href={`/roadmap/${track.id}`}
                  className={`group block rounded-2xl border border-zinc-200 bg-gradient-to-br ${track.accentClass} p-5 ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md ${track.ringClass} dark:border-white/10`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      <span className="mr-1.5">{track.emoji}</span>
                      {track.name}
                    </h3>
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                      {stats.totalSteps} steps · {stats.totalPhases} phases
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {roadmap.summary}
                  </p>
                  <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                    想定学習時間: 約 {Math.round(stats.totalMinutes / 60)} 時間
                  </p>
                  <p className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-300">
                    ロードマップを開く →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 準備中のトラック */}
      {comingSoon.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            ⏳ ロードマップ準備中 ({comingSoon.length})
          </h2>
          <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
            クイズは既に解けます。 順序立った学習パスは順次公開予定です。
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoon.map((track) => (
              <li key={track.id}>
                <Link
                  href={`/roadmap/${track.id}`}
                  className="block rounded-xl border border-dashed border-zinc-300 bg-white/40 p-4 transition hover:border-zinc-400 hover:bg-white/70 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      <span className="mr-1.5">{track.emoji}</span>
                      {track.name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                      Coming
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {track.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
        💡 各トラックの進捗はあなたのブラウザの LocalStorage に保存されます。 問題を解いて 「正解」 になると自動でステップが進みます。
      </p>
    </div>
  );
}

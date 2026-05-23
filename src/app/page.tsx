import { tracks } from "@/data/tracks";
import { allQuestions as questions } from "@/data/all-questions";
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

      {/* ジャーナル CTA */}
      <div className="mb-10">
        <JournalHomeCard />
      </div>

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

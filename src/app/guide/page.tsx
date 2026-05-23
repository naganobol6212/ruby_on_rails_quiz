import Link from "next/link";
import { guides } from "@/data/guides";
import { findTrack } from "@/data/tracks";

export const metadata = {
  title: "Study Guide — CodeDojo",
};

export default function GuideIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      {/* パンくず */}
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          Study Guide
        </span>
      </div>

      <header className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Study Guide
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          📚 参考書 — 体系的に読む
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          公式リファレンスと定番書籍のエッセンスを章立てで圧縮。読む → クイズで確認 →
          自分の言葉で説明 の構造化言語訓練ループを回しましょう。
        </p>
      </header>

      <section className="space-y-4">
        {guides.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <p className="text-2xl">🚧</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              ガイドは準備中です
            </p>
          </div>
        ) : (
          guides.map((g) => {
            const track = findTrack(g.trackId);
            const totalMinutes = g.chapters.reduce(
              (sum, c) => sum + c.readingMinutes,
              0,
            );
            return (
              <Link
                key={g.id}
                href={`/guide/${g.id}`}
                className="group block rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{g.emoji}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {track && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                          {track.emoji} {track.name}
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-500">
                        {g.chapters.length} 章 · 約 {totalMinutes} 分
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-lg font-bold tracking-tight text-zinc-900 group-hover:text-rose-600 dark:text-zinc-100 dark:group-hover:text-rose-300">
                      {g.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {g.subtitle}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                      対象: {g.audience}
                    </p>
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

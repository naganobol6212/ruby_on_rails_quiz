import Link from "next/link";
import { notFound } from "next/navigation";
import { findTrack, tracks } from "@/data/tracks";
import { categoriesByTrack } from "@/data/categories";
import { questionsByCategory, questionsByTrack } from "@/data/all-questions";
import { guidesByTrack } from "@/data/guides";
import { crudChallengesByTrack } from "@/data/crud-challenges";
import { CategoryCard } from "@/components/CategoryCard";

export function generateStaticParams() {
  return tracks.map((t) => ({ trackId: t.id }));
}

type Props = {
  params: Promise<{ trackId: string }>;
};

export default async function TrackPage({ params }: Props) {
  const { trackId } = await params;
  const track = findTrack(trackId);
  if (!track) notFound();

  const trackCategories = categoriesByTrack(track.id);
  const trackQs = questionsByTrack(track.id);
  const trackGuides = guidesByTrack(track.id);
  const trackChallenges = crudChallengesByTrack(track.id);

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
          {track.name}
        </span>
      </div>

      {/* ヒーロー */}
      <header className="mb-10">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{track.emoji}</span>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Track
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {track.name}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              {track.description}
            </p>
            <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-500">
              計 {trackQs.length} 問 / {trackCategories.length} カテゴリ
            </p>
          </div>
        </div>
      </header>

      {/* 参考書 (ある時のみ) */}
      {trackGuides.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            📚 参考書で体系的に学ぶ
          </h2>
          <div className="space-y-3">
            {trackGuides.map((g) => {
              const totalMinutes = g.chapters.reduce(
                (sum, c) => sum + c.readingMinutes,
                0,
              );
              return (
                <Link
                  key={g.id}
                  href={`/guide/${g.id}`}
                  className="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
                >
                  <span className="text-3xl">{g.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold tracking-tight text-zinc-900 group-hover:text-rose-600 dark:text-zinc-100 dark:group-hover:text-rose-300">
                      {g.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {g.subtitle}
                    </p>
                    <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                      {g.chapters.length} 章 · 約 {totalMinutes} 分
                    </p>
                  </div>
                  <span className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-rose-500 dark:text-zinc-600 dark:group-hover:text-rose-400">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CRUD 実践課題 */}
      {trackChallenges.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            🛠️ CRUD 実践課題
          </h2>
          <div className="space-y-3">
            {trackChallenges.map((c) => (
              <Link
                key={c.id}
                href={`/crud/${c.id}`}
                className="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-emerald-500/40"
              >
                <span className="text-3xl">{c.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold tracking-tight text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-300">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {c.subtitle}
                  </p>
                  <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                    {c.steps.length} ステップ · 約 {c.estimateMinutes} 分 ·{" "}
                    {c.difficulty}
                  </p>
                </div>
                <span className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-zinc-600 dark:group-hover:text-emerald-400">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* カテゴリ */}
      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          カテゴリを選ぶ
        </h2>
        {trackCategories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <p className="text-2xl">🚧</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              この Track の問題は準備中です
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {trackCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                questions={questionsByCategory(cat.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

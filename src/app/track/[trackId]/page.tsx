import Link from "next/link";
import { notFound } from "next/navigation";
import { findTrack, tracks } from "@/data/tracks";
import { categoriesByTrack } from "@/data/categories";
import { questionsByCategory, questionsByTrack } from "@/data/all-questions";
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { findGuide, guides } from "@/data/guides";
import { findTrack } from "@/data/tracks";
import { findCategory } from "@/data/categories";

export function generateStaticParams() {
  return guides.map((g) => ({ guideId: g.id }));
}

type Props = {
  params: Promise<{ guideId: string }>;
};

export default async function GuideOverviewPage({ params }: Props) {
  const { guideId } = await params;
  const guide = findGuide(guideId);
  if (!guide) notFound();

  const track = findTrack(guide.trackId);
  const totalMinutes = guide.chapters.reduce(
    (sum, c) => sum + c.readingMinutes,
    0,
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      {/* パンくず */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <Link
          href="/guide"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          Study Guide
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          {guide.title}
        </span>
      </div>

      {/* ヒーロー */}
      <header className="mb-10">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{guide.emoji}</span>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Study Guide
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {guide.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.subtitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
              {track && (
                <Link
                  href={`/track/${track.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-medium text-zinc-600 hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/50 dark:hover:text-rose-300"
                >
                  {track.emoji} {track.name}
                </Link>
              )}
              <span className="text-zinc-500 dark:text-zinc-500">
                {guide.chapters.length} 章 · 約 {totalMinutes} 分
              </span>
            </div>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
              対象: {guide.audience}
            </p>
          </div>
        </div>
      </header>

      {/* 章 */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            目次
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
            👆 章をタップで開く
          </p>
        </div>
        <ol className="space-y-3">
          {guide.chapters.map((c, i) => (
            <li key={c.id}>
              <Link
                href={`/guide/${guide.id}/${c.id}`}
                aria-label={`第 ${i + 1} 章「${c.title}」を開く`}
                className="group flex items-stretch overflow-hidden rounded-2xl border-2 border-zinc-200 bg-white/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-lg active:translate-y-0 active:scale-[0.995] dark:border-white/10 dark:bg-zinc-900/70 dark:hover:border-rose-400/60"
              >
                <span className="flex w-14 shrink-0 items-center justify-center bg-gradient-to-br from-rose-500 to-fuchsia-500 font-mono text-lg font-bold text-white shadow-inner shadow-black/20 transition group-hover:from-rose-600 group-hover:to-fuchsia-600 sm:w-16">
                  {i + 1}
                </span>
                <div className="flex-1 px-4 py-3.5 sm:px-5">
                  <h3 className="font-semibold tracking-tight text-zinc-900 group-hover:text-rose-600 dark:text-zinc-100 dark:group-hover:text-rose-300">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {c.intro}
                  </p>
                  <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                    約 {c.readingMinutes} 分 · 目標 {c.objectives.length} 個
                    {c.comprehensionQuestionIds && c.comprehensionQuestionIds.length > 0
                      ? ` · 確認問題 ${c.comprehensionQuestionIds.length} 問`
                      : ""}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 self-center px-3 text-xs font-semibold text-rose-600 transition group-hover:translate-x-1 dark:text-rose-300 sm:pr-5">
                  <span className="hidden sm:inline">読む</span>
                  <span aria-hidden className="text-base leading-none">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* 関連カテゴリ */}
      {guide.relatedCategoryIds && guide.relatedCategoryIds.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            関連カテゴリ (クイズで定着)
          </h2>
          <div className="flex flex-wrap gap-2">
            {guide.relatedCategoryIds.map((cid) => {
              const cat = findCategory(cid);
              if (!cat) return null;
              return (
                <Link
                  key={cid}
                  href={`/quiz/${cid}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-rose-400/50 dark:hover:text-rose-300"
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 出典 */}
      {guide.sources.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            出典 / 参考
          </h2>
          <ul className="space-y-1.5 text-sm">
            {guide.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline dark:text-rose-300"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

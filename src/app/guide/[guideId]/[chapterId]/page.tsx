import Link from "next/link";
import { notFound } from "next/navigation";
import { findGuide, guides } from "@/data/guides";
import { findQuestion } from "@/data/all-questions";
import { findCategory } from "@/data/categories";
import { CodeBlock } from "@/components/CodeBlock";

export function generateStaticParams() {
  return guides.flatMap((g) =>
    g.chapters.map((c) => ({ guideId: g.id, chapterId: c.id })),
  );
}

type Props = {
  params: Promise<{ guideId: string; chapterId: string }>;
};

export default async function ChapterPage({ params }: Props) {
  const { guideId, chapterId } = await params;
  const guide = findGuide(guideId);
  if (!guide) notFound();
  const idx = guide.chapters.findIndex((c) => c.id === chapterId);
  if (idx < 0) notFound();
  const chapter = guide.chapters[idx];
  const prev = idx > 0 ? guide.chapters[idx - 1] : null;
  const next =
    idx < guide.chapters.length - 1 ? guide.chapters[idx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
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
        <Link
          href={`/guide/${guide.id}`}
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          {guide.title}
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          第 {idx + 1} 章
        </span>
      </div>

      {/* ヘッダ */}
      <header className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          {guide.emoji} {guide.title} · 第 {idx + 1} 章 / {guide.chapters.length}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {chapter.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {chapter.intro}
        </p>
        <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-500">
          読了目安 約 {chapter.readingMinutes} 分
        </p>
      </header>

      {/* 学習目標 */}
      <section className="mb-8 rounded-2xl border border-rose-200/60 bg-rose-50/40 p-5 dark:border-rose-500/20 dark:bg-rose-500/5">
        <h2 className="mb-2 text-sm font-bold tracking-tight text-rose-700 dark:text-rose-300">
          🎯 この章で身につくこと
        </h2>
        <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-200">
          {chapter.objectives.map((o, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-rose-500 dark:text-rose-300">·</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 本文 */}
      <article className="space-y-10">
        {chapter.sections.map((s, i) => (
          <section key={i}>
            <h2 className="mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {s.heading}
            </h2>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
              {s.body}
            </p>
            {s.code && (
              <div className="mt-4">
                <CodeBlock code={s.code} label={s.language ?? "code"} />
              </div>
            )}
            {s.notes && s.notes.length > 0 && (
              <ul className="mt-4 space-y-1.5 rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 text-sm text-zinc-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-zinc-200">
                {s.notes.map((n, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-amber-600 dark:text-amber-400">⚠</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

      {/* 要点 */}
      <section className="mt-10 rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
        <h2 className="mb-2 text-sm font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
          ✅ 要点まとめ
        </h2>
        <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-200">
          {chapter.keyTakeaways.map((k, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-emerald-500 dark:text-emerald-300">·</span>
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 確認問題 */}
      {chapter.comprehensionQuestionIds &&
        chapter.comprehensionQuestionIds.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              🧪 理解度確認 — クイズに進む
            </h2>
            <div className="space-y-2">
              {chapter.comprehensionQuestionIds.map((qid) => {
                const q = findQuestion(qid);
                if (!q) return null;
                const cat = findCategory(q.categoryId);
                return (
                  <Link
                    key={qid}
                    href={`/quiz/${q.categoryId}/${qid}`}
                    className="group flex items-start gap-3 rounded-xl border border-zinc-200 bg-white/70 p-3 transition hover:border-rose-300 hover:bg-rose-50/40 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/5"
                  >
                    <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                      {q.difficulty[0].toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-800 group-hover:text-rose-600 dark:text-zinc-200 dark:group-hover:text-rose-300">
                        {q.question}
                      </p>
                      {cat && (
                        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                          {cat.emoji} {cat.name}
                        </p>
                      )}
                    </div>
                    <span className="text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-rose-500 dark:text-zinc-600 dark:group-hover:text-rose-400">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      {/* 参考リンク */}
      {chapter.references && chapter.references.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            🔗 参考
          </h2>
          <ul className="space-y-1.5 text-sm">
            {chapter.references.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline dark:text-rose-300"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ナビ */}
      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-zinc-200 pt-6 dark:border-white/10">
        {prev ? (
          <Link
            href={`/guide/${guide.id}/${prev.id}`}
            className="group flex max-w-[45%] flex-col rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 transition hover:border-rose-300 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
          >
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
              ← 前章
            </span>
            <span className="mt-0.5 truncate text-sm font-medium text-zinc-800 group-hover:text-rose-600 dark:text-zinc-200 dark:group-hover:text-rose-300">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/guide/${guide.id}/${next.id}`}
            className="group flex max-w-[45%] flex-col rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-right transition hover:border-rose-300 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
          >
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
              次章 →
            </span>
            <span className="mt-0.5 truncate text-sm font-medium text-zinc-800 group-hover:text-rose-600 dark:text-zinc-200 dark:group-hover:text-rose-300">
              {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href={`/guide/${guide.id}`}
            className="group flex max-w-[45%] flex-col rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-right transition hover:border-rose-300 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
          >
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
              目次へ戻る
            </span>
            <span className="mt-0.5 truncate text-sm font-medium text-zinc-800 group-hover:text-rose-600 dark:text-zinc-200 dark:group-hover:text-rose-300">
              {guide.title}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}

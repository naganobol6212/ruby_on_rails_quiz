import Link from "next/link";
import { BADGE_META, changelog } from "@/data/changelog";
import { MarkAllSeen } from "./MarkAllSeen";

export const metadata = {
  title: "お知らせ — CodeDojo",
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          お知らせ
        </span>
      </div>

      <header className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          What&apos;s New
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          🆕 お知らせ・更新履歴
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          新機能や UI 改善、コンテンツ追加の履歴です。新しいものが上にあります。
        </p>
      </header>

      {/* このページを開いた時点で「既読」マーク */}
      <MarkAllSeen />

      <ol className="relative space-y-6 border-l-2 border-zinc-200 pl-6 dark:border-white/10">
        {changelog.map((entry, i) => {
          const badge = BADGE_META[entry.badge];
          return (
            <li key={entry.version} className="relative">
              <span
                className={`absolute -left-[33px] mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-sm dark:border-zinc-900 ${
                  i === 0
                    ? "bg-rose-500"
                    : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              />
              <article className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                  <time className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    {entry.date}
                  </time>
                  {i === 0 && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                      最新
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {entry.title}
                </h2>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {entry.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="flex gap-2 text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="text-rose-500 dark:text-rose-300">·</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
        💡 要望や気付いた点は、GitHub の Issue / PR コメントで共有してもらえると、次のリリースに反映できます。
      </p>
    </div>
  );
}

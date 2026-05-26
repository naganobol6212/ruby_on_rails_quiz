import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <p className="text-6xl">🗺️</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        ページが見つかりません
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        URL の打ち間違い、 削除済みのページ、 もしくはブックマークが古い可能性があります。
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 dark:bg-rose-400 dark:text-zinc-900 dark:hover:bg-rose-300"
        >
          🏠 ホームに戻る
        </Link>
        <Link
          href="/roadmap"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/[0.04]"
        >
          🗺️ ロードマップを見る
        </Link>
      </div>
    </div>
  );
}

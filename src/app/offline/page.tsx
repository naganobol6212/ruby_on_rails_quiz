import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "オフライン | CodeDojo",
  description: "ネットワークに接続できません。キャッシュ済みのページはアクセス可能です。",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mb-6 text-6xl" aria-hidden>
        📡
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        オフラインです
      </h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        ネットワークに接続できませんでした。
        <br />
        一度開いた参考書やクイズはキャッシュからアクセスできます。
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500"
        >
          🏠 ホームへ
        </Link>
        <Link
          href="/guide"
          className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-rose-400/60 dark:hover:text-rose-300"
        >
          📚 参考書
        </Link>
      </div>
      <p className="mt-10 text-[11px] text-zinc-500 dark:text-zinc-500">
        💡 アプリをホーム画面に追加すると、より快適に学習できます
      </p>
    </div>
  );
}

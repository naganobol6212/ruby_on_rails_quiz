import Link from "next/link";
import { MarkAllSeen } from "./MarkAllSeen";
import { ChangelogTimeline } from "./ChangelogTimeline";

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

      <ChangelogTimeline />

      <p className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
        💡 要望や気付いた点は、GitHub の Issue / PR コメントで共有してもらえると、次のリリースに反映できます。
      </p>
    </div>
  );
}

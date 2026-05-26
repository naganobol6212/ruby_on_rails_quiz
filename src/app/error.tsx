"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[CodeDojo] page error:", error);
    }
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <p className="text-6xl">💥</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        ページの読み込みに失敗しました
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        ネットワーク、 一時的な不具合、 もしくはブラウザ拡張による干渉の可能性があります。
        再読み込みで直ることが多いです。
      </p>
      {error.digest && (
        <p className="mt-4 inline-block rounded-md bg-zinc-100 px-2 py-1 font-mono text-[11px] text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
          error.digest: {error.digest}
        </p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 dark:bg-rose-400 dark:text-zinc-900 dark:hover:bg-rose-300"
        >
          🔄 もう一度読み込む
        </button>
        <Link
          href="/"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/[0.04]"
        >
          ← ホームに戻る
        </Link>
      </div>
    </div>
  );
}

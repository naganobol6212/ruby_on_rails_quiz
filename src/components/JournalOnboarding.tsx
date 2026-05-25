"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const DISMISS_KEY = "rrq_journal_onboarding_dismissed_v1";

/**
 * ジャーナル初心者向けのオンボーディング。
 * - エントリ 0 件の人を対象 (parent から render 制御)
 * - 『何を書けばいいか分からない』『短くて OK』を全面に出す
 * - 3 行ジャーナル + 質問プロンプト の組合せを最初の体験に推奨
 * - 一度 dismiss しても LocalStorage で復活しないように
 */
export function JournalOnboarding() {
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    let v = false;
    try {
      v = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      v = false;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(v);
  }, []);

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* noop */
    }
    setDismissed(true);
  };

  // 初回読込みのチカチカ防止
  if (dismissed === null || dismissed) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border-2 border-sky-300/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-md dark:border-sky-400/30 dark:from-sky-950/40 dark:via-zinc-900/40 dark:to-cyan-950/30"
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="このガイドを閉じる"
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
      >
        ✕
      </button>

      <div className="pointer-events-none absolute -right-6 -top-6 text-7xl opacity-15">
        ✍️
      </div>

      <div className="relative max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
          Welcome · ジャーナル初めての方へ
        </p>
        <h2 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          『何を書けばいいか分からない』を、3 行で突破する
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          構造化ジャーナルは「最初の 1 文字目」が一番重い。 だから最初は
          <strong className="mx-1 text-sky-700 dark:text-sky-300">
            3 行ジャーナル
          </strong>
          で、たった 3 行 (今日 / 学び / 次の一歩) を書くだけで OK。
          書きにくければ各欄の
          <strong className="mx-1 text-sky-700 dark:text-sky-300">
            💡 答えやすい問い
          </strong>
          から 1 つ選んでクリック → そのまま続きを書けます。
        </p>

        {/* 3 つのコツ */}
        <ul className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
          <Tip emoji="🪶" title="短くて OK">
            1 行は単語 / 箇条書きでも構いません。 完璧は敵
          </Tip>
          <Tip emoji="🌱" title="毎日 1 分">
            『今日は無理』はいつまでも続く。 30 秒でも書くと習慣化する
          </Tip>
          <Tip emoji="🔁" title="問いから始める">
            空欄を見て止まったら 💡 を開いて、 1 つ選んでから答える
          </Tip>
        </ul>

        {/* CTA */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href="/journal/new?template=3line"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/30 transition hover:bg-sky-700"
          >
            <span aria-hidden>✏️</span>
            <span>3 行ジャーナルで始める</span>
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/journal/new?template=yww"
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
          >
            <span aria-hidden>✍️</span>
            <span>もう少し詳しく書く (YWT)</span>
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="ml-auto text-[11px] text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ガイドを閉じる (もう表示しない)
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function Tip({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-lg border border-sky-200/70 bg-white/80 px-3 py-2 dark:border-sky-500/30 dark:bg-zinc-900/40">
      <p className="flex items-center gap-1 font-semibold text-sky-800 dark:text-sky-200">
        <span aria-hidden>{emoji}</span>
        <span>{title}</span>
      </p>
      <p className="mt-1 text-zinc-700 dark:text-zinc-300">{children}</p>
    </li>
  );
}

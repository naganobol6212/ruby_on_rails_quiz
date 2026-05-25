"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Step = {
  num: string;
  emoji: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  tone: "rose" | "amber" | "violet" | "emerald";
};

const STEPS: Step[] = [
  {
    num: "01",
    emoji: "🎯",
    title: "Track でクイズに挑戦",
    desc: "Ruby/Rails / JS / TS / React / Next.js のトラックから、 段階的ヒント付きでクイズを解きます",
    href: "/#tracks",
    cta: "Track を選ぶ",
    tone: "rose",
  },
  {
    num: "02",
    emoji: "🗣️",
    title: "間違えた問題を『自分の言葉』で説明",
    desc: "答え合わせ後に『自己説明』ボックスへ記述。読むより書く方が定着率は数倍",
    href: "/explanations",
    cta: "自己説明を見る",
    tone: "amber",
  },
  {
    num: "03",
    emoji: "📝",
    title: "ジャーナルで 1 日を構造化",
    desc: "3 行ジャーナル / KPT / YWT 等 7 種テンプレ + 💡 答えやすい問い + 🔥 連続記録で習慣化",
    href: "/journal",
    cta: "ジャーナルを開く",
    tone: "violet",
  },
  {
    num: "04",
    emoji: "🔁",
    title: "ロードマップで復習 → 次の弱点へ",
    desc: "見直しマーク・正答率・学習履歴から、 次に集中すべきトピックを把握",
    href: "/roadmap",
    cta: "ロードマップを開く",
    tone: "emerald",
  },
];

const TONES: Record<
  Step["tone"],
  { ring: string; badge: string; arrow: string; text: string; hover: string }
> = {
  rose: {
    ring: "border-rose-200 hover:border-rose-400 dark:border-rose-500/30 dark:hover:border-rose-400/60",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
    arrow: "text-rose-400 dark:text-rose-500/70",
    text: "text-rose-700 dark:text-rose-300",
    hover: "hover:text-rose-700 dark:hover:text-rose-200",
  },
  amber: {
    ring: "border-amber-200 hover:border-amber-400 dark:border-amber-500/30 dark:hover:border-amber-400/60",
    badge:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
    arrow: "text-amber-400 dark:text-amber-500/70",
    text: "text-amber-800 dark:text-amber-300",
    hover: "hover:text-amber-800 dark:hover:text-amber-200",
  },
  violet: {
    ring: "border-violet-200 hover:border-violet-400 dark:border-violet-500/30 dark:hover:border-violet-400/60",
    badge:
      "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
    arrow: "text-violet-400 dark:text-violet-500/70",
    text: "text-violet-800 dark:text-violet-300",
    hover: "hover:text-violet-800 dark:hover:text-violet-200",
  },
  emerald: {
    ring: "border-emerald-200 hover:border-emerald-400 dark:border-emerald-500/30 dark:hover:border-emerald-400/60",
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    arrow: "text-emerald-400 dark:text-emerald-500/70",
    text: "text-emerald-800 dark:text-emerald-300",
    hover: "hover:text-emerald-800 dark:hover:text-emerald-200",
  },
};

type Props = {
  /** /about ページ等で見出し / About リンクを隠したい時に渡す */
  variant?: "home" | "embedded";
};

/**
 * 学習サイクル図 — クイズで間違える → 自己説明で言語化 →
 * ジャーナルで構造化記録 → ロードマップで復習 の 4 ステップを
 * カード + 矢印で常時可視化。ホームと /about の両方で使用。
 */
export function LearningCycle({ variant = "home" }: Props) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50/80 via-white to-rose-50/40 p-5 sm:p-6 dark:border-white/10 dark:from-zinc-900/60 dark:via-zinc-900/30 dark:to-rose-500/[0.04]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            How to learn · 学習サイクル
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            🌀 4 つのステップで、わかる → 説明できる → 使える へ
          </h2>
        </div>
        {variant === "home" && (
          <Link
            href="/about"
            className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-3 py-1 text-[11px] font-medium text-zinc-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-white/15 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/40 dark:hover:text-rose-300"
          >
            <span>📖 詳しい使い方</span>
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>

      {/* デスクトップ: 横並び / モバイル: 縦並び */}
      <ol className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-stretch">
        {STEPS.map((s, i) => {
          const tone = TONES[s.tone];
          return (
            <ListEntry key={s.num} step={s} tone={tone} index={i} last={i === STEPS.length - 1} />
          );
        })}
      </ol>

      <p className="mt-4 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        💡 完璧主義は敵。 まずは <strong>1 問解く / 3 行書く</strong> から。
        毎日 5 分を 30 日続けるだけで、 説明力 / 報告力 / 課題発見力が階段状に伸びます。
      </p>
    </section>
  );
}

function ListEntry({
  step,
  tone,
  index,
  last,
}: {
  step: Step;
  tone: (typeof TONES)[Step["tone"]];
  index: number;
  last: boolean;
}) {
  return (
    <>
      <motion.li
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: index * 0.05 }}
        className="group h-full"
      >
        <Link
          href={step.href}
          className={`flex h-full flex-col gap-2 rounded-xl border bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-900/70 ${tone.ring}`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-bold ${tone.badge}`}
            >
              {step.num}
            </span>
            <span className="text-xl" aria-hidden>
              {step.emoji}
            </span>
          </div>
          <h3
            className={`text-sm font-bold leading-snug text-zinc-900 dark:text-zinc-100 ${tone.hover}`}
          >
            {step.title}
          </h3>
          <p className="flex-1 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {step.desc}
          </p>
          <span
            className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold ${tone.text}`}
          >
            <span>{step.cta}</span>
            <span
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </span>
        </Link>
      </motion.li>
      {!last && (
        <li
          aria-hidden
          className={`flex items-center justify-center text-2xl ${tone.arrow}`}
        >
          <span className="hidden sm:inline">→</span>
          <span className="sm:hidden">↓</span>
        </li>
      )}
    </>
  );
}

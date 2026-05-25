"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * プログラマー脳 (Felienne Hermans 著) で紹介されるコードリーディング手法を、
 * 5 ステップに圧縮した実践ガイド。 認知科学にもとづく:
 *
 *   1. 既存知識を呼び出す (Activate prior knowledge)
 *   2. 未知のチャンクを識別する (Identify unknown chunks)
 *   3. チャンクで読む (Read in chunks)
 *   4. メンタル実行する (Mental tracing)
 *   5. 予測 → 答え合わせ → ギャップ言語化 (Verify mental model)
 *
 * variant:
 *   - "intro": 一覧ページ冒頭の解説カード (詳細展開可)
 *   - "inline": 個別問題ページの作業チェックリスト (チェック可能)
 */

type Step = {
  num: string;
  emoji: string;
  title: string;
  short: string;
  detail: string;
  prompt: string;
};

const STEPS: Step[] = [
  {
    num: "01",
    emoji: "🧠",
    title: "既存知識を呼び出す",
    short: "30 秒、 何の話か脳内で軽くメモ",
    detail:
      "コードを見る前に、 タイトルや変数名から『これは何の話?』を 30 秒だけ考える。 既知のパターン (ループ / 条件 / 例外処理) と紐付くと、 ワーキングメモリへの新規負荷が大きく減る。",
    prompt: "このコードはざっくり何をしているはず?",
  },
  {
    num: "02",
    emoji: "🔎",
    title: "未知のチャンクを識別する",
    short: "知らない記号 / メソッドにマーカー",
    detail:
      "1 度読み通して、 『これ意味知らない』 という記号・メソッド・構文を全部洗い出す。 認知負荷の原因はだいたい未知のチャンク。 先に学ぶか、 後で調べるかをここで決めると、 メインの読みが詰まらない。",
    prompt: "知らない記号・メソッド・構文は?",
  },
  {
    num: "03",
    emoji: "🧩",
    title: "チャンクで読む",
    short: "1 行ではなくパターンで読む",
    detail:
      "1 行ずつ追うのではなく、 『この 3 行は配列のフィルタ』 のように意味のまとまり (チャンク) で読む。 熟練者がコードを速く読めるのは、 行数ではなく『何個のチャンクで構成されているか』で記憶しているから。",
    prompt: "意味のまとまり (チャンク) を 2-4 個に区切ると?",
  },
  {
    num: "04",
    emoji: "✏️",
    title: "メンタル実行する",
    short: "変数の値を頭の中で追う",
    detail:
      "紙や脳内で変数表 (state table) を書きながら、 1 行ずつ値の変化を追う。 ループや条件分岐は『この iteration で x はこう変わる』を書き出す。 デバッガで止めながら読むのも同じ効果。",
    prompt: "主要な変数の最終的な値は?",
  },
  {
    num: "05",
    emoji: "🎯",
    title: "予測 → 答え合わせ → ギャップ言語化",
    short: "予測してから答えを見る",
    detail:
      "出力 / 挙動を『○○になるはず』と予測してから答えを見る。 ハズれたら『どこで自分の頭の中のモデルが間違ったか』を 1 文で言語化。 これがメタ認知を育て、 次回の読みを速くする (ジャーナルの YWT に書けば習慣化)。",
    prompt: "出力を予測した? ハズれたら『なぜ』を 1 文で",
  },
];

type Props = {
  variant?: "intro" | "inline";
};

export function CodeReadingGuide({ variant = "intro" }: Props) {
  const [open, setOpen] = useState(variant === "intro");

  if (variant === "inline") {
    return <InlineChecklist />;
  }

  return (
    <section className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50/60 p-5 dark:border-sky-500/30 dark:from-sky-950/40 dark:via-zinc-900/40 dark:to-cyan-950/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
            🧠 プログラマー脳 · コードリーディング術
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            5 ステップで読めば、 詰まらず速く理解できる
          </h2>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Felienne Hermans 著『プログラマー脳』の認知科学的アプローチを 5 段階に圧縮。
            まずこの 5 つを毎問試してみてください。
          </p>
        </div>
        <span
          aria-hidden
          className={`text-xl text-sky-500 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ol
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 grid gap-2 overflow-hidden sm:grid-cols-2 lg:grid-cols-5"
          >
            {STEPS.map((s) => (
              <li
                key={s.num}
                className="flex flex-col rounded-xl border border-sky-200/70 bg-white p-3 dark:border-sky-500/20 dark:bg-zinc-900/60"
              >
                <div className="mb-1.5 flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 font-mono text-[10px] font-bold text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                    {s.num}
                  </span>
                  <span className="text-base" aria-hidden>
                    {s.emoji}
                  </span>
                </div>
                <h3 className="text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                  {s.title}
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {s.short}
                </p>
                <details className="mt-2 text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                  <summary className="cursor-pointer text-[10px] font-semibold text-sky-700 hover:underline dark:text-sky-300">
                    詳しく
                  </summary>
                  <p className="mt-1.5">{s.detail}</p>
                </details>
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>

      {open && (
        <p className="mt-3 text-[10px] text-zinc-500 dark:text-zinc-400">
          参考: 『プログラマー脳 〜優れたプログラマーになるための認知科学に基づくアプローチ〜』
          (Felienne Hermans 著, 水野貴明 訳, 秀和システム)
        </p>
      )}
    </section>
  );
}

// ===========================================================================
// インライン版: 問題ページの折りたたみチェックリスト
// ===========================================================================

function InlineChecklist() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (num: string) =>
    setChecked((c) => ({ ...c, [num]: !c[num] }));

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <section className="rounded-xl border border-sky-200 bg-sky-50/40 px-4 py-3 dark:border-sky-500/30 dark:bg-sky-500/[0.06]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2 text-[12px] font-semibold text-sky-800 dark:text-sky-200">
          <span aria-hidden>🧠</span>
          <span>プログラマー脳 5 ステップ で読む</span>
          {doneCount > 0 && (
            <span className="rounded-full bg-sky-200 px-1.5 py-px font-mono text-[10px] text-sky-800 dark:bg-sky-500/30 dark:text-sky-100">
              {doneCount}/{STEPS.length}
            </span>
          )}
        </span>
        <span
          aria-hidden
          className={`text-sky-500 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-1.5 overflow-hidden"
          >
            {STEPS.map((s) => {
              const isChecked = !!checked[s.num];
              return (
                <li key={s.num}>
                  <button
                    type="button"
                    onClick={() => toggle(s.num)}
                    className={`flex w-full items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[11px] transition ${
                      isChecked
                        ? "border-emerald-300 bg-emerald-50/70 line-through text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/[0.08] dark:text-emerald-200"
                        : "border-sky-200/70 bg-white text-zinc-700 hover:border-sky-400 dark:border-sky-500/20 dark:bg-zinc-900/40 dark:text-zinc-300"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                        isChecked
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-zinc-300 dark:border-white/20"
                      }`}
                      aria-hidden
                    >
                      {isChecked ? "✓" : ""}
                    </span>
                    <span className="flex-1">
                      <strong>
                        {s.emoji} {s.title}
                      </strong>
                      <span className="ml-1 text-zinc-500 dark:text-zinc-400">
                        — {s.prompt}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
}

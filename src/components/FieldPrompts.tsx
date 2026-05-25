"use client";

import { useState } from "react";

type Props = {
  prompts: string[];
  /** 現在のフィールド値 (空かどうか判定 + 末尾改行制御) */
  currentValue: string;
  /** プロンプトをクリックした時にフィールドに挿入する */
  onInsert: (text: string) => void;
};

/**
 * 『書きにくい人向け』のヘルパーパネル。
 * 答えやすい問いをチップで並べ、クリックでフィールド先頭に
 * Markdown の引用形式で挿入 → そのまま下に答えを書ける。
 */
export function FieldPrompts({ prompts, currentValue, onInsert }: Props) {
  const [open, setOpen] = useState(false);
  if (prompts.length === 0) return null;

  const handleClick = (prompt: string) => {
    // Markdown 引用形式で挿入。すでに同じ問いが先頭にあればスキップ。
    const quote = `> ${prompt}\n`;
    if (currentValue.startsWith(quote)) return;
    const prefix = currentValue.trim() === "" ? "" : `${currentValue}\n\n`;
    onInsert(`${prefix}${quote}`);
  };

  return (
    <div className="mt-1.5 rounded-lg border border-sky-200 bg-sky-50/60 dark:border-sky-500/30 dark:bg-sky-500/[0.06]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[11px] font-semibold text-sky-800 transition hover:bg-sky-100/60 dark:text-sky-200 dark:hover:bg-sky-500/10"
      >
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>💡</span>
          <span>書きにくい? 答えやすい問いから 1 つ選ぶ ({prompts.length})</span>
        </span>
        <span
          aria-hidden
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        >
          ▶
        </span>
      </button>
      {open && (
        <div className="border-t border-sky-200/70 px-3 py-2 dark:border-sky-500/20">
          <p className="mb-2 text-[10px] text-sky-700/80 dark:text-sky-300/80">
            クリックで問いを引用挿入 → 続けて自分の言葉で答えを書きます
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {prompts.map((p, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleClick(p)}
                  className="rounded-md border border-sky-300 bg-white px-2 py-1 text-left text-[11px] leading-snug text-sky-800 transition hover:border-sky-500 hover:bg-sky-100 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-100 dark:hover:bg-sky-500/20"
                >
                  + {p}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

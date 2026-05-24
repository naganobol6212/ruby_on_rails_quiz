"use client";

import { useEffect, useState } from "react";

/**
 * ヘッダーに表示する検索ボタン。
 * Cmd+K / Ctrl+K の OS 判定ヒントを表示しつつ、
 * クリックで CommandPalette を開く (keydown イベントを dispatch)。
 */
export function SearchTrigger() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  const open = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      [isMac ? "metaKey" : "ctrlKey"]: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <button
      type="button"
      onClick={open}
      aria-label="検索を開く"
      title="検索 (Cmd+K / Ctrl+K)"
      className="group hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500 transition hover:border-rose-300 hover:text-rose-600 sm:inline-flex dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:border-rose-400/40 dark:hover:text-rose-300"
    >
      <span aria-hidden>🔍</span>
      <span>クイズを検索...</span>
      <kbd className="ml-2 hidden rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 group-hover:border-rose-300 lg:inline dark:border-white/15 dark:bg-white/10 dark:text-zinc-400">
        {isMac ? "⌘" : "Ctrl"}K
      </kbd>
    </button>
  );
}

/** モバイル用のコンパクト版 (アイコンのみ) */
export function SearchTriggerMobile() {
  const open = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <button
      type="button"
      onClick={open}
      aria-label="検索を開く"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-base text-zinc-600 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/40 dark:hover:text-rose-300 sm:hidden"
    >
      🔍
    </button>
  );
}

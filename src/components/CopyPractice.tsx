"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  storageKey: string;
  referenceCode: string;
  language?: string;
};

type LineStatus = "match" | "mismatch" | "pending";

const STORAGE_PREFIX = "rrq_copy_";

export function CopyPractice({ storageKey, referenceCode, language }: Props) {
  const refLines = useMemo(() => referenceCode.split("\n"), [referenceCode]);
  const [value, setValue] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_PREFIX + storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (v !== null) setValue(v);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_PREFIX + storageKey, value);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [value, storageKey, hydrated]);

  const userLines = useMemo(() => value.split("\n"), [value]);

  const lineStatuses: LineStatus[] = useMemo(
    () =>
      refLines.map((refLine, i) => {
        const userLine = userLines[i];
        if (userLine == null) return "pending";
        if (userLine === refLine) return "match";
        const isCurrent = i === userLines.length - 1;
        if (isCurrent && refLine.startsWith(userLine)) return "pending";
        return "mismatch";
      }),
    [refLines, userLines],
  );

  const matchCount = lineStatuses.filter((s) => s === "match").length;
  const mismatchCount = lineStatuses.filter((s) => s === "mismatch").length;
  const totalLines = refLines.length;
  const progress = Math.round((matchCount / totalLines) * 100);
  const isComplete = matchCount === totalLines && userLines.length >= totalLines;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const t = taRef.current;
      if (!t) return;
      const s = t.selectionStart;
      const en = t.selectionEnd;
      const next = value.slice(0, s) + "  " + value.slice(en);
      setValue(next);
      requestAnimationFrame(() => {
        if (taRef.current) {
          taRef.current.selectionStart = s + 2;
          taRef.current.selectionEnd = s + 2;
        }
      });
    }
  };

  const handleReset = () => {
    if (!value || window.confirm("入力内容をリセットします。よろしいですか?")) {
      setValue("");
      taRef.current?.focus();
    }
  };

  const peekNextChar = () => {
    const t = taRef.current;
    if (!t) return;
    const currentLineIndex = userLines.length - 1;
    const refLine = refLines[currentLineIndex] ?? "";
    const userLine = userLines[currentLineIndex] ?? "";
    if (refLine.startsWith(userLine) && userLine.length < refLine.length) {
      const nextChar = refLine[userLine.length];
      setValue(value + nextChar);
    } else if (
      userLine === refLine &&
      currentLineIndex < refLines.length - 1
    ) {
      setValue(value + "\n");
    }
    requestAnimationFrame(() => taRef.current?.focus());
  };

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm dark:border-emerald-500/20 dark:bg-zinc-900/70">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          ✍️ 写経モード
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            β
          </span>
        </h4>
        <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
          {matchCount} / {totalLines} 行一致
          {mismatchCount > 0 && (
            <span className="ml-2 text-rose-500 dark:text-rose-300">
              ✗ {mismatchCount}
            </span>
          )}
        </span>
      </div>

      {/* 進捗バー */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
        <div
          className={`h-full transition-all duration-300 ${
            isComplete
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : mismatchCount > 0
                ? "bg-gradient-to-r from-amber-400 to-orange-400"
                : "bg-gradient-to-r from-emerald-400 to-cyan-400"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* お手本 (行ステータス付き) */}
      <div className="mb-3 overflow-hidden rounded-xl border border-zinc-300 bg-zinc-950 dark:border-white/10">
        <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-3 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            📖 お手本
          </span>
          {language && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              {language}
            </span>
          )}
        </div>
        <pre className="max-h-[18rem] overflow-auto p-3 text-[12px] leading-relaxed text-zinc-200">
          <code>
            {refLines.map((line, i) => {
              const st = lineStatuses[i];
              const mark =
                st === "match" ? "✓" : st === "mismatch" ? "✗" : "·";
              const markCls =
                st === "match"
                  ? "text-emerald-400"
                  : st === "mismatch"
                    ? "text-rose-400"
                    : "text-zinc-600";
              const lineCls =
                st === "match"
                  ? "opacity-50"
                  : st === "mismatch"
                    ? "bg-rose-500/10"
                    : "";
              const isCurrent = i === userLines.length - 1 && !isComplete;
              return (
                <span
                  key={i}
                  className={`flex ${lineCls} ${
                    isCurrent ? "bg-emerald-500/15" : ""
                  }`}
                >
                  <span
                    className={`select-none pr-2 font-mono text-[11px] ${markCls}`}
                  >
                    {mark}
                  </span>
                  <span className="min-w-[2.5ch] select-none pr-3 text-right font-mono text-[10px] text-zinc-600">
                    {i + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">
                    {line.length === 0 ? " " : line}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>

      {/* 入力エディタ */}
      <div className="overflow-hidden rounded-xl border border-zinc-300 bg-zinc-950 dark:border-white/10">
        <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-3 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            ⌨ あなたの入力
          </span>
          <span className="font-mono text-[10px] text-zinc-500">
            {userLines.length} 行
          </span>
        </div>
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="ここに 1 行ずつ写経してください。半角・記号・インデントまで一致を目指そう。"
          className="block min-h-[14rem] w-full resize-y bg-transparent p-3 font-mono text-[13px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
        <span>
          💾 自動保存 (LocalStorage) ・ ⇥ Tab=2 スペース ・ あなたのブラウザのみ
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={peekNextChar}
            className="rounded border border-zinc-300 px-2 py-0.5 font-medium text-zinc-700 transition hover:border-amber-400 hover:text-amber-600 dark:border-white/20 dark:text-zinc-300 dark:hover:border-amber-400/60 dark:hover:text-amber-300"
            title="次の 1 文字を入力欄に挿入"
          >
            💡 ヒント (1 文字)
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded border border-zinc-300 px-2 py-0.5 font-medium text-zinc-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-white/20 dark:text-zinc-300 dark:hover:border-rose-400/60 dark:hover:text-rose-300"
          >
            リセット
          </button>
        </div>
      </div>

      {isComplete && (
        <div className="mt-4 rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-3 dark:border-emerald-500/30 dark:from-emerald-500/10 dark:to-teal-500/10">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            🎉 全行一致しました！
          </p>
          <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-200/80">
            次は手を止めて、書いたコードを口頭で説明してみよう。詰まった所はジャーナルに書き出して、関連クイズで定着させると効果的です。
          </p>
        </div>
      )}
    </div>
  );
}

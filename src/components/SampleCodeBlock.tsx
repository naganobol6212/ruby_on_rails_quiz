"use client";

import { useState } from "react";
import { CodeBlock } from "./CodeBlock";
import { CopyPractice } from "./CopyPractice";

type Props = {
  storageKey: string;
  code: string;
  language?: string;
  label?: string;
  filename?: string;
};

export function SampleCodeBlock({
  storageKey,
  code,
  language,
  label,
  filename,
}: Props) {
  const [practicing, setPracticing] = useState(false);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline gap-2">
        {label && (
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {label}
          </span>
        )}
        {filename && (
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
            {filename}
          </code>
        )}
        <button
          type="button"
          onClick={() => setPracticing((p) => !p)}
          aria-pressed={practicing}
          className={`ml-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition ${
            practicing
              ? "border-zinc-400 bg-zinc-100 text-zinc-700 hover:border-zinc-500 dark:border-white/20 dark:bg-white/10 dark:text-zinc-200"
              : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400/60 dark:hover:bg-emerald-500/15"
          }`}
        >
          {practicing ? "📖 お手本に戻す" : "✍️ 写経モードで開く"}
        </button>
      </div>
      {practicing ? (
        <CopyPractice
          storageKey={storageKey}
          referenceCode={code}
          language={language}
        />
      ) : (
        <CodeBlock code={code} label={language ?? "code"} />
      )}
    </div>
  );
}

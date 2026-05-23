"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { setSelfExplanation, getAttempt } from "@/lib/storage";

type Props = {
  questionId: string;
  /** 模範となるサマリー (比較用) */
  sampleSummary: string;
};

type CheckResult = {
  label: string;
  hint: string;
  ok: boolean;
};

const MIN_LENGTH = 30;

function selfCheck(text: string): CheckResult[] {
  const t = text.trim();
  const checks: CheckResult[] = [];

  // 文字数
  checks.push({
    label: `${MIN_LENGTH} 文字以上`,
    hint: `現在 ${t.length} 文字`,
    ok: t.length >= MIN_LENGTH,
  });

  // 結論ファースト (冒頭が結論っぽいか): 末尾が「です」「ます」「だ」「である」で終わる文を含む
  const firstSentence = t.split(/[。\n]/).find((s) => s.trim().length > 0) ?? "";
  const looksConclusive =
    /です$|ます$|だ$|である$|になる$|する$|なる$/.test(firstSentence.trim()) ||
    firstSentence.includes("だから") ||
    firstSentence.includes("ため");
  checks.push({
    label: "結論を最初に書いた",
    hint: "1 文目で『〜だ』『〜である』のように言い切る",
    ok: looksConclusive,
  });

  // 理由 / 具体例の語が含まれる
  const hasReason = /なぜなら|理由|ため|から|ので/.test(t);
  checks.push({
    label: "理由・根拠を書いた",
    hint: "『なぜなら / ため / ので』のような接続を入れる",
    ok: hasReason,
  });

  // 具体例
  const hasExample = /例えば|たとえば|例:|具体的に|たとえ/.test(t);
  checks.push({
    label: "具体例を入れた",
    hint: "『例えば〜』『具体的に〜』のような例示",
    ok: hasExample,
  });

  return checks;
}

export function SelfExplanationBox({ questionId, sampleSummary }: Props) {
  const [text, setText] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  // 初期ロード
  useEffect(() => {
    const a = getAttempt(questionId);
    if (a?.selfExplanation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(a.selfExplanation);
    }
  }, [questionId]);

  const handleSave = () => {
    setSelfExplanation(questionId, text);
    setSavedAt(new Date().toLocaleTimeString("ja-JP"));
  };

  const checks = selfCheck(text);
  const okCount = checks.filter((c) => c.ok).length;

  return (
    <div className="overflow-hidden rounded-xl border border-sky-300/70 bg-gradient-to-br from-sky-50 to-white dark:border-sky-500/30 dark:from-sky-950/40 dark:via-zinc-900/40 dark:to-transparent">
      <div className="border-b border-sky-200 bg-sky-50 px-4 py-3 dark:border-sky-500/20 dark:bg-sky-500/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🗣️</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-200">
              構造化言語トレーニング
            </span>
            <span className="rounded-full bg-sky-200/70 px-2 py-0.5 font-mono text-[10px] text-sky-900 dark:bg-sky-500/30 dark:text-sky-100">
              {okCount} / {checks.length}
            </span>
          </div>
          {savedAt && (
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              ✓ 保存 {savedAt}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-sky-900/80 dark:text-sky-100/80">
          解説を見ずに、まずは <strong>自分の言葉でこの問題を説明</strong>{" "}
          してみましょう。クライアントに口頭で説明するつもりで。
        </p>
      </div>

      <div className="space-y-3 p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder={
            "例: この問題の答えは〜だ。なぜなら〜だから。たとえば〜のケースで使う。"
          }
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />

        {/* セルフチェック */}
        <ul className="space-y-1">
          {checks.map((c, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[11px] leading-relaxed"
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                  c.ok
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                }`}
              >
                {c.ok ? "✓" : "・"}
              </span>
              <span
                className={
                  c.ok
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }
              >
                <strong>{c.label}</strong>
                <span className="ml-1 text-zinc-500 dark:text-zinc-400">
                  — {c.hint}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={text.trim().length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>💾</span>
            <span>保存</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowSample((s) => !s);
              setReviewed(true);
            }}
            disabled={text.trim().length < 10}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-200 dark:hover:bg-sky-950/50"
          >
            <span>{showSample ? "📕" : "📖"}</span>
            <span>
              {showSample ? "模範解説を閉じる" : "模範解説と見比べる"}
            </span>
          </button>
          {!reviewed && text.trim().length >= 10 && (
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
              まず自分で書いてから見比べると効果的
            </span>
          )}
        </div>

        <AnimatePresence>
          {showSample && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/40"
            >
              <div className="px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  模範解説
                </p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {sampleSummary}
                </p>
              </div>
              <div className="border-t border-zinc-200 bg-amber-50/60 px-3 py-2 text-[10px] text-amber-800 dark:border-zinc-700 dark:bg-amber-950/30 dark:text-amber-200">
                💡 自分の説明と比べて、抜けていた要素・順序・具体例の有無を確認してみましょう。
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Explanation } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";

type Props = {
  explanation: Explanation;
  isCorrect: boolean;
};

const OFFICIAL_HOSTS = [
  "docs.ruby-lang.org",
  "ruby-doc.org",
  "rubyonrails.org",
  "guides.rubyonrails.org",
  "api.rubyonrails.org",
  "developer.mozilla.org",
  "nodejs.org",
  "typescriptlang.org",
  "react.dev",
  "reactjs.org",
  "nextjs.org",
  "git-scm.com",
  "rspec.info",
  "owasp.org",
  "kernel.org",
];

function isOfficial(url: string): boolean {
  try {
    const u = new URL(url);
    return OFFICIAL_HOSTS.some((h) => u.host === h || u.host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function ExplanationCard({ explanation, isCorrect }: Props) {
  const [openBeginner, setOpenBeginner] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`overflow-hidden rounded-xl border ${
        isCorrect
          ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-500/30 dark:from-emerald-500/10 dark:via-emerald-500/5 dark:to-transparent"
          : "border-rose-300 bg-gradient-to-br from-rose-50 to-white dark:border-rose-500/30 dark:from-rose-500/10 dark:via-rose-500/5 dark:to-transparent"
      }`}
    >
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-base ${
              isCorrect
                ? "bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-rose-500 text-white dark:bg-rose-500/20 dark:text-rose-300"
            }`}
          >
            {isCorrect ? "✓" : "✕"}
          </span>
          <p
            className={`text-base font-bold ${
              isCorrect
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-rose-700 dark:text-rose-300"
            }`}
          >
            {isCorrect ? "正解" : "不正解"}
          </p>
        </div>
        <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-100">
          {explanation.summary}
        </p>
      </div>

      <div className="space-y-5 px-5 py-5">
        <Section title="なぜそうなるのか" icon="🧠">
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {explanation.reason}
          </p>
        </Section>

        {explanation.beginnerExplanation && (
          <section className="overflow-hidden rounded-lg border border-sky-300/60 bg-sky-50/40 dark:border-sky-500/30 dark:bg-sky-500/[0.06]">
            <button
              type="button"
              onClick={() => setOpenBeginner((v) => !v)}
              aria-expanded={openBeginner}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-sky-100/60 dark:hover:bg-sky-500/[0.1]"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">💡</span>
                <span className="text-xs font-bold text-sky-800 dark:text-sky-200">
                  もっと噛み砕いて読む
                </span>
                <span className="rounded-full bg-sky-200/70 px-2 py-0.5 font-mono text-[10px] text-sky-900 dark:bg-sky-500/30 dark:text-sky-100">
                  わからない人向け
                </span>
              </span>
              <span
                className={`text-sky-700 transition-transform dark:text-sky-300 ${
                  openBeginner ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▾
              </span>
            </button>
            <AnimatePresence initial={false}>
              {openBeginner && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-sky-200/60 px-4 py-3 dark:border-sky-500/20">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-100">
                      {explanation.beginnerExplanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {explanation.codeExample && (
          <Section title="関連コード" icon="💻">
            <CodeBlock code={explanation.codeExample} />
          </Section>
        )}

        {explanation.commonMistakes &&
          explanation.commonMistakes.length > 0 && (
            <Section title="よくある間違い" icon="⚠️">
              <ul className="space-y-2">
                {explanation.commonMistakes.map((m, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

        {explanation.references && explanation.references.length > 0 && (
          <Section title="公式ガイド・参考リンク" icon="🔗">
            <ul className="space-y-1.5">
              {explanation.references.map((r, i) => {
                const official = isOfficial(r.url);
                return (
                  <li key={i}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline ${
                        official
                          ? "font-semibold text-sky-700 dark:text-sky-300"
                          : "text-rose-600 dark:text-rose-300"
                      }`}
                    >
                      {official && (
                        <span
                          className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-500/20 dark:text-sky-200"
                          title="公式ドキュメント"
                        >
                          公式
                        </span>
                      )}
                      <span>{r.label}</span>
                      <span className="text-[10px]" aria-hidden>
                        ↗
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}
      </div>
    </motion.div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-xs">{icon}</span>
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {title}
        </h4>
      </div>
      {children}
    </section>
  );
}

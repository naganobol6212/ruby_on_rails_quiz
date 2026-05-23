"use client";

import { motion } from "framer-motion";
import type { Explanation } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";

type Props = {
  explanation: Explanation;
  isCorrect: boolean;
};

export function ExplanationCard({ explanation, isCorrect }: Props) {
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
          <Section title="参考リンク" icon="🔗">
            <ul className="space-y-1.5">
              {explanation.references.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-rose-600 underline-offset-4 hover:underline dark:text-rose-300"
                  >
                    {r.label} ↗
                  </a>
                </li>
              ))}
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

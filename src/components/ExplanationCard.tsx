"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { CategoryId, Explanation } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { findGuide, studyLinksForCategory } from "@/data/guides";

type Props = {
  explanation: Explanation;
  isCorrect: boolean;
  /** 自動学び直しガイド導出のため */
  categoryId?: CategoryId;
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

type ResolvedStudyLink = {
  guideId: string;
  guideTitle: string;
  guideEmoji: string;
  chapterId?: string;
  chapterTitle?: string;
  href: string;
  note?: string;
  /** true なら explicit (Question 側で明示)、 false なら category 自動フォールバック */
  explicit: boolean;
};

function resolveStudyLinks(
  explanation: Explanation,
  categoryId: CategoryId | undefined,
): ResolvedStudyLink[] {
  const links: ResolvedStudyLink[] = [];
  const seen = new Set<string>();

  // 1. Question 側で明示された studyGuide 優先
  for (const sg of explanation.studyGuide ?? []) {
    const guide = findGuide(sg.guideId);
    if (!guide) continue;
    const chapter = sg.chapterId
      ? guide.chapters.find((c) => c.id === sg.chapterId)
      : undefined;
    const key = `${guide.id}|${chapter?.id ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({
      guideId: guide.id,
      guideTitle: guide.title,
      guideEmoji: guide.emoji,
      chapterId: chapter?.id,
      chapterTitle: chapter?.title,
      href: chapter ? `/guide/${guide.id}/${chapter.id}` : `/guide/${guide.id}`,
      note: sg.note,
      explicit: true,
    });
  }

  // 2. 明示がなければ categoryId からフォールバック (最大 2 件)
  // studyLinksForCategory は章レベル & note 付きの代替案内も返す
  if (links.length === 0 && categoryId) {
    for (const sg of studyLinksForCategory(categoryId).slice(0, 2)) {
      const guide = findGuide(sg.guideId);
      if (!guide) continue;
      const chapter = sg.chapterId
        ? guide.chapters.find((c) => c.id === sg.chapterId)
        : undefined;
      const key = `${guide.id}|${chapter?.id ?? ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({
        guideId: guide.id,
        guideTitle: guide.title,
        guideEmoji: guide.emoji,
        chapterId: chapter?.id,
        chapterTitle: chapter?.title,
        href: chapter
          ? `/guide/${guide.id}/${chapter.id}`
          : `/guide/${guide.id}`,
        note: sg.note,
        explicit: false,
      });
    }
  }

  return links;
}

export function ExplanationCard({ explanation, isCorrect, categoryId }: Props) {
  const [openBeginner, setOpenBeginner] = useState(false);
  const studyLinks = useMemo(
    () => resolveStudyLinks(explanation, categoryId),
    [explanation, categoryId],
  );

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

        {studyLinks.length > 0 && (
          <Section title="もう一度学ぶ — このサイトの参考書" icon="📖">
            {!isCorrect && (
              <p className="mb-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                💡 公式サイトを開く前に、 まずアプリ内の参考書で基礎を読み返してみましょう。
              </p>
            )}
            <ul className="space-y-1.5">
              {studyLinks.map((l) => (
                <li key={`${l.guideId}|${l.chapterId ?? ""}`}>
                  <Link
                    href={l.href}
                    className="group flex items-start gap-2 rounded-lg border border-rose-200 bg-white/70 px-3 py-2 text-sm text-zinc-800 transition hover:border-rose-400 hover:bg-rose-50/70 dark:border-rose-500/30 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:border-rose-400/60 dark:hover:bg-rose-500/10"
                  >
                    <span className="text-base leading-none">{l.guideEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-rose-700 group-hover:underline dark:text-rose-300">
                        {l.chapterTitle ?? l.guideTitle}
                      </p>
                      {l.chapterTitle && (
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          {l.guideTitle}
                        </p>
                      )}
                      {l.note && (
                        <p className="mt-0.5 text-[11px] text-zinc-600 dark:text-zinc-300">
                          ヒント: {l.note}
                        </p>
                      )}
                      {!l.explicit && (
                        <p className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                          ※ カテゴリから自動関連付け
                        </p>
                      )}
                    </div>
                    <span className="text-rose-500 transition group-hover:translate-x-0.5 dark:text-rose-300">
                      →
                    </span>
                  </Link>
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

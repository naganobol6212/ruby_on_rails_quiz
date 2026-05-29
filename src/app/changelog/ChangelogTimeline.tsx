"use client";

import { useState } from "react";
import { BADGE_META, changelog, type ChangelogBadge } from "@/data/changelog";

type Filter = "all" | ChangelogBadge;

const FILTERS: Filter[] = ["all", "feat", "fix", "ui", "content"];
const FILTER_LABEL: Record<Filter, string> = {
  all: "すべて",
  feat: BADGE_META.feat.label,
  fix: BADGE_META.fix.label,
  ui: BADGE_META.ui.label,
  content: BADGE_META.content.label,
};

const countOf = (f: Filter) =>
  f === "all" ? changelog.length : changelog.filter((e) => e.badge === f).length;

export function ChangelogTimeline() {
  const newestVersion = changelog[0]?.version;
  const [filter, setFilter] = useState<Filter>("all");
  // 最新の 1 件だけ最初から開いておく
  const [open, setOpen] = useState<Record<string, boolean>>(
    newestVersion ? { [newestVersion]: true } : {},
  );

  const toggle = (version: string) =>
    setOpen((o) => ({ ...o, [version]: !o[version] }));

  const entries =
    filter === "all"
      ? changelog
      : changelog.filter((e) => e.badge === filter);

  return (
    <div>
      {/* フィルタチップ */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                active
                  ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-rose-300"
              }`}
            >
              <span>{FILTER_LABEL[f]}</span>
              <span className="tabular-nums text-[10px] text-zinc-400">
                {countOf(f)}
              </span>
            </button>
          );
        })}
      </div>

      {/* タイムライン (アコーディオン) */}
      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
          該当する更新はありません。
        </p>
      ) : (
        <ol className="relative space-y-3 border-l-2 border-zinc-200 pl-6 dark:border-white/10">
          {entries.map((entry) => {
            const badge = BADGE_META[entry.badge];
            const isNewest = entry.version === newestVersion;
            const isOpen = open[entry.version] ?? false;
            return (
              <li key={entry.version} className="relative">
                <span
                  className={`absolute -left-[33px] mt-3 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-sm dark:border-zinc-900 ${
                    isNewest ? "bg-rose-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
                <article className="rounded-2xl border border-zinc-200 bg-white/70 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
                  <button
                    type="button"
                    onClick={() => toggle(entry.version)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  >
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {entry.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2">
                        <time className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                          {entry.date}
                        </time>
                        {isNewest && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                            最新
                          </span>
                        )}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-zinc-400 transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ▸
                    </span>
                  </button>
                  {isOpen && (
                    <ul className="space-y-1.5 border-t border-zinc-100 px-5 py-4 text-sm dark:border-white/5">
                      {entry.highlights.map((h, j) => (
                        <li
                          key={j}
                          className="flex gap-2 text-zinc-700 dark:text-zinc-300"
                        >
                          <span className="text-rose-500 dark:text-rose-300">
                            ·
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { allQuestions } from "@/data/all-questions";
import { categories } from "@/data/categories";
import { tracks } from "@/data/tracks";
import { guides } from "@/data/guides";
import { crudChallenges } from "@/data/crud-challenges";

type Hit = {
  kind: "quiz" | "category" | "track" | "guide" | "guide-chapter" | "crud" | "crud-step";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  emoji: string;
};

const buildIndex = (): Hit[] => {
  const hits: Hit[] = [];

  for (const t of tracks) {
    hits.push({
      kind: "track",
      id: t.id,
      title: t.name,
      subtitle: t.description ?? `${t.emoji} Track`,
      href: `/track/${t.id}`,
      emoji: t.emoji,
    });
  }

  for (const c of categories) {
    hits.push({
      kind: "category",
      id: c.id,
      title: c.name,
      subtitle: `${c.emoji} カテゴリ`,
      href: `/quiz/${c.id}`,
      emoji: c.emoji,
    });
  }

  for (const q of allQuestions) {
    const cat = categories.find((c) => c.id === q.categoryId);
    hits.push({
      kind: "quiz",
      id: q.id,
      title: q.question,
      subtitle: `${q.difficulty} · ${cat?.name ?? q.categoryId}`,
      href: `/quiz/${q.categoryId}/${q.id}`,
      emoji: cat?.emoji ?? "🧩",
    });
  }

  for (const g of guides) {
    hits.push({
      kind: "guide",
      id: g.id,
      title: g.title,
      subtitle: `📚 参考書`,
      href: `/guide/${g.id}`,
      emoji: g.emoji ?? "📚",
    });
    for (const ch of g.chapters) {
      hits.push({
        kind: "guide-chapter",
        id: `${g.id}/${ch.id}`,
        title: ch.title,
        subtitle: `📖 ${g.title}`,
        href: `/guide/${g.id}/${ch.id}`,
        emoji: "📖",
      });
    }
  }

  for (const ch of crudChallenges) {
    hits.push({
      kind: "crud",
      id: ch.id,
      title: ch.title,
      subtitle: `🛠️ CRUD 実践課題`,
      href: `/crud/${ch.id}`,
      emoji: ch.emoji ?? "🛠️",
    });
    for (const s of ch.steps) {
      hits.push({
        kind: "crud-step",
        id: `${ch.id}/${s.id}`,
        title: s.title,
        subtitle: `🪜 ${ch.title}`,
        href: `/crud/${ch.id}/${s.id}`,
        emoji: "🪜",
      });
    }
  }

  return hits;
};

const fuzzyMatch = (haystack: string, needle: string): number => {
  if (needle === "") return 0.0001;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h.includes(n)) {
    // bonus if it appears earlier
    return 1 + 1 / (h.indexOf(n) + 1);
  }
  // simple subsequence check
  let i = 0;
  for (const ch of h) {
    if (ch === n[i]) i++;
    if (i === n.length) return 0.5;
  }
  return 0;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    if (!query.trim()) {
      // 検索クエリがないときは『よく使う』導線を出す
      return [
        ...tracks.slice(0, 4).map((t) => ({
          kind: "track" as const,
          id: t.id,
          title: t.name,
          subtitle: "Track",
          href: `/track/${t.id}`,
          emoji: t.emoji,
        })),
        {
          kind: "guide" as const,
          id: "guide-list",
          title: "📚 参考書一覧",
          subtitle: "Study Guide",
          href: "/guide",
          emoji: "📚",
        },
        {
          kind: "crud" as const,
          id: "crud-list",
          title: "🛠️ CRUD 実践課題",
          subtitle: "手を動かして学ぶ",
          href: "/crud",
          emoji: "🛠️",
        },
        {
          kind: "guide" as const,
          id: "roadmap",
          title: "🗺️ 学習ロードマップ",
          subtitle: "推奨される学習順",
          href: "/roadmap",
          emoji: "🗺️",
        },
      ];
    }
    return index
      .map((h) => ({
        h,
        score: Math.max(
          fuzzyMatch(h.title, query),
          fuzzyMatch(h.subtitle, query) * 0.7,
        ),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((x) => x.h);
  }, [query, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac =
        typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad/.test(navigator.platform);
      const trigger = isMac
        ? e.metaKey && e.key.toLowerCase() === "k"
        : e.ctrlKey && e.key.toLowerCase() === "k";
      if (trigger) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const target = results[activeIndex];
        if (target) {
          setOpen(false);
          setQuery("");
          router.push(target.href);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, activeIndex, router]);

  useEffect(() => {
    if (open) {
      // 開いた時にフォーカス、活性をリセット
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[12vh] px-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-white/10">
          <span className="text-base text-zinc-400" aria-hidden>
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="クイズ・参考書・課題を検索... (例: N+1、validates、ぼっち演算子)"
            className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            ESC
          </kbd>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              該当する結果がありません
            </li>
          )}
          {results.map((h, i) => (
            <li key={`${h.kind}-${h.id}`}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                  router.push(h.href);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                  i === activeIndex
                    ? "bg-rose-50 dark:bg-rose-500/[0.08]"
                    : "hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {h.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${
                      i === activeIndex
                        ? "text-rose-700 dark:text-rose-300"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {h.title}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-500">
                    {h.subtitle}
                  </p>
                </div>
                {i === activeIndex && (
                  <kbd className="hidden rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
                    ↵
                  </kbd>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] text-zinc-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
          <span>
            <kbd className="font-mono">↑↓</kbd> 移動 ·{" "}
            <kbd className="font-mono">↵</kbd> 選択 ·{" "}
            <kbd className="font-mono">ESC</kbd> 閉じる
          </span>
          <span>{results.length} 件</span>
        </div>
      </div>
    </div>
  );
}

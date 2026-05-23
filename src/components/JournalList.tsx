"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  type JournalEntry,
  deleteEntry,
  findTemplate,
  loadEntries,
  templates,
} from "@/lib/journal";

export function JournalList() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filter, setFilter] = useState<"all" | string>("all");

  useEffect(() => {
    const refresh = () => setEntries(loadEntries());
    refresh();
    window.addEventListener("rrq:journal-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("rrq:journal-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filtered =
    filter === "all" ? entries : entries.filter((e) => e.templateId === filter);

  const handleDelete = (id: string) => {
    if (confirm("この記録を削除します。よろしいですか？")) {
      deleteEntry(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Journal
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            学習ジャーナル
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            複数のフォーマットで学びを構造化し、言語化力を鍛えましょう。
            記録はあなたのブラウザに保存されます。
          </p>
        </div>
      </div>

      {/* テンプレート選択 (新規作成) */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          📝 新しい振り返りを書く
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/journal/new?template=${t.id}`}
              className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-rose-400/40 dark:hover:bg-white/[0.05]"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{t.emoji}</span>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {t.name}
                </h3>
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.description}
              </p>
              <p className="mt-3 text-[11px] text-zinc-500 transition-colors group-hover:text-rose-600 dark:text-zinc-500 dark:group-hover:text-rose-300">
                書き始める →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 履歴 */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            📚 過去の記録 ({entries.length})
          </h2>
        </div>

        {/* テンプレートフィルタ */}
        {entries.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                filter === "all"
                  ? "border-rose-400 bg-rose-500 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              }`}
            >
              すべて ({entries.length})
            </button>
            {templates.map((t) => {
              const count = entries.filter((e) => e.templateId === t.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFilter(t.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    filter === t.id
                      ? "border-rose-400 bg-rose-500 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                  }`}
                >
                  {t.emoji} {t.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white/50 p-8 text-center text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
            {entries.length === 0
              ? "まだ記録がありません。上のテンプレートから書き始めましょう。"
              : "このフィルタに該当する記録はありません。"}
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence>
              {filtered.map((entry) => {
                const tpl = findTemplate(entry.templateId);
                return (
                  <motion.li
                    key={entry.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Link
                      href={`/journal/${entry.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-rose-300 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-rose-400/30"
                    >
                      <span className="text-lg">{tpl?.emoji ?? "📝"}</span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {entry.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          {tpl?.name ?? "不明"} ·{" "}
                          {new Date(entry.createdAt).toLocaleString("ja-JP", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(entry.id);
                        }}
                        title="削除"
                        className="rounded p-1.5 text-zinc-400 transition hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                      >
                        🗑
                      </button>
                    </Link>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </section>

      {/* ヒント */}
      <section className="rounded-xl border border-sky-300/60 bg-sky-50/40 p-4 dark:border-sky-500/20 dark:bg-sky-500/5">
        <h3 className="mb-1.5 text-sm font-semibold text-sky-800 dark:text-sky-300">
          💡 構造化言語力を鍛えるコツ
        </h3>
        <ul className="ml-4 list-disc space-y-1 text-xs text-sky-900/80 dark:text-sky-200/80">
          <li>毎日決まった時間 (1日5分でOK) に同じテンプレで書くと『書く型』が体に染み付く</li>
          <li>『最初に結論』『次に理由』の順を守るだけで、説明力が劇的に上がる</li>
          <li>事実 (Fact) と 意見 (Opinion) を分けて書く意識を持つ</li>
          <li>数字を 1 個以上入れる (時間・件数・% など) と曖昧さが消える</li>
          <li>1 週間に 1 度、過去の Try / 次やる が実行できたか自己レビュー</li>
        </ul>
      </section>
    </div>
  );
}

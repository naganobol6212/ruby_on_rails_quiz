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
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

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
    <div className="space-y-8">
      {/* ヘッダー */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Journal · 構造化言語訓練
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          学習ジャーナル
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          学びや経験を 6 種類のテンプレートで構造化して記録。
          <strong className="text-zinc-800 dark:text-zinc-200">毎日 5 分続ける</strong>
          だけで、説明力・報告力・課題発見力が階段状に伸びます。
          記録はあなたのブラウザにのみ保存されます。
        </p>
      </div>

      {/* テンプレート選択 (新規作成) */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          📝 新しい振り返りを書く
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((t) => {
            const isExpanded = expandedTemplate === t.id;
            return (
              <div
                key={t.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <div className="flex flex-col p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{t.emoji}</span>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {t.name}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {t.description}
                  </p>

                  {/* 鍛えられるスキル */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {t.skills.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href={`/journal/new?template=${t.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-fuchsia-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-rose-400 hover:to-fuchsia-400"
                    >
                      <span>書き始める</span>
                      <span>→</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTemplate(isExpanded ? null : t.id)
                      }
                      className="text-[11px] text-zinc-500 hover:text-rose-600 hover:underline dark:text-zinc-400 dark:hover:text-rose-300"
                    >
                      {isExpanded ? "▲ 閉じる" : "▼ 使い方・例を見る"}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden border-t border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/30"
                    >
                      <div className="space-y-4 p-4 text-xs">
                        <Section title="この型式で何が鍛えられる？" icon="🧠">
                          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {t.rationale}
                          </p>
                        </Section>
                        <Section title="どんな場面で使う？" icon="🎯">
                          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {t.useCase}
                          </p>
                        </Section>
                        <Section title="鍛えられるスキル" icon="💪">
                          <ul className="ml-4 list-disc space-y-1 text-zinc-700 dark:text-zinc-300">
                            {t.skills.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </Section>
                        <Section title="うまく書くコツ" icon="💡">
                          <ul className="ml-4 list-disc space-y-1 text-zinc-700 dark:text-zinc-300">
                            {t.tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </Section>
                        {t.examples.length > 0 && (
                          <Section title="記入例" icon="📖">
                            <div className="space-y-3">
                              {t.examples.map((ex, i) => (
                                <div
                                  key={i}
                                  className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
                                >
                                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                                    {ex.title}
                                  </p>
                                  {ex.context && (
                                    <p className="mt-0.5 text-[10px] italic text-zinc-500 dark:text-zinc-400">
                                      {ex.context}
                                    </p>
                                  )}
                                  <div className="mt-2 space-y-1.5">
                                    {t.fields.map((f) => {
                                      const v = ex.content[f.key];
                                      if (!v) return null;
                                      return (
                                        <div key={f.key}>
                                          <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-300">
                                            {f.label}
                                          </p>
                                          <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                                            {v}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Section>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="すべて"
              count={entries.length}
            />
            {templates.map((t) => {
              const count = entries.filter((e) => e.templateId === t.id).length;
              if (count === 0) return null;
              return (
                <FilterChip
                  key={t.id}
                  active={filter === t.id}
                  onClick={() => setFilter(t.id)}
                  label={`${t.emoji} ${t.name}`}
                  count={count}
                />
              );
            })}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
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
                      className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-rose-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-rose-400/40"
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

      {/* 構造化言語力を伸ばすコツ */}
      <section className="rounded-xl border border-sky-300/70 bg-sky-50/60 p-5 dark:border-sky-500/30 dark:bg-sky-950/40">
        <h3 className="mb-2 text-sm font-semibold text-sky-800 dark:text-sky-200">
          💡 構造化言語力を伸ばす 5 つの習慣
        </h3>
        <ul className="ml-4 list-disc space-y-1.5 text-xs leading-relaxed text-sky-900/90 dark:text-sky-100/90">
          <li>
            <strong>毎日同じ時間に書く</strong> (1 日 5 分でOK)。継続が型を体に染み込ませる
          </li>
          <li>
            <strong>結論ファースト</strong>。最初に「〜である」と言い切ってから理由を書く
          </li>
          <li>
            <strong>事実 (Fact) と意見 (Opinion) を分ける</strong>。
            「〜と思う」「〜だった」を意識して使い分け
          </li>
          <li>
            <strong>数字を 1 個以上入れる</strong> (時間・件数・% など)。曖昧さが消える
          </li>
          <li>
            <strong>1 週間に 1 度、過去の記録を見返す</strong>。
            前回の Try / 次やる が実行できたかセルフレビュー
          </li>
        </ul>
      </section>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-rose-400 bg-rose-500 text-white shadow-sm"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-rose-400/40"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
          active
            ? "bg-white/25"
            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
        }`}
      >
        {count}
      </span>
    </button>
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
    <div>
      <h4 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        <span>{icon}</span>
        <span>{title}</span>
      </h4>
      {children}
    </div>
  );
}

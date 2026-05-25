"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  type JournalEntry,
  type Template,
  computeStreak,
  dailyCounts,
  deleteEntry,
  entriesOnDay,
  findTemplate,
  getLastTemplateId,
  loadEntries,
  monthlyCounts,
  templates,
} from "@/lib/journal";
import { Modal } from "./Modal";
import { JournalStreak } from "./JournalStreak";
import { JournalHeatmap } from "./JournalHeatmap";
import { TodaysJournal } from "./TodaysJournal";

export function JournalList() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filter, setFilter] = useState<"all" | string>("all");
  const [modalTemplate, setModalTemplate] = useState<Template | null>(null);
  const [lastTemplateId, setLastTemplateId] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      setEntries(loadEntries());
      setLastTemplateId(getLastTemplateId());
    };
    refresh();
    window.addEventListener("rrq:journal-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("rrq:journal-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const todayEntries = useMemo(() => entriesOnDay(entries), [entries]);
  const heatmapCounts = useMemo(
    () => dailyCounts(entries, 26 * 7),
    [entries],
  );
  const months = useMemo(() => monthlyCounts(entries, 6), [entries]);
  const maxMonth = Math.max(1, ...months.map((m) => m.count));

  const filtered =
    filter === "all" ? entries : entries.filter((e) => e.templateId === filter);

  const handleDelete = (id: string) => {
    if (confirm("この記録を削除します。よろしいですか？")) {
      deleteEntry(id);
    }
  };

  return (
    <div className="space-y-10">
      {/* ヘッダー */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Journal · 構造化言語訓練
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          学習ジャーナル
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          学びや経験を 6 種類のテンプレートで構造化して記録。毎日 5 分続けるだけで、
          説明力・報告力・課題発見力が階段状に伸びます。
          記録はあなたのブラウザにのみ保存されます。
        </p>
        <div className="mt-4">
          <Link
            href="/explanations"
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:border-sky-500 hover:bg-sky-100 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:border-sky-400/60 dark:hover:bg-sky-500/15"
          >
            🗣️ クイズで書いた自己説明 一覧へ
          </Link>
        </div>
      </div>

      {/* 今日の記録 (毎日記録しやすい主役 CTA) */}
      <TodaysJournal
        todayEntries={todayEntries}
        lastTemplateId={lastTemplateId}
        hasStreak={streak.current >= 1}
      />

      {/* 連続記録 / 累計 */}
      <JournalStreak streak={streak} totalEntries={entries.length} />

      {/* ヒートマップ + 月別件数 */}
      {entries.length > 0 && (
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <JournalHeatmap counts={heatmapCounts} weeks={26} />
          </div>
          <MonthlyBars months={months} max={maxMonth} />
        </section>
      )}

      {/* テンプレート選択 (カード全体クリック + 詳細はモーダル) */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          📝 テンプレートを選んで書き始める
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/journal/new?template=${t.id}`}
              className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-rose-400/50 dark:hover:bg-zinc-900/60"
            >
              {/* 詳細ボタン (絶対配置、カードクリックを止める) */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalTemplate(t);
                }}
                title="使い方・記入例を見る"
                aria-label="使い方・記入例を見る"
                className="absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs text-zinc-500 transition hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-rose-400/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
              >
                ?
              </button>

              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{t.emoji}</span>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {t.name}
                </h3>
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.description}
              </p>
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
              <div className="mt-4 flex items-center text-[11px] font-medium text-zinc-500 transition-colors group-hover:text-rose-600 dark:text-zinc-400 dark:group-hover:text-rose-300">
                <span>クリックして書き始める</span>
                <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 履歴 */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            📚 過去の記録 ({entries.length})
          </h2>
        </div>

        {entries.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
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
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <p className="text-2xl">📝</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {entries.length === 0
                ? "まだ記録がありません"
                : "このフィルタに該当する記録はありません"}
            </p>
            {entries.length === 0 && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                上のテンプレートをクリックして書き始めましょう
              </p>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence>
              {filtered.map((entry) => (
                <JournalEntryRow
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDelete}
                />
              ))}
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
            <strong>毎日同じ時間に書く</strong>{" "}
            (1 日 5 分でOK)。継続が型を体に染み込ませる
          </li>
          <li>
            <strong>結論ファースト</strong>。最初に「〜である」と言い切ってから理由を書く
          </li>
          <li>
            <strong>事実 (Fact) と意見 (Opinion) を分ける</strong>。
            「〜と思う」「〜だった」を意識して使い分け
          </li>
          <li>
            <strong>数字を 1 個以上入れる</strong>{" "}
            (時間・件数・% など)。曖昧さが消える
          </li>
          <li>
            <strong>1 週間に 1 度、過去の記録を見返す</strong>。
            前回の Try / 次やる が実行できたかセルフレビュー
          </li>
        </ul>
      </section>

      {/* テンプレート詳細モーダル */}
      <Modal
        open={modalTemplate !== null}
        onClose={() => setModalTemplate(null)}
        title={modalTemplate ? `${modalTemplate.emoji}  ${modalTemplate.name}` : ""}
        size="xl"
      >
        {modalTemplate && <TemplateDetail template={modalTemplate} />}
      </Modal>
    </div>
  );
}

function JournalEntryRow({
  entry,
  onDelete,
}: {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}) {
  const tpl = findTemplate(entry.templateId);

  // プレビュー: 主要フィールドの先頭
  const preview = (() => {
    if (!tpl) return "";
    for (const f of tpl.fields) {
      const v = entry.content[f.key]?.trim();
      if (v) return v.slice(0, 80);
    }
    return "";
  })();

  const charCount = Object.values(entry.content)
    .reduce((sum, v) => sum + (v ?? "").length, 0);

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Link
        href={`/journal/${entry.id}`}
        className="group block rounded-xl border border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-rose-400/40 dark:hover:bg-zinc-900/60"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl">{tpl?.emoji ?? "📝"}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="line-clamp-1 flex-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {entry.title}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(entry.id);
                }}
                title="削除"
                className="shrink-0 rounded p-1 text-zinc-400 opacity-0 transition hover:bg-rose-100 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-950 dark:hover:text-rose-300"
              >
                🗑
              </button>
            </div>
            {preview && (
              <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {preview}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">{tpl?.name ?? "不明"}</span>
              <span>·</span>
              <time className="tabular-nums">
                {new Date(entry.createdAt).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
              <span>·</span>
              <span className="tabular-nums">{charCount} 字</span>
              {entry.updatedAt !== entry.createdAt && (
                <>
                  <span>·</span>
                  <span className="italic">編集済</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.li>
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

// テンプレートの詳細 (モーダル本体)
function TemplateDetail({ template }: { template: Template }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {template.description}
      </p>

      <ModalSection icon="🧠" title="この型式で何が鍛えられる？">
        <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
          {template.rationale}
        </p>
      </ModalSection>

      <ModalSection icon="🎯" title="どんな場面で使う？">
        <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
          {template.useCase}
        </p>
      </ModalSection>

      <ModalSection icon="💪" title="鍛えられるスキル">
        <ul className="ml-4 list-disc space-y-1 text-zinc-700 dark:text-zinc-300">
          {template.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </ModalSection>

      <ModalSection icon="💡" title="うまく書くコツ">
        <ul className="ml-4 list-disc space-y-1 text-zinc-700 dark:text-zinc-300">
          {template.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </ModalSection>

      {template.examples.length > 0 && (
        <ModalSection icon="📖" title="記入例">
          <div className="space-y-4">
            {template.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/40"
              >
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {ex.title}
                </p>
                {ex.context && (
                  <p className="mt-0.5 text-[11px] italic text-zinc-500 dark:text-zinc-400">
                    {ex.context}
                  </p>
                )}
                <div className="mt-3 space-y-3">
                  {template.fields.map((f) => {
                    const v = ex.content[f.key];
                    if (!v) return null;
                    return (
                      <div key={f.key}>
                        <p className="mb-1 text-[11px] font-semibold text-rose-600 dark:text-rose-300">
                          {f.label}
                        </p>
                        <p className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                          {v}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ModalSection>
      )}

      <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <Link
          href={`/journal/new?template=${template.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
        >
          <span>{template.emoji}</span>
          <span>このテンプレートで書き始める</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

function ModalSection({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        <span>{icon}</span>
        <span>{title}</span>
      </h4>
      <div className="text-sm">{children}</div>
    </section>
  );
}

function MonthlyBars({
  months,
  max,
}: {
  months: { ym: string; count: number }[];
  max: number;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <h3 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        📈 直近 {months.length} ヶ月の件数
      </h3>
      <ul className="space-y-2">
        {months.map((m) => {
          const pct = Math.round((m.count / max) * 100);
          const [, mm] = m.ym.split("-");
          return (
            <li key={m.ym} className="flex items-center gap-2 text-xs">
              <span className="w-10 shrink-0 font-mono text-zinc-500 dark:text-zinc-400">
                {parseInt(mm, 10)}月
              </span>
              <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4 }}
                  className={`h-full rounded-full ${
                    m.count === 0
                      ? "bg-zinc-200 dark:bg-zinc-700"
                      : "bg-gradient-to-r from-rose-400 to-fuchsia-500"
                  }`}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
                {m.count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

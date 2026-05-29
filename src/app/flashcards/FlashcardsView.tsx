"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  type Flashcard,
  bucketOf,
  cardStats,
  createCard,
  daysUntilDue,
  deleteCard,
  dueCards,
  loadCards,
} from "@/lib/flashcards";
import { StudySession } from "./StudySession";

type Filter = "all" | "due" | "new" | "learning" | "review" | "lapsed";

const FILTER_META: Record<Filter, { label: string; emoji: string }> = {
  all: { label: "全部", emoji: "🃏" },
  due: { label: "今日復習", emoji: "⏰" },
  new: { label: "未学習", emoji: "🌱" },
  learning: { label: "学習中", emoji: "📚" },
  review: { label: "定着済み", emoji: "✅" },
  lapsed: { label: "忘れた", emoji: "🌀" },
};

export function FlashcardsView() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [studying, setStudying] = useState<Flashcard[] | null>(null);

  useEffect(() => {
    const refresh = () => setCards(loadCards());
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("rrq:flashcards-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("rrq:flashcards-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const stats = useMemo(() => cardStats(cards), [cards]);
  const due = useMemo(() => dueCards(cards), [cards]);

  const filtered = useMemo(() => {
    let xs = cards;
    if (filter === "due") xs = due;
    else if (filter !== "all") xs = cards.filter((c) => bucketOf(c) === filter);
    const q = query.trim().toLowerCase();
    if (q) {
      xs = xs.filter(
        (c) =>
          c.front.toLowerCase().includes(q) ||
          c.back.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return xs.slice().sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  }, [cards, due, filter, query]);

  const startStudy = (subset: Flashcard[]) => {
    if (subset.length === 0) return;
    setStudying(subset);
  };

  return (
    <>
      {/* パンくず */}
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          フラッシュカード
        </span>
      </div>

      <header className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Flashcards · Spaced Repetition
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          🃏 フラッシュカード
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          知らない単語や間違えた問題をカードにして、 SM-2 (SuperMemo 2)
          の間隔反復学習で長期記憶へ。 忘却曲線に沿って復習タイミングを最適化します。
        </p>
      </header>

      {/* === 今日の復習 ヒーロー ============================================= */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-md ${
          stats.due > 0
            ? "border-rose-300 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50 dark:border-rose-500/30 dark:from-rose-950/30 dark:via-zinc-900/40 dark:to-fuchsia-950/30"
            : "border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:border-emerald-500/30 dark:from-emerald-950/30 dark:via-zinc-900/40 dark:to-teal-950/30"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest ${
                stats.due > 0
                  ? "text-rose-600 dark:text-rose-300"
                  : "text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {new Date().toLocaleDateString("ja-JP", {
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {stats.due > 0
                ? `⏰ 今日の復習 ${stats.due} 枚`
                : "🎉 今日の復習は完了！"}
            </h2>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              {stats.due > 0
                ? "1 セッションあたり 5-10 分が目安。 評価で次回の復習日が自動調整されます"
                : stats.total > 0
                  ? "明日のために、 新しいカードを追加するのもおすすめ"
                  : "最初の 1 枚から始めましょう。 知らない単語や間違えた問題をカード化"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            {stats.due > 0 ? (
              <button
                type="button"
                onClick={() => startStudy(due)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-500/30 transition hover:bg-rose-600"
              >
                <span>📚 学習を始める</span>
                <span aria-hidden>→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-600"
              >
                <span>＋ 新しいカードを追加</span>
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* === 統計 ============================================= */}
      <section className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Stat label="合計" emoji="🃏" value={stats.total} />
        <Stat label="今日復習" emoji="⏰" value={stats.due} accent="rose" />
        <Stat label="未学習" emoji="🌱" value={stats.new} />
        <Stat label="学習中 + 忘却" emoji="📚" value={stats.learning + stats.lapsed} />
        <Stat label="定着済" emoji="✅" value={stats.review} accent="emerald" />
      </section>

      {/* === フィルタ + 検索 + 追加 ============================================= */}
      <section className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(FILTER_META) as Filter[]).map((f) => {
            const active = filter === f;
            const count =
              f === "all"
                ? stats.total
                : f === "due"
                  ? stats.due
                  : stats[f];
            const disabled = count === 0 && f !== "all";
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                disabled={disabled}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  active
                    ? "border-rose-400 bg-rose-500 text-white shadow-sm shadow-rose-500/30"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/40 dark:hover:text-rose-300"
                }`}
              >
                <span>{FILTER_META[f].emoji}</span>
                <span>{FILTER_META[f].label}</span>
                <span
                  className={`rounded-full px-1.5 py-px font-mono text-[10px] ${active ? "bg-white/25" : "bg-zinc-100 dark:bg-white/10"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 表面 / 裏面 / タグ 検索"
          className="min-w-[180px] flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        <button
          type="button"
          onClick={() => setShowAdd((s) => !s)}
          className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
        >
          {showAdd ? "閉じる" : "＋ 新規カード"}
        </button>
      </section>

      {/* === 追加フォーム ============================================= */}
      {showAdd && (
        <AddCardForm
          onCreated={() => setShowAdd(false)}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {/* === カード一覧 ============================================= */}
      <section className="mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
            <p className="text-3xl">{cards.length === 0 ? "🃏" : "🔍"}</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {cards.length === 0
                ? "まだカードがありません。 最初の 1 枚を追加して始めましょう"
                : "該当するカードがありません"}
            </p>
            {cards.length === 0 && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600"
              >
                ＋ 最初のカードを作る
              </button>
            )}
          </div>
        ) : (
          <ul className="grid gap-2">
            {filtered.map((c) => (
              <CardListItem
                key={c.id}
                card={c}
                onStudyOne={() => startStudy([c])}
              />
            ))}
          </ul>
        )}
      </section>

      <p className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
        💡 評価:{" "}
        <strong>Again</strong> (忘れた → 翌日再挑戦) · <strong>Hard</strong> (難しい
        → 短めの間隔) · <strong>Good</strong> (普通に思い出せた) · <strong>Easy</strong> (簡単 → 長めの間隔)。
        間隔は SM-2 アルゴリズムで自動計算されます。 カードはブラウザの LocalStorage に保存。
      </p>

      {studying && (
        <StudySession
          initialCards={studying}
          onClose={() => setStudying(null)}
        />
      )}
    </>
  );
}

// ===========================================================================
// 統計カード
// ===========================================================================

function Stat({
  label,
  emoji,
  value,
  accent,
}: {
  label: string;
  emoji: string;
  value: number;
  accent?: "rose" | "emerald";
}) {
  const accentClass =
    accent === "rose"
      ? "text-rose-700 dark:text-rose-300"
      : accent === "emerald"
        ? "text-emerald-700 dark:text-emerald-300"
        : "text-zinc-800 dark:text-zinc-100";
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-center dark:border-white/10 dark:bg-zinc-900/40">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        <span className="mr-1">{emoji}</span>
        {label}
      </p>
      <p className={`mt-0.5 text-xl font-bold tabular-nums ${accentClass}`}>
        {value}
      </p>
    </div>
  );
}

// ===========================================================================
// カード一覧アイテム
// ===========================================================================

function CardListItem({
  card,
  onStudyOne,
}: {
  card: Flashcard;
  onStudyOne: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const due = daysUntilDue(card);
  const bucket = bucketOf(card);
  const dueLabel =
    due <= 0 ? "今日" : due === 1 ? "明日" : `${due} 日後`;
  const bucketColor: Record<typeof bucket, string> = {
    new: "bg-zinc-100 text-zinc-700 dark:bg-white/5 dark:text-zinc-300",
    learning:
      "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    review:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    lapsed:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  };

  const handleDelete = () => {
    if (confirm("このカードを削除します。 よろしいですか？")) {
      deleteCard(card.id);
    }
  };

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-3 transition hover:border-rose-300 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900/40 dark:hover:border-rose-400/40">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${bucketColor[bucket]}`}
            >
              {FILTER_META[bucket].emoji} {FILTER_META[bucket].label}
            </span>
            <span
              className={`font-mono text-[10px] ${
                due <= 0
                  ? "text-rose-600 dark:text-rose-300"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              ⏰ {dueLabel}
            </span>
            {card.lapses > 0 && (
              <span className="font-mono text-[10px] text-amber-600 dark:text-amber-300">
                🌀 {card.lapses} 回忘れた
              </span>
            )}
            {card.tags.length > 0 && (
              <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                🏷 {card.tags.join(", ")}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="block w-full text-left"
          >
            <p
              className={`text-sm font-medium text-zinc-900 dark:text-zinc-100 ${
                expanded ? "whitespace-pre-wrap" : "line-clamp-2"
              }`}
            >
              {card.front}
            </p>
            <p
              className={`mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 ${
                expanded ? "whitespace-pre-wrap" : "line-clamp-1"
              }`}
            >
              → {card.back}
            </p>
            <span className="mt-1 inline-block text-[10px] font-medium text-rose-600 dark:text-rose-300">
              {expanded ? "閉じる ▲" : "全文を見る ▼"}
            </span>
          </button>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            onClick={onStudyOne}
            className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-white px-2 py-1 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-500/40 dark:bg-zinc-800 dark:text-rose-200 dark:hover:bg-rose-500/10"
          >
            復習
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-[10px] text-zinc-400 transition hover:text-rose-600 dark:hover:text-rose-300"
          >
            削除
          </button>
        </div>
      </div>
    </li>
  );
}

// ===========================================================================
// 新規カード追加フォーム
// ===========================================================================

function AddCardForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [hint, setHint] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const canSubmit = front.trim() !== "" && back.trim() !== "";

  const submit = () => {
    if (!canSubmit) return;
    createCard({
      front,
      back,
      hint: hint.trim() || undefined,
      tags: tagsInput
        .split(/[,、 ]+/)
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setFront("");
    setBack("");
    setHint("");
    setTagsInput("");
    onCreated();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-4 overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50/40 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/[0.05]"
    >
      <h3 className="mb-3 text-sm font-bold text-emerald-800 dark:text-emerald-200">
        ＋ 新規カード
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="表面 (front) *">
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            rows={3}
            placeholder="例: ActiveRecord で N+1 を防ぐ方法は?"
            className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
        </Field>
        <Field label="裏面 (back) *">
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            rows={3}
            placeholder="例: includes / preload / eager_load で 関連を事前ロード。 .includes(:posts).where('posts.published = ?', true) は eager_load に自動切替"
            className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
        </Field>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="ヒント (任意)">
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="例: bullet gem"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
        </Field>
        <Field label="タグ (任意、 カンマ区切り)">
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="rails, activerecord, performance"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
        </Field>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-emerald-600"
        >
          保存して追加
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          キャンセル
        </button>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      {children}
    </label>
  );
}

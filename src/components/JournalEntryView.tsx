"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  type JournalEntry,
  deleteEntry,
  entryToText,
  findEntry,
  findTemplate,
  loadEntries,
} from "@/lib/journal";
import { JournalEditor } from "./JournalEditor";
import { JournalMarkdown } from "./JournalMarkdown";
import { Modal } from "./Modal";

type Props = {
  id: string;
};

export function JournalEntryView({ id }: Props) {
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null | undefined>(
    undefined,
  );
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const refresh = () => {
      setEntry(findEntry(id) ?? null);
      setAllEntries(loadEntries());
    };
    refresh();
    window.addEventListener("rrq:journal-updated", refresh);
    return () => window.removeEventListener("rrq:journal-updated", refresh);
  }, [id]);

  const relatedEntries = useMemo(() => {
    if (!entry) return [];
    return allEntries
      .filter((e) => e.templateId === entry.templateId && e.id !== entry.id)
      .slice(0, 5);
  }, [entry, allEntries]);

  if (entry === undefined) {
    return <div className="text-sm text-zinc-500">読み込み中...</div>;
  }

  if (entry === null) {
    return (
      <div className="space-y-4">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300"
        >
          ← ジャーナル一覧
        </Link>
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          指定された記録が見つかりません
        </div>
      </div>
    );
  }

  const template = findTemplate(entry.templateId);

  if (editMode && template) {
    return <JournalEditor template={template} existingId={entry.id} />;
  }

  const handleDelete = () => {
    if (confirm("この記録を削除します。よろしいですか？")) {
      deleteEntry(entry.id);
      router.push("/journal");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entryToText(entry));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("クリップボードコピーに失敗しました。");
    }
  };

  const charCount = Object.values(entry.content).reduce(
    (sum, v) => sum + (v ?? "").length,
    0,
  );
  const readingMinutes = Math.max(1, Math.ceil(charCount / 400));

  const createdDate = new Date(entry.createdAt);
  const updatedDate = new Date(entry.updatedAt);
  const wasEdited = entry.createdAt !== entry.updatedAt;

  return (
    <div className="space-y-6">
      {/* トップナビ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/journal"
          className="group inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          <span>ジャーナル一覧</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <ToolButton
            icon="✏"
            label="編集"
            onClick={() => setEditMode(true)}
          />
          <ToolButton
            icon={copied ? "✓" : "📋"}
            label={copied ? "コピー済" : "コピー"}
            onClick={handleCopy}
          />
          <ToolButton
            icon="💡"
            label="振り返りのコツ"
            onClick={() => setShowTips(true)}
            disabled={!template}
          />
          <ToolButton
            icon="🗑"
            label="削除"
            onClick={handleDelete}
            danger
          />
        </div>
      </div>

      {/* メインカード (ジャーナル本体) */}
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
      >
        {/* バナー (テンプレートカラーのストライプ) */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500 dark:from-rose-400 dark:via-rose-500 dark:to-rose-400" />

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {/* メタヘッダー */}
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <span>{template?.emoji ?? "📝"}</span>
              <span>{template?.name ?? "不明"}</span>
            </span>
            <span>·</span>
            <time dateTime={entry.createdAt}>
              {createdDate.toLocaleString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
            {wasEdited && (
              <>
                <span>·</span>
                <span className="italic">
                  編集:{" "}
                  {updatedDate.toLocaleString("ja-JP", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </>
            )}
          </div>

          {/* タイトル */}
          <h1 className="text-2xl font-bold leading-snug text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {entry.title}
          </h1>

          {/* メトリクス */}
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <span>📝</span>
              <span className="tabular-nums">{charCount} 字</span>
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <span>⏱</span>
              <span className="tabular-nums">約 {readingMinutes} 分で読める</span>
            </span>
            <span>·</span>
            <span className="tabular-nums">
              {Object.values(entry.content).filter((v) => v?.trim()).length} /{" "}
              {template?.fields.length ?? 0} 項目記入
            </span>
          </div>

          {/* フィールド本体 */}
          <div className="mt-8 space-y-7">
            {template?.fields.map((field) => {
              const value = entry.content[field.key]?.trim();
              const isEmpty = !value;
              return (
                <section
                  key={field.key}
                  className={`relative rounded-xl border ${
                    isEmpty
                      ? "border-dashed border-zinc-200 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/20"
                      : "border-zinc-200 bg-zinc-50/40 dark:border-zinc-800 dark:bg-zinc-900/30"
                  } p-5`}
                >
                  <div className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-rose-300">
                    {field.label.split("—")[0].trim()}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {field.label.replace(/^[^—]+—\s*/, "") || field.label}
                  </h3>
                  {isEmpty ? (
                    <p className="mt-2 text-xs italic text-zinc-400 dark:text-zinc-500">
                      (未記入)
                    </p>
                  ) : field.multiline ? (
                    <div className="mt-2">
                      <JournalMarkdown text={value!} />
                    </div>
                  ) : (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                      {value}
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </motion.article>

      {/* 関連記録 */}
      {relatedEntries.length > 0 && (
        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h3 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            🔁 同じ {template?.name ?? "テンプレート"} の過去の記録
          </h3>
          <ul className="space-y-2">
            {relatedEntries.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/journal/${e.id}`}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs transition hover:border-rose-300 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-rose-400/40"
                >
                  <time className="shrink-0 font-mono text-[10px] tabular-nums text-zinc-500 dark:text-zinc-400">
                    {new Date(e.createdAt).toLocaleDateString("ja-JP", {
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </time>
                  <span className="line-clamp-1 flex-1 text-zinc-800 dark:text-zinc-200">
                    {e.title}
                  </span>
                  <span className="text-zinc-400">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* アクションフッター */}
      <section className="flex flex-wrap items-center gap-2">
        <Link
          href={`/journal/new?template=${template?.id ?? ""}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
        >
          <span>{template?.emoji ?? "📝"}</span>
          <span>同じテンプレートで新規記録</span>
        </Link>
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          ジャーナル一覧へ
        </Link>
      </section>

      {/* 振り返りのコツモーダル */}
      <Modal
        open={showTips}
        onClose={() => setShowTips(false)}
        title={template ? `💡 ${template.name} を振り返るコツ` : "コツ"}
        size="lg"
      >
        {template && (
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                振り返り観点
              </h4>
              <ul className="ml-4 list-disc space-y-1 text-zinc-700 dark:text-zinc-300">
                <li>前回 (もしあれば) との変化 / 進捗を意識して読む</li>
                <li>『書いた時点では気付かなかった』ことが見えていないか</li>
                <li>Try / 次やる / 明日の予定 を実行できたかチェック</li>
                <li>事実 (Fact) と 感想 (Opinion) のバランスを再確認</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                {template.name} の核
              </h4>
              <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                {template.rationale}
              </p>
            </div>
            <div>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                書くときのコツ (= 読むときの観点でもある)
              </h4>
              <ul className="ml-4 list-disc space-y-1 text-zinc-700 dark:text-zinc-300">
                {template.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ToolButton({
  icon,
  label,
  onClick,
  danger,
  disabled,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border-zinc-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-rose-300 dark:hover:border-rose-400/40 dark:hover:bg-rose-950/30"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-rose-400/40 dark:hover:bg-zinc-700"
      }`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type JournalEntry,
  deleteEntry,
  entryToText,
  findEntry,
  findTemplate,
} from "@/lib/journal";
import { JournalEditor } from "./JournalEditor";

type Props = {
  id: string;
};

export function JournalEntryView({ id }: Props) {
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntry(findEntry(id) ?? null);
    const refresh = () => setEntry(findEntry(id) ?? null);
    window.addEventListener("rrq:journal-updated", refresh);
    return () => window.removeEventListener("rrq:journal-updated", refresh);
  }, [id]);

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
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
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

  return (
    <div className="space-y-6">
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            <span>✏</span>
            <span>編集</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            <span>{copied ? "✓" : "📋"}</span>
            <span>{copied ? "コピーしました" : "コピー"}</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15"
          >
            <span>🗑</span>
            <span>削除</span>
          </button>
        </div>
      </div>

      <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
        <header className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="text-lg">{template?.emoji ?? "📝"}</span>
            <span>{template?.name ?? "不明なテンプレート"}</span>
            <span>·</span>
            <time>
              {new Date(entry.createdAt).toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {entry.title}
          </h1>
        </header>

        <div className="space-y-5">
          {template?.fields.map((field) => {
            const value = entry.content[field.key]?.trim();
            if (!value) return null;
            return (
              <section key={field.key}>
                <h3 className="mb-1.5 text-sm font-semibold text-rose-600 dark:text-rose-300">
                  {field.label}
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {value}
                </p>
              </section>
            );
          })}
        </div>
      </article>
    </div>
  );
}

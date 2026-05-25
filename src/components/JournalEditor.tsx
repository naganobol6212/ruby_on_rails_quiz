"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  type JournalEntry,
  type Template,
  createEntry,
  entryToText,
  findEntry,
  loadEntries,
  previousEntryOfTemplate,
  rememberLastTemplate,
  updateEntry,
} from "@/lib/journal";
import { Modal } from "./Modal";
import { MarkdownField } from "./MarkdownField";

type Props = {
  template: Template;
  existingId?: string;
};

const DRAFT_KEY = (templateId: string, entryId?: string) =>
  `rrq_journal_draft_${templateId}${entryId ? `_${entryId}` : ""}`;

export function JournalEditor({ template, existingId }: Props) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string[] | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [existing, setExisting] = useState<JournalEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedEntry, setSavedEntry] = useState<JournalEntry | null>(null);
  const [previousEntry, setPreviousEntry] = useState<JournalEntry | null>(null);

  // 初期ロード: 既存エントリ or ドラフトから
  useEffect(() => {
    if (existingId) {
      const e = findEntry(existingId);
      if (e) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExisting(e);
        setContent(e.content);
        setTitle(e.title);
        // 編集モードでは『前回参照』は出さない
        return;
      }
    }
    // ドラフトから復元
    try {
      const draft = window.localStorage.getItem(DRAFT_KEY(template.id, existingId));
      if (draft) {
        const parsed = JSON.parse(draft);
        setContent(parsed.content ?? {});
        setTitle(parsed.title ?? "");
      }
    } catch {
      /* noop */
    }
    // 同じテンプレで書いた直前 1 件を取得 (新規時のみ、継続性表示用)
    setPreviousEntry(previousEntryOfTemplate(loadEntries(), template.id));
  }, [existingId, template.id]);

  // 前回エントリから『次に活かす』フィールドを抽出 (テンプレ別)
  const carryOver = useMemo(() => {
    if (!previousEntry) return null;
    const map: Partial<Record<string, { label: string; key: string }>> = {
      kpt: { label: "前回の Try (実行できた？)", key: "try" },
      "daily-report": {
        label: "前回の『明日の予定』",
        key: "tomorrow",
      },
      yww: { label: "前回の『次やる』", key: "next" },
      star: { label: "前回の Result / 学び", key: "result" },
      "5w1h": { label: "前回の How", key: "how" },
      prep: { label: "前回の結論 (Point)", key: "point" },
    };
    const cfg = map[previousEntry.templateId];
    if (!cfg) return null;
    const value = previousEntry.content[cfg.key]?.trim();
    if (!value) return null;
    return {
      label: cfg.label,
      value,
      title: previousEntry.title,
      createdAt: previousEntry.createdAt,
      id: previousEntry.id,
    };
  }, [previousEntry]);

  // ドラフト自動保存 (500ms デバウンス)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(
          DRAFT_KEY(template.id, existingId),
          JSON.stringify({ content, title }),
        );
        setSavedAt(new Date().toLocaleTimeString("ja-JP"));
      } catch {
        /* noop */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [content, title, template.id, existingId]);

  const setField = (key: string, val: string) =>
    setContent((c) => ({ ...c, [key]: val }));

  const handleSave = () => {
    let entry: JournalEntry | null = null;
    if (existing) {
      entry = updateEntry(existing.id, content, title);
    } else {
      entry = createEntry(template.id, content, title);
    }
    // ドラフト削除
    try {
      window.localStorage.removeItem(DRAFT_KEY(template.id, existingId));
    } catch {
      /* noop */
    }
    if (entry) {
      setSavedEntry(entry);
      setExisting(entry); // 以後の保存は更新扱いに
      // 『次に同じテンプレで開く』のために最後に使ったテンプレを記憶
      rememberLastTemplate(template.id);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // 簡易セルフレビュー (ローカル ヒューリスティック、AI 不要)
  const handleSelfReview = () => {
    const tips: string[] = [];

    // 各フィールドの長さチェック
    let totalLength = 0;
    let emptyCount = 0;
    for (const f of template.fields) {
      const v = (content[f.key] ?? "").trim();
      totalLength += v.length;
      if (v.length === 0) emptyCount++;
      else if (v.length < 20) {
        tips.push(
          `「${f.label}」が短いです (${v.length}文字)。理由や具体例を 1 つ加えると説明力が増します。`,
        );
      }
    }
    if (emptyCount > 0) {
      tips.push(
        `${emptyCount} 項目が空欄です。たとえ短くても埋めることで思考の抜けが減ります。`,
      );
    }

    // 数字の有無 (具体性)
    if (!/\d/.test(JSON.stringify(content))) {
      tips.push(
        "数字 (件数・時間・% など) が一つも入っていません。1つでも入れると曖昧さが大きく減ります。",
      );
    }

    // 主観/感情語の検出
    const subjective = /(なんとなく|たぶん|多分|気がする|思う|感じ)/g;
    const matches = JSON.stringify(content).match(subjective);
    if (matches && matches.length >= 2) {
      tips.push(
        `主観的な表現 (${matches.slice(0, 2).join(" / ")}) が複数あります。観察した事実 (Fact) と推測 (Opinion) を分けて書く意識をつけてみましょう。`,
      );
    }

    // テンプレート別の追加チェック
    if (template.id === "kpt" && (content.try ?? "").trim().length < 10) {
      tips.push(
        "Try (次に試すこと) が手薄です。Problem に対して、明日から実行できる具体的な行動を 1 つ書いてみましょう。",
      );
    }
    if (template.id === "star" && !/\d/.test(content.result ?? "")) {
      tips.push(
        "STAR の Result に数字が欲しいです。前後比較 (例: 1.5s → 200ms) を入れると説得力が出ます。",
      );
    }
    if (template.id === "prep") {
      const p1 = (content.point ?? "").trim();
      const p2 = (content.point2 ?? "").trim();
      if (p1 && p2 && p1 === p2) {
        tips.push(
          "Point の冒頭と末尾がまったく同じです。再結論は別の言い回しで補強すると説明が立体的になります。",
        );
      }
    }
    if (template.id === "5w1h") {
      const missing = template.fields.filter(
        (f) => !(content[f.key] ?? "").trim(),
      );
      if (missing.length > 0) {
        tips.push(
          `${missing.length} 軸が未記入です: ${missing
            .map((f) => f.label.split("—")[0].trim())
            .join(", ")}。書けないなら『不明』とでも書く方が抜けに気付けます。`,
        );
      }
    }

    // 良いとき
    if (tips.length === 0) {
      tips.push("✅ 各項目に十分な内容・具体性が書けています。");
      tips.push(
        "💪 次のステップ: 翌日に同じテンプレで書き、前回の Try / 次やる が実行できたか確認してみましょう。",
      );
    }
    if (totalLength > 800) {
      tips.unshift(
        `📏 合計 ${totalLength} 文字書けています。継続的に記録できると振り返り資料として価値が出てきます。`,
      );
    }

    setFeedback(tips);
  };

  const handleCopy = async () => {
    const text = entryToText({
      id: existing?.id ?? "preview",
      templateId: template.id,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: title || "(無題)",
      content,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("クリップボードコピーに失敗しました。手動で選択してください。");
    }
  };

  const hasAnyContent = Object.values(content).some(
    (v) => v.trim().length > 0,
  );

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
        {savedAt && (
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
            ✓ 自動保存 (ドラフト) {savedAt}
          </span>
        )}
      </div>

      {/* 保存完了カード */}
      {savedEntry && (
        <section
          role="status"
          aria-live="polite"
          className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-md dark:border-emerald-500/40 dark:from-emerald-500/[0.12] dark:to-teal-500/[0.08]"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden>
              ✅
            </span>
            <div className="flex-1">
              <h2 className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                保存しました
              </h2>
              <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-200/80">
                ジャーナル一覧やエントリ詳細ページでいつでも見返せます。
                <span className="ml-1 font-mono text-[10px]">
                  ({new Date(savedEntry.updatedAt).toLocaleString("ja-JP")})
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/journal/${savedEntry.id}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  📖 エントリを開く
                </Link>
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
                >
                  📚 一覧へ戻る
                </Link>
                <button
                  type="button"
                  onClick={() => setSavedEntry(null)}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-white/20 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                >
                  ✏️ 編集を続ける
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSavedEntry(null)}
              aria-label="閉じる"
              className="text-zinc-400 transition hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              ✕
            </button>
          </div>
        </section>
      )}

      {/* テンプレートヘッダー */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{template.emoji}</span>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {template.name}
            </h1>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {template.description}
            </p>
            <button
              type="button"
              onClick={() => setShowRationale(true)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60"
            >
              <span>💡</span>
              <span>使い方・コツ・記入例を見る</span>
            </button>
          </div>
        </div>
      </section>

      {/* 前回の同テンプレ entry から継続性ヒント (KPT の Try / daily-report の明日 等) */}
      {carryOver && !existing && (
        <section className="rounded-xl border border-amber-300/60 bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 dark:border-amber-400/30 dark:from-amber-500/[0.10] dark:to-orange-500/[0.06]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-800 dark:text-amber-200">
              <span aria-hidden>🔁</span>
              <span>{carryOver.label}</span>
            </p>
            <Link
              href={`/journal/${carryOver.id}`}
              className="text-[10px] text-amber-700 hover:underline dark:text-amber-300"
            >
              元の記録を開く →
            </Link>
          </div>
          <p className="line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-amber-900 dark:text-amber-100">
            {carryOver.value}
          </p>
          <p className="mt-2 text-[10px] text-amber-700/80 dark:text-amber-300/70">
            「{carryOver.title}」 ({new Date(carryOver.createdAt).toLocaleDateString("ja-JP")}) より
          </p>
        </section>
      )}

      {/* テンプレート詳細モーダル */}
      <Modal
        open={showRationale}
        onClose={() => setShowRationale(false)}
        title={`${template.emoji}  ${template.name}`}
        size="xl"
      >
        <div className="space-y-5 text-sm">
          <p className="text-zinc-600 dark:text-zinc-400">{template.description}</p>

          <ModalSection icon="🧠" title="この型式で鍛えられること">
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
        </div>
      </Modal>

      {/* Markdown ヒント (multiline フィールドで markdown が効くことを周知) */}
      <details className="rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900/40">
        <summary className="cursor-pointer font-semibold text-zinc-700 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-rose-300">
          ✨ 本文は Markdown 対応 (見出し / 太字 / コード / リスト / 引用) — クリックで詳細
        </summary>
        <div className="mt-2 grid gap-x-4 gap-y-1 text-[11px] text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
          <code># 見出し</code>
          <code>**太字** *斜体* ~~取り消し~~</code>
          <code>- 箇条書き  1. 番号付き</code>
          <code>`code` ```fenced```</code>
          <code>&gt; 引用</code>
          <code>[link](https://example.com)</code>
        </div>
        <p className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-500">
          各フィールド右上の <strong>👁 プレビュー</strong> で確認できます。⌘B 太字 / ⌘I 斜体 / ⌘K リンク / ⌘E プレビュー切替 / ⌘S 保存。
        </p>
      </details>

      {/* タイトル */}
      <section>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          タイトル (任意)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="未入力なら主要項目から自動生成されます"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </section>

      {/* フィールド */}
      <section className="space-y-4">
        {template.fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {field.label}
              </span>
              <span className="ml-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                {field.hint}
              </span>
            </label>
            {field.multiline ? (
              <MarkdownField
                value={content[field.key] ?? ""}
                onChange={(v) => setField(field.key, v)}
                placeholder={field.placeholder}
                rows={5}
                onSubmit={handleSave}
              />
            ) : (
              <input
                type="text"
                value={content[field.key] ?? ""}
                onChange={(e) => setField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            )}
          </div>
        ))}
      </section>

      {/* セルフレビューパネル */}
      {feedback && (
        <section className="rounded-xl border border-sky-300/60 bg-sky-50/50 p-4 dark:border-sky-500/30 dark:bg-sky-500/[0.06]">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-sky-800 dark:text-sky-300">
              🔎 セルフレビュー結果
            </h3>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs text-sky-700 hover:underline dark:text-sky-300"
            >
              閉じる
            </button>
          </div>
          <ul className="space-y-2">
            {feedback.map((tip, i) => (
              <li
                key={i}
                className="flex gap-2 text-xs leading-relaxed text-sky-900 dark:text-sky-100"
              >
                <span className="shrink-0">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-sky-700/80 dark:text-sky-300/70">
            ※ ローカル簡易チェックです。Claude API などの本格 AI レビューは将来追加予定。
          </p>
        </section>
      )}

      {/* アクション */}
      <section className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasAnyContent}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/20 transition hover:from-rose-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:from-zinc-300 disabled:to-zinc-300 disabled:shadow-none dark:disabled:from-zinc-700 dark:disabled:to-zinc-700"
        >
          <span>💾</span>
          <span>{existing ? "更新する" : "保存する"}</span>
        </button>
        <button
          type="button"
          onClick={handleSelfReview}
          disabled={!hasAnyContent}
          className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-5 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/15"
        >
          <span>🔎</span>
          <span>セルフレビュー</span>
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!hasAnyContent}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
        >
          <span>{copied ? "✓" : "📋"}</span>
          <span>{copied ? "コピーしました" : "テキストでコピー"}</span>
        </button>
      </section>
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

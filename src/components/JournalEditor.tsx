"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type JournalEntry,
  type Template,
  createEntry,
  entryToText,
  findEntry,
  updateEntry,
} from "@/lib/journal";

type Props = {
  template: Template;
  existingId?: string;
};

const DRAFT_KEY = (templateId: string, entryId?: string) =>
  `rrq_journal_draft_${templateId}${entryId ? `_${entryId}` : ""}`;

export function JournalEditor({ template, existingId }: Props) {
  const router = useRouter();
  const [content, setContent] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string[] | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [existing, setExisting] = useState<JournalEntry | null>(null);
  const [copied, setCopied] = useState(false);

  // 初期ロード: 既存エントリ or ドラフトから
  useEffect(() => {
    if (existingId) {
      const e = findEntry(existingId);
      if (e) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExisting(e);
        setContent(e.content);
        setTitle(e.title);
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
  }, [existingId, template.id]);

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
    if (existing) {
      updateEntry(existing.id, content, title);
    } else {
      createEntry(template.id, content, title);
    }
    // ドラフト削除
    try {
      window.localStorage.removeItem(DRAFT_KEY(template.id, existingId));
    } catch {
      /* noop */
    }
    router.push("/journal");
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

      {/* テンプレートヘッダー */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
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
              onClick={() => setShowRationale((s) => !s)}
              className="mt-2 inline-flex items-center gap-1 text-[11px] text-rose-600 hover:underline dark:text-rose-300"
            >
              <span>{showRationale ? "▼" : "▶"}</span>
              <span>この型式で何が鍛えられる？</span>
            </button>
            {showRationale && (
              <p className="mt-2 rounded-lg bg-rose-50/60 px-3 py-2 text-xs leading-relaxed text-rose-900 dark:bg-rose-500/10 dark:text-rose-100">
                {template.rationale}
              </p>
            )}
          </div>
        </div>
      </section>

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
              <textarea
                value={content[field.key] ?? ""}
                onChange={(e) => setField(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 font-sans text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500"
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

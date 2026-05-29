"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * ファインマン・テクニック演習。
 * 1 つのトピックを 4 人の相手に説明し直すことで「分かったつもり」の穴を炙り出す。
 * 入力は LocalStorage に自動保存 (rrq_feynman_v1)。
 */

type AudienceKey = "engineer" | "beginner" | "teen" | "grandma";

type Audience = {
  key: AudienceKey;
  emoji: string;
  label: string;
  prompt: string;
  placeholder: string;
};

const AUDIENCES: Audience[] = [
  {
    key: "engineer",
    emoji: "👩‍💻",
    label: "エンジニア仲間",
    prompt: "正確さ重視。専門用語を使ってよいが、根拠と前提条件まで言い切る。",
    placeholder:
      "例: 〜は〜という仕組みで、内部的には〜。トレードオフは〜で、〜の場合は〜を選ぶ。",
  },
  {
    key: "beginner",
    emoji: "🌱",
    label: "初学者",
    prompt: "専門用語を避けるか、使ったらその場で噛み砕く。手順を 1 つずつ。",
    placeholder:
      "例: まず〜をします。これは〜という意味です。次に〜。むずかしい言葉だと〜と言います。",
  },
  {
    key: "teen",
    emoji: "🧑‍🎓",
    label: "中学生",
    prompt: "身近なたとえ話で。日常の出来事に置き換えて説明する。",
    placeholder:
      "例: これは〜にたとえると、〜みたいなもの。たとえば学校で〜するのと同じで〜。",
  },
  {
    key: "grandma",
    emoji: "👵",
    label: "おばあちゃん",
    prompt: "前提知識ゼロ。専門用語を一切使わず、ふだんの言葉だけで。",
    placeholder:
      "例: むずかしい言葉は使わずに言うとね、〜は〜なの。ちょうど〜するのと同じことだよ。",
  },
];

const STORAGE_KEY = "rrq_feynman_v1";

type Draft = {
  topic: string;
  texts: Record<AudienceKey, string>;
};

const emptyDraft = (): Draft => ({
  topic: "",
  texts: { engineer: "", beginner: "", teen: "", grandma: "" },
});

function loadDraft(): Draft {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      topic: parsed.topic ?? "",
      texts: { ...emptyDraft().texts, ...(parsed.texts ?? {}) },
    };
  } catch {
    return emptyDraft();
  }
}

export function FeynmanTrainer() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // 初期ロード
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(loadDraft());
  }, []);

  // 自動保存 (デバウンス)
  useEffect(() => {
    if (!draft) return;
    const id = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSavedAt(new Date().toLocaleTimeString("ja-JP"));
    }, 600);
    return () => window.clearTimeout(id);
  }, [draft]);

  if (!draft) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">読み込み中…</p>
    );
  }

  const filledCount = AUDIENCES.filter(
    (a) => draft.texts[a.key].trim().length > 0,
  ).length;

  const setTopic = (topic: string) =>
    setDraft((d) => (d ? { ...d, topic } : d));
  const setText = (key: AudienceKey, value: string) =>
    setDraft((d) => (d ? { ...d, texts: { ...d.texts, [key]: value } } : d));

  const onReset = () => {
    if (!window.confirm("入力内容をクリアして新しいトピックを始めますか？"))
      return;
    setDraft(emptyDraft());
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
          ファインマン演習
        </span>
      </div>

      <header className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
          Feynman Technique
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          🗣️ 4 人に説明してみる
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          学んだトピックを 1 つ選び、相手を変えて説明し直します。
          <strong className="text-zinc-800 dark:text-zinc-200">
            うまく説明できなかった所が『まだ理解できていない所』
          </strong>
          。そこを学び直すと一気に定着します。
        </p>
      </header>

      {/* 進め方 */}
      <details className="mb-6 rounded-xl border border-zinc-200 bg-white/60 p-4 text-sm dark:border-white/10 dark:bg-zinc-900/50">
        <summary className="cursor-pointer font-semibold text-zinc-800 dark:text-zinc-200">
          進め方 (ファインマン・テクニック)
        </summary>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-zinc-700 dark:text-zinc-300">
          <li>学んだトピックを 1 つ選んで書く (例: 「クロージャ」「正規化」)。</li>
          <li>下の 4 人それぞれに向けて、自分の言葉で説明する。</li>
          <li>
            詰まった・あいまいになった所をメモし、参考書やクイズに戻って学び直す。
          </li>
          <li>もう一度説明してみて、すらすら言えるようになれば理解できた証拠。</li>
        </ol>
      </details>

      {/* トピック */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          今日のトピック
        </label>
        <input
          value={draft.topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例: クロージャ / DB の正規化 / Promise と async-await"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      {/* 進捗 + 保存状態 */}
      <div className="mb-4 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
        <span>
          記入: {filledCount} / {AUDIENCES.length} 人
        </span>
        {savedAt && <span>💾 自動保存 {savedAt}</span>}
      </div>

      {/* 4 人ぶんの入力 */}
      <div className="space-y-4">
        {AUDIENCES.map((a) => {
          const text = draft.texts[a.key];
          return (
            <section
              key={a.key}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white/70 dark:border-white/10 dark:bg-zinc-900/60"
            >
              <div className="border-b border-zinc-100 bg-zinc-50/70 px-4 py-3 dark:border-white/5 dark:bg-white/[0.03]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{a.emoji}</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {a.label}に説明
                  </span>
                  {text.trim().length > 0 && (
                    <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      ✓ 記入済
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {a.prompt}
                </p>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(a.key, e.target.value)}
                rows={4}
                placeholder={a.placeholder}
                className="block w-full resize-y bg-transparent px-4 py-3 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-600"
              />
            </section>
          );
        })}
      </div>

      {/* アクション */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-rose-400 hover:text-rose-600 dark:border-zinc-700 dark:text-zinc-300"
        >
          クリアして次のトピック
        </button>
        <Link
          href="/explanations"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-zinc-700 dark:text-zinc-200"
        >
          🗂️ クイズで書いた自己説明を見る
        </Link>
        <Link
          href="/journal"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-zinc-700 dark:text-zinc-200"
        >
          📝 ジャーナルに振り返りを書く
        </Link>
      </div>

      <p className="mt-6 rounded-lg bg-amber-50/70 px-3 py-2 text-[11px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
        💡 入力はこの端末のブラウザに自動保存されます。次のトピックに進むときは
        「クリアして次のトピック」を押してください。
      </p>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  crudChallenges,
  findCrudChallenge,
} from "@/data/crud-challenges";
import { findTrack } from "@/data/tracks";
import { findCategory } from "@/data/categories";

export function generateStaticParams() {
  return crudChallenges.map((c) => ({ challengeId: c.id }));
}

type Props = {
  params: Promise<{ challengeId: string }>;
};

const DIFFICULTY_LABEL: Record<string, { label: string; cls: string }> = {
  beginner: {
    label: "Beginner",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  intermediate: {
    label: "Intermediate",
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  advanced: {
    label: "Advanced",
    cls: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  },
};

const METHOD_CLS: Record<string, string> = {
  GET: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  POST: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  PATCH: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  DELETE: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export default async function CrudOverviewPage({ params }: Props) {
  const { challengeId } = await params;
  const c = findCrudChallenge(challengeId);
  if (!c) notFound();
  const track = findTrack(c.trackId);
  const diff = DIFFICULTY_LABEL[c.difficulty];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <Link
          href="/crud"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          CRUD 実践課題
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          {c.title}
        </span>
      </div>

      {/* ヒーロー */}
      <header className="mb-10">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{c.emoji}</span>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              CRUD Challenge
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {c.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {c.subtitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
              {track && (
                <Link
                  href={`/track/${track.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-medium text-zinc-600 hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/50 dark:hover:text-rose-300"
                >
                  {track.emoji} {track.name}
                </Link>
              )}
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${diff.cls}`}
              >
                {diff.label}
              </span>
              <span className="text-zinc-500 dark:text-zinc-500">
                {c.steps.length} ステップ · 約 {c.estimateMinutes} 分
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
              対象: {c.audience}
            </p>
          </div>
        </div>
      </header>

      {/* シナリオ */}
      <section className="mb-10 rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-900/60">
        <h2 className="mb-2 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          📋 シナリオ
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {c.scenario}
        </p>
      </section>

      {/* データモデル */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          🗄️ データモデル
        </h2>
        <div className="space-y-4">
          {c.dataModels.map((m) => (
            <div
              key={m.name}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white/70 dark:border-white/10 dark:bg-zinc-900/60"
            >
              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-white/10 dark:bg-white/5">
                <h3 className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {m.name}
                </h3>
                <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                  {m.description}
                </p>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-zinc-50/60 text-left text-[10px] uppercase tracking-wider text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-2 font-medium">カラム</th>
                    <th className="px-4 py-2 font-medium">型</th>
                    <th className="px-4 py-2 font-medium">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {m.columns.map((col) => (
                    <tr
                      key={col.name}
                      className="border-t border-zinc-100 dark:border-white/5"
                    >
                      <td className="px-4 py-2 font-mono text-zinc-800 dark:text-zinc-200">
                        {col.name}
                      </td>
                      <td className="px-4 py-2 font-mono text-zinc-600 dark:text-zinc-400">
                        {col.type}
                      </td>
                      <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                        {col.notes ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      {/* API */}
      {c.apiEndpoints && c.apiEndpoints.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            🔌 API エンドポイント
          </h2>
          <div className="space-y-1.5">
            {c.apiEndpoints.map((ep, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900/60"
              >
                <span
                  className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                    METHOD_CLS[ep.method] ?? ""
                  }`}
                >
                  {ep.method}
                </span>
                <div className="flex-1">
                  <code className="font-mono text-zinc-900 dark:text-zinc-100">
                    {ep.path}
                  </code>
                  <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {ep.description}
                  </p>
                  {ep.request && (
                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                      <span className="font-medium">req:</span> {ep.request}
                    </p>
                  )}
                  {ep.response && (
                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                      <span className="font-medium">res:</span> {ep.response}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ステップ */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            実装ステップ
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
            👆 ステップをタップで開く
          </p>
        </div>
        <ol className="space-y-3">
          {c.steps.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/crud/${c.id}/${s.id}`}
                aria-label={`ステップ ${i + 1}「${s.title}」を開く`}
                className="group flex items-stretch overflow-hidden rounded-2xl border-2 border-zinc-200 bg-white/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg active:translate-y-0 active:scale-[0.995] dark:border-white/10 dark:bg-zinc-900/70 dark:hover:border-emerald-400/60"
              >
                <span className="flex w-14 shrink-0 items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500 font-mono text-lg font-bold text-white shadow-inner shadow-black/20 transition group-hover:from-emerald-600 group-hover:to-cyan-600 sm:w-16">
                  {i + 1}
                </span>
                <div className="flex-1 px-4 py-3.5 sm:px-5">
                  <h3 className="font-semibold tracking-tight text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-300">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {s.goal}
                  </p>
                  <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-500">
                    チェック {s.checkpoints.length} 個
                    {s.sampleCode && s.sampleCode.length > 0
                      ? ` · サンプル ${s.sampleCode.length} 件`
                      : ""}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 self-center px-3 text-xs font-semibold text-emerald-700 transition group-hover:translate-x-1 dark:text-emerald-300 sm:pr-5">
                  <span className="hidden sm:inline">開く</span>
                  <span aria-hidden className="text-base leading-none">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* レビューチェック */}
      <section className="mb-10 rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
        <h2 className="mb-2 text-sm font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
          ✅ 全体レビューチェック
        </h2>
        <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-200">
          {c.reviewChecklist.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-emerald-500 dark:text-emerald-300">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 発展課題 */}
      {c.stretch && c.stretch.length > 0 && (
        <section className="mb-10 rounded-2xl border border-violet-200/60 bg-violet-50/40 p-5 dark:border-violet-500/20 dark:bg-violet-500/5">
          <h2 className="mb-2 text-sm font-bold tracking-tight text-violet-700 dark:text-violet-300">
            🚀 発展課題 (任意)
          </h2>
          <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-200">
            {c.stretch.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-violet-500 dark:text-violet-300">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 関連カテゴリ */}
      {c.relatedCategoryIds && c.relatedCategoryIds.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            🧪 関連カテゴリ (定着用クイズ)
          </h2>
          <div className="flex flex-wrap gap-2">
            {c.relatedCategoryIds.map((cid) => {
              const cat = findCategory(cid);
              if (!cat) return null;
              return (
                <Link
                  key={cid}
                  href={`/quiz/${cid}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-rose-400/50 dark:hover:text-rose-300"
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 参考 */}
      {c.references && c.references.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            🔗 参考
          </h2>
          <ul className="space-y-1.5 text-sm">
            {c.references.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline dark:text-rose-300"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

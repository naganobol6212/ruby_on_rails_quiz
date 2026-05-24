import Link from "next/link";
import { notFound } from "next/navigation";
import {
  crudChallenges,
  findCrudChallenge,
} from "@/data/crud-challenges";
import { CodeBlock } from "@/components/CodeBlock";

export function generateStaticParams() {
  return crudChallenges.flatMap((c) =>
    c.steps.map((s) => ({ challengeId: c.id, stepId: s.id })),
  );
}

type Props = {
  params: Promise<{ challengeId: string; stepId: string }>;
};

export default async function CrudStepPage({ params }: Props) {
  const { challengeId, stepId } = await params;
  const challenge = findCrudChallenge(challengeId);
  if (!challenge) notFound();
  const idx = challenge.steps.findIndex((s) => s.id === stepId);
  if (idx < 0) notFound();
  const step = challenge.steps[idx];
  const prev = idx > 0 ? challenge.steps[idx - 1] : null;
  const next =
    idx < challenge.steps.length - 1 ? challenge.steps[idx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
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
        <Link
          href={`/crud/${challenge.id}`}
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          {challenge.title}
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          ステップ {idx + 1}
        </span>
      </div>

      <header className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          {challenge.emoji} {challenge.title} · ステップ {idx + 1} /{" "}
          {challenge.steps.length}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {step.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          🎯 {step.goal}
        </p>
      </header>

      {/* 説明本文 */}
      <article className="mb-8">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
          {step.instructions}
        </p>
      </article>

      {/* 触るファイル */}
      {step.files && step.files.length > 0 && (
        <section className="mb-8 rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-white/10 dark:bg-zinc-900/60">
          <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            📁 触るファイル
          </h2>
          <ul className="space-y-1.5 text-sm">
            {step.files.map((f) => (
              <li key={f.path} className="flex flex-wrap items-baseline gap-2">
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px] text-zinc-800 dark:bg-white/10 dark:text-zinc-200">
                  {f.path}
                </code>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  — {f.purpose}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* コマンド */}
      {step.commandHints && step.commandHints.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            💻 実行コマンド例
          </h2>
          <CodeBlock
            code={step.commandHints.join("\n")}
            label="bash"
          />
        </section>
      )}

      {/* サンプルコード */}
      {step.sampleCode && step.sampleCode.length > 0 && (
        <section className="mb-8 space-y-5">
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            📝 サンプルコード
          </h2>
          {step.sampleCode.map((sc, i) => (
            <div key={i}>
              <div className="mb-2 flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {sc.label}
                </span>
                {sc.filename && (
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                    {sc.filename}
                  </code>
                )}
              </div>
              <CodeBlock code={sc.code} label={sc.language} />
            </div>
          ))}
        </section>
      )}

      {/* チェックポイント */}
      <section className="mb-8 rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
        <h2 className="mb-2 text-sm font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
          ✅ チェックポイント
        </h2>
        <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-200">
          {step.checkpoints.map((cp, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-emerald-500 dark:text-emerald-300">□</span>
              <span>{cp}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* レビュー観点 */}
      {step.reviewPoints && step.reviewPoints.length > 0 && (
        <section className="mb-8 rounded-2xl border border-amber-200/60 bg-amber-50/40 p-5 dark:border-amber-500/20 dark:bg-amber-500/5">
          <h2 className="mb-2 text-sm font-bold tracking-tight text-amber-700 dark:text-amber-300">
            🔍 レビュー観点
          </h2>
          <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-200">
            {step.reviewPoints.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-600 dark:text-amber-400">·</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 前後ナビ */}
      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-zinc-200 pt-6 dark:border-white/10">
        {prev ? (
          <Link
            href={`/crud/${challenge.id}/${prev.id}`}
            className="group flex max-w-[45%] flex-col rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 transition hover:border-rose-300 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
          >
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
              ← 前ステップ
            </span>
            <span className="mt-0.5 truncate text-sm font-medium text-zinc-800 group-hover:text-rose-600 dark:text-zinc-200 dark:group-hover:text-rose-300">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/crud/${challenge.id}/${next.id}`}
            className="group flex max-w-[45%] flex-col rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-right transition hover:border-rose-300 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
          >
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
              次ステップ →
            </span>
            <span className="mt-0.5 truncate text-sm font-medium text-zinc-800 group-hover:text-rose-600 dark:text-zinc-200 dark:group-hover:text-rose-300">
              {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href={`/crud/${challenge.id}`}
            className="group flex max-w-[45%] flex-col rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-right transition hover:border-rose-300 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-rose-500/40"
          >
            <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
              課題トップへ戻る
            </span>
            <span className="mt-0.5 truncate text-sm font-medium text-zinc-800 group-hover:text-rose-600 dark:text-zinc-200 dark:group-hover:text-rose-300">
              {challenge.title}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}

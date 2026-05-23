import Link from "next/link";
import { findTemplate, templates } from "@/lib/journal";
import { JournalEditor } from "@/components/JournalEditor";

type Props = {
  searchParams: Promise<{ template?: string }>;
};

export default async function NewJournalPage({ searchParams }: Props) {
  const { template: templateParam } = await searchParams;
  const template = templateParam ? findTemplate(templateParam) : undefined;

  if (!template) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
        <div className="space-y-4">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300"
          >
            ← ジャーナル一覧
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            テンプレートを選んでください
          </h1>
          <ul className="space-y-2">
            {templates.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/journal/new?template=${t.id}`}
                  className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-rose-300 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <span className="mr-2 text-lg">{t.emoji}</span>
                  <span className="font-semibold">{t.name}</span>
                  <span className="ml-2 text-xs text-zinc-500">
                    {t.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <JournalEditor template={template} />
    </div>
  );
}

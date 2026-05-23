import Link from "next/link";
import { categories } from "@/data/categories";
import { questions, questionsByCategory } from "@/data/questions";
import { ProgressSummary } from "@/components/ProgressSummary";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      {/* テーマトグル */}
      <div className="mb-6 flex justify-end">
        <ThemeToggle />
      </div>

      {/* ヒーロー */}
      <header className="mb-12 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-4 py-1.5 text-xs font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500 dark:bg-rose-400" />
          <span>{questions.length} 問の Ruby/Rails 知識を凝縮</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-br from-rose-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent dark:from-rose-300 dark:via-fuchsia-300 dark:to-violet-300">
            Ruby Dojo
          </span>
        </h1>
        <p className="mt-3 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
          Ruby on Rails を、
          <span className="shimmer-text-light dark:hidden">クイズで極める</span>
          <span className="hidden shimmer-text-dark dark:inline">
            クイズで極める
          </span>
        </p>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          文法から ActiveRecord、コードリーディング、メタプログラミングまで。
          段階的ヒント・詳しい解説・ストリーク機能で、初学者から上級者への階段を一段ずつ。
        </p>
      </header>

      {/* 進捗 */}
      <div className="mb-12">
        <ProgressSummary totalQuestions={questions.length} />
      </div>

      {/* カテゴリ */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            カテゴリを選ぶ
          </h2>
          <p className="text-xs text-zinc-500">
            計 {questions.length} 問 / {categories.length} カテゴリ
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((cat) => {
            const count = questionsByCategory(cat.id).length;
            return (
              <Link
                key={cat.id}
                href={`/quiz/${cat.id}`}
                className={`group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none dark:hover:bg-white/[0.06] dark:hover:shadow-2xl dark:hover:shadow-black/30 ${cat.ringClass}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${cat.accentClass}`}
                />
                <div className="relative">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-3xl drop-shadow-sm">{cat.emoji}</span>
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[10px] text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                      {count} 問
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors group-hover:text-rose-600 dark:text-zinc-400 dark:group-hover:text-rose-300">
                    <span>挑戦する</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="mt-16 border-t border-zinc-200 pt-6 text-center text-[11px] text-zinc-500 dark:border-white/5">
        <p>
          学習データは LocalStorage に保存されます。問題は随時追加予定。
        </p>
      </footer>
    </div>
  );
}

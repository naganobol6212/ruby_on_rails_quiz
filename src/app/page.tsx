import { categories } from "@/data/categories";
import { allQuestions as questions, questionsByCategory } from "@/data/all-questions";
import { ProgressSummary } from "@/components/ProgressSummary";
import { CategoryCard } from "@/components/CategoryCard";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
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
          文法から ActiveRecord、コードリーディング、メタプログラミング、
          実践課題まで。段階的ヒント・詳しい解説・完璧／見直しマークで、
          初学者から上級者への階段を一段ずつ。
        </p>
      </header>

      {/* 進捗 */}
      <div className="mb-12">
        <ProgressSummary totalQuestions={questions.length} />
      </div>

      {/* カテゴリ */}
      <section id="categories" className="scroll-mt-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            カテゴリを選ぶ
          </h2>
          <p className="text-xs text-zinc-500">
            計 {questions.length} 問 / {categories.length} カテゴリ
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              questions={questionsByCategory(cat.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

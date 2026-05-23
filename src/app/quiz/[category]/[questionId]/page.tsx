import { notFound } from "next/navigation";
import { findCategory, categories } from "@/data/categories";
import { questionsByCategory } from "@/data/all-questions";
import { QuizRunner } from "@/components/QuizRunner";

export function generateStaticParams() {
  return categories.flatMap((c) =>
    questionsByCategory(c.id).map((q) => ({
      category: c.id,
      questionId: q.id,
    })),
  );
}

type Props = {
  params: Promise<{ category: string; questionId: string }>;
};

export default async function QuizPage({ params }: Props) {
  const { category, questionId } = await params;
  const cat = findCategory(category);
  if (!cat) notFound();

  const qs = questionsByCategory(cat.id);
  const startIndex = qs.findIndex((q) => q.id === questionId);
  if (startIndex === -1) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <QuizRunner
        questions={qs}
        categoryName={cat.name}
        categoryEmoji={cat.emoji}
        categoryId={cat.id}
        startIndex={startIndex}
      />
    </div>
  );
}

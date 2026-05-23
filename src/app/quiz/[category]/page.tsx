import { notFound } from "next/navigation";
import { findCategory, categories } from "@/data/categories";
import { questionsByCategory } from "@/data/all-questions";
import { QuestionPicker } from "@/components/QuestionPicker";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) notFound();

  const qs = questionsByCategory(cat.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <QuestionPicker
        questions={qs}
        categoryName={cat.name}
        categoryEmoji={cat.emoji}
        categoryId={cat.id}
      />
    </div>
  );
}

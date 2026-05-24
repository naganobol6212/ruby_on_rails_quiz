import { ExplanationsList } from "./ExplanationsList";

export const metadata = {
  title: "自己説明 一覧 — CodeDojo",
};

export default function ExplanationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <ExplanationsList />
    </div>
  );
}

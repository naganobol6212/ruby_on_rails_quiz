import { JournalList } from "@/components/JournalList";

export const metadata = {
  title: "学習ジャーナル — CodeDojo",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <JournalList />
    </div>
  );
}

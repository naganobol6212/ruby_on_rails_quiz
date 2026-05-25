import { FlashcardsView } from "./FlashcardsView";

export const metadata = {
  title: "フラッシュカード — CodeDojo",
  description:
    "知らない単語や間違えた問題を SM-2 の間隔反復学習 (Spaced Repetition) で長期記憶へ。 忘却曲線に沿って復習タイミングを最適化。",
};

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <FlashcardsView />
    </div>
  );
}

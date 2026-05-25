import { ReviewView } from "./ReviewView";

export const metadata = {
  title: "復習推奨 — CodeDojo",
  description:
    "Ebbinghaus 忘却曲線を考慮した『そろそろ復習』対象問題の一覧。 解いてから 7 日 / 30 日経過した問題や、 自分で 🔁 を付けた問題を優先順に提示。",
};

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <ReviewView />
    </div>
  );
}

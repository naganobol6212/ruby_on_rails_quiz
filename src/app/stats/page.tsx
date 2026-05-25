import { StatsView } from "./StatsView";

export const metadata = {
  title: "学習統計 — CodeDojo",
  description:
    "週次/月次のクイズ正答率、 カテゴリー別 / 難易度別の正答率、 ジャーナル件数、 連続記録などをダッシュボードで一覧。",
};

export default function StatsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      <StatsView />
    </div>
  );
}

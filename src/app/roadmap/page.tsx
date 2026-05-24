import { RoadmapView } from "./RoadmapView";

export const metadata = {
  title: "学習ロードマップ — CodeDojo",
  description:
    "ゼロから Rails 中級者までの推奨学習順。クイズ・参考書・実践課題を組み合わせた塊で進む。",
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <RoadmapView />
    </div>
  );
}

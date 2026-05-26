/**
 * ロードマップの型定義と、 「デフォルト = Ruby on Rails」 の後方互換 re-export。
 *
 * - トラック別ロードマップの本体は src/data/roadmaps/<track>.ts
 * - レジストリは src/data/roadmaps/index.ts
 * - このファイルの `roadmap` / `totalSteps` は既存コード (StatsView 等) のための互換 export
 */

export type RoadmapItemKind = "quiz-category" | "guide" | "guide-chapter" | "crud-step";

export type RoadmapItem = {
  kind: RoadmapItemKind;
  /** リンク先 (例: /quiz/ruby-basics, /guide/ruby-intro, /crud/rails-todo-crud/01-bootstrap) */
  href: string;
  /** 表示ラベル */
  label: string;
  /** 補足説明 */
  hint?: string;
  /** クイズの場合、達成扱いに必要な問題 ID の配列。これらすべて solved になったら完了扱い */
  requiredQuestionIds?: string[];
};

export type RoadmapStep = {
  id: string;
  /** ステップ番号 (表示用) */
  number: number;
  title: string;
  emoji: string;
  /** どんな状態を目指すか */
  goal: string;
  /** 想定所要時間 */
  estimateMinutes: number;
  items: RoadmapItem[];
};

export type RoadmapPhase = {
  id: string;
  title: string;
  description: string;
  color: "emerald" | "sky" | "violet" | "amber" | "rose";
  steps: RoadmapStep[];
};

import { rubyRoadmap } from "./roadmaps/ruby";

/**
 * 既存コード互換のための export。 新しいコードでは
 * `import { getRoadmap } from "@/data/roadmaps"` を使うこと。
 */
export const roadmap: RoadmapPhase[] = rubyRoadmap;

export const totalSteps = roadmap.reduce(
  (sum, phase) => sum + phase.steps.length,
  0,
);

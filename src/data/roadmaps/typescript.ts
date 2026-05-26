/**
 * TypeScript 学習ロードマップ: 型の基礎からジェネリクスまで。
 *
 * JavaScript の経験がある前提。 ts-basics カテゴリの 30 問を 3 ステップに分割。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const typescriptRoadmap: RoadmapPhase[] = [
  {
    id: "ts-foundations",
    title: "Phase 1 · 型の基礎",
    description: "プリミティブ型・配列型・タプル・型推論。 JS から TS へ橋を架ける段。",
    color: "sky",
    steps: [
      {
        id: "ts-01-basics",
        number: 1,
        title: "プリミティブと推論",
        emoji: "🔷",
        goal: "string/number/boolean/null/undefined、 型推論、 const アサーション、 readonly を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/ts-basics",
            label: "🧩 TS 基礎クイズ (10 問)",
            hint: "ts-001〜010",
            requiredQuestionIds: idRange("ts", 1, 10),
          },
        ],
      },
    ],
  },
  {
    id: "ts-composition",
    title: "Phase 2 · 型を組み合わせる",
    description: "ユニオン / 交差 / リテラル型 / 判別可能ユニオンで現実のデータを表現する。",
    color: "violet",
    steps: [
      {
        id: "ts-02-unions",
        number: 2,
        title: "ユニオン・リテラル・判別可能ユニオン",
        emoji: "🧩",
        goal: "string リテラル型で API レスポンスを表現、 in / typeof / discriminator でナローイングできる。",
        estimateMinutes: 35,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/ts-basics",
            label: "🧩 TS 基礎クイズ (10 問)",
            hint: "ts-011〜020",
            requiredQuestionIds: idRange("ts", 11, 20),
          },
        ],
      },
    ],
  },
  {
    id: "ts-generics",
    title: "Phase 3 · ジェネリクスと型操作",
    description: "Generic 関数、 ユーティリティ型 (Partial / Pick / Omit など)、 mapped types で再利用性を上げる。",
    color: "rose",
    steps: [
      {
        id: "ts-03-generics",
        number: 3,
        title: "ジェネリクスとユーティリティ型",
        emoji: "🛠️",
        goal: "<T> 付き関数、 制約 extends、 Partial / Required / Pick / Omit / Record の意味と使い分け。",
        estimateMinutes: 40,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/ts-basics",
            label: "🧩 TS 基礎クイズ (10 問)",
            hint: "ts-021〜030",
            requiredQuestionIds: idRange("ts", 21, 30),
          },
        ],
      },
    ],
  },
];

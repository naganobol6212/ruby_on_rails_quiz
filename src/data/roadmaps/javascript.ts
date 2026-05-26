/**
 * JavaScript 学習ロードマップ: モダン JS の基礎から非同期まで。
 *
 * 既存のクイズカテゴリ (js-basics / js-functions / js-async) を順序立てて並べたコース。
 * Ruby ロードマップと違い参考書はまだ無く、 まずはクイズで手を動かす構成。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const javascriptRoadmap: RoadmapPhase[] = [
  {
    id: "js-foundations",
    title: "Phase 1 · JavaScript の足場を作る",
    description:
      "ES2015+ の基本リテラル・変数・型変換・配列とオブジェクトの基本操作を体に染み込ませる。",
    color: "amber",
    steps: [
      {
        id: "js-01-literals",
        number: 1,
        title: "変数・リテラル・真偽値",
        emoji: "🟨",
        goal: "let/const の使い分け、 truthy/falsy、 NaN や undefined の感覚を身につける。",
        estimateMinutes: 25,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/js-basics",
            label: "🧩 JS 基礎クイズ (5 問)",
            hint: "js-001〜005",
            requiredQuestionIds: idRange("js", 1, 5),
          },
        ],
      },
      {
        id: "js-02-operators",
        number: 2,
        title: "演算子と型変換",
        emoji: "🔁",
        goal: "== vs ===、 暗黙変換、 短絡評価、 分割代入、 スプレッドの基本を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/js-basics",
            label: "🧩 JS 基礎クイズ (10 問)",
            hint: "js-006〜015",
            requiredQuestionIds: idRange("js", 6, 15),
          },
        ],
      },
      {
        id: "js-03-collections",
        number: 3,
        title: "配列・オブジェクト操作",
        emoji: "📦",
        goal: "map/filter/reduce、 Object.keys/entries、 構造化代入、 イミュータブル更新の型を整える。",
        estimateMinutes: 35,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/js-basics",
            label: "🧩 JS 基礎クイズ (5 問)",
            hint: "js-016〜020",
            requiredQuestionIds: idRange("js", 16, 20),
          },
        ],
      },
    ],
  },
  {
    id: "js-functions",
    title: "Phase 2 · 関数を使いこなす",
    description:
      "アロー / クロージャ / this / 高階関数。 関数が第一級オブジェクトであることを腑に落とす。",
    color: "sky",
    steps: [
      {
        id: "js-04-function-basics",
        number: 4,
        title: "関数定義・アロー・スコープ",
        emoji: "🏹",
        goal: "function vs アロー、 this の束縛、 デフォルト引数、 残余引数 (...args) を使い分ける。",
        estimateMinutes: 35,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/js-functions",
            label: "🧩 JS 関数クイズ (10 問)",
            hint: "jsf-001〜010",
            requiredQuestionIds: idRange("jsf", 1, 10),
          },
        ],
      },
      {
        id: "js-05-higher-order",
        number: 5,
        title: "高階関数とクロージャ",
        emoji: "🪄",
        goal: "コールバック・クロージャ・カリー化・関数合成。 状態を関数で閉じ込める発想を獲得する。",
        estimateMinutes: 40,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/js-functions",
            label: "🧩 JS 関数クイズ (10 問)",
            hint: "jsf-011〜020",
            requiredQuestionIds: idRange("jsf", 11, 20),
          },
        ],
      },
    ],
  },
  {
    id: "js-async",
    title: "Phase 3 · 非同期処理を制する",
    description:
      "コールバック地獄から Promise / async-await へ。 イベントループの直感も身につける。",
    color: "violet",
    steps: [
      {
        id: "js-06-promise",
        number: 6,
        title: "Promise の基本",
        emoji: "⏳",
        goal: "then/catch/finally、 Promise.all / Promise.race、 マイクロタスクキューの動きを理解する。",
        estimateMinutes: 40,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/js-async",
            label: "🧩 JS 非同期クイズ (10 問)",
            hint: "jsa-001〜010",
            requiredQuestionIds: idRange("jsa", 1, 10),
          },
        ],
      },
      {
        id: "js-07-async-await",
        number: 7,
        title: "async / await とエラー処理",
        emoji: "🌊",
        goal: "async/await の糖衣構文としての本質、 try/catch、 並行と直列、 タイムアウト処理を書ける。",
        estimateMinutes: 40,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/js-async",
            label: "🧩 JS 非同期クイズ (10 問)",
            hint: "jsa-011〜020",
            requiredQuestionIds: idRange("jsa", 11, 20),
          },
        ],
      },
    ],
  },
];

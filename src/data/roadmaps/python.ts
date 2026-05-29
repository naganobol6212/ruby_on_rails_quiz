/**
 * Python 学習ロードマップ: 基礎構文からモダンな開発ワークフローまで。
 * 参考書 (python-intro) の章とクイズ (python-basics) を順に積み上げる。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const pythonRoadmap: RoadmapPhase[] = [
  {
    id: "py-foundations",
    title: "Phase 1 · Python の基礎",
    description: "値・構文・コレクション・内包表記。Python らしい書き方を体に入れる。",
    color: "emerald",
    steps: [
      {
        id: "py-01-values",
        number: 1,
        title: "値と基本構文",
        emoji: "🐍",
        goal: "数値 / 文字列 / 真偽 / None、インデント構文、f-string の基本を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/python-intro/values-and-syntax",
            label: "📖 Python 入門: 値と構文",
            hint: "まず 10 分で全体像",
          },
          {
            kind: "quiz-category",
            href: "/quiz/python-basics",
            label: "🧩 Python 基礎クイズ (10 問)",
            hint: "py-001〜010",
            requiredQuestionIds: idRange("py", 1, 10),
          },
        ],
      },
      {
        id: "py-02-collections",
        number: 2,
        title: "コレクションと内包表記",
        emoji: "📦",
        goal: "list / dict / set / tuple、スライス、リスト内包表記・辞書内包表記を使いこなす。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/python-intro/collections-and-comprehensions",
            label: "📖 Python 入門: コレクションと内包表記",
          },
          {
            kind: "quiz-category",
            href: "/quiz/python-basics",
            label: "🧩 Python 基礎クイズ (10 問)",
            hint: "py-011〜020",
            requiredQuestionIds: idRange("py", 11, 20),
          },
        ],
      },
    ],
  },
  {
    id: "py-functions-classes",
    title: "Phase 2 · 関数とオブジェクト",
    description: "関数・デコレータ・クラス・データクラス。再利用とモデリングの道具を揃える。",
    color: "sky",
    steps: [
      {
        id: "py-03-functions",
        number: 3,
        title: "関数とデコレータ",
        emoji: "🧩",
        goal: "可変長引数・キーワード引数・クロージャ・デコレータの仕組みを理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/python-intro/functions-and-decorators",
            label: "📖 Python 入門: 関数とデコレータ",
          },
          {
            kind: "quiz-category",
            href: "/quiz/python-basics",
            label: "🧩 Python 基礎クイズ (10 問)",
            hint: "py-021〜030",
            requiredQuestionIds: idRange("py", 21, 30),
          },
        ],
      },
      {
        id: "py-04-classes",
        number: 4,
        title: "クラスとデータクラス",
        emoji: "🏗️",
        goal: "class / __init__ / 継承 / dataclass / プロパティの基本を押さえる。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/python-intro/classes-and-dataclasses",
            label: "📖 Python 入門: クラスとデータクラス",
          },
        ],
      },
    ],
  },
  {
    id: "py-practical",
    title: "Phase 3 · 実戦的な Python",
    description: "例外・コンテキストマネージャ・イテレータ、そして現代的な開発環境。",
    color: "violet",
    steps: [
      {
        id: "py-05-exceptions-iter",
        number: 5,
        title: "例外・with・イテレータ/ジェネレータ",
        emoji: "🔁",
        goal: "try/except/finally、with 文、yield によるジェネレータの遅延評価を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/python-intro/exceptions-and-with",
            label: "📖 Python 入門: 例外と with",
          },
          {
            kind: "guide-chapter",
            href: "/guide/python-intro/iterators-and-generators",
            label: "📖 Python 入門: イテレータとジェネレータ",
          },
        ],
      },
      {
        id: "py-06-workflow",
        number: 6,
        title: "モダンな Python 開発",
        emoji: "⚙️",
        goal: "仮想環境 / パッケージ管理 / 型ヒント / フォーマッタなど現場の作法を知る。",
        estimateMinutes: 25,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/python-intro/modern-python-workflow",
            label: "📖 Python 入門: モダンな開発ワークフロー",
          },
        ],
      },
    ],
  },
];

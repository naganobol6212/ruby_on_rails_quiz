/**
 * React 学習ロードマップ: JSX とコンポーネントから Hooks・最適化・RSC まで。
 * 参考書 (react-intro) の章とクイズ (react-fundamentals) を積み上げる。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const reactRoadmap: RoadmapPhase[] = [
  {
    id: "react-foundations",
    title: "Phase 1 · コンポーネントと状態",
    description: "JSX・props・state。UI を関数で組み立てる基本を固める。",
    color: "sky",
    steps: [
      {
        id: "react-01-jsx",
        number: 1,
        title: "JSX とコンポーネント",
        emoji: "⚛️",
        goal: "JSX の式埋め込み、props、条件付き / リストレンダリング、key の意味を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/react-intro/jsx-and-components",
            label: "📖 React 入門: JSX とコンポーネント",
          },
          {
            kind: "quiz-category",
            href: "/quiz/react-fundamentals",
            label: "🧩 React 基礎クイズ (10 問)",
            hint: "react-001〜010",
            requiredQuestionIds: idRange("react", 1, 10),
          },
        ],
      },
      {
        id: "react-02-state",
        number: 2,
        title: "useState と useReducer",
        emoji: "🔢",
        goal: "状態の最小化、イミュータブル更新、useReducer での状態遷移の整理を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/react-intro/state-with-usestate-and-usereducer",
            label: "📖 React 入門: state 管理",
          },
          {
            kind: "quiz-category",
            href: "/quiz/react-fundamentals",
            label: "🧩 React 基礎クイズ (10 問)",
            hint: "react-011〜020",
            requiredQuestionIds: idRange("react", 11, 20),
          },
        ],
      },
    ],
  },
  {
    id: "react-hooks",
    title: "Phase 2 · Hooks を使いこなす",
    description: "副作用・Context・カスタムフック・フォーム。状態とロジックを分離する。",
    color: "violet",
    steps: [
      {
        id: "react-03-effects",
        number: 3,
        title: "useEffect と副作用",
        emoji: "🌊",
        goal: "依存配列、cleanup、データ取得の注意点、useEffect を使わない判断を理解する。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/react-intro/effects-and-useeffect",
            label: "📖 React 入門: 副作用と useEffect",
          },
          {
            kind: "quiz-category",
            href: "/quiz/react-fundamentals",
            label: "🧩 React 基礎クイズ (10 問)",
            hint: "react-021〜030",
            requiredQuestionIds: idRange("react", 21, 30),
          },
        ],
      },
      {
        id: "react-04-context-hooks",
        number: 4,
        title: "Context・カスタムフック・状態ライブラリ",
        emoji: "🪝",
        goal: "Context の使いどころ、カスタムフック抽出、状態管理ライブラリの位置づけを掴む。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/react-intro/context-custom-hooks-and-state-libs",
            label: "📖 React 入門: Context とカスタムフック",
          },
        ],
      },
      {
        id: "react-05-forms-refs",
        number: 5,
        title: "フォームと ref",
        emoji: "📝",
        goal: "制御 / 非制御コンポーネント、useRef、フォーム送信の基本を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/react-intro/forms-and-refs",
            label: "📖 React 入門: フォームと ref",
          },
        ],
      },
    ],
  },
  {
    id: "react-advanced",
    title: "Phase 3 · 最適化と先端",
    description: "再レンダリングの制御と、Suspense / Server Components の世界。",
    color: "amber",
    steps: [
      {
        id: "react-06-perf",
        number: 6,
        title: "再レンダリング最適化",
        emoji: "⚡",
        goal: "memo / useMemo / useCallback の正しい使いどころ、無駄な再描画の見つけ方を学ぶ。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/react-intro/performance-and-rerenders",
            label: "📖 React 入門: 再レンダリング最適化",
          },
        ],
      },
      {
        id: "react-07-suspense-rsc",
        number: 7,
        title: "Suspense・エラー境界・RSC",
        emoji: "🧬",
        goal: "Suspense / Error Boundary、React Server Components の考え方を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/react-intro/suspense-error-boundary-and-rsc",
            label: "📖 React 入門: Suspense と RSC",
          },
        ],
      },
    ],
  },
];

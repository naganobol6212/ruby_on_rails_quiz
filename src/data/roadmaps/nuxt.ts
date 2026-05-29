/**
 * Nuxt 学習ロードマップ: Nuxt 3 の規約と Vue Composition API からレンダリング・本番まで。
 * 参考書 (nuxt-intro) の章とクイズ (nuxt-basics) を積み上げる。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const nuxtRoadmap: RoadmapPhase[] = [
  {
    id: "nuxt-foundations",
    title: "Phase 1 · Nuxt と Vue の基礎",
    description: "Nuxt の規約と Vue 3 Composition API。自動インポートの世界に慣れる。",
    color: "emerald",
    steps: [
      {
        id: "nuxt-01-conventions",
        number: 1,
        title: "Nuxt の規約",
        emoji: "💚",
        goal: "ディレクトリ規約、自動インポート、pages / components / composables を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nuxt-intro/nuxt-conventions",
            label: "📖 Nuxt 入門: Nuxt の規約",
          },
          {
            kind: "quiz-category",
            href: "/quiz/nuxt-basics",
            label: "🧩 Nuxt 基礎クイズ (10 問)",
            hint: "nuxt-001〜010",
            requiredQuestionIds: idRange("nuxt", 1, 10),
          },
        ],
      },
      {
        id: "nuxt-02-vue",
        number: 2,
        title: "Vue Composition の基礎",
        emoji: "🧩",
        goal: "ref / reactive / computed / watch、<script setup> の基本を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nuxt-intro/vue-composition-basics",
            label: "📖 Nuxt 入門: Vue Composition 基礎",
          },
          {
            kind: "quiz-category",
            href: "/quiz/nuxt-basics",
            label: "🧩 Nuxt 基礎クイズ (10 問)",
            hint: "nuxt-011〜020",
            requiredQuestionIds: idRange("nuxt", 11, 20),
          },
        ],
      },
    ],
  },
  {
    id: "nuxt-routing-data",
    title: "Phase 2 · ルーティングとデータ",
    description: "ファイルベースルーティング、レイアウト、useFetch によるデータ取得と状態管理。",
    color: "sky",
    steps: [
      {
        id: "nuxt-03-routing",
        number: 3,
        title: "ルーティングとレイアウト",
        emoji: "🗺️",
        goal: "ファイルベースルーティング、動的ルート、レイアウトの仕組みを理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nuxt-intro/routing-and-layouts",
            label: "📖 Nuxt 入門: ルーティングとレイアウト",
          },
        ],
      },
      {
        id: "nuxt-04-data",
        number: 4,
        title: "データ取得",
        emoji: "📡",
        goal: "useFetch / useAsyncData、SSR でのデータ取得とハイドレーションを理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nuxt-intro/data-fetching",
            label: "📖 Nuxt 入門: データ取得",
          },
        ],
      },
      {
        id: "nuxt-05-state",
        number: 5,
        title: "状態管理",
        emoji: "📦",
        goal: "useState / Pinia、SSR と状態共有の注意点を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nuxt-intro/state-management",
            label: "📖 Nuxt 入門: 状態管理",
          },
        ],
      },
    ],
  },
  {
    id: "nuxt-rendering-deploy",
    title: "Phase 3 · レンダリングと本番",
    description: "SSR / SSG / ISR の選択、SEO・エラー処理・デプロイ。",
    color: "violet",
    steps: [
      {
        id: "nuxt-06-rendering",
        number: 6,
        title: "レンダリングモード",
        emoji: "🎚️",
        goal: "SSR / SSG / ISR / SPA の違いと、ルートごとのレンダリング設定を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nuxt-intro/rendering-modes",
            label: "📖 Nuxt 入門: レンダリングモード",
          },
        ],
      },
      {
        id: "nuxt-07-seo-deploy",
        number: 7,
        title: "SEO・エラー・デプロイ",
        emoji: "🚀",
        goal: "useHead による SEO、エラーページ、デプロイの基本を押さえる。",
        estimateMinutes: 25,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nuxt-intro/seo-errors-deploy",
            label: "📖 Nuxt 入門: SEO・エラー・デプロイ",
          },
        ],
      },
    ],
  },
];

/**
 * Next.js 学習ロードマップ: App Router の規約からデータ取得・本番運用まで。
 * 参考書 (nextjs-intro) の章とクイズ (nextjs-basics) を積み上げる。React 経験が前提。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const nextjsRoadmap: RoadmapPhase[] = [
  {
    id: "next-app-router",
    title: "Phase 1 · App Router の基礎",
    description: "ファイル規約と Server / Client Components。App Router の世界観を掴む。",
    color: "sky",
    steps: [
      {
        id: "next-01-conventions",
        number: 1,
        title: "App Router のファイル規約",
        emoji: "▲",
        goal: "page / layout / loading / error などの規約と、ルーティングの仕組みを理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nextjs-intro/app-router-file-conventions",
            label: "📖 Next.js 入門: App Router ファイル規約",
          },
          {
            kind: "quiz-category",
            href: "/quiz/nextjs-basics",
            label: "🧩 Next.js 基礎クイズ (10 問)",
            hint: "next-001〜010",
            requiredQuestionIds: idRange("next", 1, 10),
          },
        ],
      },
      {
        id: "next-02-server-client",
        number: 2,
        title: "Server / Client Components",
        emoji: "🧩",
        goal: "Server と Client の境界、'use client'、コンポジションの考え方を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nextjs-intro/server-client-components",
            label: "📖 Next.js 入門: Server / Client Components",
          },
          {
            kind: "quiz-category",
            href: "/quiz/nextjs-basics",
            label: "🧩 Next.js 基礎クイズ (10 問)",
            hint: "next-011〜020",
            requiredQuestionIds: idRange("next", 11, 20),
          },
        ],
      },
    ],
  },
  {
    id: "next-data",
    title: "Phase 2 · データと変更",
    description: "データ取得とキャッシュ、Server Actions によるフォーム送信。",
    color: "violet",
    steps: [
      {
        id: "next-03-data-fetching",
        number: 3,
        title: "データ取得とキャッシュ",
        emoji: "📡",
        goal: "fetch のキャッシュ制御、revalidate、動的 / 静的レンダリングの判断を理解する。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nextjs-intro/data-fetching-and-caching",
            label: "📖 Next.js 入門: データ取得とキャッシュ",
          },
        ],
      },
      {
        id: "next-04-server-actions",
        number: 4,
        title: "Server Actions とフォーム",
        emoji: "✍️",
        goal: "Server Actions、フォーム送信、再検証 (revalidatePath) の流れを理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nextjs-intro/server-actions-and-forms",
            label: "📖 Next.js 入門: Server Actions とフォーム",
          },
        ],
      },
    ],
  },
  {
    id: "next-advanced",
    title: "Phase 3 · 応用と本番",
    description: "高度なルーティング・ストリーミングと、本番デプロイの勘所。",
    color: "amber",
    steps: [
      {
        id: "next-05-routing-streaming",
        number: 5,
        title: "高度なルーティングとストリーミング",
        emoji: "🌊",
        goal: "並行ルート / インターセプト、Suspense ストリーミング、middleware を理解する。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nextjs-intro/routing-advanced",
            label: "📖 Next.js 入門: 高度なルーティング",
          },
          {
            kind: "guide-chapter",
            href: "/guide/nextjs-intro/streaming-suspense-and-middleware",
            label: "📖 Next.js 入門: ストリーミングと middleware",
          },
        ],
      },
      {
        id: "next-06-production",
        number: 6,
        title: "本番デプロイ",
        emoji: "🚀",
        goal: "環境変数、ビルド最適化、デプロイ時の注意点を押さえる。",
        estimateMinutes: 25,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/nextjs-intro/production-deployment",
            label: "📖 Next.js 入門: 本番デプロイ",
          },
        ],
      },
    ],
  },
];

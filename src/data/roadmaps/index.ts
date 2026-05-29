/**
 * トラック別ロードマップのレジストリ。
 *
 * - 「ロードマップあり」 のトラック: phases を入れて利用可能扱い
 * - 「準備中」 のトラック: 一覧には表示されるが /roadmap/[track] では準備中ページを出す
 *
 * 新しい言語を追加するときは
 *   1. src/data/roadmaps/<track>.ts に phases を作る
 *   2. ここに import して trackRoadmaps に追加する
 * の 2 ステップで完結する。
 */
import type { RoadmapPhase } from "../roadmap";
import type { TrackId } from "@/lib/types";
import { rubyRoadmap } from "./ruby";
import { javascriptRoadmap } from "./javascript";
import { typescriptRoadmap } from "./typescript";
import { pythonRoadmap } from "./python";
import { sqlRoadmap } from "./sql";
import { reactRoadmap } from "./react";
import { nextjsRoadmap } from "./nextjs";
import { nuxtRoadmap } from "./nuxt";
import { gitRoadmap } from "./git";
import { linuxRoadmap } from "./linux";
import { infosecRoadmap } from "./infosec";
import { dbDesignRoadmap } from "./db-design";
import { aiClaudeRoadmap } from "./ai-claude";

export type TrackRoadmap = {
  trackId: TrackId;
  phases: RoadmapPhase[];
  /** 一覧カードに出す 1 行サマリ */
  summary: string;
  /** 概要ページのキャッチコピー (h1 下に出す) */
  headline: string;
};

const totalMinutes = (phases: RoadmapPhase[]) =>
  phases.reduce(
    (sum, phase) =>
      sum + phase.steps.reduce((s, step) => s + step.estimateMinutes, 0),
    0,
  );

const totalStepsOf = (phases: RoadmapPhase[]) =>
  phases.reduce((sum, phase) => sum + phase.steps.length, 0);

export const trackRoadmaps: Partial<Record<TrackId, TrackRoadmap>> = {
  ruby: {
    trackId: "ruby",
    phases: rubyRoadmap,
    summary: "ゼロから Rails 中級者まで。 クイズ + 参考書 + 4 本の CRUD 課題で実装力まで。",
    headline: "ゼロから Rails 中級者まで",
  },
  javascript: {
    trackId: "javascript",
    phases: javascriptRoadmap,
    summary: "ES2015+ の基礎・関数・非同期処理を 60 問のクイズで体系的に。",
    headline: "モダン JavaScript の基礎から非同期まで",
  },
  typescript: {
    trackId: "typescript",
    phases: typescriptRoadmap,
    summary: "型の基礎・ユニオン・ジェネリクスを 30 問で。 JS 経験ありが前提。",
    headline: "型システムで安全に書く",
  },
  python: {
    trackId: "python",
    phases: pythonRoadmap,
    summary: "値・コレクションから関数・クラス・モダン開発まで 30 問 + 参考書 7 章。",
    headline: "Python の基礎からモダンな書き方まで",
  },
  sql: {
    trackId: "sql",
    phases: sqlRoadmap,
    summary: "SELECT の基礎から JOIN・ウィンドウ関数・性能まで、参考書 7 章 + 3 カテゴリのクイズ。",
    headline: "データを自在に問い合わせる",
  },
  react: {
    trackId: "react",
    phases: reactRoadmap,
    summary: "JSX・state から Hooks・最適化・RSC まで 30 問 + 参考書 7 章。",
    headline: "コンポーネントと Hooks を使いこなす",
  },
  nextjs: {
    trackId: "nextjs",
    phases: nextjsRoadmap,
    summary: "App Router の規約からデータ取得・Server Actions・本番まで 20 問 + 参考書 7 章。",
    headline: "App Router で作る Next.js",
  },
  nuxt: {
    trackId: "nuxt",
    phases: nuxtRoadmap,
    summary: "Nuxt の規約と Vue Composition からレンダリング・本番まで 20 問 + 参考書 7 章。",
    headline: "Nuxt 3 と Vue 3 で作る",
  },
  git: {
    trackId: "git",
    phases: gitRoadmap,
    summary: "3 つのエリアの基本から復旧・PR・Actions まで 20 問 + 参考書 7 章。",
    headline: "Git を理解して安全に使う",
  },
  linux: {
    trackId: "linux",
    phases: linuxRoadmap,
    summary: "ファイル操作・テキスト処理から運用・シェル自動化まで 20 問 + 参考書 7 章。",
    headline: "CLI を手足のように使う",
  },
  infosec: {
    trackId: "infosec",
    phases: infosecRoadmap,
    summary: "OWASP の主要脅威から認証認可・守りの運用まで 20 問 + 参考書 7 章。",
    headline: "攻撃を知り、守りを設計する",
  },
  "db-design": {
    trackId: "db-design",
    phases: dbDesignRoadmap,
    summary: "ER / 正規化からインデックス・運用・アンチパターンまで 18 問 + 参考書 7 章。",
    headline: "壊れにくいスキーマを設計する",
  },
  "ai-claude": {
    trackId: "ai-claude",
    phases: aiClaudeRoadmap,
    summary: "LLM の基礎からエージェント設計・Claude Code・AI セキュリティ・運用まで 120 問 + 参考書 8 章。",
    headline: "LLM アプリ開発を体系で学ぶ",
  },
};

export function getRoadmap(trackId: string): TrackRoadmap | undefined {
  return trackRoadmaps[trackId as TrackId];
}

export type RoadmapSummary = {
  trackId: TrackId;
  totalSteps: number;
  totalPhases: number;
  totalMinutes: number;
};

export function summarize(roadmap: TrackRoadmap): RoadmapSummary {
  return {
    trackId: roadmap.trackId,
    totalSteps: totalStepsOf(roadmap.phases),
    totalPhases: roadmap.phases.length,
    totalMinutes: totalMinutes(roadmap.phases),
  };
}

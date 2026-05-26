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

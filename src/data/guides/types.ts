import type { TrackId, CategoryId } from "@/lib/types";

export type GuideSection = {
  /** 見出し */
  heading: string;
  /** 本文 (改行を含むプレーンテキスト) */
  body: string;
  /** オプションのコード例 */
  code?: string;
  /** オプションのコードの言語 (シンタックスハイライト用ラベル) */
  language?: string;
  /** よくある落とし穴・補足 */
  notes?: string[];
  /** オプションの Mermaid 図 (flowchart / sequence / classDiagram など) */
  diagram?: string;
  /** 図のキャプション (図のすぐ下に表示) */
  diagramCaption?: string;
};

export type GuideChapter = {
  id: string;
  /** 章タイトル */
  title: string;
  /** 短い導入 (リスト画面用) */
  intro: string;
  /** 想定読了時間 (分) */
  readingMinutes: number;
  /** 学習目標 (この章で何を理解すべきか) */
  objectives: string[];
  /** 公式/参考リンク */
  references?: { label: string; url: string }[];
  /** 章本体 (節の配列) */
  sections: GuideSection[];
  /** 理解度確認: 関連クイズ問題 ID */
  comprehensionQuestionIds?: string[];
  /** 要点まとめ (章末) */
  keyTakeaways: string[];
};

export type Guide = {
  id: string;
  trackId: TrackId;
  /** ガイド名 (例: 「Ruby の地図 — はじめての一冊」) */
  title: string;
  /** 1 行説明 */
  subtitle: string;
  /** どんな読者に */
  audience: string;
  /** 出典 (公式ドキュメント / 書籍 / リンク) */
  sources: { label: string; url: string }[];
  emoji: string;
  /** 章の配列 */
  chapters: GuideChapter[];
  /** どのカテゴリと関連が深いか (リンク用) */
  relatedCategoryIds?: CategoryId[];
};

/**
 * 参考書 (Study Guide) のレジストリ。
 *
 * 旧 `src/data/guides.ts` は 5800 行を超え、 1 ファイルに 13 ガイドを抱えていたため、
 * ガイドごとに `src/data/guides/<id>.ts` へ分割した。 このファイルは:
 *
 *   1. 各ガイドファイルを import して 1 つの配列にまとめる
 *   2. findGuide / guidesByTrack / studyLinksForCategory を提供する
 *
 * 旧 import パス `@/data/guides` は `src/data/guides.ts` の薄い re-export で
 * 後方互換を保つ。
 */
import type { TrackId, CategoryId, StudyGuideLink } from "@/lib/types";
import type { Guide } from "./types";
import { rubyIntroGuide } from "./ruby-intro";
import { javascriptIntroGuide } from "./javascript-intro";
import { typescriptIntroGuide } from "./typescript-intro";
import { pythonIntroGuide } from "./python-intro";
import { sqlIntroGuide } from "./sql-intro";
import { reactIntroGuide } from "./react-intro";
import { nextjsIntroGuide } from "./nextjs-intro";
import { nuxtIntroGuide } from "./nuxt-intro";
import { gitIntroGuide } from "./git-intro";
import { linuxIntroGuide } from "./linux-intro";
import { infosecIntroGuide } from "./infosec-intro";
import { dbDesignIntroGuide } from "./db-design-intro";
import { examPrepOverviewGuide } from "./exam-prep-overview";

export type { Guide, GuideChapter, GuideSection } from "./types";

export const guides: Guide[] = [
  rubyIntroGuide,
  javascriptIntroGuide,
  typescriptIntroGuide,
  pythonIntroGuide,
  sqlIntroGuide,
  reactIntroGuide,
  nextjsIntroGuide,
  nuxtIntroGuide,
  gitIntroGuide,
  linuxIntroGuide,
  infosecIntroGuide,
  dbDesignIntroGuide,
  examPrepOverviewGuide,
];

export const findGuide = (id: string) => guides.find((g) => g.id === id);

export const guidesByTrack = (trackId: TrackId) =>
  guides.filter((g) => g.trackId === trackId);

/**
 * 直接対応のガイドが無いカテゴリのための『代替案内』 マップ。
 *
 * 新しいガイドを書く代わりに、 既存ガイドの最も近いトピックの章を
 * note 付きで案内する。 各エントリは StudyGuideLink[] (ExplanationCard
 * 側で章タイトルとヒント文が表示される)。
 *
 * AI/Claude 系カテゴリは exam-prep-overview の ai-and-claude 章を
 * topical match として案内 (試験ガイドだが Anthropic 認定の地図
 * として一般的な参考になるため、 ここでは例外的に許可)。
 */
const CATEGORY_STUDY_FALLBACK: Partial<Record<CategoryId, StudyGuideLink[]>> = {
  "ruby-advanced": [
    {
      guideId: "ruby-intro",
      chapterId: "metaprogramming",
      note: "Module / メタプログラミングの土台を先に確認",
    },
  ],
  "code-reading": [
    {
      guideId: "ruby-intro",
      chapterId: "values-and-control",
      note: "まずは Ruby の構文 — 読解の戦略は問題ページのチェックリストで",
    },
  ],
  "rails-convention": [
    {
      guideId: "ruby-intro",
      chapterId: "classes-and-modules",
      note: "Rails の前提となる Ruby クラス / モジュールの基礎",
    },
  ],
  "routing-controller": [
    {
      guideId: "ruby-intro",
      chapterId: "classes-and-modules",
      note: "Controller は Ruby のクラス — クラス構造の基礎を確認",
    },
  ],
  "active-record": [
    {
      guideId: "db-design-intro",
      chapterId: "er-and-normalization",
      note: "AR の前提となる ER / 正規化 / キー設計",
    },
    {
      guideId: "sql-intro",
      chapterId: "joins",
      note: "AR の has_many / belongs_to は SQL JOIN の薄いラッパ",
    },
  ],
  rspec: [
    {
      guideId: "ruby-intro",
      chapterId: "testing",
      note: "RSpec の基本作法はこの章で導入",
    },
  ],
  logs: [
    {
      guideId: "linux-intro",
      chapterId: "text-processing",
      note: "grep / awk / sed でログを抽出する基礎",
    },
  ],
  debugging: [
    {
      guideId: "ruby-intro",
      chapterId: "exceptions",
      note: "例外の伝播とリカバリの基礎",
    },
  ],
  practical: [
    {
      guideId: "linux-intro",
      chapterId: "shell-automation-and-ops",
      note: "実務シェル運用の基礎",
    },
  ],
  // AI/Claude 系 — 専用ガイド未整備のため exam-prep の ai-and-claude 章を案内
  "claude-code-basics": [
    {
      guideId: "exam-prep-overview",
      chapterId: "ai-and-claude",
      note: "Anthropic 認定の地図 — CCA-F / Claude Code の射程を概観",
    },
  ],
  "claude-code-practice": [
    {
      guideId: "exam-prep-overview",
      chapterId: "ai-and-claude",
      note: "Anthropic 認定の地図 — Claude Code 実務応用の前提",
    },
  ],
  "ai-engineering": [
    {
      guideId: "exam-prep-overview",
      chapterId: "ai-and-claude",
      note: "AI / 機械学習認定の地図 (G 検定 / E 資格 / クラウド AI)",
    },
  ],
  "ai-security": [
    {
      guideId: "infosec-intro",
      chapterId: "owasp-overview",
      note: "AI 固有のリスクの前にセキュリティ全般の地図を",
    },
  ],
};

/**
 * 与えられた categoryId に対する学び直し案内 (StudyGuideLink) を返す。
 *
 * 1. CATEGORY_STUDY_FALLBACK に明示があればそれを優先 (章レベル + note)
 * 2. なければ guides の relatedCategoryIds から直接マッチを返す
 *    (exam-prep トラックのガイドは除外 — Ruby 問題で『試験・認定の地図』
 *    に誤誘導しないため。 AI/Claude 系は上記 1. で明示的に許可)
 */
export const studyLinksForCategory = (
  categoryId: CategoryId,
): StudyGuideLink[] => {
  const explicit = CATEGORY_STUDY_FALLBACK[categoryId];
  if (explicit) return explicit;
  return guides
    .filter(
      (g) =>
        g.trackId !== "exam-prep" && g.relatedCategoryIds?.includes(categoryId),
    )
    .map((g) => ({ guideId: g.id }));
};

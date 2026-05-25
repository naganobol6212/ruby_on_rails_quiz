import type { Question } from "@/lib/types";

/**
 * Expert ティアの問題集。
 *
 * 「シニアエンジニアの判断力 / 障害対応力」 を鍛える高難度問題。
 * - 設計判断 (トレードオフ) / 障害対応 (切り分け) / パフォーマンス最適化 が中心
 * - シナリオの語りは最小限、 鋭い 1 問を心がける
 * - 必ず references で公式ドキュメントを示し、 studyGuide で章レベル誘導
 *
 * ID 規則: ex-{categoryId 短縮}-{連番}
 *
 * NOTE: 現時点では Expert 問題は未投入 (型と UI 基盤のみ整備済み)。
 * 既存 3 ティア (beginner/intermediate/advanced) の拡充を優先中。
 */

export const expertQuestions: Question[] = [];

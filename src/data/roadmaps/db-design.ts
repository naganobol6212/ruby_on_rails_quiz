/**
 * DB 設計 学習ロードマップ: ER / 正規化からインデックス・運用・アンチパターンまで。
 * 参考書 (db-design-intro) の章とクイズ (db-design) を積み上げる。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const dbDesignRoadmap: RoadmapPhase[] = [
  {
    id: "db-modeling",
    title: "Phase 1 · モデリングの基礎",
    description: "ER 図と正規化、主キー・外部キーの設計。データ構造の土台を作る。",
    color: "emerald",
    steps: [
      {
        id: "db-01-er",
        number: 1,
        title: "ER と正規化",
        emoji: "🗂️",
        goal: "エンティティ / 関連、第 1〜第 3 正規形、正規化の目的と崩しどころを理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/db-design-intro/er-and-normalization",
            label: "📖 DB 設計入門: ER と正規化",
          },
          {
            kind: "quiz-category",
            href: "/quiz/db-design",
            label: "🧩 DB 設計クイズ (9 問)",
            hint: "db-001〜009",
            requiredQuestionIds: idRange("db", 1, 9),
          },
        ],
      },
      {
        id: "db-02-keys",
        number: 2,
        title: "主キーと外部キー",
        emoji: "🔑",
        goal: "主キーの選び方 (自然キー / 代理キー)、外部キー制約、参照整合性を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/db-design-intro/primary-and-foreign-keys",
            label: "📖 DB 設計入門: 主キーと外部キー",
          },
          {
            kind: "quiz-category",
            href: "/quiz/db-design",
            label: "🧩 DB 設計クイズ (9 問)",
            hint: "db-010〜018",
            requiredQuestionIds: idRange("db", 10, 18),
          },
        ],
      },
    ],
  },
  {
    id: "db-patterns",
    title: "Phase 2 · 設計パターン",
    description: "リレーションの表現、インデックスと命名規約。",
    color: "sky",
    steps: [
      {
        id: "db-03-relations",
        number: 3,
        title: "リレーションのパターン",
        emoji: "🔗",
        goal: "1:1 / 1:N / N:M、中間テーブル、ポリモーフィックの扱いを理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/db-design-intro/relation-patterns",
            label: "📖 DB 設計入門: リレーションのパターン",
          },
        ],
      },
      {
        id: "db-04-index-naming",
        number: 4,
        title: "インデックスと命名",
        emoji: "📇",
        goal: "インデックス設計の基本、複合インデックス、一貫した命名規約を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/db-design-intro/indexes-and-naming",
            label: "📖 DB 設計入門: インデックスと命名",
          },
        ],
      },
    ],
  },
  {
    id: "db-ops",
    title: "Phase 3 · 運用と落とし穴",
    description: "マイグレーション、監査 / 論理削除 / 履歴、そして避けたいアンチパターン。",
    color: "violet",
    steps: [
      {
        id: "db-05-migration",
        number: 5,
        title: "マイグレーションと ZDD",
        emoji: "🚧",
        goal: "安全なスキーマ変更、ゼロダウンタイムデプロイ (ZDD) の段階的手順を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/db-design-intro/migrations-and-zdd",
            label: "📖 DB 設計入門: マイグレーションと ZDD",
          },
        ],
      },
      {
        id: "db-06-audit",
        number: 6,
        title: "監査・論理削除・履歴",
        emoji: "🧾",
        goal: "作成 / 更新日時、論理削除、履歴テーブルなど運用に効く設計を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/db-design-intro/audit-soft-delete-history",
            label: "📖 DB 設計入門: 監査・論理削除・履歴",
          },
        ],
      },
      {
        id: "db-07-antipatterns",
        number: 7,
        title: "アンチパターン",
        emoji: "⚠️",
        goal: "EAV / 多すぎる NULL / 一貫性のない型など、典型的な設計の罠を避ける。",
        estimateMinutes: 25,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/db-design-intro/antipatterns",
            label: "📖 DB 設計入門: アンチパターン",
          },
        ],
      },
    ],
  },
];

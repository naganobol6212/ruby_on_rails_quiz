/**
 * SQL 学習ロードマップ: SELECT の基礎から JOIN・ウィンドウ関数・性能まで。
 *
 * NOTE: SQL のクイズは sql-basics / sql-joins / sql-advanced の 3 カテゴリで
 * 問題 ID が交錯しているため、完了判定はカテゴリ単位 (requiredQuestionIds なし) とする。
 */
import type { RoadmapPhase } from "../roadmap";

export const sqlRoadmap: RoadmapPhase[] = [
  {
    id: "sql-retrieval",
    title: "Phase 1 · 取得と操作の基礎",
    description: "SELECT / WHERE / ORDER BY と、INSERT・UPDATE・トランザクションの基本。",
    color: "emerald",
    steps: [
      {
        id: "sql-01-select",
        number: 1,
        title: "SELECT の基礎",
        emoji: "🗃️",
        goal: "SELECT / WHERE / ORDER BY / LIMIT、NULL の扱い、DISTINCT を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/sql-intro/select-basics",
            label: "📖 SQL 入門: SELECT の基礎",
          },
          {
            kind: "quiz-category",
            href: "/quiz/sql-basics",
            label: "🧩 SQL 基礎クイズ",
          },
        ],
      },
      {
        id: "sql-02-dml",
        number: 2,
        title: "DML とトランザクション",
        emoji: "✍️",
        goal: "INSERT / UPDATE / DELETE、トランザクションと ACID、ロールバックの感覚を掴む。",
        estimateMinutes: 25,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/sql-intro/dml-and-transactions",
            label: "📖 SQL 入門: DML とトランザクション",
          },
        ],
      },
      {
        id: "sql-03-aggregate",
        number: 3,
        title: "集約と GROUP BY",
        emoji: "📊",
        goal: "COUNT / SUM / AVG、GROUP BY / HAVING の使い分けを理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/sql-intro/aggregates-and-group-by",
            label: "📖 SQL 入門: 集約と GROUP BY",
          },
        ],
      },
    ],
  },
  {
    id: "sql-join-subquery",
    title: "Phase 2 · 結合とサブクエリ",
    description: "複数テーブルを JOIN し、サブクエリ・CTE で読みやすく組み立てる。",
    color: "sky",
    steps: [
      {
        id: "sql-04-joins",
        number: 4,
        title: "JOIN を制する",
        emoji: "🔗",
        goal: "INNER / LEFT / RIGHT / FULL OUTER、自己結合、結合条件の設計を理解する。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/sql-intro/joins",
            label: "📖 SQL 入門: JOIN",
          },
          {
            kind: "quiz-category",
            href: "/quiz/sql-joins",
            label: "🧩 SQL 結合クイズ",
          },
        ],
      },
      {
        id: "sql-05-subquery-cte",
        number: 5,
        title: "サブクエリと CTE",
        emoji: "🪆",
        goal: "相関サブクエリ、WITH 句 (CTE)、EXISTS / IN の使い分けを身につける。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/sql-intro/subqueries-and-cte",
            label: "📖 SQL 入門: サブクエリと CTE",
          },
        ],
      },
    ],
  },
  {
    id: "sql-advanced",
    title: "Phase 3 · 上級と性能",
    description: "ウィンドウ関数で分析クエリを書き、インデックスと EXPLAIN で速くする。",
    color: "violet",
    steps: [
      {
        id: "sql-06-window",
        number: 6,
        title: "ウィンドウ関数",
        emoji: "🪟",
        goal: "ROW_NUMBER / RANK / SUM() OVER、PARTITION BY による分析クエリを書ける。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/sql-intro/window-functions",
            label: "📖 SQL 入門: ウィンドウ関数",
          },
          {
            kind: "quiz-category",
            href: "/quiz/sql-advanced",
            label: "🧩 SQL 上級クイズ",
          },
        ],
      },
      {
        id: "sql-07-performance",
        number: 7,
        title: "性能とインデックス",
        emoji: "🚀",
        goal: "インデックスの効き方、EXPLAIN の読み方、遅いクエリの典型を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/sql-intro/performance-and-index",
            label: "📖 SQL 入門: 性能とインデックス",
          },
        ],
      },
    ],
  },
];

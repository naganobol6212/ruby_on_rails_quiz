/**
 * Git & GitHub 学習ロードマップ: 3 つのエリアの基本から復旧・PR・Actions まで。
 * 参考書 (git-intro) の章とクイズ (git-github) を積み上げる。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const gitRoadmap: RoadmapPhase[] = [
  {
    id: "git-foundations",
    title: "Phase 1 · 基礎と分岐",
    description: "作業ツリー / ステージ / コミットの 3 エリアと、ブランチ・マージ戦略。",
    color: "emerald",
    steps: [
      {
        id: "git-01-areas",
        number: 1,
        title: "3 つのエリアと基本操作",
        emoji: "🔧",
        goal: "作業ツリー / インデックス / HEAD、add・commit・diff・log の意味を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/git-intro/git-3-areas-and-basics",
            label: "📖 Git 入門: 3 つのエリアと基本",
          },
          {
            kind: "quiz-category",
            href: "/quiz/git-github",
            label: "🧩 Git クイズ (10 問)",
            hint: "git-001〜010",
            requiredQuestionIds: idRange("git", 1, 10),
          },
        ],
      },
      {
        id: "git-02-branches",
        number: 2,
        title: "ブランチとマージ戦略",
        emoji: "🌿",
        goal: "merge / rebase の違い、fast-forward、コンフリクト解決の型を身につける。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/git-intro/branches-and-merge-strategies",
            label: "📖 Git 入門: ブランチとマージ戦略",
          },
          {
            kind: "quiz-category",
            href: "/quiz/git-github",
            label: "🧩 Git クイズ (10 問)",
            hint: "git-011〜020",
            requiredQuestionIds: idRange("git", 11, 20),
          },
        ],
      },
    ],
  },
  {
    id: "git-collab-recovery",
    title: "Phase 2 · 連携と復旧",
    description: "リモートとの同期、共同作業、そして「やらかし」からの復旧術。",
    color: "sky",
    steps: [
      {
        id: "git-03-remote",
        number: 3,
        title: "リモートと共同作業",
        emoji: "🌐",
        goal: "fetch / pull / push、追跡ブランチ、force-with-lease の安全な使い方を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/git-intro/remote-and-collaboration",
            label: "📖 Git 入門: リモートと共同作業",
          },
        ],
      },
      {
        id: "git-04-recovery",
        number: 4,
        title: "やり直しと復旧",
        emoji: "🩹",
        goal: "reset / revert / restore の違い、reflog による救出、stash を使い分ける。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/git-intro/fixing-and-recovery",
            label: "📖 Git 入門: やり直しと復旧",
          },
        ],
      },
      {
        id: "git-05-advanced",
        number: 5,
        title: "高度な操作",
        emoji: "🧰",
        goal: "cherry-pick / bisect / worktree / interactive rebase の使いどころを知る。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/git-intro/advanced-operations",
            label: "📖 Git 入門: 高度な操作",
          },
        ],
      },
    ],
  },
  {
    id: "git-github",
    title: "Phase 3 · GitHub と自動化",
    description: "PR を中心とした共同開発と、GitHub Actions による CI/CD。",
    color: "violet",
    steps: [
      {
        id: "git-06-pr",
        number: 6,
        title: "GitHub と Pull Request",
        emoji: "🔀",
        goal: "PR の作法、レビュー、ブランチ保護、gh CLI の基本を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/git-intro/github-and-pull-requests",
            label: "📖 Git 入門: GitHub と Pull Request",
          },
        ],
      },
      {
        id: "git-07-actions",
        number: 7,
        title: "GitHub Actions とワークフロー",
        emoji: "🤖",
        goal: "ワークフロー YAML の基本、トリガー、CI の組み方を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/git-intro/github-actions-and-workflows",
            label: "📖 Git 入門: GitHub Actions",
          },
        ],
      },
    ],
  },
];

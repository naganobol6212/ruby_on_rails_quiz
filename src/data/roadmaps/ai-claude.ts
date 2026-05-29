/**
 * AI / Claude 学習ロードマップ: LLM の基礎からエージェント設計・Claude Code・
 * AI セキュリティ・運用まで。参考書 (ai-claude-intro 全 8 章) と
 * 4 カテゴリのクイズ (ai-engineering / claude-code-basics / claude-code-practice / ai-security)。
 */
import type { RoadmapPhase } from "../roadmap";

const idRange = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `${prefix}-${String(start + i).padStart(3, "0")}`,
  );

export const aiClaudeRoadmap: RoadmapPhase[] = [
  {
    id: "ai-foundations",
    title: "Phase 1 · 基礎とエージェント設計",
    description: "LLM とコンテキストの基礎を固め、エージェント設計パターンと RAG を学ぶ。",
    color: "emerald",
    steps: [
      {
        id: "ai-01-llm",
        number: 1,
        title: "LLM とコンテキストの基礎",
        emoji: "🧠",
        goal: "トークン / コンテキストウィンドウ / プロンプト設計、Augmented LLM の考え方を掴む。",
        estimateMinutes: 25,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ai-claude-intro/llm-foundations",
            label: "📖 AI/Claude 入門: LLM とコンテキストの基礎",
          },
        ],
      },
      {
        id: "ai-02-agents",
        number: 2,
        title: "エージェント設計パターン",
        emoji: "🤖",
        goal: "Workflow と Agent の違い、Anthropic の 5 パターン、ReAct / Plan-and-Execute を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ai-claude-intro/agent-patterns",
            label: "📖 AI/Claude 入門: エージェント設計パターン",
          },
          {
            kind: "quiz-category",
            href: "/quiz/ai-engineering",
            label: "🧩 AI エンジニアリングクイズ (8 問)",
            hint: "ai-eng-001〜008",
            requiredQuestionIds: idRange("ai-eng", 1, 8),
          },
        ],
      },
      {
        id: "ai-03-rag",
        number: 3,
        title: "RAG",
        emoji: "📚",
        goal: "チャンク化 / 埋め込み / 検索 / 再ランキング / 評価 (RAGAs) の流れを理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ai-claude-intro/rag-fundamentals",
            label: "📖 AI/Claude 入門: RAG",
          },
          {
            kind: "quiz-category",
            href: "/quiz/ai-engineering",
            label: "🧩 AI エンジニアリングクイズ (8 問)",
            hint: "ai-eng-009〜016",
            requiredQuestionIds: idRange("ai-eng", 9, 16),
          },
        ],
      },
    ],
  },
  {
    id: "ai-claude-code",
    title: "Phase 2 · Claude Code",
    description: "ハーネスとカスタマイズ機構、MCP、そして実務ワークフロー。",
    color: "sky",
    steps: [
      {
        id: "ai-04-cc-basics",
        number: 4,
        title: "Claude Code 基礎 (ハーネス / CLAUDE.md / Hooks)",
        emoji: "⚙️",
        goal: "1 ターンのループ、CLAUDE.md のスコープ、Hooks の決定論的介入を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ai-claude-intro/claude-code-basics",
            label: "📖 AI/Claude 入門: Claude Code 基礎",
          },
          {
            kind: "quiz-category",
            href: "/quiz/claude-code-basics",
            label: "🧩 Claude Code 基礎クイズ (15 問)",
            hint: "ccb-001〜015",
            requiredQuestionIds: idRange("ccb", 1, 15),
          },
        ],
      },
      {
        id: "ai-05-skills-mcp",
        number: 5,
        title: "Skills・Subagents・MCP",
        emoji: "🔌",
        goal: "Skills / Subagents の使い分けと、MCP の transport・スコープ・セキュリティを理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ai-claude-intro/mcp",
            label: "📖 AI/Claude 入門: MCP",
          },
          {
            kind: "quiz-category",
            href: "/quiz/claude-code-basics",
            label: "🧩 Claude Code 基礎クイズ (15 問)",
            hint: "ccb-016〜030",
            requiredQuestionIds: idRange("ccb", 16, 30),
          },
        ],
      },
      {
        id: "ai-06-cc-practice",
        number: 6,
        title: "Claude Code 実務活用",
        emoji: "🛠️",
        goal: "Plan ファースト / 権限省力化 / レビュー運用と、典型的な落とし穴を理解する。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ai-claude-intro/claude-code-practice",
            label: "📖 AI/Claude 入門: Claude Code 実務活用",
          },
          {
            kind: "quiz-category",
            href: "/quiz/claude-code-practice",
            label: "🧩 Claude Code 実務クイズ (30 問)",
            hint: "ccp-001〜030",
            requiredQuestionIds: idRange("ccp", 1, 30),
          },
        ],
      },
    ],
  },
  {
    id: "ai-security-ops",
    title: "Phase 3 · セキュリティと運用",
    description: "AI 固有のセキュリティと、LLMOps・ガバナンス。",
    color: "violet",
    steps: [
      {
        id: "ai-07-security",
        number: 7,
        title: "AI セキュリティ",
        emoji: "🔐",
        goal: "OWASP LLM Top 10、プロンプトインジェクション、Lethal Trifecta を理解する。",
        estimateMinutes: 40,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ai-claude-intro/ai-security",
            label: "📖 AI/Claude 入門: AI セキュリティ",
          },
          {
            kind: "quiz-category",
            href: "/quiz/ai-security",
            label: "🧩 AI セキュリティクイズ (30 問)",
            hint: "aisec-001〜030",
            requiredQuestionIds: idRange("aisec", 1, 30),
          },
        ],
      },
      {
        id: "ai-08-llmops",
        number: 8,
        title: "LLMOps とガバナンス",
        emoji: "📈",
        goal: "監視 (P95 / 幻覚率)、プロンプト管理、NIST AI RMF / ISO 42001 / EU AI Act を理解する。",
        estimateMinutes: 35,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ai-claude-intro/llmops-governance",
            label: "📖 AI/Claude 入門: LLMOps とガバナンス",
          },
          {
            kind: "quiz-category",
            href: "/quiz/ai-engineering",
            label: "🧩 AI エンジニアリングクイズ (14 問)",
            hint: "ai-eng-017〜030",
            requiredQuestionIds: idRange("ai-eng", 17, 30),
          },
        ],
      },
    ],
  },
];

import type { Category } from "@/lib/types";

export const categories: Category[] = [
  // ===========================================================================
  // Track: Ruby / Rails
  // ===========================================================================
  {
    id: "ruby-basics",
    trackId: "ruby",
    name: "Ruby 基礎",
    description: "変数・型・nil・真偽値・メソッド定義・標準入出力",
    emoji: "💎",
    accentClass: "from-rose-500/20 to-red-500/5",
    ringClass: "hover:ring-rose-500/40",
  },
  {
    id: "collections",
    trackId: "ruby",
    name: "コレクション",
    description: "Array, Hash, Enumerable, Range, ブロック処理",
    emoji: "📦",
    accentClass: "from-amber-500/20 to-orange-500/5",
    ringClass: "hover:ring-amber-500/40",
  },
  {
    id: "ruby-oop",
    trackId: "ruby",
    name: "クラスとモジュール",
    description: "クラス定義、継承、Module/Mixin、attr_accessor",
    emoji: "🧱",
    accentClass: "from-emerald-500/20 to-teal-500/5",
    ringClass: "hover:ring-emerald-500/40",
  },
  {
    id: "ruby-advanced",
    trackId: "ruby",
    name: "Ruby 上級",
    description: "ブロック・Proc・Lambda・例外処理・メタプログラミング",
    emoji: "⚡",
    accentClass: "from-violet-500/20 to-purple-500/5",
    ringClass: "hover:ring-violet-500/40",
  },
  {
    id: "code-reading",
    trackId: "ruby",
    name: "コードリーディング",
    description: "複数行のコードを読んで出力・挙動を予測する読解問題",
    emoji: "🔎",
    accentClass: "from-sky-500/20 to-indigo-500/5",
    ringClass: "hover:ring-sky-500/40",
  },
  {
    id: "rails-convention",
    trackId: "ruby",
    name: "Rails 規約",
    description: "命名規則・MVC・CoC・ディレクトリ構成",
    emoji: "🛤️",
    accentClass: "from-red-500/20 to-rose-500/5",
    ringClass: "hover:ring-red-500/40",
  },
  {
    id: "routing-controller",
    trackId: "ruby",
    name: "ルーティング & コントローラ",
    description: "routes.rb, RESTful, before_action, params, Strong Parameters",
    emoji: "🔀",
    accentClass: "from-blue-500/20 to-cyan-500/5",
    ringClass: "hover:ring-blue-500/40",
  },
  {
    id: "active-record",
    trackId: "ruby",
    name: "ActiveRecord",
    description: "モデル、関連、スコープ、クエリ、マイグレーション",
    emoji: "🗄️",
    accentClass: "from-fuchsia-500/20 to-pink-500/5",
    ringClass: "hover:ring-fuchsia-500/40",
  },
  {
    id: "rspec",
    trackId: "ruby",
    name: "RSpec テスト",
    description: "describe/it/expect, matcher, factory_bot, モック/スタブ",
    emoji: "🧪",
    accentClass: "from-pink-500/20 to-rose-500/5",
    ringClass: "hover:ring-pink-500/40",
  },
  {
    id: "logs",
    trackId: "ruby",
    name: "ログ調査・運用",
    description: "Rails ログ、エラー追跡、tail/grep/journalctl、デバッグの型",
    emoji: "📜",
    accentClass: "from-yellow-500/20 to-amber-500/5",
    ringClass: "hover:ring-yellow-500/40",
  },
  {
    id: "git-github",
    trackId: "git",
    name: "Git & GitHub 基礎",
    description: "branch 戦略、PR、rebase/merge、conflict 解決、gh CLI",
    emoji: "🔧",
    accentClass: "from-slate-500/20 to-zinc-500/5",
    ringClass: "hover:ring-slate-500/40",
  },
  {
    id: "security",
    trackId: "infosec",
    name: "セキュリティ (OWASP)",
    description: "CSRF/XSS/SQLi, Strong Params, secret 管理, セッション",
    emoji: "🛡️",
    accentClass: "from-red-500/20 to-orange-500/5",
    ringClass: "hover:ring-red-500/40",
  },
  {
    id: "debugging",
    trackId: "ruby",
    name: "デバッグ & パフォーマンス",
    description: "binding.pry, EXPLAIN, slow query, profiling, APM",
    emoji: "🔬",
    accentClass: "from-cyan-500/20 to-teal-500/5",
    ringClass: "hover:ring-cyan-500/40",
  },
  {
    id: "linux-cli",
    trackId: "linux",
    name: "Linux & CLI 基礎",
    description: "find/grep/sed/awk, パイプ, ssh, パーミッション, プロセス",
    emoji: "🐧",
    accentClass: "from-zinc-500/20 to-stone-500/5",
    ringClass: "hover:ring-zinc-500/40",
  },
  {
    id: "practical",
    trackId: "ruby",
    name: "実践課題",
    description: "実務想定タスク。要件→自分で実装→サンプル解答で答え合わせ",
    emoji: "🛠️",
    accentClass: "from-orange-500/20 to-amber-500/5",
    ringClass: "hover:ring-orange-500/40",
  },

  // ===========================================================================
  // Track: JavaScript
  // ===========================================================================
  {
    id: "js-basics",
    trackId: "javascript",
    name: "JS 基礎",
    description: "変数・型・スコープ・演算子・制御構文・モダン ES",
    emoji: "🟨",
    accentClass: "from-yellow-500/20 to-amber-500/5",
    ringClass: "hover:ring-yellow-500/40",
  },
  {
    id: "js-functions",
    trackId: "javascript",
    name: "JS 関数",
    description: "クロージャ・アロー・this・bind/call/apply・高階関数",
    emoji: "𝑓",
    accentClass: "from-amber-500/20 to-yellow-500/5",
    ringClass: "hover:ring-amber-500/40",
  },
  {
    id: "js-async",
    trackId: "javascript",
    name: "JS 非同期",
    description: "Promise / async-await / fetch / Event Loop / try-catch",
    emoji: "⏳",
    accentClass: "from-orange-500/20 to-yellow-500/5",
    ringClass: "hover:ring-orange-500/40",
  },

  // ===========================================================================
  // Track: TypeScript
  // ===========================================================================
  {
    id: "ts-basics",
    trackId: "typescript",
    name: "TS 基礎",
    description: "型注釈・interface vs type・union・narrowing・generics",
    emoji: "🔷",
    accentClass: "from-sky-500/20 to-blue-500/5",
    ringClass: "hover:ring-sky-500/40",
  },

  // ===========================================================================
  // Track: React
  // ===========================================================================
  {
    id: "react-fundamentals",
    trackId: "react",
    name: "React 基礎",
    description: "JSX, props, state, hooks (useState/useEffect/useMemo)",
    emoji: "⚛️",
    accentClass: "from-cyan-500/20 to-blue-500/5",
    ringClass: "hover:ring-cyan-500/40",
  },

  // ===========================================================================
  // Track: Next.js
  // ===========================================================================
  {
    id: "nextjs-basics",
    trackId: "nextjs",
    name: "Next.js 基礎",
    description: "App Router, Server Components, ルーティング, データ取得",
    emoji: "▲",
    accentClass: "from-zinc-500/20 to-slate-500/5",
    ringClass: "hover:ring-zinc-500/40",
  },

  // ===========================================================================
  // Track: Nuxt
  // ===========================================================================
  {
    id: "nuxt-basics",
    trackId: "nuxt",
    name: "Nuxt 基礎",
    description: "Vue 3 / Composition API / 自動ルーティング / useFetch",
    emoji: "💚",
    accentClass: "from-emerald-500/20 to-green-500/5",
    ringClass: "hover:ring-emerald-500/40",
  },

  // ===========================================================================
  // Track: Python
  // ===========================================================================
  {
    id: "python-basics",
    trackId: "python",
    name: "Python 基礎",
    description: "基本構文・コレクション・内包表記・関数・モジュール",
    emoji: "🐍",
    accentClass: "from-blue-500/20 to-indigo-500/5",
    ringClass: "hover:ring-blue-500/40",
  },

  // ===========================================================================
  // Track: SQL
  // ===========================================================================
  {
    id: "sql-basics",
    trackId: "sql",
    name: "SQL 基礎",
    description: "SELECT / WHERE / ORDER BY / GROUP BY / INSERT / UPDATE",
    emoji: "🗃️",
    accentClass: "from-indigo-500/20 to-violet-500/5",
    ringClass: "hover:ring-indigo-500/40",
  },
  {
    id: "sql-joins",
    trackId: "sql",
    name: "SQL 結合",
    description: "INNER / LEFT / RIGHT / OUTER / セルフジョイン / サブクエリ",
    emoji: "🔗",
    accentClass: "from-violet-500/20 to-purple-500/5",
    ringClass: "hover:ring-violet-500/40",
  },
  {
    id: "sql-advanced",
    trackId: "sql",
    name: "SQL 上級",
    description: "ウィンドウ関数・CTE・トランザクション・インデックス・EXPLAIN",
    emoji: "📈",
    accentClass: "from-purple-500/20 to-fuchsia-500/5",
    ringClass: "hover:ring-purple-500/40",
  },
  // ===========================================================================
  // Track: DB 設計
  // ===========================================================================
  {
    id: "db-design",
    trackId: "db-design",
    name: "DB 設計 基礎",
    description: "正規化 / ER モデリング / 主キー・外部キー / 命名 / マイグレーション / アンチパターン",
    emoji: "🗂️",
    accentClass: "from-teal-500/20 to-emerald-500/5",
    ringClass: "hover:ring-teal-500/40",
  },

  // ===========================================================================
  // Track: AI / Claude
  // ===========================================================================
  {
    id: "ai-engineering",
    trackId: "ai-claude",
    name: "AI エンジニアリング基礎",
    description:
      "エージェント設計パターン (Anthropic 5 workflows) / RAG / LLMOps / ガバナンス (NIST/ISO/EU AI Act)",
    emoji: "🧠",
    accentClass: "from-purple-500/20 to-violet-500/5",
    ringClass: "hover:ring-purple-500/40",
  },
  {
    id: "claude-code-basics",
    trackId: "ai-claude",
    name: "Claude Code 基礎",
    description:
      "ハーネス / CLAUDE.md / Hooks / Skills / Subagents / MCP / Slash Commands / Plugins",
    emoji: "⚙️",
    accentClass: "from-indigo-500/20 to-blue-500/5",
    ringClass: "hover:ring-indigo-500/40",
  },
  {
    id: "claude-code-practice",
    trackId: "ai-claude",
    name: "Claude Code 実務活用",
    description:
      "ワークフロー設計 / Plan モード / 並列セッション / レビュー / 自動化 / 落とし穴",
    emoji: "🛠️",
    accentClass: "from-blue-500/20 to-cyan-500/5",
    ringClass: "hover:ring-blue-500/40",
  },
  {
    id: "ai-security",
    trackId: "ai-claude",
    name: "AI セキュリティ",
    description:
      "OWASP LLM Top 10 (2025) / Prompt Injection / Lethal Trifecta / MCP セキュリティ / Constitutional AI",
    emoji: "🔐",
    accentClass: "from-red-500/20 to-rose-500/5",
    ringClass: "hover:ring-red-500/40",
  },
];

export const findCategory = (id: string) =>
  categories.find((c) => c.id === id);

export const categoriesByTrack = (trackId: string) =>
  categories.filter((c) => c.trackId === trackId);

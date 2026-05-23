import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "ruby-basics",
    name: "Ruby 基礎",
    description: "変数・型・nil・真偽値・メソッド定義・標準入出力",
    emoji: "💎",
    accentClass: "from-rose-500/20 to-red-500/5",
    ringClass: "hover:ring-rose-500/40",
  },
  {
    id: "collections",
    name: "コレクション",
    description: "Array, Hash, Enumerable, Range, ブロック処理",
    emoji: "📦",
    accentClass: "from-amber-500/20 to-orange-500/5",
    ringClass: "hover:ring-amber-500/40",
  },
  {
    id: "ruby-oop",
    name: "クラスとモジュール",
    description: "クラス定義、継承、Module/Mixin、attr_accessor",
    emoji: "🧱",
    accentClass: "from-emerald-500/20 to-teal-500/5",
    ringClass: "hover:ring-emerald-500/40",
  },
  {
    id: "ruby-advanced",
    name: "Ruby 上級",
    description: "ブロック・Proc・Lambda・例外処理・メタプログラミング",
    emoji: "⚡",
    accentClass: "from-violet-500/20 to-purple-500/5",
    ringClass: "hover:ring-violet-500/40",
  },
  {
    id: "code-reading",
    name: "コードリーディング",
    description: "複数行のコードを読んで出力・挙動を予測する読解問題",
    emoji: "🔎",
    accentClass: "from-sky-500/20 to-indigo-500/5",
    ringClass: "hover:ring-sky-500/40",
  },
  {
    id: "rails-convention",
    name: "Rails 規約",
    description: "命名規則・MVC・CoC・ディレクトリ構成",
    emoji: "🛤️",
    accentClass: "from-red-500/20 to-rose-500/5",
    ringClass: "hover:ring-red-500/40",
  },
  {
    id: "routing-controller",
    name: "ルーティング & コントローラ",
    description: "routes.rb, RESTful, before_action, params, Strong Parameters",
    emoji: "🔀",
    accentClass: "from-blue-500/20 to-cyan-500/5",
    ringClass: "hover:ring-blue-500/40",
  },
  {
    id: "active-record",
    name: "ActiveRecord",
    description: "モデル、関連、スコープ、クエリ、マイグレーション",
    emoji: "🗄️",
    accentClass: "from-fuchsia-500/20 to-pink-500/5",
    ringClass: "hover:ring-fuchsia-500/40",
  },
  {
    id: "practical",
    name: "実践課題",
    description: "実務想定タスク。要件→自分で実装→サンプル解答で答え合わせ",
    emoji: "🛠️",
    accentClass: "from-orange-500/20 to-amber-500/5",
    ringClass: "hover:ring-orange-500/40",
  },
];

export const findCategory = (id: string) =>
  categories.find((c) => c.id === id);

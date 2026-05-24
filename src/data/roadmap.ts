/**
 * 学習ロードマップ: ゼロから Rails 中級者までの推奨順序。
 *
 * 各ステップは「クイズ・参考書・実践課題」を組み合わせた『塊』。
 * 順番に進めば自然に必要な前提知識が積み上がるように構成する。
 */

export type RoadmapItemKind = "quiz-category" | "guide" | "guide-chapter" | "crud-step";

export type RoadmapItem = {
  kind: RoadmapItemKind;
  /** リンク先 (例: /quiz/ruby-basics, /guide/ruby-intro, /crud/rails-todo-crud/01-bootstrap) */
  href: string;
  /** 表示ラベル */
  label: string;
  /** 補足説明 */
  hint?: string;
  /** クイズの場合、達成扱いに必要な問題 ID の配列。これらすべて solved になったら完了扱い */
  requiredQuestionIds?: string[];
};

export type RoadmapStep = {
  id: string;
  /** ステップ番号 (表示用) */
  number: number;
  title: string;
  emoji: string;
  /** どんな状態を目指すか */
  goal: string;
  /** 想定所要時間 */
  estimateMinutes: number;
  items: RoadmapItem[];
};

export type RoadmapPhase = {
  id: string;
  title: string;
  description: string;
  color: "emerald" | "sky" | "violet" | "amber" | "rose";
  steps: RoadmapStep[];
};

export const roadmap: RoadmapPhase[] = [
  {
    id: "ruby-foundations",
    title: "Phase 1 · Ruby の足場を作る",
    description:
      "Ruby のリテラル・基本制御構造・型変換まで。クイズだけでなく参考書も並行で読み、写経で手を動かす。",
    color: "emerald",
    steps: [
      {
        id: "01-ruby-basics-1",
        number: 1,
        title: "Ruby の基本リテラル & nil の感覚",
        emoji: "💎",
        goal: "Symbol と String の違い、nil でもメソッドが呼べる感覚、真偽の最小設計を理解する。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ruby-intro/values-and-control",
            label: "📖 Ruby 入門: 値と制御",
            hint: "全体像を 10 分で",
          },
          {
            kind: "quiz-category",
            href: "/quiz/ruby-basics",
            label: "🧩 Ruby 基礎クイズ (5 問)",
            hint: "rb-001〜005",
            requiredQuestionIds: [
              "rb-001",
              "rb-002",
              "rb-003",
              "rb-004",
              "rb-005",
            ],
          },
        ],
      },
      {
        id: "02-ruby-basics-2",
        number: 2,
        title: "メソッド・文字列・型変換",
        emoji: "🔤",
        goal: "upcase / 式展開 / respond_to? / to_s の慣習 / デフォルト引数 を体に染み込ませる。",
        estimateMinutes: 25,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/ruby-basics",
            label: "🧩 Ruby 基礎クイズ (5 問)",
            hint: "rb-006〜010",
            requiredQuestionIds: [
              "rb-006",
              "rb-007",
              "rb-008",
              "rb-009",
              "rb-010",
            ],
          },
        ],
      },
      {
        id: "03-ruby-control",
        number: 3,
        title: "制御構造 と ぼっち演算子",
        emoji: "🌀",
        goal: "unless / &. (ぼっち) / 型混在の TypeError / 定数 / 参照と複製の感覚を掴む。",
        estimateMinutes: 30,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/ruby-basics",
            label: "🧩 Ruby 基礎クイズ (5 問)",
            hint: "rb-011〜015",
            requiredQuestionIds: [
              "rb-011",
              "rb-012",
              "rb-013",
              "rb-014",
              "rb-015",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ruby-oop",
    title: "Phase 2 · オブジェクト指向と Module",
    description:
      "クラス・継承・Mixin・self の意味を整理。Rails の Concern パターンへの伏線を貼る。",
    color: "sky",
    steps: [
      {
        id: "04-oop-basics",
        number: 4,
        title: "クラスの基本",
        emoji: "🧱",
        goal: "attr_accessor / initialize / 継承 / super の使い方を理解。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ruby-intro/classes-and-modules",
            label: "📖 Ruby 入門: クラス と Module",
          },
          {
            kind: "quiz-category",
            href: "/quiz/ruby-oop",
            label: "🧩 OOP クイズ (5 問)",
            hint: "oop-001〜005",
            requiredQuestionIds: [
              "oop-001",
              "oop-002",
              "oop-003",
              "oop-004",
              "oop-005",
            ],
          },
        ],
      },
      {
        id: "05-oop-advanced",
        number: 5,
        title: "include / private / self の本質",
        emoji: "🪄",
        goal: "include vs extend vs prepend、private の Ruby 流の意味、Struct / Comparable を理解。",
        estimateMinutes: 30,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/ruby-oop",
            label: "🧩 OOP クイズ (7 問)",
            hint: "oop-006〜012",
            requiredQuestionIds: [
              "oop-006",
              "oop-007",
              "oop-008",
              "oop-009",
              "oop-010",
              "oop-011",
              "oop-012",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ruby-collections",
    title: "Phase 3 · コレクションを操る",
    description:
      "Ruby らしい関数型スタイルのコレクション操作。map/select/reduce を 1 行で書ける手に。",
    color: "violet",
    steps: [
      {
        id: "06-collections-1",
        number: 6,
        title: "map / select / sum / inject",
        emoji: "🔁",
        goal: "Enumerable の基本イディオムを使いこなす。",
        estimateMinutes: 25,
        items: [
          {
            kind: "guide-chapter",
            href: "/guide/ruby-intro/collections-and-blocks",
            label: "📖 Ruby 入門: コレクション と ブロック",
          },
          {
            kind: "quiz-category",
            href: "/quiz/collections",
            label: "🧩 Collections クイズ (5 問)",
            hint: "col-001〜005",
            requiredQuestionIds: [
              "col-001",
              "col-002",
              "col-003",
              "col-004",
              "col-005",
            ],
          },
        ],
      },
      {
        id: "07-collections-2",
        number: 7,
        title: "Hash 操作・並び替え・畳み込み",
        emoji: "🗂️",
        goal: "to_h / each_slice / sort_by / group_by / Hash.new(0) パターン / each_with_object の使い分け。",
        estimateMinutes: 30,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/collections",
            label: "🧩 Collections クイズ (11 問)",
            hint: "col-006〜016",
            requiredQuestionIds: [
              "col-006",
              "col-007",
              "col-008",
              "col-009",
              "col-010",
              "col-011",
              "col-012",
              "col-013",
              "col-014",
              "col-015",
              "col-016",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "rails-fundamentals",
    title: "Phase 4 · Rails の規約に乗る",
    description:
      "MVC・命名規則・autoload・CoC を理解。Rails らしいフォルダ構成とファイル命名のセンスを身につける。",
    color: "rose",
    steps: [
      {
        id: "08-rails-convention",
        number: 8,
        title: "Rails 規約と MVC",
        emoji: "🚂",
        goal: "テーブル名規約 / MVC の役割 / コントローラー命名 / Zeitwerk / Encrypted Credentials を理解。",
        estimateMinutes: 40,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/rails-convention",
            label: "🧩 Rails 規約クイズ (10 問)",
            hint: "rails-001〜010",
            requiredQuestionIds: [
              "rails-001",
              "rails-002",
              "rails-003",
              "rails-004",
              "rails-005",
              "rails-006",
              "rails-007",
              "rails-008",
              "rails-009",
              "rails-010",
            ],
          },
        ],
      },
      {
        id: "09-routing-controller",
        number: 9,
        title: "ルーティングとコントローラ",
        emoji: "🛤️",
        goal: "resources / params / render vs redirect_to / Strong Parameters / namespace / Turbo の罠 を理解。",
        estimateMinutes: 40,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/routing-controller",
            label: "🧩 Routing/Controller クイズ (12 問)",
            hint: "rt-001〜012",
            requiredQuestionIds: [
              "rt-001",
              "rt-002",
              "rt-003",
              "rt-004",
              "rt-005",
              "rt-006",
              "rt-007",
              "rt-008",
              "rt-009",
              "rt-010",
              "rt-011",
              "rt-012",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "active-record",
    title: "Phase 5 · ActiveRecord を仕事道具にする",
    description:
      "Rails の心臓部 ActiveRecord。関連・クエリ・バリデーション・トランザクション・N+1 をマスターする。",
    color: "amber",
    steps: [
      {
        id: "10-ar-basics",
        number: 10,
        title: "関連と検索の基本",
        emoji: "🔗",
        goal: "has_many / belongs_to / find vs find_by / find_each で OOM 回避 / N+1 と includes を理解。",
        estimateMinutes: 50,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/active-record",
            label: "🧩 ActiveRecord クイズ (5 問)",
            hint: "ar-001〜005",
            requiredQuestionIds: [
              "ar-001",
              "ar-002",
              "ar-003",
              "ar-004",
              "ar-005",
            ],
          },
        ],
      },
      {
        id: "11-ar-validation",
        number: 11,
        title: "バリデーション・scope・callback",
        emoji: "🛡️",
        goal: "validates / scope / save vs save! / where と SQL Injection 対策 / callback の落とし穴。",
        estimateMinutes: 50,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/active-record",
            label: "🧩 ActiveRecord クイズ (5 問)",
            hint: "ar-006〜010",
            requiredQuestionIds: [
              "ar-006",
              "ar-007",
              "ar-008",
              "ar-009",
              "ar-010",
            ],
          },
        ],
      },
      {
        id: "12-ar-advanced",
        number: 12,
        title: "実務で踏むハマりポイント",
        emoji: "⚠️",
        goal: "update_all のスキップ / 多対多 / count vs size / Optimistic Locking / dependent: destroy / 複合 unique / マイグレーション運用 / pluck / find_or_create_by の race / transaction / 集計クエリ。",
        estimateMinutes: 70,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/active-record",
            label: "🧩 ActiveRecord クイズ (13 問)",
            hint: "ar-011〜023",
            requiredQuestionIds: [
              "ar-011",
              "ar-012",
              "ar-013",
              "ar-014",
              "ar-015",
              "ar-016",
              "ar-017",
              "ar-018",
              "ar-019",
              "ar-020",
              "ar-021",
              "ar-022",
              "ar-023",
            ],
          },
        ],
      },
      {
        id: "12b-db-design",
        number: 13,
        title: "DB 設計を体系的に学ぶ",
        emoji: "🗂️",
        goal: "正規化 / PK・FK / リレーション設計 / INDEX 設計 / ZDD マイグレーション / アンチパターン (EAV / 巨大 JSONB)。SQL を書く側から設計する側へ。",
        estimateMinutes: 90,
        items: [
          {
            kind: "guide",
            href: "/guide/db-design-intro",
            label: "📖 DB 設計の地図 (7 章)",
            hint: "正規化 → PK/FK → リレーション → INDEX → ZDD → 監査 → アンチパターン",
          },
          {
            kind: "quiz-category",
            href: "/quiz/db-design",
            label: "🧩 DB 設計クイズ (18 問)",
            hint: "db-001〜018",
            requiredQuestionIds: Array.from(
              { length: 18 },
              (_, i) => `db-${String(i + 1).padStart(3, "0")}`,
            ),
          },
        ],
      },
    ],
  },
  {
    id: "practice",
    title: "Phase 6 · 手を動かして実装する",
    description:
      "知識を実装に変換する段。CRUD 課題を最初から最後まで通し、本番運用相当のセキュリティ意識も身につける。",
    color: "rose",
    steps: [
      {
        id: "13-crud",
        number: 14,
        title: "CRUD 実践課題を 4 本走り抜ける",
        emoji: "🛠️",
        goal: "ToDo → 認証付きブログ → ファイルアップロード → JSON API + RSpec の順で実装。MVC の足場 → 認証/認可 → ファイル添付 → API 設計とテスト、と実務でほぼ必ず踏むテーマを一周。",
        estimateMinutes: 430,
        items: [
          {
            kind: "crud-step",
            href: "/crud/rails-todo-crud",
            label: "🛠️ Rails ToDo CRUD",
            hint: "8 ステップ・約 90 分 / 基礎の一周",
          },
          {
            kind: "crud-step",
            href: "/crud/rails-auth-blog",
            label: "🔐 認証付きブログ",
            hint: "6 ステップ・約 120 分 / Devise + Pundit",
          },
          {
            kind: "crud-step",
            href: "/crud/rails-photo-gallery",
            label: "🖼️ フォトギャラリー",
            hint: "6 ステップ・約 100 分 / Active Storage",
          },
          {
            kind: "crud-step",
            href: "/crud/rails-api-with-tests",
            label: "🔌 JSON API + RSpec",
            hint: "6 ステップ・約 120 分 / API モード + 認証 + テスト",
          },
        ],
      },
      {
        id: "14-practical",
        number: 15,
        title: "実装パターンを身体に染み込ませる",
        emoji: "🏗️",
        goal: "FizzBuzz / 集計 / CSV パーサ / User-Post 設計 / N+1 / scope / RESTful Controller / Service Object / JSON API / ActiveJob / API 認証 / メタプロ DSL を順番に解く。",
        estimateMinutes: 90,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/practical",
            label: "🧩 Practical クイズ (12 問)",
            hint: "pr-001〜012",
            requiredQuestionIds: [
              "pr-001",
              "pr-002",
              "pr-003",
              "pr-004",
              "pr-005",
              "pr-006",
              "pr-007",
              "pr-008",
              "pr-009",
              "pr-010",
              "pr-011",
              "pr-012",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "advanced",
    title: "Phase 7 · 中級者の壁を越える",
    description:
      "Ruby のメタプロ・パターンマッチ・Refinements・GC・コード読解力。シニアエンジニアの会話に追いつける。",
    color: "violet",
    steps: [
      {
        id: "15-ruby-advanced",
        number: 16,
        title: "Ruby 上級 (メタプロ・Fiber・パターンマッチ)",
        emoji: "🧙",
        goal: "yield / Proc vs Lambda / raise/rescue / ensure / Symbol#to_proc / method_missing / define_method / Enumerator / クロージャ / モンキーパッチ / GC / case/in / instance_eval / send / 特異メソッド / Concern / Refinements / Fiber / エンコーディング。",
        estimateMinutes: 90,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/ruby-advanced",
            label: "🧩 Ruby 上級クイズ (22 問)",
            requiredQuestionIds: Array.from(
              { length: 22 },
              (_, i) => `adv-${String(i + 1).padStart(3, "0")}`,
            ),
          },
        ],
      },
      {
        id: "16-code-reading",
        number: 17,
        title: "コード読解力 (トレース演習)",
        emoji: "🔬",
        goal: "他人のコードを 1 行ずつ追って正確に出力を予測できる力。デバッグ・コードレビューの基礎。",
        estimateMinutes: 50,
        items: [
          {
            kind: "quiz-category",
            href: "/quiz/code-reading",
            label: "🧩 Code Reading クイズ (12 問)",
            requiredQuestionIds: Array.from(
              { length: 12 },
              (_, i) => `cr-${String(i + 1).padStart(3, "0")}`,
            ),
          },
        ],
      },
    ],
  },
  {
    id: "reflection",
    title: "Phase 8 · 学びを言語化する",
    description:
      "解いた問題を自分の言葉で説明できるか確認。ジャーナルに記録して振り返ると定着率が劇的に上がる。",
    color: "emerald",
    steps: [
      {
        id: "17-self-explanation",
        number: 18,
        title: "自己説明トレーニング",
        emoji: "🗣️",
        goal: "解いた問題の中から 10 問選び、『結論 → 理由 → 具体例 → 落とし穴』の構造で自分の言葉で書き直す。",
        estimateMinutes: 60,
        items: [
          {
            kind: "guide-chapter",
            href: "/explanations",
            label: "🗂️ 自己説明 一覧で振り返る",
            hint: "保存した自己説明を見直す",
          },
        ],
      },
      {
        id: "18-journal",
        number: 19,
        title: "週次振り返り (KPT / PREP)",
        emoji: "📝",
        goal: "学習ジャーナルで KPT (Keep/Problem/Try) または PREP (Point/Reason/Example/Point) で週次振り返り。",
        estimateMinutes: 30,
        items: [
          {
            kind: "guide-chapter",
            href: "/journal",
            label: "📝 学習ジャーナル",
            hint: "KPT / STAR / PREP / 5W1H など",
          },
        ],
      },
    ],
  },
];

export const totalSteps = roadmap.reduce(
  (sum, phase) => sum + phase.steps.length,
  0,
);

/**
 * ユーザーへのお知らせ (更新履歴)。
 * 新しいエントリは配列の先頭に追加する。
 * `version` は単調増加する文字列なら何でも良い (YYYY-MM-DD-x 形式を推奨)。
 */

export type ChangelogBadge = "feat" | "fix" | "ui" | "content";

export type ChangelogEntry = {
  version: string;
  date: string; // 表示用
  title: string;
  highlights: string[];
  badge: ChangelogBadge;
  prUrl?: string;
};

export const changelog: ChangelogEntry[] = [
  {
    version: "2026-05-26-f",
    date: "2026-05-26",
    title: "🗃️ Study Guide に SQL を追加 (7 章)",
    badge: "content",
    highlights: [
      "🗃️ SQL の地図 — 宣言的にデータを問い合わせる (新規ガイド、7 章 / 約 60 分)",
      "1. SELECT 基礎 / 2. DML とトランザクション / 3. 集計と GROUP BY / 4. JOIN (N+1 解消含む) / 5. サブクエリと CTE (再帰含む) / 6. ウィンドウ関数 / 7. パフォーマンス (INDEX / EXPLAIN)",
      "PostgreSQL / MySQL / SQLite 共通の標準 SQL を中心に、PG 固有の便利機能 (RETURNING / DATE_TRUNC / 部分 INDEX) も実例付きで解説",
      "N+1 / 巨大 OFFSET / 関数加工 / 複合 INDEX の順序ルールなど Slow Query の典型対策を網羅",
      "Use The Index, Luke! / PostgreSQL 公式 / MySQL 8 リファレンスへのリンク完備",
      "Guide 総数: 4 → 5 (Ruby / JS / TS / Python / SQL)、章総数: 28 → 35",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-26-e",
    date: "2026-05-26",
    title: "🐍 Study Guide に Python を追加 (7 章)",
    badge: "content",
    highlights: [
      "🐍 Python の地図 — 静かで強い言語 (新規ガイド、7 章 / 約 60 分)",
      "1. 値と構文 / 2. コレクションと内包表記 / 3. 関数とデコレータ / 4. クラスと OOP / 5. 例外と with / 6. イテレータと Generator / 7. モダン Python (型ヒント・pytest・uv)",
      "Ruby / JS との falsy 値・スライス・f-string・nonlocal の違いを実例で対比",
      "@dataclass / @contextmanager / yield from / itertools / Protocol などモダン Python の主要機能を解説",
      "uv / poetry / pip+venv / pyproject.toml / ruff / mypy の現代開発環境を一望",
      "Guide 総数: 3 → 4 (Ruby / JavaScript / TypeScript / Python)、章総数: 21 → 28",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-26-d",
    date: "2026-05-26",
    title: "🔷 Study Guide に TypeScript を追加 (7 章)",
    badge: "content",
    highlights: [
      "🔷 TypeScript の地図 — 型で守る JavaScript (新規ガイド、7 章 / 約 60 分)",
      "1. tsconfig と strict / 2. 型システムの基礎 / 3. 関数とジェネリクス / 4. オブジェクト型操作 / 5. 型ガードと Narrowing / 6. 非同期と Promise / 7. React/Next との実践",
      "Mapped Type / Conditional Type / Template Literal Type / Utility Types を実例で解説",
      "Server / Client Components の境界と Next.js 15+ の params (Promise) も実例付き",
      "TS Handbook / Total TypeScript / React TS Cheatsheet などの公式系リンク完備",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-26-c",
    date: "2026-05-26",
    title: "📚 Study Guide を 6 章 → 14 章に拡充 (Ruby 7 + JS 7)",
    badge: "content",
    highlights: [
      "💎 Ruby 入門: +4 章 (例外処理 / メタプログラミング / テスト / Gem と Bundler)",
      "🟨 Modern JavaScript: +4 章 (配列とイテレーション / オブジェクトとクラス / ESM モジュール / TypeScript への橋渡し)",
      "各章 5〜10 分の読了時間、学習目標 3 つ、コード例 3 節、要点まとめ、関連クイズへのリンク付き",
      "公式リファレンス (Ruby docs / MDN / TS Handbook 等) へのリンクで深堀り導線",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-26-b",
    date: "2026-05-26",
    title: "🛠️ CRUD 実践課題を 3 つ追加 (認証 / アップロード / API)",
    badge: "feat",
    highlights: [
      "🔐 認証付きブログ — Devise + Pundit で『所有者だけ編集可能』と認可の境界を体験 (6 steps / 120 分)",
      "🖼️ フォトギャラリー — Active Storage で画像アップロード、variant、複数添付、本番 S3 (6 steps / 100 分)",
      "🔌 JSON API + RSpec — API モード + Bearer 認証 + Request Spec で全シナリオカバー (6 steps / 120 分)",
      "既存の Rails ToDo CRUD と合わせて 計 4 課題、推奨順は学習ロードマップで案内",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-26-a",
    date: "2026-05-26",
    title: "🗺️ 学習ロードマップ + 🔍 横断検索 (Cmd+K)",
    badge: "feat",
    highlights: [
      "新ページ `/roadmap` — ゼロから Rails 中級者までの 18 ステップ・8 フェーズ推奨学習順",
      "進捗バー表示 (LocalStorage の正解履歴と連動、ステップ別 + 全体)",
      "Cmd+K (Mac) / Ctrl+K (Win) で全 149 問 + 参考書 6 章 + CRUD 課題 8 ステップ + カテゴリを横断検索",
      "ヘッダーに 🔍 検索ボタンと「ロードマップ」ナビを追加",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-j",
    date: "2026-05-25",
    title: "🎊 全 149 問の解説拡充が完了 — Practical pr-006〜012 (最終 PR)",
    badge: "content",
    highlights: [
      "pr-006 (scope) / pr-007 (RESTful Controller) / pr-008 (Service Object) / pr-009 (JSON API) / pr-010 (ActiveJob) / pr-011 (API 認証) / pr-012 (メタプロ DSL)",
      "practical カテゴリ完走 + 全 149 問の解説拡充プロジェクトが完了 🎉🎉🎉",
      "ruby-basics 30 / rails-convention 10 / active-record 23 / routing-controller 12 / ruby-oop 12 / collections 16 / ruby-advanced 22 / code-reading 12 / practical 12 = 149/149 (100%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-i",
    date: "2026-05-25",
    title: "Practical カテゴリの解説拡充スタート (pr-001〜005)",
    badge: "content",
    highlights: [
      "pr-001 (FizzBuzz) / pr-002 (配列集計 stats) / pr-003 (CSV パーサ) / pr-004 (Rails User-Post モデル設計) / pr-005 (N+1 解消)",
      "実践的なコーディング演習を解説で深掘り",
      "進捗: 142/149 問 (95%) — あと 7 問で完走",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-h",
    date: "2026-05-25",
    title: "🎉 Code Reading カテゴリ完走 — cr-011〜012 (Phase 3)",
    badge: "content",
    highlights: [
      "cr-011 (super + Mixin の祖先チェーン) / cr-012 (メソッド末尾 rescue で複数例外振り分け)",
      "code-reading カテゴリ全 12 問の解説拡充が完了",
      "進捗: 137/149 問 (92%) — 残り practical 12 問のみ",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-g",
    date: "2026-05-25",
    title: "Code Reading cr-006〜010 の解説拡充 (Phase 2)",
    badge: "content",
    highlights: [
      "cr-006 (super チェーン) / cr-007 (メソッドチェーン読解) / cr-008 (||= の落とし穴) / cr-009 (sort_by 降順 + Top N) / cr-010 (ネスト each = 直積)",
      "メソッドチェーン読解と Ruby のイディオム理解を深掘り",
      "進捗: 135/149 問 (91%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-f",
    date: "2026-05-25",
    title: "Code Reading カテゴリの解説拡充スタート (cr-001〜005)",
    badge: "content",
    highlights: [
      "cr-001 (each_with_object 条件 push) / cr-002 (キーワード引数) / cr-003 (Hash の reduce + 分解代入) / cr-004 (クラス変数 @@) / cr-005 (each_with_index)",
      "コード読解力を養うトレース演習",
      "進捗: 130/149 問 (87%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-e",
    date: "2026-05-25",
    title: "🎉 Ruby Advanced カテゴリ完走 — adv-021〜022 (Phase 5)",
    badge: "content",
    highlights: [
      "adv-021 (Fiber と Async) / adv-022 (文字列エンコーディング)",
      "ruby-advanced カテゴリ全 22 問の解説拡充が完了",
      "進捗: 128/149 問 (86%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-d",
    date: "2026-05-25",
    title: "Ruby Advanced adv-016〜020 の解説拡充 (Phase 4)",
    badge: "content",
    highlights: [
      "adv-016 (send vs public_send) / adv-017 (特異メソッド) / adv-018 (Concern パターン) / adv-019 (ネスト case/in) / adv-020 (Refinements)",
      "Ruby メタプログラミングの応用 (DSL・Concern・パターンマッチ・スコープ限定パッチ)",
      "進捗: 126/149 問 (85%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-c",
    date: "2026-05-25",
    title: "Ruby Advanced adv-011〜015 の解説拡充 (Phase 3)",
    badge: "content",
    highlights: [
      "adv-011 (&blk でブロック受け取り) / adv-012 (モンキーパッチ) / adv-013 (Ruby の GC) / adv-014 (case/in パターンマッチング) / adv-015 (instance_eval)",
      "Ruby のメタプログラミングと最新機能 (Ruby 3.0+ パターンマッチ) を深掘り",
      "進捗: 121/149 問 (81%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-b",
    date: "2026-05-25",
    title: "Ruby Advanced adv-006〜010 の解説拡充 (Phase 2)",
    badge: "content",
    highlights: [
      "adv-006 (method_missing) / adv-007 (define_method) / adv-008 (Enumerator) / adv-009 (Module の特異メソッド) / adv-010 (クロージャ)",
      "Ruby メタプログラミングの中核を実例で深掘り",
      "進捗: 116/149 問 (78%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-25-a",
    date: "2026-05-25",
    title: "Ruby Advanced カテゴリの解説拡充スタート (adv-001〜005)",
    badge: "content",
    highlights: [
      "adv-001 (yield とブロック) / adv-002 (Proc vs Lambda) / adv-003 (raise/rescue) / adv-004 (ensure) / adv-005 (Symbol#to_proc)",
      "Ruby のメタプログラミング基礎と例外処理を深掘り",
      "進捗: 111/149 問 (74%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-z",
    date: "2026-05-24",
    title: "🎉 Collections カテゴリ完走 — col-011〜016 (Phase 3)",
    badge: "content",
    highlights: [
      "col-011 (zip) / col-012 (Range と Enumerable) / col-013 (Hash.new(0) と頻度カウント) / col-014 (sort_by + Schwartzian Transform) / col-015 (flatten / flat_map) / col-016 (each_with_object vs inject)",
      "collections カテゴリ全 16 問の解説拡充が完了",
      "進捗: 106/149 問 (71%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-y",
    date: "2026-05-24",
    title: "Collections col-006〜010 の解説拡充 (Phase 2)",
    badge: "content",
    highlights: [
      "col-006 (to_h と Hash 変換) / col-007 (each_slice vs each_cons) / col-008 (reverse) / col-009 (group_by + tally) / col-010 (each vs map)",
      "コレクション操作の組み合わせと使い分けを実例ベースで深掘り",
      "collections 進捗 10/16",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-x",
    date: "2026-05-24",
    title: "Collections カテゴリの解説拡充スタート (col-001〜005)",
    badge: "content",
    highlights: [
      "col-001 (map) / col-002 (Hash#fetch) / col-003 (select vs filter vs reject) / col-004 (sum) / col-005 (inject/reduce)",
      "Ruby のコレクション操作の核となる Enumerable メソッドを実例で深掘り",
      "進捗: 95/149 問 (64%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-w",
    date: "2026-05-24",
    title: "🎉 Ruby OOP カテゴリ完走 — oop-011〜012 (Phase 3)",
    badge: "content",
    highlights: [
      "oop-011 (self の文脈別意味) / oop-012 (attr_accessor vs Struct の使い分け)",
      "ruby-oop カテゴリ全 12 問の解説拡充が完了",
      "進捗: 90/149 問 (60%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-v",
    date: "2026-05-24",
    title: "Ruby OOP oop-006〜010 の解説拡充 (Phase 2)",
    badge: "content",
    highlights: [
      "oop-006 (include/prepend/extend の挿入位置) / oop-007 (def self) / oop-008 (private の真の意味) / oop-009 (Comparable + <=>) / oop-010 (Struct と Data)",
      "Ruby のメタプログラミング基礎と Mixin の使い分けを深掘り",
      "ruby-oop 進捗 10/12",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-u",
    date: "2026-05-24",
    title: "Ruby OOP カテゴリの解説拡充スタート (oop-001〜005)",
    badge: "content",
    highlights: [
      "oop-001 (attr_accessor) / oop-002 (initialize) / oop-003 (継承構文 `<`) / oop-004 (super の 3 パターン) / oop-005 (Module の用途)",
      "Ruby のオブジェクト指向の基礎と他言語との対比を整理",
      "進捗: 83/149 問 (56%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-t",
    date: "2026-05-24",
    title: "🎉 Routing/Controller カテゴリ完走 — rt-011〜012 (Phase 3)",
    badge: "content",
    highlights: [
      "rt-011 (Rails 7 Turbo と unprocessable_entity) / rt-012 (rescue_from)",
      "routing-controller カテゴリ全 12 問の解説拡充が完了",
      "進捗: 78/149 問 (52%)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-s",
    date: "2026-05-24",
    title: "Routing/Controller rt-006〜010 の解説拡充 (Phase 2)",
    badge: "content",
    highlights: [
      "rt-006 (ネストリソース + shallow) / rt-007 (URL Helper) / rt-008 (namespace vs scope) / rt-009 (rails routes) / rt-010 (render と DoubleRenderError)",
      "実務でルーティング設計するときの選択肢と落とし穴を深掘り",
      "Routing/Controller 進捗 10/12 (残り 2 問で完走)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-r",
    date: "2026-05-24",
    title: "Routing/Controller カテゴリの解説拡充スタート (rt-001〜005)",
    badge: "content",
    highlights: [
      "rt-001 (resources の 7 アクション) / rt-002 (params) / rt-003 (redirect_to vs render) / rt-004 (before_action) / rt-005 (Strong Parameters と Mass Assignment 対策)",
      "RESTful 設計・PRG パターン・セキュリティ脆弱性対策を実例で深掘り",
      "残り 7 問は順次拡充",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-q",
    date: "2026-05-24",
    title: "🎉 ActiveRecord カテゴリ完走 — ar-021〜023 (Phase 5)",
    badge: "content",
    highlights: [
      "ar-021 (has_many :through オプション) / ar-022 (transaction の挙動) / ar-023 (joins + group + count 集計)",
      "ActiveRecord 全 23 問の解説拡充が完了",
      "次は ruby-oop / routing-controller / collections / ruby-advanced / code-reading / practical の中から進めます",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-p",
    date: "2026-05-24",
    title: "ActiveRecord ar-016〜020 の解説拡充 (Phase 4)",
    badge: "content",
    highlights: [
      "ar-016 (dependent: destroy vs delete_all) / ar-017 (複合 unique = validation + DB INDEX) / ar-018 (本番マイグレーション運用) / ar-019 (pluck と AR インスタンス生成コスト) / ar-020 (find_or_create_by と race condition)",
      "本番運用で必ず踏むハマりポイントを解説に組み込み",
      "ActiveRecord 進捗 20/23 (残り 3 問で完走)",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-o",
    date: "2026-05-24",
    title: "ActiveRecord ar-011〜015 の解説拡充 (Phase 3)",
    badge: "content",
    highlights: [
      "ar-011 (create vs create!) / ar-012 (update_all のスキップ機構) / ar-013 (多対多: through vs HABTM) / ar-014 (count vs size vs length) / ar-015 (Optimistic Locking)",
      "実務でハマりやすい『裏側の挙動』を中心に深掘り",
      "ActiveRecord 進捗 15/23",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-n",
    date: "2026-05-24",
    title: "ActiveRecord ar-006〜010 の解説拡充 (Phase 2)",
    badge: "content",
    highlights: [
      "ar-006 (validates) / ar-007 (scope) / ar-008 (save vs save!) / ar-009 (where と SQL Injection 対策) / ar-010 (callbacks)",
      "バリデーション・クエリ DSL・トランザクション・ライフサイクルフックの中核を実例ベースで深掘り",
      "ActiveRecord 進捗 10/23",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-m",
    date: "2026-05-24",
    title: "ActiveRecord カテゴリの解説拡充スタート (ar-001〜005)",
    badge: "content",
    highlights: [
      "ar-001 (has_many) / ar-002 (find vs find_by) / ar-003 (find_each で OOM 回避) / ar-004 (N+1 と includes/preload/eager_load) / ar-005 (マイグレーション命名)",
      "Rails 開発の心臓部 ActiveRecord の重要トピックを実例付きで深掘り",
      "残り 18 問 (ar-006〜023) は順次拡充",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-l",
    date: "2026-05-24",
    title: "🎉 Rails 規約カテゴリ完走 — rails-006〜010 (Phase 2)",
    badge: "content",
    highlights: [
      "rails-006 (Service Object / Concerns / lib) / rails-007 (Rails.env) / rails-008 (Zeitwerk) / rails-009 (本番 console) / rails-010 (Encrypted Credentials)",
      "rails-convention カテゴリ全 10 問の拡充が完了",
      "次は active-record (23 問) または ruby-oop (12 問) に着手予定",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-k",
    date: "2026-05-24",
    title: "Rails 規約カテゴリの解説拡充スタート (rails-001〜005)",
    badge: "content",
    highlights: [
      "rails-001 (テーブル名規約) / rails-002 (MVC) / rails-003 (コントローラ命名) / rails-004 (CoC) / rails-005 (app/helpers)",
      "Rails の中心思想 (Convention over Configuration) と命名規則を実例ベースで深掘り",
      "残り 5 問は次の PR で完了予定",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-j",
    date: "2026-05-24",
    title: "🎉 Ruby 基礎 30 問すべての解説拡充が完了 (Phase 6)",
    badge: "content",
    highlights: [
      "rb-026 (ENV) / rb-027 (rescue スコープ) / rb-028 (StandardError) / rb-029 (文字列スライス) / rb-030 (times)",
      "ruby-basics カテゴリの 30 問すべてに『噛み砕き / 自己説明 4 構造 / 選択肢解説 / 公式リンク』が揃いました",
      "次は別カテゴリ (rails-convention や active-record など) のコンテンツ拡充に着手予定",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-i",
    date: "2026-05-24",
    title: "Ruby 基礎 rb-021〜025 の解説拡充 (Phase 5)",
    badge: "content",
    highlights: [
      "rb-021 (strip) / rb-022 (split + map) / rb-023 (Date 加算) / rb-024 (Time.now vs Time.current) / rb-025 (File.open ブロック形式)",
      "文字列正規化・コレクション操作・日時・ファイル I/O の実務頻出パターンを深掘り",
      "残り 5 問 (rb-026〜030) は次の PR で ruby-basics 完走予定",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-h",
    date: "2026-05-24",
    title: "Ruby 基礎 rb-016〜020 の解説拡充 (Phase 4)",
    badge: "content",
    highlights: [
      "rb-016 (== vs equal?) / rb-017 (tap) / rb-018 (dup vs clone) / rb-019 (正規表現 $~ と $1) / rb-020 (String#scan)",
      "Ruby の等価判定 3 段階・複製の浅さ深さ・正規表現の特殊変数まで踏み込んだ解説",
      "残り 10 問 (rb-021〜rb-030) は次の PR から順次拡充",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-g",
    date: "2026-05-24",
    title: "Ruby 基礎 rb-011〜015 の解説拡充 (Phase 3)",
    badge: "content",
    highlights: [
      "rb-011 (unless) / rb-012 (ぼっち演算子 &.) / rb-013 (型混在と TypeError) / rb-014 (定数の慣習) / rb-015 (配列 + と <<)",
      "各問に『噛み砕き / 自己説明 4 構造 / 選択肢解説 / 公式リンク』を追加",
      "残り 15 問 (rb-016〜rb-030) は次の PR から順次拡充",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-f",
    date: "2026-05-24",
    title: "Ruby 基礎 rb-006〜010 の解説拡充 (Phase 2)",
    badge: "content",
    highlights: [
      "rb-006 (upcase) / rb-007 (式展開) / rb-008 (respond_to?) / rb-009 (to_s) / rb-010 (デフォルト引数)",
      "各問に『噛み砕き説明 / 4 ブロックの自己説明模範 / 選択肢ごとの解説 / 公式リンク』を追加",
      "残り 20 問は次の PR から順次拡充",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-e",
    date: "2026-05-24",
    title: "クイズ解説の拡充スタート (Ruby 基礎 rb-001〜005)",
    badge: "content",
    highlights: [
      "💡『もっと噛み砕いて読む』トグルを解説カードに追加 (わからない人向け説明)",
      "選択肢ごとに『なぜこれが正解 / なぜこれは違うか』のアコーディオン",
      "🗣️ 自己説明の模範解答を『結論 → 理由 → たとえば → 落とし穴』の 4 ブロック構造に",
      "公式リンクは『公式』バッジ付きで強調表示",
      "まず Ruby 基礎の rb-001〜rb-005 に上記すべてを反映 (公式ガイドのリンク追加)",
      "残り 25 問は次の PR から数問ずつ拡充予定",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-d",
    date: "2026-05-24",
    title: "お知らせページ + 保存 UX 改善 + 写経モード拡張",
    badge: "feat",
    highlights: [
      "🆕 ヘッダーに『お知らせ』アイコン + 新着があれば赤ドット",
      "💾 ジャーナルの保存が「保存しました」カードで明確に",
      "🗂️ 保存した自己説明を `/explanations` で一覧表示できるように",
      "✍️ 写経モードを CRUD ステップのコマンド例にも展開",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pulls",
  },
  {
    version: "2026-05-24-c",
    date: "2026-05-24",
    title: "写経モード — お手本を 1 行ずつタイプして判定",
    badge: "feat",
    highlights: [
      "CRUD ステップと Study Guide の章で、サンプルコードを 1 行ずつ写経",
      "行単位の一致判定 + 進捗バー + 入力中行ハイライト",
      "💡 ヒント (1 文字) ボタン + リセット + 自動保存 (LocalStorage)",
      "完了で 🎉 祝福カード → 口頭説明 → ジャーナル → クイズの動線",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pull/8",
  },
  {
    version: "2026-05-24-b",
    date: "2026-05-24",
    title: "目次 / ステップ一覧を「押せるボタン」感のあるカードへ",
    badge: "ui",
    highlights: [
      "番号バッジを塗りのグラデーション + サイズアップ",
      "右側に「読む →」「開く →」CTA チップ追加",
      "hover で浮く + 影が強くなる + active で押し込み",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pull/7",
  },
  {
    version: "2026-05-24-a",
    date: "2026-05-24",
    title: "Study Guide + CRUD 実践課題 + 11 Track 適正化",
    badge: "feat",
    highlights: [
      "📚 参考書 — Ruby/JS 入門ガイド (各 3 章)",
      "🛠️ Rails ToDo CRUD 課題 (8 ステップ, 約 90 分)",
      "Track を整理して 11 種類に (Git / Security / Linux を独立)",
      "🛡️ postcss の moderate XSS 脆弱性 (GHSA-qx2v-qp2m-jg93) を修正",
      "フッターの旧名 RubyDojo → CodeDojo に修正",
    ],
    prUrl: "https://github.com/naganobol6212/ruby_on_rails_quiz/pull/6",
  },
];

export const latestVersion = (): string => changelog[0]?.version ?? "";

export const BADGE_META: Record<
  ChangelogBadge,
  { label: string; cls: string }
> = {
  feat: {
    label: "新機能",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  fix: {
    label: "修正",
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  ui: {
    label: "UI 改善",
    cls: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  content: {
    label: "コンテンツ",
    cls: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
};

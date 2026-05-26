import type { Guide } from "./types";

export const dbDesignIntroGuide: Guide = {
    id: "db-design-intro",
    trackId: "db-design",
    title: "DB 設計の地図 — 正規化からスキーマ進化まで",
    subtitle:
      "ER モデリング → 正規化 → PK/FK → リレーション設計パターン → INDEX 設計 → マイグレーション運用 (ZDD) → アンチパターン、を 7 章で",
    audience:
      "SQL は書けるが ER 設計 / 正規化 / 命名 / FK / マイグレーション運用 でフワッとしている人、本番テーブルに ALTER したくない人、polymorphic / EAV で迷子の人",
    sources: [
      { label: "SQL アンチパターン (Bill Karwin、書籍)", url: "https://www.oreilly.co.jp/books/9784873115894/" },
      { label: "PostgreSQL 公式 — Data Modeling", url: "https://www.postgresql.org/docs/current/ddl.html" },
      { label: "strong_migrations (Rails)", url: "https://github.com/ankane/strong_migrations" },
    ],
    emoji: "🗂️",
    relatedCategoryIds: ["db-design", "sql-basics", "sql-joins"],
    chapters: [
      {
        id: "er-and-normalization",
        title: "1. ER モデリングと正規化の基礎",
        intro:
          "DB 設計は『エンティティを抽出し、属性とリレーションで表現する』作業。1NF / 2NF / 3NF / BCNF を整理しつつ、現代の実務では 3NF 〜 BCNF を目指す。",
        readingMinutes: 8,
        objectives: [
          "Entity / Attribute / Relationship の関係を ER 図で書ける",
          "1NF / 2NF / 3NF の違いと更新異常 (update anomaly) の防止を説明できる",
          "意図的な非正規化が許されるケースを判断できる",
        ],
        sections: [
          {
            heading: "1.1 ER モデリング — Entity / Attribute / Relationship",
            body: "**Entity** はデータの主体 (User / Post / Order)、**Attribute** はその属性 (name / email / created_at)、**Relationship** はエンティティ間の関連 (User ─ has many ─ Posts)。最初は『業務の名詞を書き出す → 関係を矢印で結ぶ』のスケッチから。Mermaid の `erDiagram` でレビューに使いやすい。",
            code: "// 業務要件 → ER スケッチ\n// 『ユーザーは複数の投稿を持ち、投稿は複数のタグを持つ』\n// User --< Post >-- Tag (N:N 中間)",
            language: "text",
            diagram: `erDiagram
  USER ||--o{ POST : "has many"
  POST }o--o{ TAG  : "has many through post_tags"
  USER {
    bigint id PK
    text   email UK
    text   name
    timestamptz created_at
  }
  POST {
    bigint id PK
    bigint user_id FK
    text   title
    timestamptz published_at
  }
  TAG {
    bigint id PK
    text   name UK
  }
  POST_TAGS {
    bigint post_id FK
    bigint tag_id FK
  }
  POST ||--o{ POST_TAGS : ""
  TAG  ||--o{ POST_TAGS : ""`,
            diagramCaption: "ER 図の例: User 1:N Post、Post N:N Tag (中間テーブル POST_TAGS)",
            notes: [
              "ER は Conceptual (業務概念) → Logical (正規化済) → Physical (RDB 固有の型 / INDEX) の順で詳細化",
              "命名: PK = id (BIGINT or UUID)、外部キー = `<table_singular>_id` (user_id / post_id)",
            ],
          },
          {
            heading: "1.2 正規化 — 1NF / 2NF / 3NF",
            body: "**1NF**: セルは atomic (1 セル 1 値、繰り返し列なし)。**2NF**: 1NF + 部分関数従属がない (複合 PK の一部にだけ依存する属性を分離)。**3NF**: 2NF + 推移的従属がない (非キー → 非キーの連鎖を排除)。実務では『単一 PK + 3NF』が標準的なゴール。",
            code: "-- ❌ 1NF 違反 (繰り返し / 配列を 1 セルに)\npost(id, title, tags)         -- tags='ruby,rails,sql'\n\n-- ✅ 1NF (タグは別テーブル)\npost(id, title)\ntag(id, name)\npost_tags(post_id, tag_id)\n\n-- ❌ 2NF 違反 (複合 PK の一部にだけ依存)\norder_items(order_id, product_id, quantity, product_name)\n--                                              ^ product_id にだけ依存\n\n-- ✅ 2NF\norder_items(order_id, product_id, quantity)\nproducts(id, name)\n\n-- ❌ 3NF 違反 (推移的従属: id → department_id → department_name)\nemployees(id, name, department_id, department_name, department_floor)\n\n-- ✅ 3NF\nemployees(id, name, department_id)\ndepartments(id, name, floor)",
            language: "sql",
            notes: [
              "正規化の真の目的は『更新異常 (update anomaly) の防止』 — 同じ値が複数行にあると変更時の不整合リスク",
              "BCNF: 3NF より厳しい (全関数従属で左辺が候補キー)。実務では 3NF と区別しにくい場面が多い",
            ],
          },
          {
            heading: "1.3 意図的な非正規化 — 性能のためのトレードオフ",
            body: "厳密な正規化は『書き込み時の整合性 ◎、読み込み時に JOIN コスト ▲』。読み多 / 書き少のユースケースで意図的に冗長を入れる: **キャッシュカラム** (`posts.comment_count`)、**マテリアライズドビュー**、**集計テーブル**、**JSONB に小さなネストを入れる**。代わりに整合性は別途担保 (counter_culture gem、定期 batch、トリガー)。",
            code: "-- 例: counter cache\nCREATE TABLE users (id BIGINT PRIMARY KEY, post_count INT NOT NULL DEFAULT 0);\n\n-- 投稿追加時に user.post_count を +1 (Rails counter_cache)\nclass Post < ApplicationRecord\n  belongs_to :user, counter_cache: true   -- users.posts_count を自動更新\nend\nclass User < ApplicationRecord\n  has_many :posts\nend\n# users カラムは posts_count (Rails の規約)\n\n-- 例: マテリアライズドビュー (PostgreSQL)\nCREATE MATERIALIZED VIEW monthly_sales AS\nSELECT DATE_TRUNC('month', created_at) AS month,\n       SUM(amount) AS total\nFROM orders\nGROUP BY DATE_TRUNC('month', created_at);\nCREATE INDEX ON monthly_sales(month);\n\n-- 定期リフレッシュ (cron / sidekiq scheduled)\nREFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;\n\n-- 例: 小規模ネストは JSONB で OK\nCREATE TABLE products (\n  id BIGINT PRIMARY KEY,\n  name TEXT,\n  attributes JSONB DEFAULT '{}'    -- 大量に増えない / クエリ少ない属性\n);",
            language: "sql",
            notes: [
              "『性能のために非正規化』は計測してから — 推測で冗長カラムを増やすと整合性が崩れる",
              "counter_cache の整合性は Rails の after_create / destroy フックに依存 — 直接 SQL 操作するとズレる",
            ],
          },
        ],
        keyTakeaways: [
          "Entity / Attribute / Relationship から ER 図で設計を可視化、レビューしやすく",
          "1NF (atomic) → 2NF (部分従属なし) → 3NF (推移従属なし)、実務は 3NF が標準ゴール",
          "正規化の目的は更新異常の防止、非正規化は『計測してから』",
        ],
        comprehensionQuestionIds: ["db-001", "db-002"],
      },
      {
        id: "primary-and-foreign-keys",
        title: "2. 主キーと外部キー設計 — surrogate / UUID / FK 制約",
        intro:
          "代理キー (surrogate key) vs 自然キー (natural key)、BIGINT vs UUID、FK 制約の貼り方と ON DELETE 戦略を整理。",
        readingMinutes: 9,
        objectives: [
          "Surrogate key を PK に使う理由を説明できる",
          "BIGINT / UUID v4 / UUID v7 / ULID の使い分けを判断できる",
          "FOREIGN KEY 制約と ON DELETE CASCADE / SET NULL / RESTRICT を書ける",
        ],
        sections: [
          {
            heading: "2.1 代理キー (surrogate) vs 自然キー (natural)",
            body: "**Surrogate key**: 業務的意味のない単なる識別子 (auto-increment ID、UUID)。**Natural key**: 業務上一意な値 (email、商品コード、ISBN)。実務は『PK は surrogate、業務的一意値は UNIQUE 制約付きの別カラム』が圧倒的に多い。理由: natural key は変わる (email 変更 / 会社統合)、長い (URL 公開時に重い)、漏洩リスク。",
            code: "-- ❌ Natural key を PK (email 変更で全 FK 連鎖更新)\nCREATE TABLE users (\n  email TEXT PRIMARY KEY,\n  name TEXT\n);\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_email TEXT REFERENCES users(email)   -- email 変更で多数行 UPDATE\n);\n\n-- ✅ Surrogate + UNIQUE\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,\n  email TEXT UNIQUE NOT NULL,                -- 一意性は維持\n  name TEXT\n);\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL REFERENCES users(id)\n);\n-- → email が変わっても posts 側は何も触らない",
            language: "sql",
            notes: [
              "Rails 5+ は BIGINT がデフォルト PK (旧 INT は 21 億件で枯渇)",
              "ISBN や VIN (車両識別番号) は 'natural key っぽいが組織で発行される番号' — それでも PK には surrogate を推奨",
            ],
          },
          {
            heading: "2.2 BIGINT vs UUID — どっちを PK に？",
            body: "**BIGINT**: 短い (8 byte)、人間にも読みやすい、連番でデバッグしやすい、JOIN 高速。**UUID v4** (完全ランダム): 衝突しない / 分散 ID 生成 OK だが B-Tree ページ分割で挿入性能が劣化。**UUID v7 / ULID**: 時系列順 + ランダム、両方の利点。BIGINT 連番 + UUID 公開列の併用も実用的。",
            code: "-- 一般的: BIGINT 連番 PK\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,\n  ...\n);\n\n-- 分散 / 公開 URL に使う: UUID v7 (時系列順)\nCREATE TABLE posts (\n  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),   -- 拡張で生成\n  ...\n);\n\n-- 折衷案: 内部は BIGINT、公開は UUID (推奨)\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,\n  public_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),\n  ...\n);\n-- 内部 JOIN は BIGINT (速い)、公開 URL は public_id (推測されない)\n\n-- Rails (UUID PK)\n# config/initializers/...\nclass CreatePosts < ActiveRecord::Migration[7.1]\n  def change\n    create_table :posts, id: :uuid do |t|\n      t.references :user, null: false, foreign_key: true, type: :uuid\n      ...\n    end\n  end\nend",
            language: "sql",
            diagram: `flowchart TB
  BIGINT["BIGINT 連番<br/>1, 2, 3, ..."]:::good
  V4["UUID v4<br/>完全ランダム"]:::bad
  V7["UUID v7 / ULID<br/>時刻 + ランダム"]:::good

  BIGINT --> P1["✅ 8 byte<br/>✅ 連番でデバッグ容易<br/>✅ B-Tree 末尾追記で高速<br/>❌ 推測されやすい<br/>❌ 分散 ID 生成困難"]:::note
  V4 --> P2["❌ 16 byte<br/>❌ B-Tree ページ分割<br/>❌ 書き込み性能劣化<br/>✅ 完全分散・衝突なし<br/>✅ 推測されない"]:::note
  V7 --> P3["✅ 16 byte<br/>✅ 時系列順で高速<br/>✅ 分散 ID 生成<br/>✅ 推測されない<br/>△ 対応 lib が必要"]:::note

  classDef good fill:#dcfce7,stroke:#16a34a
  classDef bad fill:#fee2e2,stroke:#ef4444
  classDef note fill:#fef3c7,stroke:#f59e0b`,
            diagramCaption: "PK 選びの比較 — BIGINT / UUID v4 / UUID v7・ULID",
          },
          {
            heading: "2.3 FOREIGN KEY と ON DELETE 戦略",
            body: "FK は『参照先が存在する』を DB レベルで保証。`ON DELETE` で削除時の連鎖挙動を選ぶ: **CASCADE** (子も一緒に削除)、**SET NULL** (FK を NULL に)、**RESTRICT** / **NO ACTION** (子があれば削除拒否)。Rails の `dependent: :destroy` (アプリ層) と DB の `ON DELETE` (DB 層) は別物 — 両方理解して使う。",
            code: "-- CASCADE: 親を消すと子も消える (Post を消すと Comment も)\nCREATE TABLE comments (\n  id BIGINT PRIMARY KEY,\n  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,\n  body TEXT\n);\n\n-- SET NULL: 親を消すと FK を NULL に (User 退会で投稿は残す)\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,\n  -- user_id NULL 許可必須\n  title TEXT\n);\n\n-- RESTRICT: 子があれば親の削除を拒否 (デフォルト)\nCREATE TABLE order_items (\n  id BIGINT PRIMARY KEY,\n  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE RESTRICT\n);\n-- order に items があれば DELETE orders で例外\n\n-- Rails (migration)\nadd_reference :comments, :post, null: false, foreign_key: { on_delete: :cascade }\nadd_reference :posts, :user, foreign_key: { on_delete: :nullify }\n\n# モデル側\nclass Post < ApplicationRecord\n  has_many :comments, dependent: :destroy   -- アプリ層 (callback 走らせる)\n  # dependent: :delete_all                  -- callback 走らせない (高速、注意)\nend",
            language: "sql",
            notes: [
              "FK には自動で INDEX が貼られない (PG) — 別途 `CREATE INDEX` 推奨 (JOIN / 参照削除で必要)",
              "dependent: :destroy は callback を走らせる (重いが安全)、:delete_all は callback スキップ",
              "Rails の `foreign_key: true` は migration で FK 制約を生成、それと別に index も貼る",
            ],
          },
        ],
        keyTakeaways: [
          "PK は surrogate (BIGINT or UUID v7/ULID)、自然キーは UNIQUE 制約付きの別カラム",
          "BIGINT がデフォルト、URL 公開 / 分散には UUID v7 / ULID、UUID v4 は B-Tree 劣化",
          "FOREIGN KEY + ON DELETE CASCADE/SET NULL/RESTRICT で DB レベルの整合性、FK には INDEX も別途",
        ],
        comprehensionQuestionIds: ["db-003", "db-004", "db-017"],
      },
      {
        id: "relation-patterns",
        title: "3. リレーション設計パターン — 1:1 / 1:N / N:N / polymorphic",
        intro:
          "リレーションの 4 大パターンを実例で。N:N の中間テーブル、ポリモーフィック関連の使いどころと FK 整合性の代替策。",
        readingMinutes: 9,
        objectives: [
          "1:1 / 1:N / N:N / ポリモーフィックを判別できる",
          "中間テーブルを (post_id, tag_id) 複合 PK か別途 id + UNIQUE で設計できる",
          "ポリモーフィック関連の代替案 (専用テーブル / STI / GraphQL union) を比較できる",
        ],
        sections: [
          {
            heading: "3.1 1:1 — オプショナルな拡張属性",
            body: "ユーザーとプロフィール (詳細情報) を分けたい時など。**FK + UNIQUE 制約** で 1:1 を表現。あまり頻繁ではない情報、TEXT が大量の場合、Auth 用 / Profile 用の分離などで使う。1:0..1 (オプショナル 1:1) も同パターン。",
            code: "-- users + profiles (1:1 オプショナル)\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL\n);\nCREATE TABLE user_profiles (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  bio TEXT,\n  avatar_url TEXT,\n  twitter_handle TEXT\n);\n-- UNIQUE (user_id) で 1:1 を強制\n\n-- Rails\nclass User < ApplicationRecord\n  has_one :user_profile, dependent: :destroy\nend\nclass UserProfile < ApplicationRecord\n  belongs_to :user\nend\n\n-- 使い分け\n-- 1:1 が常に必要 → 同じテーブルに統合 (users に bio カラム)\n-- オプショナル / 大量 TEXT / 別アクセス権限 → 別テーブル",
            language: "sql",
          },
          {
            heading: "3.2 1:N — N 側に FK",
            body: "User 1 : N Posts の典型。**N 側 (posts) に user_id を持たせる**。FK + NOT NULL (所有が必須なら) + INDEX。Rails では `belongs_to :user` (N 側) と `has_many :posts` (1 側)。",
            code: "CREATE TABLE users (id BIGINT PRIMARY KEY, name TEXT);\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  title TEXT NOT NULL\n);\nCREATE INDEX idx_posts_user_id ON posts(user_id);\n\n-- Rails\nclass User < ApplicationRecord\n  has_many :posts, dependent: :destroy\nend\nclass Post < ApplicationRecord\n  belongs_to :user\nend\n\n-- ❌ N:1 を逆向きに表現 (users.post_ids INT[])\nALTER TABLE users ADD COLUMN post_ids BIGINT[];\n-- 配列で持つと FK 制約不可、逆引き遅い、JOIN 困難、集計困難\n-- → 必ず N 側に FK",
            language: "sql",
          },
          {
            heading: "3.3 N:N — 中間テーブル必須",
            body: "Post N : N Tags のように両方が複数を持つなら **中間テーブル** (join table / junction table)。複合 PK `(post_id, tag_id)` で同組み合わせ重複を防ぐ。中間テーブルが『独立したエンティティ』に育つことが多い (memberships は role / joined_at を持つ) → 最初から id + UNIQUE で組むと拡張に強い。",
            code: "-- シンプルな N:N\nCREATE TABLE posts (id BIGINT PRIMARY KEY, title TEXT);\nCREATE TABLE tags  (id BIGINT PRIMARY KEY, name TEXT UNIQUE);\nCREATE TABLE post_tags (\n  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,\n  tag_id  BIGINT NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,\n  PRIMARY KEY (post_id, tag_id)\n);\nCREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);   -- 逆引き用\n\n-- 属性を持つ中間 (推奨、拡張に強い)\nCREATE TABLE memberships (\n  id BIGINT PRIMARY KEY,\n  team_id BIGINT NOT NULL REFERENCES teams(id),\n  user_id BIGINT NOT NULL REFERENCES users(id),\n  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),\n  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  UNIQUE (team_id, user_id)\n);\n\n-- Rails (has_many :through が推奨、has_and_belongs_to_many は属性を持てない)\nclass Post < ApplicationRecord\n  has_many :post_tags, dependent: :destroy\n  has_many :tags, through: :post_tags\nend\nclass Tag < ApplicationRecord\n  has_many :post_tags, dependent: :destroy\n  has_many :posts, through: :post_tags\nend\nclass PostTag < ApplicationRecord\n  belongs_to :post\n  belongs_to :tag\nend",
            language: "sql",
            diagram: `erDiagram
  POST  ||--o{ POST_TAG : ""
  TAG   ||--o{ POST_TAG : ""
  POST {
    bigint id PK
    text   title
  }
  TAG {
    bigint id PK
    text   name UK
  }
  POST_TAG {
    bigint post_id FK
    bigint tag_id FK
  }`,
            diagramCaption: "N:N は中間テーブル POST_TAG で表現 — 両者に FK + 複合 PK",
          },
          {
            heading: "3.4 ポリモーフィック関連 — 柔軟だが FK が貼れない",
            body: "コメントを Post / Photo / Video など複数の親に付けたい時の選択肢。`commentable_type` (型名文字列) + `commentable_id` (FK 相当) を持つ。柔軟だが **FK 制約が貼れない → 孤児レコード発生のリスク**。代替案も検討する。",
            code: "-- ポリモーフィック\nCREATE TABLE comments (\n  id BIGINT PRIMARY KEY,\n  commentable_type TEXT NOT NULL,    -- 'Post', 'Photo', 'Video'\n  commentable_id   BIGINT NOT NULL,\n  body TEXT,\n  user_id BIGINT REFERENCES users(id),\n  created_at TIMESTAMPTZ\n);\nCREATE INDEX idx_comments_commentable\n  ON comments(commentable_type, commentable_id);   -- 必須\n\n-- Rails\nclass Comment < ApplicationRecord\n  belongs_to :commentable, polymorphic: true\nend\nclass Post < ApplicationRecord\n  has_many :comments, as: :commentable, dependent: :destroy\nend\nclass Photo < ApplicationRecord\n  has_many :comments, as: :commentable, dependent: :destroy\nend\n\n-- ⚠️ 孤児レコード防止 (定期チェック)\n-- 親が destroy されても、Rails の dependent: :destroy が走らないコードパス\n-- (raw SQL DELETE 等) で残ることがある\nSELECT * FROM comments\nWHERE commentable_type = 'Post'\n  AND commentable_id NOT IN (SELECT id FROM posts);\n\n-- 代替案\n-- 1. 専用テーブル: post_comments / photo_comments\n--    → 別々の belongs_to、FK 制約 OK、複雑性増\n-- 2. STI (Single Table Inheritance): commentables 1 テーブルに type で分岐\n--    → JOIN が単純、列が多くなる\n-- 3. アプリ層の polymorphic: GraphQL union, Service object で分岐",
            language: "sql",
            notes: [
              "ポリモーフィックは便利だが安易に使うと『データ整合性は祈り頼み』に",
              "本当に多態性が必要か検討 — Comment 専用テーブルでも実装は組める",
              "type カラムは class 名そのまま (リネーム時に DB 更新が必要)",
            ],
          },
        ],
        keyTakeaways: [
          "1:1 は user_id UNIQUE で表現、1:N は N 側に FK + NOT NULL + INDEX",
          "N:N は中間テーブル — 複合 PK か id + UNIQUE、属性が育つなら memberships 型で",
          "ポリモーフィックは FK 不可 — 孤児チェックを定期実行、代替案 (専用テーブル / STI) も検討",
        ],
        comprehensionQuestionIds: ["db-006", "db-007", "db-008"],
      },
      {
        id: "indexes-and-naming",
        title: "4. INDEX 設計と命名規約 — 設計時から効かせる",
        intro:
          "テーブル設計の時点で INDEX を意識する。複合 INDEX の順序、UNIQUE / 部分 INDEX、命名・型選び (TEXT vs VARCHAR、DECIMAL vs FLOAT) を整理。",
        readingMinutes: 9,
        objectives: [
          "WHERE / JOIN / ORDER BY で使うカラムに INDEX を設計時から貼れる",
          "複合 INDEX の左端ルール / 部分 INDEX を理解する",
          "金額は DECIMAL、文字列は TEXT、命名は snake_case + 複数形などの慣習を守れる",
        ],
        sections: [
          {
            heading: "4.1 設計時に INDEX を貼るカラム",
            body: "**外部キー** (user_id, post_id 等)、**UNIQUE 制約** (自動)、**WHERE 高頻度** (status, deleted_at)、**ORDER BY** (created_at)、**JOIN 条件**。PostgreSQL は FK に自動 INDEX を貼らない (MySQL は貼る) — Rails の migration で `index: true` を明示。",
            code: "CREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL REFERENCES users(id),\n  status TEXT NOT NULL,\n  published_at TIMESTAMPTZ,\n  slug TEXT NOT NULL\n);\n\n-- 1. FK には必ず INDEX\nCREATE INDEX idx_posts_user_id ON posts(user_id);\n\n-- 2. URL / 一意な業務値\nCREATE UNIQUE INDEX idx_posts_slug ON posts(slug);\n\n-- 3. 一覧クエリ用の複合 INDEX (等値 → 範囲 → ORDER BY)\nCREATE INDEX idx_posts_status_published_at\n  ON posts(status, published_at DESC);\n-- WHERE status='published' ORDER BY published_at DESC が高速化\n\n-- Rails migration\nclass CreatePosts < ActiveRecord::Migration[7.1]\n  def change\n    create_table :posts do |t|\n      t.references :user, null: false, foreign_key: true   # FK + index 同時\n      t.string :status, null: false\n      t.timestamptz :published_at\n      t.string :slug, null: false\n      t.timestamps\n    end\n    add_index :posts, :slug, unique: true\n    add_index :posts, [:status, :published_at], order: { published_at: :desc }\n  end\nend",
            language: "sql",
            notes: [
              "INDEX を貼りすぎると INSERT / UPDATE が重くなる + ディスク増 → WHERE / JOIN / ORDER BY 実績ベースで",
              "複合 INDEX の順序は『等値 (=) → 範囲 (> < BETWEEN) → ORDER BY』が原則 (SQL ガイド 7 章を参照)",
            ],
          },
          {
            heading: "4.2 部分 INDEX と UNIQUE 制約の応用",
            body: "**部分 INDEX (PostgreSQL)**: `CREATE INDEX ... WHERE condition` で条件付きの INDEX。サイズが小さく、特定の検索に強い。ソフト削除と UNIQUE の組合せに必須。**Expression INDEX**: `CREATE INDEX ON users(LOWER(email))` で関数結果に INDEX。",
            code: "-- 公開済みの post だけに INDEX (サイズ小、検索高速)\nCREATE INDEX idx_posts_published\n  ON posts(published_at DESC)\n  WHERE published_at IS NOT NULL;\n\n-- ソフト削除 + UNIQUE\n-- 通常の UNIQUE だと『削除済み + 同 email の新規』が衝突\nCREATE UNIQUE INDEX idx_users_email_active\n  ON users(email)\n  WHERE deleted_at IS NULL;          -- 生存レコードだけ UNIQUE\n\n-- Expression INDEX (大文字小文字無視の検索)\nCREATE INDEX idx_users_lower_email ON users(LOWER(email));\n-- → WHERE LOWER(email) = 'a@x.com' で INDEX 使われる\n\n-- 複数カラムの式\nCREATE INDEX idx_users_full_name ON users((first_name || ' ' || last_name));\n\n-- Rails (migration)\nclass AddPartialIndexToUsers < ActiveRecord::Migration[7.1]\n  def change\n    add_index :users, :email, unique: true, where: 'deleted_at IS NULL'\n  end\nend",
            language: "sql",
            notes: [
              "MySQL は部分 INDEX が無いので、別カラムで実現 (deleted_at の代わりに 'active_email' を別途持つなど)",
              "INDEX 名は規約: `idx_<table>_<col1>_<col2>` / `<table>_<col>_unique` などチームで統一",
            ],
          },
          {
            heading: "4.3 命名規約 — snake_case + 複数形 + 共通サフィックス",
            body: "**テーブル名**: 複数形 snake_case (`users`, `order_items`)。**カラム名**: 単数 snake_case (`user_id`, `created_at`)。**外部キー**: `<table_singular>_id`。**Boolean**: `is_` / `has_` プレフィックス避けつつ、状態を表す動詞 (`active`, `published_at`)。**タイムスタンプ**: `_at` サフィックス (`created_at`, `published_at`)。**カウント**: `_count` サフィックス。",
            code: "-- ✅ 推奨\nusers, posts, order_items, post_tags\nid, user_id, post_id\ncreated_at, updated_at, published_at, deleted_at\nfollowers_count, posts_count\nemail, name, role, status\n\n-- ❌ よくある混乱\nUser, Posts                        -- PascalCase\nuserId, createdAt                  -- camelCase\nuser_email, user_password          -- テーブル名重複 (users.email で十分)\nemailAddress, emailAddrPlain       -- 縦割り型語彙\nbool_published, isPublished        -- prefix が冗長\nflag_active                        -- 'flag' が無意味\n\n-- 一貫したサフィックス\n_at      タイムスタンプ (TIMESTAMPTZ)\n_id      外部キー (BIGINT or UUID)\n_count   カウント\n_url     URL 文字列\n_path    ローカルパス\n_token   認証トークン (機密、filter_parameters)",
            language: "sql",
            notes: [
              "Rails の規約: テーブル `users` → モデル `User`、`user_id` → `belongs_to :user`、`created_at` → 自動更新",
              "予約語 (order, group, user 等) はクオート必要だが、避けるのが無難",
            ],
          },
          {
            heading: "4.4 適切なデータ型の選び方",
            body: "**整数**: BIGINT (Rails 5+ デフォルト、INT は 21 億で枯渇)。**文字列**: TEXT (PG では VARCHAR と性能同等、長さ制限なし)。**金額**: DECIMAL(10, 2) または整数 (cents)。**日時**: TIMESTAMPTZ (UTC + TZ 情報)。**Boolean**: BOOLEAN。**列挙**: TEXT + CHECK 制約 or ENUM 型。**JSON**: JSONB (PG、インデックス可能、推奨)。**UUID**: UUID 型。",
            code: "-- 推奨型\nCREATE TABLE orders (\n  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,\n  user_id BIGINT NOT NULL REFERENCES users(id),\n  amount_cents BIGINT NOT NULL,                  -- 金額は整数 (or DECIMAL)\n  -- amount DECIMAL(15, 2) NOT NULL,              -- 代替案\n  currency CHAR(3) NOT NULL DEFAULT 'JPY',\n  status TEXT NOT NULL DEFAULT 'pending'\n    CHECK (status IN ('pending', 'paid', 'cancelled')),\n  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,\n  external_id UUID,\n  is_subscription BOOLEAN NOT NULL DEFAULT FALSE,\n  notes TEXT,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\n-- ❌ アンチパターン\nid INT,                              -- 21 億件で枯渇\namount FLOAT,                        -- 浮動小数誤差\ncreated_at TIMESTAMP,                -- TZ なし (TIMESTAMPTZ 推奨)\nstatus VARCHAR(20),                  -- CHECK 制約なし (どんな値でも入る)\ndata TEXT,                           -- JSON を TEXT で保存 (JSONB が良い)\n\n-- Rails (migration)\nt.bigint   :user_id, null: false\nt.bigint   :amount_cents, null: false\nt.string   :currency, limit: 3, default: 'JPY', null: false\nt.string   :status, null: false, default: 'pending'\nt.jsonb    :metadata, null: false, default: {}\nt.boolean  :is_subscription, null: false, default: false\nt.timestamps                          -- created_at, updated_at",
            language: "sql",
          },
        ],
        keyTakeaways: [
          "FK / UNIQUE / WHERE 高頻度 / ORDER BY に INDEX、複合 INDEX は『等値→範囲→順序』",
          "部分 INDEX (PG) はソフト削除 + UNIQUE と相性 ◎、Expression INDEX で関数結果も",
          "命名: テーブル複数形 + snake_case、_id / _at / _count サフィックスで意図を明示",
          "型: BIGINT / TEXT / DECIMAL or 整数 / TIMESTAMPTZ / JSONB が現代の標準",
        ],
        comprehensionQuestionIds: ["db-005", "db-009", "db-010", "db-013", "db-014"],
      },
      {
        id: "migrations-and-zdd",
        title: "5. マイグレーションと Zero Downtime Deployment",
        intro:
          "本番 DB に DDL を打つ怖さと対策。NULL → backfill → NOT NULL の段階手順、CONCURRENTLY INDEX、strong_migrations gem の活用。",
        readingMinutes: 9,
        objectives: [
          "本番テーブルへの危険な ALTER (NOT NULL 一気追加 / 巨大 INDEX / ENUM 変更) を見分けられる",
          "段階的に NULL 追加 → backfill → NOT NULL の手順を書ける",
          "CONCURRENTLY INDEX、strong_migrations gem で安全装置を入れる",
        ],
        sections: [
          {
            heading: "5.1 危険な DDL のパターン",
            body: "PostgreSQL の ALTER TABLE は **ACCESS EXCLUSIVE ロック** を取り、テーブル全体を一時的に止める。短時間で終わる DDL なら OK、長時間ロックは本番停止と等価。危険な例: NOT NULL 一気追加 / DEFAULT 値追加 / カラム型変更 / 巨大 INDEX 作成 / ENUM 値追加。",
            code: "-- ❌ 危険 1: 巨大テーブルに NOT NULL DEFAULT を一気に\nALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'member';\n-- → 全行を更新するためテーブル書き換え (PG 11+ で改善されたが油断禁物)\n\n-- ❌ 危険 2: 巨大 INDEX を通常モードで作る\nCREATE INDEX idx_users_email ON users(email);\n-- → INDEX 完成まで書き込みブロック (PostgreSQL)\n\n-- ❌ 危険 3: カラム型変更\nALTER TABLE posts ALTER COLUMN title TYPE VARCHAR(500);\n-- → テーブル全体の書き換え\n\n-- ❌ 危険 4: ENUM 値の途中削除\nALTER TYPE post_status DROP VALUE 'archived';   -- できない (古いバージョン)\n\n-- ✅ 正解: 段階的に\n-- (1) NULL 許可で追加 (ファイルサイズの変更だけ)\nALTER TABLE users ADD COLUMN role TEXT;\n-- (2) backfill (小分け、アプリ稼働中)\nUPDATE users SET role = 'member' WHERE role IS NULL AND id BETWEEN 1 AND 10000;\n-- ... (繰り返し)\n-- (3) NOT NULL 制約 (全行に値があれば即時、短時間)\nALTER TABLE users ALTER COLUMN role SET NOT NULL;",
            language: "sql",
            notes: [
              "PG 11+ の `ADD COLUMN ... DEFAULT 定数` は『書き換えなし』に改善されたが、関数や式は依然書き換え",
              "Bluegreen Deployment 等のスキーマ移行プラットフォームもある",
            ],
          },
          {
            heading: "5.2 CONCURRENTLY INDEX — ノンブロッキング作成",
            body: "PostgreSQL の `CREATE INDEX CONCURRENTLY` は他のクエリをブロックせずに INDEX を作成する。代わりに時間はかかる (通常の 2〜3 倍)。本番では必須。Rails では `disable_ddl_transaction!` + `algorithm: :concurrently` で。",
            code: "-- ノンブロッキング INDEX 作成\nCREATE INDEX CONCURRENTLY idx_posts_user_id ON posts(user_id);\n-- → 他のクエリは継続実行可能、INDEX 完成まで時間がかかる\n\n-- ❌ 通常モード (本番禁止)\nCREATE INDEX idx_posts_user_id ON posts(user_id);\n-- → 書き込みブロック\n\n-- 失敗時のリカバリ\n-- CONCURRENTLY が中断するとIndex が INVALID 状態で残る\nSELECT indexname, indexdef FROM pg_indexes WHERE indexname = 'idx_posts_user_id';\n-- 確認後\nDROP INDEX CONCURRENTLY idx_posts_user_id;\n-- 再作成\n\n-- Rails (migration)\nclass AddIndexToPostsUser < ActiveRecord::Migration[7.1]\n  disable_ddl_transaction!         -- CONCURRENTLY は transaction の中で動かない\n\n  def change\n    add_index :posts, :user_id, algorithm: :concurrently\n  end\nend\n\n-- UNIQUE INDEX も同じ\nadd_index :users, :email, unique: true, algorithm: :concurrently",
            language: "sql",
            notes: [
              "CONCURRENTLY は MySQL では `ALGORITHM=INPLACE, LOCK=NONE` が相当 (MySQL 5.6+)",
              "CONCURRENTLY 中に重複データが入ると INDEX が INVALID 状態に → DROP + 再作成",
            ],
          },
          {
            heading: "5.3 strong_migrations — 危険を自動検出",
            body: "**strong_migrations** gem (Rails) は危険な migration を Rails の migrate 時に検出してエラーにし、安全な代替手順を提示してくれる。チーム全体で『うっかり』を防げる。`safety_assured` でレビュー済みの ALTER は許可可能。",
            code: "# Gemfile\ngem 'strong_migrations'\n\n# 危険な migration\nclass AddRoleToUsers < ActiveRecord::Migration[7.1]\n  def change\n    add_column :users, :role, :string, null: false, default: 'member'\n  end\nend\n\n# → migrate 時にエラー\n# === Dangerous operation detected #strong_migrations ===\n# Adding a column with a non-null default blocks reads and writes...\n# Instead:\n# 1. Add the column WITHOUT a default value\n# 2. Backfill the column\n# 3. Add the default value\n# 4. Add NOT NULL\n\n# 安全な書き方\nclass AddRoleToUsers < ActiveRecord::Migration[7.1]\n  def up\n    add_column :users, :role, :string\n  end\nend\n\nclass BackfillRoleOnUsers < ActiveRecord::Migration[7.1]\n  disable_ddl_transaction!\n\n  def up\n    User.unscoped.in_batches.update_all(role: 'member')\n  end\nend\n\nclass AddRoleNotNullToUsers < ActiveRecord::Migration[7.1]\n  def up\n    safety_assured { change_column_null :users, :role, false }\n  end\nend\n\n# レビュー済みで強制実行\nsafety_assured do\n  add_column :users, :role, :string, null: false, default: 'member'\nend",
            language: "ruby",
            notes: [
              "strong_migrations は『教科書』として優秀 — エラーメッセージに代替手順が書いてある",
              "ローカル / staging で十分テストしてから本番デプロイ",
            ],
          },
          {
            heading: "5.4 Zero Downtime Deployment の全体像",
            body: "新旧スキーマが共存する期間を許容するのが ZDD。**Expand → Migrate → Contract** の 3 段階: (1) 新カラム / テーブル追加 (古コードは無視)、(2) アプリを新スキーマ対応 + データ移行、(3) 古カラム削除。各ステップで複数デプロイを挟むのが基本。",
            code: `// 例: users.name (TEXT) を first_name / last_name に分割

// Step 1: Expand (新カラム追加、古いコードは無視)
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;

// アプリ: name を書く時に first_name / last_name にも書く
class User < ApplicationRecord
  before_save :sync_name_parts
  def sync_name_parts
    if name_changed?
      self.first_name, self.last_name = name.split(' ', 2)
    end
  end
end

// → デプロイ

// Step 2: Migrate (backfill + アプリ移行)
// 既存データを backfill (小分け batch)
User.unscoped.in_batches do |batch|
  batch.each do |u|
    first, last = u.name.split(' ', 2)
    u.update_columns(first_name: first, last_name: last)
  end
end

// アプリの読み取り側を first_name / last_name に切替
// name アクセスを deprecated にする (warning だけ)
class User < ApplicationRecord
  def name
    ActiveSupport::Deprecation.warn('User#name is deprecated, use first_name + last_name')
    "#{first_name} #{last_name}"
  end
end

// → デプロイ

// Step 3: Contract (古いカラム削除)
class RemoveNameFromUsers < ActiveRecord::Migration[7.1]
  def up
    safety_assured { remove_column :users, :name }
  end
end

// → デプロイ
// この時点で古いコードを参照する process が残っていないこと
`,
            language: "ruby",
            notes: [
              "Expand → Migrate → Contract の 3 段階は最低でも 3 回デプロイが必要 (場合により 5〜6 回)",
              "各段階で『旧クライアント / 新クライアント / 旧 DB / 新 DB』が共存できる設計が必要",
              "DB スナップショット + Rollback 手順を必ず用意",
            ],
          },
        ],
        keyTakeaways: [
          "巨大テーブル DDL は段階的に: NULL 追加 → backfill → NOT NULL",
          "本番 INDEX は CONCURRENTLY (Rails: algorithm: :concurrently + disable_ddl_transaction!)",
          "strong_migrations で危険な migration を自動検出、教科書として優秀",
          "ZDD は Expand → Migrate → Contract の 3 段階で複数デプロイを挟む",
        ],
        comprehensionQuestionIds: ["db-012"],
      },
      {
        id: "audit-soft-delete-history",
        title: "6. 監査・ソフト削除・履歴 — DB 設計で残す情報",
        intro:
          "created_at / updated_at / deleted_at の意味、ソフト削除のメリデメ、変更履歴を残す paper_trail / audited、論理削除と UNIQUE の衝突解消。",
        readingMinutes: 9,
        objectives: [
          "Rails の timestamps カラムと業務的時刻 (published_at) の区別ができる",
          "ソフト削除 (deleted_at) と UNIQUE 制約の組合せを部分 INDEX で解決できる",
          "paper_trail / audited で履歴監査ログを設計できる",
        ],
        sections: [
          {
            heading: "6.1 タイムスタンプ — 3 種類の用途",
            body: "**システム時刻 (created_at / updated_at)**: Rails が自動更新。デバッグ・キャッシュキー・楽観ロック (lock_version でなくこれを使う場合も)。**業務時刻 (published_at / approved_at / completed_at)**: 業務イベントの発生時刻、`NULL = 未発生` で状態も表現。**監査時刻 (last_login_at / last_seen_at)**: ユーザー行動の最新時刻。全部 `TIMESTAMPTZ`、UTC で保存・表示時に変換が原則。",
            code: "CREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  title TEXT NOT NULL,\n  body TEXT,\n  user_id BIGINT NOT NULL REFERENCES users(id),\n\n  -- システム時刻 (Rails timestamps、自動更新)\n  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n  -- 業務時刻 (アプリ層で明示セット)\n  published_at TIMESTAMPTZ,                -- NULL = 下書き、時刻 = 公開済み\n  archived_at  TIMESTAMPTZ,                -- NULL = アクティブ\n  approved_at  TIMESTAMPTZ,\n\n  -- 削除時刻 (ソフト削除、後述)\n  deleted_at   TIMESTAMPTZ\n);\n\n-- 公開済みを取得\nSELECT * FROM posts\nWHERE deleted_at IS NULL\n  AND published_at IS NOT NULL\n  AND published_at <= NOW()\nORDER BY published_at DESC;\n\n-- 予約投稿\nUPDATE posts SET published_at = '2026-12-01 10:00' WHERE id = 1;\n\n-- Rails\nt.timestamps                              # created_at, updated_at\nt.timestamptz :published_at\nt.timestamptz :deleted_at",
            language: "sql",
            notes: [
              "全部 TIMESTAMPTZ で UTC 保存 → アプリ層で TZ 変換 (Time.zone.now)",
              "boolean published より published_at TIMESTAMPTZ NULL のほうが情報量が多い (公開時刻も分かる)",
            ],
          },
          {
            heading: "6.2 ソフト削除 — deleted_at + 部分 INDEX",
            body: "**物理削除しない代わりに `deleted_at` を埋める**。誤削除復元、監査、関連レコード保持に有効。デメリット: UNIQUE 制約と相性悪 (`email UNIQUE` で『削除済み + 同 email の新規』が衝突) → 部分 INDEX で解決。Rails では discard / paranoia gem。",
            code: "-- スキーマ\nALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;\n\n-- 部分 UNIQUE (PG) — 生存レコードだけ UNIQUE\nDROP INDEX users_email_key;     -- 既存の UNIQUE 制約があれば外す\nCREATE UNIQUE INDEX idx_users_email_active\n  ON users(email)\n  WHERE deleted_at IS NULL;\n\n-- 削除 / 復元\nUPDATE users SET deleted_at = NOW() WHERE id = 1;\nUPDATE users SET deleted_at = NULL  WHERE id = 1;\n\n-- 検索 (生存のみ)\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- 削除済みを含めて検索 (監査・復元用)\nSELECT * FROM users;\nSELECT * FROM users WHERE deleted_at IS NOT NULL;\n\n-- Rails (discard gem 推奨、軽量で paranoia の罠が少ない)\n# Gemfile: gem 'discard'\nclass User < ApplicationRecord\n  include Discard::Model            # default_scope { kept } を提供\nend\n\nUser.discard(id)                    # deleted_at = NOW()\nUser.undiscard(id)                  # NULL に戻す\nUser.kept                           # 生存\nUser.discarded                      # 削除済み\nUser.with_discarded                 # 全件",
            language: "sql",
            diagram: `flowchart LR
  ACT["users<br/>deleted_at IS NULL"]:::active
  DEL["users<br/>deleted_at IS NOT NULL"]:::deleted
  ACT -- "discard()<br/>deleted_at = NOW()" --> DEL
  DEL -- "undiscard()<br/>deleted_at = NULL" --> ACT
  ACT -.->|"UNIQUE (email) WHERE deleted_at IS NULL"| IDX["部分 INDEX"]:::index
  classDef active fill:#dcfce7,stroke:#16a34a
  classDef deleted fill:#fee2e2,stroke:#ef4444
  classDef index fill:#fef3c7,stroke:#f59e0b`,
            diagramCaption: "ソフト削除 + 部分 UNIQUE INDEX で『削除済 + 同 email 再登録』を可能に",
            notes: [
              "MySQL は部分 INDEX 無し → 別カラム (active_email など) で代替",
              "GDPR の右forgotten では物理削除も必要 — 監査用に key/value だけ別テーブルに残すのも一案",
            ],
          },
          {
            heading: "6.3 変更履歴 — paper_trail / audited",
            body: "『誰がいつ何を変えたか』を別テーブルに記録。**paper_trail** は versions テーブルに変更前後の値を JSON で保存、reify でロールバック可能。**audited** は同様だが API が少し違う。コンプライアンス (SOX / GDPR / SOC2) で必須になることが多い。",
            code: "# Gemfile\ngem 'paper_trail'\n\n# rails g paper_trail:install\n# versions テーブルが作られる\n\n# Model\nclass Post < ApplicationRecord\n  has_paper_trail                              # 全 attr を追跡\n  # has_paper_trail only: [:title, :body]      # 一部だけ\n  # has_paper_trail ignore: [:updated_at]\nend\n\n# 使う\npost = Post.find(1)\npost.versions                                  # PaperTrail::Version の配列\npost.versions.last.object_changes              # { 'title' => ['Old', 'New'] }\npost.versions.last.reify                       # 1 つ前の Post オブジェクト復元\npost.versions.last.reify.save                  # ロールバック\n\n# whodunnit (誰が変更したか)\nclass ApplicationController < ActionController::Base\n  before_action :set_paper_trail_whodunnit\n  # → PaperTrail.request.whodunnit = current_user.id\nend\npost.versions.last.whodunnit                   # \"42\" (user_id)\n\n# audited も同様の機能\ngem 'audited'\nclass Post < ApplicationRecord\n  audited                                       # audits テーブル\nend\nPost.last.audits.last.audited_changes\n\n# DB スキーマ (paper_trail)\nCREATE TABLE versions (\n  id BIGINT PRIMARY KEY,\n  item_type TEXT NOT NULL,                     # 'Post'\n  item_id BIGINT NOT NULL,                     # post.id\n  event TEXT NOT NULL,                         # 'create', 'update', 'destroy'\n  whodunnit TEXT,                              # user_id (string)\n  object JSONB,                                # 変更前のオブジェクト全体\n  object_changes JSONB,                        # diff\n  created_at TIMESTAMPTZ\n);",
            language: "ruby",
            notes: [
              "ストレージ消費が増える — 重要モデルだけに絞る or 古いバージョンは定期 purge",
              "paper_trail の reify は ActiveRecord callback を呼ぶので、save 時の副作用に注意",
              "金融・医療系では audit log の改ざん不可性 (append-only) が要求される",
            ],
          },
        ],
        keyTakeaways: [
          "システム時刻 (created/updated_at) + 業務時刻 (published_at) + 削除時刻 (deleted_at) を区別",
          "ソフト削除は部分 UNIQUE INDEX (PG) で再登録可能に、discard gem が軽量",
          "paper_trail / audited で変更履歴を versions / audits に JSON 保存、whodunnit で誰がを記録",
        ],
        comprehensionQuestionIds: ["db-010", "db-011", "db-016", "db-018"],
      },
      {
        id: "antipatterns",
        title: "7. アンチパターン集 — EAV / 巨大 JSON / 配列カラム / N+1 を呼ぶ設計",
        intro:
          "DB 設計でよく見かける『一見便利だが後で苦しむ』パターン。EAV / 巨大 JSONB / 配列カラム / unbounded polymorphic / N+1 を誘発する設計を整理。",
        readingMinutes: 8,
        objectives: [
          "EAV / 配列カラム / 巨大 JSONB の落とし穴と代替案を説明できる",
          "『あとから INDEX が貼れない / 集計が辛い』設計を避けられる",
          "N+1 を誘発する設計 (counter cache なし / 過剰 polymorphic) を見抜ける",
        ],
        sections: [
          {
            heading: "7.1 EAV (Entity-Attribute-Value)",
            body: "属性を縦持ちで保存する設計。柔軟だが集計・型保証・JOIN が悪夢。商品カテゴリごとに違う属性 (服: サイズ / 色、本: ISBN) で誘惑される。**JSONB or サブタイプ別テーブル** で代替するのが現代。",
            code: "-- ❌ EAV (避ける)\nCREATE TABLE product_properties (\n  product_id BIGINT,\n  key TEXT,                                -- 'size', 'color', 'isbn'\n  value TEXT,                              -- '42', 'red', '978-...'\n  PRIMARY KEY (product_id, key)\n);\n-- 検索: WHERE key='size' AND value='M' の JOIN 地獄\n-- 型なし: '42' (string) vs 42 (int) で混乱\n-- 集計: SELECT AVG(value) は文字列なので不可\n\n-- ✅ 代替 1: JSONB (PostgreSQL)\nCREATE TABLE products (\n  id BIGINT PRIMARY KEY,\n  name TEXT,\n  category TEXT,\n  attributes JSONB NOT NULL DEFAULT '{}'::jsonb\n);\nCREATE INDEX idx_products_attrs ON products USING GIN (attributes);\n-- 検索\nSELECT * FROM products WHERE attributes @> '{\"size\":\"M\"}';\nSELECT * FROM products WHERE (attributes->>'price')::numeric > 1000;\n\n-- ✅ 代替 2: サブタイプ毎にテーブル\nCREATE TABLE clothes (\n  id BIGINT PRIMARY KEY,\n  product_id BIGINT REFERENCES products(id),\n  size TEXT NOT NULL,\n  color TEXT NOT NULL\n);\nCREATE TABLE books (\n  id BIGINT PRIMARY KEY,\n  product_id BIGINT REFERENCES products(id),\n  isbn TEXT UNIQUE,\n  author TEXT NOT NULL\n);\n-- → JOIN は明確、型保証、CHECK 制約も貼れる",
            language: "sql",
            notes: [
              "JSONB はバランスが良いが、頻繁にクエリする属性は通常カラムに昇格",
              "EAV を採用するなら、必ず value の型を別カラム (value_text / value_number) で分けてから",
            ],
          },
          {
            heading: "7.2 配列カラム / カンマ区切り",
            body: "`tags TEXT` に 'ruby,rails,sql' のようにカンマ区切りで保存、または `tag_ids BIGINT[]` で配列保存。**1NF 違反**で集計・検索・FK 制約が困難。N:N の中間テーブルに昇格すべき。例外: 順序を持つ小さい固定列 (色のチェックリスト 5 色など) は配列 / JSONB でも OK。",
            code: "-- ❌ カンマ区切り\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  tags TEXT                              -- 'ruby,rails,sql'\n);\n-- 検索: WHERE tags LIKE '%rails%' → 'preserve_rails' も hit、INDEX 効かず\n-- 追加: 既存値を読んで連結して書き直し (race condition)\n-- 削除: 同上\n\n-- ❌ 配列カラム (PostgreSQL 専用)\nALTER TABLE posts ADD COLUMN tag_ids BIGINT[];\n-- 検索: WHERE tag_ids @> ARRAY[5] は GIN index で速いが\n-- FK 制約が貼れない → 参照先削除で残骸\n-- JOIN: LATERAL UNNEST が必要で読みにくい\n\n-- ✅ 中間テーブル (N:N)\nCREATE TABLE post_tags (\n  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,\n  tag_id  BIGINT REFERENCES tags(id),\n  PRIMARY KEY (post_id, tag_id)\n);\nCREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);\n\n-- 検索 (高速、明確)\nSELECT p.* FROM posts p\n  JOIN post_tags pt ON pt.post_id = p.id\n  JOIN tags t ON t.id = pt.tag_id\nWHERE t.name = 'rails';\n\n-- 配列が OK な例外\n-- 固定の小さい順序付きリスト (Roles: ['admin', 'editor'])\nALTER TABLE users ADD COLUMN roles TEXT[];\n-- ※ 値の集合が小さく、FK 関係がない場合のみ",
            language: "sql",
          },
          {
            heading: "7.3 巨大 JSONB / すべて JSON で済ます",
            body: "JSONB は強力だが『何でも JSON に詰める』のは別のアンチパターン。型保証・JOIN・INDEX・集計の全てが弱くなる。**頻繁にクエリする属性は通常カラムに、ネスト構造や疎な属性だけ JSONB に**。",
            code: "-- ❌ 全部 JSONB\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  data JSONB NOT NULL                    -- {name, email, age, address, ...全部}\n);\n-- 検索: WHERE data->>'email' = 'a@x' は遅い (GIN index でも限界)\n-- 制約: メールユニーク? NULL? 型? 全てアプリ任せ\n-- JOIN: data->>'org_id' での結合は遅い + 型変換が必要\n\n-- ✅ 通常カラム + JSONB の役割分担\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,            -- 頻出 + 制約あり → 通常カラム\n  name TEXT NOT NULL,\n  age INT,\n  org_id BIGINT REFERENCES organizations(id),\n\n  -- 疎な / 構造化された設定 (頻繁にクエリしない)\n  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,\n  --   { 'theme': 'dark', 'notifications': { 'email': true, 'slack': false } }\n\n  -- 動的な属性 (商品の独自属性等、サブタイプ別テーブルが大袈裟な時)\n  metadata JSONB NOT NULL DEFAULT '{}'::jsonb\n);\nCREATE INDEX idx_users_prefs ON users USING GIN (preferences);\n\n-- JSONB のクエリ\nSELECT * FROM users WHERE preferences @> '{\"theme\":\"dark\"}';\nSELECT * FROM users WHERE preferences->'notifications'->>'email' = 'true';\n\n-- 頻繁にクエリする属性は通常カラムに昇格\n-- preferences->>'theme' を多用 → users.theme カラムに移行",
            language: "sql",
          },
          {
            heading: "7.4 N+1 を呼ぶ設計",
            body: "DB 設計レベルで N+1 を誘発するパターン: (1) カウントを毎回 SELECT させる (counter_cache なし)、(2) 過剰な polymorphic で eager load 困難、(3) 中間集計を毎回計算 (マテリアライズドビューが向く場面)。設計時に『この情報、N 回 SELECT されない?』をチェック。",
            code: "-- ❌ users.posts_count をリアルタイム計算\n-- 一覧表示で users.each { |u| u.posts.count } → N+1\n\n-- ✅ counter_cache\nALTER TABLE users ADD COLUMN posts_count INT NOT NULL DEFAULT 0;\n\n-- Rails\nclass Post < ApplicationRecord\n  belongs_to :user, counter_cache: true   -- users.posts_count を自動更新\nend\n\n-- 整合性チェック (定期 batch)\nUser.find_each do |u|\n  expected = u.posts.count\n  u.update_columns(posts_count: expected) if u.posts_count != expected\nend\n\n-- ❌ 過剰 polymorphic\nclass Notification < ApplicationRecord\n  belongs_to :notifiable, polymorphic: true  # Post, Comment, Photo, Video, Tag, ...\nend\n-- 一覧で includes(:notifiable) しても N+1 (各 type ごとに別クエリ)\n\n-- ✅ 専用テーブル + 限定的な polymorphic\nclass PostNotification < ApplicationRecord; belongs_to :post; end\nclass CommentNotification < ApplicationRecord; belongs_to :comment; end\n-- 必要な分だけ FK 付きで\n\n-- ❌ 中間集計を毎回\nSELECT user_id, COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY user_id;\n-- リクエスト毎に走らせると遅い\n\n-- ✅ マテリアライズドビュー (PostgreSQL)\nCREATE MATERIALIZED VIEW user_monthly_orders AS\nSELECT user_id, COUNT(*) AS order_count\nFROM orders\nWHERE created_at > NOW() - INTERVAL '30 days'\nGROUP BY user_id;\nCREATE INDEX ON user_monthly_orders(user_id);\n\n-- 定期リフレッシュ (sidekiq scheduled / cron)\nREFRESH MATERIALIZED VIEW CONCURRENTLY user_monthly_orders;",
            language: "sql",
            notes: [
              "Rails の bullet gem を開発環境に入れて N+1 を自動検出",
              "本番では Skylight / New Relic 等で重いクエリを継続監視",
            ],
          },
        ],
        keyTakeaways: [
          "EAV / カンマ区切り / 配列カラム / 巨大 JSONB は『最初は便利、後で苦しむ』 — 中間テーブル / 通常カラムに昇格",
          "JSONB は『頻繁にクエリしない疎な属性』に限定、頻出は通常カラムに",
          "DB 設計時に counter_cache / マテリアライズドビュー で N+1 を誘発しないように",
          "bullet gem / Skylight で N+1 を継続検知",
        ],
        comprehensionQuestionIds: ["db-015"],
      },
    ],
};

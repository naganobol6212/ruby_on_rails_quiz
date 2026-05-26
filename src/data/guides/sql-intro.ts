import type { Guide } from "./types";

export const sqlIntroGuide: Guide = {
    id: "sql-intro",
    trackId: "sql",
    title: "SQL の地図 — 宣言的にデータを問い合わせる",
    subtitle:
      "SELECT → DML → 集約 → JOIN → サブクエリ/CTE → ウィンドウ関数 → パフォーマンス。PostgreSQL / MySQL / SQLite 共通の標準 SQL を 7 章で。",
    audience:
      "ORM (Rails / Prisma / Django) は使えるが生 SQL を読み書きしたい人、N+1 や Slow Query を自力で潰したい人",
    sources: [
      { label: "PostgreSQL 公式ドキュメント", url: "https://www.postgresql.org/docs/current/" },
      { label: "MySQL 8.0 リファレンス", url: "https://dev.mysql.com/doc/refman/8.0/ja/" },
      { label: "Use The Index, Luke!", url: "https://use-the-index-luke.com/ja" },
    ],
    emoji: "🗃️",
    relatedCategoryIds: ["sql-basics", "sql-joins", "sql-advanced"],
    chapters: [
      {
        id: "select-basics",
        title: "1. SELECT の基礎 — 投影・選択・並べ替え・制限",
        intro:
          "SQL は『どう取るか』ではなく『何が欲しいか』を書く宣言的言語。まずは SELECT / WHERE / ORDER BY / LIMIT を整理。",
        readingMinutes: 7,
        objectives: [
          "SELECT 文の基本形 (投影 / 選択 / 並べ替え / 制限) を書ける",
          "比較演算子 / IN / BETWEEN / LIKE / IS NULL を使い分けられる",
          "ORDER BY / LIMIT / OFFSET の挙動と組み合わせを理解する",
        ],
        sections: [
          {
            heading: "1.1 SELECT の構文 — 6 つのキーワード",
            body: "SQL の SELECT 文は 6 つの主要キーワードを順番に書く: `SELECT` (投影) → `FROM` (元) → `WHERE` (選択) → `GROUP BY` (集約) → `HAVING` (集約後の選択) → `ORDER BY` (並べ替え) → `LIMIT/OFFSET` (制限)。論理的な評価順は FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT。",
            code: "-- 全カラム / 全行\nSELECT * FROM users;\n\n-- 必要なカラムだけ (推奨)\nSELECT id, name, email FROM users;\n\n-- 別名 (AS は省略可)\nSELECT name AS user_name, email AS contact FROM users;\nSELECT name user_name FROM users;          -- AS 省略\n\n-- 計算列\nSELECT id, name, age * 12 AS age_in_months FROM users;\n\n-- 重複排除\nSELECT DISTINCT role FROM users;",
            language: "sql",
            notes: [
              "本番コードで `SELECT *` は避ける — 必要なカラムを明示すると通信量・index 効率が改善",
              "SQL のキーワードは大文字推奨 (テーブル / カラムは小文字 snake_case) — 視覚的に区別しやすい",
            ],
          },
          {
            heading: "1.2 WHERE — 比較・IN・BETWEEN・LIKE・NULL",
            body: "WHERE で行を絞り込む。比較演算子 (`=` / `<>` / `<` / `>` / `<=` / `>=`)、`IN` (集合に含まれる)、`BETWEEN` (範囲)、`LIKE` (パターン)、`IS NULL` (NULL 判定)。NULL は `=` で比較できず必ず `IS NULL` / `IS NOT NULL` を使う点に注意。",
            code: "SELECT * FROM users WHERE active = true;\nSELECT * FROM users WHERE age >= 18 AND age < 65;\nSELECT * FROM users WHERE role IN ('admin', 'editor');\nSELECT * FROM users WHERE age BETWEEN 18 AND 64;     -- 両端含む\n\n-- パターンマッチ\nSELECT * FROM users WHERE name LIKE 'A%';            -- A で始まる\nSELECT * FROM users WHERE email LIKE '%@example.com';\nSELECT * FROM users WHERE name LIKE 'A_ice';         -- _ は任意 1 文字\n\n-- NULL は = で比較できない\nSELECT * FROM users WHERE deleted_at IS NULL;        -- ✅\nSELECT * FROM users WHERE deleted_at = NULL;         -- ❌ 常に空\n\n-- AND / OR / NOT\nSELECT * FROM users\nWHERE active = true AND (role = 'admin' OR role = 'editor');",
            language: "sql",
            notes: [
              "NULL は『値が無い』状態。= NULL は常に偽になる SQL の落とし穴 No.1",
              "前方一致 `'A%'` は INDEX が効くが、`'%@x'` (後方一致) は効かない",
            ],
          },
          {
            heading: "1.3 ORDER BY / LIMIT / OFFSET",
            body: "`ORDER BY` で並べ替え (デフォルト ASC、降順は DESC)。複数キー指定可。`LIMIT n` で先頭 n 件、`OFFSET m` で m 件スキップ。ページング (`LIMIT 20 OFFSET 40` で 3 ページ目) の定番。",
            code: "SELECT * FROM users ORDER BY created_at DESC;\nSELECT * FROM users ORDER BY age ASC, name ASC;       -- 複数キー\n\n-- 並べ替え + 上位 N 件\nSELECT * FROM products ORDER BY sales DESC LIMIT 10;\n\n-- ページング (1 ページ 20 件、3 ページ目)\nSELECT * FROM posts\nORDER BY published_at DESC\nLIMIT 20 OFFSET 40;\n\n-- NULL の並び順 (DB により差あり)\nSELECT * FROM users ORDER BY last_login DESC NULLS LAST;   -- PostgreSQL",
            language: "sql",
            notes: [
              "OFFSET は値が大きいほど遅くなる — Keyset Pagination (WHERE id < ?) が高速",
              "ORDER BY 無しで LIMIT すると順序は未定義 — 必ず ORDER BY を併用",
            ],
          },
        ],
        keyTakeaways: [
          "SQL は宣言的。何が欲しいかを書き、どう取るかは DB に任せる",
          "本番では SELECT * を避け、必要なカラムを明示",
          "NULL は IS NULL / IS NOT NULL でしか判定できない",
          "ORDER BY 無しの LIMIT は順序が未定義 — 必ず併用",
        ],
        comprehensionQuestionIds: ["sql-001", "sql-002", "sql-003", "sql-008"],
      },
      {
        id: "dml-and-transactions",
        title: "2. INSERT / UPDATE / DELETE とトランザクション",
        intro:
          "データを変更する DML (Data Manipulation Language) と、その変更を『全部成功か全部失敗か』にまとめるトランザクションを整理。",
        readingMinutes: 8,
        objectives: [
          "INSERT (単行 / 複数行 / SELECT から)、UPDATE、DELETE を書ける",
          "WHERE を忘れた UPDATE / DELETE の事故を防げる",
          "BEGIN / COMMIT / ROLLBACK と SAVEPOINT を使える",
        ],
        sections: [
          {
            heading: "2.1 INSERT — 行を追加する",
            body: "`INSERT INTO テーブル (カラム...) VALUES (値...)` が基本。複数行を 1 文で、`SELECT` の結果を流し込む `INSERT INTO ... SELECT` もある。`RETURNING` (PostgreSQL) で挿入後の id を取り出せる。",
            code: "-- 単行\nINSERT INTO users (name, email, role)\nVALUES ('Alice', 'a@example.com', 'admin');\n\n-- 複数行 (1 statement)\nINSERT INTO users (name, email) VALUES\n  ('Alice', 'a@x'),\n  ('Bob',   'b@x'),\n  ('Carol', 'c@x');\n\n-- SELECT の結果を挿入\nINSERT INTO archived_users (id, name)\nSELECT id, name FROM users WHERE active = false;\n\n-- 挿入後の値を取り出す (PostgreSQL)\nINSERT INTO users (name) VALUES ('Dave')\nRETURNING id, created_at;\n\n-- UPSERT (重複時は更新)  PostgreSQL\nINSERT INTO users (email, name) VALUES ('a@x', 'Alice')\nON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;",
            language: "sql",
            notes: [
              "複数行 INSERT は 1 文で書く方が高速 (ラウンドトリップ 1 回)",
              "MySQL の UPSERT は `INSERT ... ON DUPLICATE KEY UPDATE`",
            ],
          },
          {
            heading: "2.2 UPDATE / DELETE — WHERE を忘れない",
            body: "`UPDATE テーブル SET カラム = 値 WHERE 条件`。WHERE を忘れると **全行が更新される**。同様に DELETE も。検証クエリを先に SELECT で流し、件数が想定通りか確認してから実行するのが鉄則。",
            code: "-- UPDATE\nUPDATE users SET role = 'admin' WHERE id = 1;\nUPDATE users SET last_login = NOW() WHERE email = 'a@x';\n\n-- 複数カラム同時\nUPDATE users SET name = 'Alice A', role = 'admin' WHERE id = 1;\n\n-- 別テーブルの値で更新 (PostgreSQL)\nUPDATE users SET role = roles.name\nFROM roles WHERE users.role_id = roles.id;\n\n-- DELETE\nDELETE FROM users WHERE id = 1;\nDELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';\n\n-- ✅ 事故防止: 先に SELECT で件数確認\nSELECT COUNT(*) FROM users WHERE role = 'guest';\nDELETE FROM users WHERE role = 'guest';\n\n-- ✅ トランザクションで囲む\nBEGIN;\nDELETE FROM users WHERE role = 'guest';\n-- 結果を確認してから\nCOMMIT;     -- or ROLLBACK;",
            language: "sql",
            notes: [
              "本番 DB を直接触る時は『SELECT で確認 → BEGIN で囲む → COMMIT』をクセに",
              "DELETE は本当に削除して良いか — 論理削除 (deleted_at) で代用するケースも多い",
            ],
          },
          {
            heading: "2.3 トランザクション — BEGIN / COMMIT / ROLLBACK",
            body: "複数の SQL を『1 つの単位』として扱う仕組み。途中で失敗したら ROLLBACK で全部巻き戻し、全部成功したら COMMIT で確定。ACID の A (Atomicity)。SAVEPOINT で部分ロールバックも可能。",
            code: "-- 銀行送金 (典型例)\nBEGIN;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n-- どちらか失敗したら ROLLBACK で両方無かったことに\n\n-- SAVEPOINT (部分ロールバック)\nBEGIN;\n  INSERT INTO users(name) VALUES ('Alice');\n  SAVEPOINT sp1;\n  INSERT INTO users(name) VALUES (NULL);     -- 失敗するかも\n  ROLLBACK TO sp1;                             -- Alice は残る\n  INSERT INTO users(name) VALUES ('Bob');\nCOMMIT;\n\n-- 分離レベル (PostgreSQL のデフォルトは READ COMMITTED)\nBEGIN ISOLATION LEVEL SERIALIZABLE;\n  -- 最も厳しい分離レベル (並行更新を厳格に検出)\nCOMMIT;",
            language: "sql",
            notes: [
              "Web アプリは ORM (Rails の transaction do / Prisma の $transaction) でラップするのが普通",
              "ACID: Atomicity (原子性) / Consistency / Isolation / Durability",
              "分離レベルを上げると整合性は強くなるが、競合・デッドロックも増える",
            ],
          },
        ],
        keyTakeaways: [
          "INSERT は複数行を 1 文で。RETURNING で id を取り出せる (PG)",
          "UPDATE / DELETE は WHERE 忘れで全行消える事故 — 事前 SELECT + BEGIN で守る",
          "BEGIN / COMMIT / ROLLBACK で複数操作を atomic に",
          "SAVEPOINT で部分ロールバック、ISOLATION LEVEL で分離強度を調整",
        ],
        comprehensionQuestionIds: ["sql-005", "sql-006", "sql-007", "sql-021"],
      },
      {
        id: "aggregates-and-group-by",
        title: "3. 集計と GROUP BY — COUNT / SUM / AVG と HAVING",
        intro:
          "『何件あるか』『合計いくらか』『平均は』など、集計関数と GROUP BY でグループ化された集計を整理。",
        readingMinutes: 8,
        objectives: [
          "COUNT / SUM / AVG / MAX / MIN を使い分けられる",
          "GROUP BY で集計のキーを指定できる、HAVING との違いを説明できる",
          "COUNT(*) と COUNT(col) の違い (NULL の扱い) を理解する",
        ],
        sections: [
          {
            heading: "3.1 集計関数の基本",
            body: "`COUNT(*)` は全行数、`COUNT(col)` は col が NULL でない行数。`SUM` / `AVG` / `MAX` / `MIN` は対象カラムが NULL の行を無視する。`COUNT(DISTINCT col)` で重複除外。",
            code: "-- 全件数\nSELECT COUNT(*) FROM users;\n\n-- 重複なしのロール数\nSELECT COUNT(DISTINCT role) FROM users;\n\n-- 合計 / 平均 / 最大 / 最小\nSELECT\n  SUM(amount)   AS total,\n  AVG(amount)   AS mean,\n  MAX(amount)   AS top,\n  MIN(amount)   AS bottom,\n  COUNT(*)      AS rows\nFROM orders;\n\n-- COUNT(*) vs COUNT(col) — NULL の扱い\nSELECT\n  COUNT(*)            AS all_rows,        -- NULL も数える\n  COUNT(email)        AS with_email,      -- email が NULL でない行\n  COUNT(DISTINCT role) AS unique_roles\nFROM users;",
            language: "sql",
            notes: [
              "NULL は計算でも無視される (AVG は NULL を分母に含めない)",
              "COUNT(*) は最速。COUNT(1) と等価 (古い迷信で COUNT(1) が速いと言われたが嘘)",
            ],
          },
          {
            heading: "3.2 GROUP BY — グループ化された集計",
            body: "`GROUP BY` で『同じ値を持つ行』をまとめて 1 行に集約する。`SELECT` 句にはグループキー or 集計関数しか書けない (それ以外は SQL 標準ではエラー)。",
            code: "-- ロール別ユーザー数\nSELECT role, COUNT(*) AS cnt\nFROM users\nGROUP BY role\nORDER BY cnt DESC;\n\n-- 月別売上合計\nSELECT DATE_TRUNC('month', created_at) AS month,\n       SUM(amount) AS total\nFROM orders\nGROUP BY DATE_TRUNC('month', created_at)\nORDER BY month;\n\n-- 複数キーでグループ化\nSELECT country, role, COUNT(*)\nFROM users\nGROUP BY country, role;\n\n-- ❌ SQL 標準違反 (SELECT に集計でない列)\nSELECT name, COUNT(*) FROM users GROUP BY role;\n--     ^ name は role 内で複数あるので 1 つに決められない\n\n-- ✅ name を含めたいなら GROUP BY name も追加するか、集計する\nSELECT role, MAX(name), COUNT(*) FROM users GROUP BY role;",
            language: "sql",
            notes: [
              "MySQL の古いデフォルト (ONLY_FULL_GROUP_BY OFF) は SELECT に何でも書けるが、結果は未定義 — 危険",
              "GROUP BY の代わりに DISTINCT + ウィンドウ関数の方が読みやすいケースもある (6 章で)",
            ],
          },
          {
            heading: "3.3 HAVING — 集約後の絞り込み",
            body: "`WHERE` は集約前、`HAVING` は集約後の絞り込み。集計結果 (COUNT / SUM など) を条件にしたい時は HAVING を使う。",
            code: "-- ❌ WHERE で集計結果を使えない\nSELECT role, COUNT(*) FROM users\nWHERE COUNT(*) > 10                       -- Error\nGROUP BY role;\n\n-- ✅ HAVING を使う\nSELECT role, COUNT(*) AS cnt\nFROM users\nGROUP BY role\nHAVING COUNT(*) > 10\nORDER BY cnt DESC;\n\n-- WHERE と HAVING の併用 (active なユーザー内で、ロール別 10 人以上)\nSELECT role, COUNT(*) AS cnt\nFROM users\nWHERE active = true                       -- 集約前のフィルタ\nGROUP BY role\nHAVING COUNT(*) > 10                       -- 集約後のフィルタ\nORDER BY cnt DESC;",
            language: "sql",
            notes: [
              "可能なら WHERE で先に絞ってから集約 — その方が高速 (行数が減ってから集計)",
              "HAVING に集計関数以外 (例: role) を書くのは GROUP BY と同じ条件で WHERE に書ける",
            ],
          },
        ],
        keyTakeaways: [
          "COUNT(*) は全行、COUNT(col) は NULL を除外",
          "GROUP BY のキー or 集計関数しか SELECT に書けない (SQL 標準)",
          "WHERE は集約前、HAVING は集約後の絞り込み",
          "可能なら WHERE で先に絞り、行数を減らしてから集計",
        ],
        comprehensionQuestionIds: ["sql-004", "sql-008", "sql-009", "sql-010"],
      },
      {
        id: "joins",
        title: "4. JOIN — 複数テーブルをつなぐ",
        intro:
          "正規化されたデータを結合して 1 つの結果に。INNER / LEFT / RIGHT / FULL / CROSS / SELF JOIN と N+1 問題の解消を整理。",
        readingMinutes: 10,
        objectives: [
          "INNER JOIN と LEFT JOIN の違いを説明できる",
          "ON 句で結合条件を書ける、複数テーブルを連結できる",
          "N+1 問題を JOIN または IN で 1 つの SQL に集約できる",
        ],
        sections: [
          {
            heading: "4.1 INNER JOIN — 両方にある行だけ",
            body: "`A INNER JOIN B ON 条件` で両テーブルの行を結合。条件が成立した組み合わせのみ残る。デフォルトは INNER なので `JOIN` だけでも同じ。",
            code: "-- users と posts を user_id で結合\nSELECT u.name, p.title\nFROM users u\nJOIN posts p ON u.id = p.user_id;\n\n-- 投稿のない user は出てこない (INNER の特徴)\n\n-- 3 テーブル結合 (users → posts → comments)\nSELECT u.name, p.title, c.body\nFROM users u\nJOIN posts    p ON u.id = p.user_id\nJOIN comments c ON p.id = c.post_id;\n\n-- WHERE と組み合わせ\nSELECT u.name, p.title\nFROM users u\nJOIN posts p ON u.id = p.user_id\nWHERE u.active = true\n  AND p.published = true;",
            language: "sql",
            notes: [
              "テーブルに別名 (u / p / c) を付けると JOIN の連鎖が読みやすい",
              "ON 句は『結合条件』、WHERE 句は『結果の絞り込み』として書き分けるのが慣習",
            ],
          },
          {
            heading: "4.2 LEFT JOIN — 左テーブルは全行残す",
            body: "`A LEFT JOIN B ON 条件` で A 側は必ず残し、B 側が無ければ NULL で埋める。『投稿が 0 件の user も含めて一覧したい』『parent も子も両方一覧したい』などで頻出。",
            code: "-- 全 user (投稿 0 件の人も含む)\nSELECT u.id, u.name, p.title\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id;\n-- 投稿が無い user は p.title が NULL\n\n-- 投稿数 0 を含むカウント (COALESCE で 0 に揃える)\nSELECT u.id, u.name, COUNT(p.id) AS post_count\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nGROUP BY u.id, u.name;\n-- COUNT(p.id) は NULL を数えないので、投稿 0 件の人は 0 になる ◎\n\n-- ❌ NG パターン: WHERE で右テーブル条件を書くと INNER になる\nSELECT u.id, u.name, p.title\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nWHERE p.published = true;          -- ← published=true の post が無い user が消える\n\n-- ✅ 正しくは ON に書く\nSELECT u.id, u.name, p.title\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id AND p.published = true;",
            language: "sql",
            diagram: `flowchart TB
  subgraph INNER ["INNER JOIN"]
    direction LR
    A1["users<br/>(投稿あり)"]:::both --- B1["posts<br/>(著者あり)"]:::both
  end
  subgraph LEFT ["LEFT JOIN"]
    direction LR
    A2["users<br/>(全員)"]:::left --- B2["posts<br/>+ NULL 補完"]:::nullable
  end
  subgraph RIGHT ["RIGHT JOIN"]
    direction LR
    A3["users<br/>+ NULL 補完"]:::nullable --- B3["posts<br/>(全件)"]:::right
  end
  subgraph FULL ["FULL OUTER JOIN"]
    direction LR
    A4["users<br/>+ NULL"]:::nullable --- B4["posts<br/>+ NULL"]:::nullable
  end
  classDef both fill:#fef3c7,stroke:#f59e0b
  classDef left fill:#dbeafe,stroke:#3b82f6
  classDef right fill:#ddd6fe,stroke:#8b5cf6
  classDef nullable fill:#fee2e2,stroke:#ef4444,stroke-dasharray: 5 5`,
            diagramCaption: "JOIN の 4 種類 — どちらの行を『必ず残すか』と『NULL 補完するか』の違い",
            notes: [
              "LEFT JOIN + WHERE 右側条件は『見落としやすい INNER 化』 — ON に書くのが正解",
              "RIGHT JOIN は『LEFT JOIN の逆』 — 実務では LEFT に書き換える方が読みやすい",
              "FULL OUTER JOIN は両側残す。OR で結合した『どちらかにある』",
            ],
          },
          {
            heading: "4.3 SELF JOIN と CROSS JOIN",
            body: "SELF JOIN は同じテーブルに別名を付けて結合 (社員と上司、親カテゴリ等)。CROSS JOIN は全行のデカルト積 (組み合わせ全列挙) — 滅多に使わないが、日付テーブルとの結合などで稀に。",
            code: "-- SELF JOIN: 社員と上司\nSELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n\n-- SELF JOIN: 同じカテゴリの 2 商品の組み合わせ\nSELECT a.name, b.name\nFROM products a\nJOIN products b ON a.category = b.category\nWHERE a.id < b.id;       -- 重複ペア除外\n\n-- CROSS JOIN: 全 user × 全月の表 (空でも 0 で埋めたい時など)\nSELECT u.id, m.month\nFROM users u\nCROSS JOIN generate_series(1, 12) AS m(month);",
            language: "sql",
          },
          {
            heading: "4.4 N+1 問題と JOIN/IN の活用",
            body: "ORM の典型的アンチパターン: ループの中で 1 件ずつ SELECT すると、N 件のループで N+1 回クエリが発行される。1 つの JOIN または `WHERE id IN (...)` に集約することで 2 回 (or 1 回) に減らせる。",
            code: "-- ❌ N+1 (ORM ループ中で 1 件ずつクエリ)\n-- SELECT * FROM users;                        -- 1 回\n-- SELECT * FROM posts WHERE user_id = 1;      -- N 回\n-- SELECT * FROM posts WHERE user_id = 2;\n-- ...\n\n-- ✅ JOIN で 1 SQL にまとめる\nSELECT u.id, u.name, p.id AS post_id, p.title\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id;\n\n-- ✅ 集計だけ欲しいなら集約クエリ 1 つで OK\nSELECT u.id, u.name, COUNT(p.id) AS post_count\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nGROUP BY u.id, u.name;\n\n-- ✅ ORM 流: id を集めてから IN で 1 回引く (preload)\n-- 1) SELECT id FROM users;\n-- 2) SELECT * FROM posts WHERE user_id IN (1, 2, 3, ...);",
            language: "sql",
            notes: [
              "Rails: `User.includes(:posts)` (preload / eager_load)",
              "Prisma: `prisma.user.findMany({ include: { posts: true } })`",
              "Django: `User.objects.prefetch_related('posts')`",
            ],
          },
        ],
        keyTakeaways: [
          "INNER は両方にある行だけ、LEFT は左を全部残し右を NULL で埋める",
          "LEFT JOIN 後の WHERE で右テーブル条件は INNER 化に注意 — ON に書く",
          "N+1 は JOIN / IN / ORM の preload で 1〜2 回のクエリに集約",
          "SELECT 句で `name, COUNT(*)` のような NULL 含む集計は COUNT(p.id) で 0 を返せる",
        ],
        comprehensionQuestionIds: ["sql-011", "sql-012", "sql-013", "sql-015", "sql-016", "sql-017"],
      },
      {
        id: "subqueries-and-cte",
        title: "5. サブクエリと CTE — クエリの中にクエリを書く",
        intro:
          "サブクエリ (IN / EXISTS / スカラ) と CTE (WITH 句) を使い、複雑な集計を段階的に組み立てる。",
        readingMinutes: 9,
        objectives: [
          "WHERE / FROM / SELECT 句のサブクエリを書き分けられる",
          "IN と EXISTS の違い、相関サブクエリの仕組みを理解する",
          "CTE (WITH 句) で多段クエリを読みやすく構造化できる、再帰 CTE で階層を辿れる",
        ],
        sections: [
          {
            heading: "5.1 サブクエリ — どこに書けるか",
            body: "サブクエリは括弧で囲んだ SELECT。`WHERE 句` (集合や値の比較)、`FROM 句` (一時表のように)、`SELECT 句` (スカラ値) のいずれにも書ける。",
            code: "-- WHERE 句: 集合 (IN)\nSELECT * FROM users\nWHERE id IN (SELECT user_id FROM orders WHERE amount > 1000);\n\n-- WHERE 句: スカラ (= や比較)\nSELECT * FROM users\nWHERE age > (SELECT AVG(age) FROM users);\n\n-- FROM 句: 中間結果を一時表のように\nSELECT t.role, AVG(t.cnt) AS avg_posts\nFROM (\n  SELECT u.role, COUNT(p.id) AS cnt\n  FROM users u LEFT JOIN posts p ON u.id = p.user_id\n  GROUP BY u.id, u.role\n) AS t\nGROUP BY t.role;\n\n-- SELECT 句: 各行に対する補助値\nSELECT u.name,\n       (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id) AS post_count\nFROM users u;",
            language: "sql",
            notes: [
              "SELECT 句のスカラサブクエリは『各行に対して 1 回実行される』ので大量行で遅くなる — JOIN + GROUP BY の方が速いことが多い",
            ],
          },
          {
            heading: "5.2 IN vs EXISTS、相関サブクエリ",
            body: "`IN` は値の集合との比較。`EXISTS` は存在判定 (1 件でも該当があれば true)。多くの DB ではオプティマイザがほぼ同等に変換するが、NULL が混じる時の挙動は要注意。",
            code: "-- IN (集合に含まれるか)\nSELECT * FROM users\nWHERE id IN (SELECT user_id FROM orders);\n\n-- EXISTS (存在判定、相関サブクエリ)\nSELECT * FROM users u\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);\n\n-- NOT IN の罠 — サブクエリに NULL が混じると全体が NULL = 空結果\nSELECT * FROM users WHERE id NOT IN (SELECT user_id FROM orders);\n-- もし orders.user_id に NULL が 1 つでもあれば → 0 件\n\n-- ✅ 安全: NOT EXISTS\nSELECT * FROM users u\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);\n\n-- 相関サブクエリ: 外側の行に依存\nSELECT u.name,\n       (SELECT MAX(o.amount) FROM orders o WHERE o.user_id = u.id) AS max_amount\nFROM users u;",
            language: "sql",
            notes: [
              "NOT IN は NULL があると意図しない空結果 — NOT EXISTS か LEFT JOIN + IS NULL を使う",
              "EXISTS は最初の 1 件で打ち切れるので、存在判定だけなら IN より高速になることがある",
            ],
          },
          {
            heading: "5.3 CTE (WITH 句) で構造化",
            body: "CTE (Common Table Expression) は `WITH 名前 AS (SELECT ...)` で定義する一時的な名前付き結果集合。ネストしたサブクエリを階段状に分解できる。同じ CTE をクエリ内で複数回参照可。",
            code: "-- 段階的に組み立てる\nWITH active_users AS (\n  SELECT id, name FROM users WHERE active = true\n),\nrecent_posts AS (\n  SELECT user_id, title FROM posts\n  WHERE published_at > NOW() - INTERVAL '30 days'\n)\nSELECT au.name, COUNT(rp.user_id) AS recent_count\nFROM active_users au\nLEFT JOIN recent_posts rp ON au.id = rp.user_id\nGROUP BY au.id, au.name;\n\n-- 結果の確認しやすさ — CTE 1 つずつ単独で実行可\n-- WITH の途中まで切り出して動作確認できるのが大きな利点",
            language: "sql",
            notes: [
              "深いネストのサブクエリは可読性が悪い — CTE で名前を付けて段階分解",
              "PostgreSQL 12+ では CTE もインライン展開され、性能差はほぼなくなった",
            ],
          },
          {
            heading: "5.4 再帰 CTE — 階層構造を辿る",
            body: "`WITH RECURSIVE` で自分自身を参照する CTE を定義 → 階層構造 (組織図 / カテゴリツリー / コメントスレッド) を 1 SQL でトラバースできる。基底ケース → 再帰ケースを `UNION ALL` で繋ぐ。",
            code: "-- 組織図: 全社員と階層レベル\nWITH RECURSIVE org AS (\n  -- 基底: ルート (上司が NULL の人)\n  SELECT id, name, manager_id, 1 AS lvl\n  FROM employees\n  WHERE manager_id IS NULL\n\n  UNION ALL\n\n  -- 再帰: 直属の部下を 1 階層ずつ追加\n  SELECT e.id, e.name, e.manager_id, org.lvl + 1\n  FROM employees e\n  JOIN org ON e.manager_id = org.id\n)\nSELECT * FROM org ORDER BY lvl, id;\n\n-- カテゴリツリーで『あるカテゴリ配下を全部取る』にも使える\nWITH RECURSIVE descendants AS (\n  SELECT id, name, parent_id FROM categories WHERE id = 5\n  UNION ALL\n  SELECT c.id, c.name, c.parent_id\n  FROM categories c JOIN descendants d ON c.parent_id = d.id\n)\nSELECT * FROM descendants;",
            language: "sql",
            notes: [
              "再帰 CTE は無限ループ防止のため、終了条件 (lvl < 10 など) を入れることがある",
              "深い階層は再帰 CTE が便利だが、ネストが浅いなら通常 JOIN の方が速い",
            ],
          },
        ],
        keyTakeaways: [
          "サブクエリは WHERE / FROM / SELECT のどこにも書ける",
          "NOT IN は NULL の罠 — NOT EXISTS か LEFT JOIN + IS NULL に置き換える",
          "CTE で多段クエリを名前付きに分解、可読性 ↑",
          "WITH RECURSIVE で階層構造を 1 SQL でトラバース",
        ],
        comprehensionQuestionIds: ["sql-014", "sql-018", "sql-020"],
      },
      {
        id: "window-functions",
        title: "6. ウィンドウ関数 — 行を保ったまま集計する",
        intro:
          "GROUP BY と違って『元の行を保ったまま、グループ内で順位や移動平均を計算』するのがウィンドウ関数。レポート / ランキング / 時系列で必須。",
        readingMinutes: 9,
        objectives: [
          "ROW_NUMBER / RANK / DENSE_RANK の違いを説明できる",
          "PARTITION BY と ORDER BY を組み合わせてランキング・累積を計算できる",
          "LAG / LEAD / 移動平均 (ROWS BETWEEN) を書ける",
        ],
        sections: [
          {
            heading: "6.1 OVER 句の基本 — PARTITION BY と ORDER BY",
            body: "ウィンドウ関数の構文: `関数() OVER (PARTITION BY ... ORDER BY ...)`。`PARTITION BY` でグループ分け (省略時は全行)、`ORDER BY` でグループ内の順序を決める。GROUP BY と違い、元の行数は減らない。",
            code: "-- 部門毎の給与ランキング (元の行はそのまま、rank 列を追加)\nSELECT name, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank\nFROM employees;\n\n-- 全社の単純な給与順位 (PARTITION 無し)\nSELECT name, salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS global_rank\nFROM employees;\n\n-- GROUP BY との対比\n-- GROUP BY: 各 department で 1 行に集約される\nSELECT department, AVG(salary) FROM employees GROUP BY department;\n\n-- ウィンドウ: 全社員の行を保ち、部門平均を各行に付ける\nSELECT name, department, salary,\n  AVG(salary) OVER (PARTITION BY department) AS dept_avg\nFROM employees;",
            language: "sql",
            notes: [
              "GROUP BY は『集約して行を減らす』、ウィンドウは『行を保ったまま集計列を足す』",
              "PARTITION BY 無しなら全行で 1 つのウィンドウ",
            ],
          },
          {
            heading: "6.2 ランキング関数の使い分け",
            body: "`ROW_NUMBER()` (重複なし、必ず連番)、`RANK()` (同点は同順位、その後スキップ)、`DENSE_RANK()` (同点は同順位、スキップなし)、`NTILE(n)` (n 分割の番号)。",
            code: "SELECT name, score,\n  ROW_NUMBER() OVER (ORDER BY score DESC) AS rn,\n  RANK()       OVER (ORDER BY score DESC) AS rk,\n  DENSE_RANK() OVER (ORDER BY score DESC) AS dr,\n  NTILE(4)     OVER (ORDER BY score DESC) AS quartile\nFROM exam;\n\n-- 例: A:100, B:100, C:90, D:80\n--    ROW_NUMBER  RANK  DENSE_RANK  NTILE(4)\n-- A      1        1        1          1\n-- B      2        1        1          1\n-- C      3        3        2          2\n-- D      4        4        3          3\n\n-- TOP-N per group (各部門の上位 3 人)\nSELECT * FROM (\n  SELECT name, department, salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn\n  FROM employees\n) t WHERE rn <= 3;",
            language: "sql",
          },
          {
            heading: "6.3 LAG / LEAD と累積・移動集計",
            body: "`LAG(col, n)` は同じウィンドウ内の n 行前の値、`LEAD(col, n)` は n 行後。`SUM/AVG OVER (... ROWS BETWEEN ...)` で累積和や移動平均を計算できる。",
            code: "-- 前日との差分 (LAG)\nSELECT date, value,\n  value - LAG(value) OVER (ORDER BY date) AS diff\nFROM daily_stats;\n\n-- 翌行を覗く (LEAD)\nSELECT name, login_at,\n  LEAD(login_at) OVER (PARTITION BY user_id ORDER BY login_at) AS next_login\nFROM sessions;\n\n-- 累積和\nSELECT date, amount,\n  SUM(amount) OVER (ORDER BY date) AS cumulative\nFROM orders;\n\n-- 7 日間移動平均\nSELECT date, value,\n  AVG(value) OVER (\n    ORDER BY date\n    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) AS moving_avg_7\nFROM daily_stats;\n\n-- 部門毎の累積和\nSELECT department, name, salary,\n  SUM(salary) OVER (PARTITION BY department ORDER BY hire_date) AS cum_salary\nFROM employees;",
            language: "sql",
            notes: [
              "ROWS BETWEEN は『物理的な行範囲』、RANGE BETWEEN は『値の範囲』 (日付に便利)",
              "ウィンドウフレーム指定なしの SUM OVER (ORDER BY ...) は累積和 (デフォルト = RANGE)",
            ],
          },
        ],
        keyTakeaways: [
          "ウィンドウ関数は元の行を保ったまま集計列を足す (GROUP BY との最大の違い)",
          "ROW_NUMBER / RANK / DENSE_RANK を場面で使い分け",
          "TOP-N per group は ROW_NUMBER + サブクエリで一発",
          "LAG / LEAD / 移動集計 (ROWS BETWEEN) で時系列分析",
        ],
        comprehensionQuestionIds: ["sql-019", "sql-020"],
      },
      {
        id: "performance-and-index",
        title: "7. パフォーマンス — INDEX と EXPLAIN",
        intro:
          "Slow Query を倒すには INDEX 設計と EXPLAIN の読み方が必須。インデックスが効く条件、複合インデックスの順序、EXPLAIN の見方を整理。",
        readingMinutes: 10,
        objectives: [
          "INDEX が効く条件・効かない条件を判別できる",
          "複合インデックスの順序ルール (左端から使われる) を理解する",
          "EXPLAIN / EXPLAIN ANALYZE の主要な行 (Seq Scan / Index Scan / Nested Loop) を読める",
        ],
        references: [
          { label: "Use The Index, Luke! (日本語)", url: "https://use-the-index-luke.com/ja" },
          { label: "PostgreSQL: Performance Tips", url: "https://www.postgresql.org/docs/current/performance-tips.html" },
        ],
        sections: [
          {
            heading: "7.1 INDEX の基本 — B-Tree で何が速くなるか",
            body: "INDEX は B-Tree 構造で『カラムの値 → 行の位置』を高速に引ける補助データ。SELECT は速くなるが、INSERT / UPDATE / DELETE は INDEX 更新コストがかかるので **付けすぎは逆効果**。PRIMARY KEY と UNIQUE は自動的に INDEX が作られる。",
            code: "-- INDEX 作成\nCREATE INDEX idx_users_email ON users(email);\n\n-- 複合 INDEX (順序が重要、後述)\nCREATE INDEX idx_posts_user_status ON posts(user_id, status);\n\n-- UNIQUE INDEX (重複も禁止)\nCREATE UNIQUE INDEX idx_users_email_uniq ON users(email);\n\n-- 部分 INDEX (条件付き、PostgreSQL)\nCREATE INDEX idx_active_users ON users(email) WHERE active = true;\n\n-- 削除\nDROP INDEX idx_users_email;\n\n-- 既存 INDEX 一覧 (PostgreSQL)\nSELECT * FROM pg_indexes WHERE tablename = 'users';",
            language: "sql",
            notes: [
              "目安: WHERE / JOIN / ORDER BY で多用するカラムに INDEX を貼る",
              "更新頻度が高いカラムへの INDEX は INSERT/UPDATE が重くなる",
              "Cardinality (値の種類数) が低い (active=true/false 等) カラムは INDEX の効果が薄い",
            ],
          },
          {
            heading: "7.2 INDEX が効く条件・効かない条件",
            body: "INDEX は『カラム値そのままの比較』で効く。関数で加工 (`LOWER(email)` / `SUBSTR`) や型変換すると効かない。LIKE は前方一致 (`'A%'`) なら効くが、後方一致 (`'%X'`) / 中央 (`'%XY%'`) は効かない。",
            code: "-- ✅ INDEX 効く\nWHERE email = 'a@example.com'\nWHERE email LIKE 'a%'\nWHERE created_at > '2026-01-01'\nWHERE user_id IN (1, 2, 3)\n\n-- ❌ INDEX 効かない\nWHERE LOWER(email) = 'a@example.com'        -- 関数で加工\nWHERE SUBSTR(email, 1, 3) = 'a@x'\nWHERE email LIKE '%@example.com'              -- 後方一致\nWHERE email LIKE '%example%'                   -- 中央一致\nWHERE id + 1 = 100                              -- 演算\nWHERE created_at::date = '2026-01-01'          -- 型変換\n\n-- ✅ 対策: Expression INDEX を貼る (PostgreSQL)\nCREATE INDEX idx_users_lower_email ON users(LOWER(email));\n-- ↑ こうすると WHERE LOWER(email) = ... でも index 使われる\n\n-- 全文検索は別の仕組み (PostgreSQL は GIN + tsvector、Elasticsearch 等)\nCREATE INDEX idx_posts_body_gin ON posts USING GIN(to_tsvector('english', body));",
            language: "sql",
          },
          {
            heading: "7.3 複合 INDEX — 左端から順に効く",
            body: "`(a, b, c)` の複合 INDEX は **左端から順に** WHERE で使われた時にだけ効く。`WHERE a=...` ◎、`WHERE a=... AND b=...` ◎、`WHERE b=...` ✗、`WHERE a=... AND c=...` (b スキップ) は部分的にしか効かない。よく使う組み合わせを左に置く。",
            code: "-- 複合 INDEX\nCREATE INDEX idx_posts_user_status_date\n  ON posts(user_id, status, published_at);\n\n-- ✅ 効く\nWHERE user_id = 1\nWHERE user_id = 1 AND status = 'published'\nWHERE user_id = 1 AND status = 'published' AND published_at > '2026-01'\n\n-- ⚠️ 部分的に効く (user_id だけ)\nWHERE user_id = 1 AND published_at > '2026-01'    -- status をスキップ\n\n-- ❌ ほぼ効かない\nWHERE status = 'published'                          -- 先頭の user_id 無し\nWHERE published_at > '2026-01'\n\n-- ORDER BY も index 順と一致すれば速い\nSELECT * FROM posts\nWHERE user_id = 1 AND status = 'published'\nORDER BY published_at DESC;                          -- index の 3 番目と一致 ✓",
            language: "sql",
            notes: [
              "Cardinality が高いカラム (id / email など) を左に置くのが基本セオリー",
              "WHERE 等値 → 範囲 → ORDER BY の順で複合 INDEX を組むと効きやすい",
            ],
          },
          {
            heading: "7.4 EXPLAIN — 実行計画を読む",
            body: "クエリの前に `EXPLAIN` を付けると DB が選んだ実行計画が見える。`EXPLAIN ANALYZE` は実際に実行して実測時間も出す (UPDATE/DELETE に注意!)。`Seq Scan` (全件スキャン) が遅い時は INDEX 検討、`Nested Loop` の深さや `rows=` の見積もりズレもチェック。",
            code: "EXPLAIN SELECT * FROM users WHERE email = 'a@x';\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@x';\nEXPLAIN (ANALYZE, BUFFERS, VERBOSE) SELECT * FROM users WHERE email = 'a@x';\n\n-- 主な node\n-- Seq Scan: 全件スキャン (テーブルが小さい / INDEX 無い時に登場)\n-- Index Scan: INDEX 経由でアクセス ◎\n-- Index Only Scan: INDEX だけで答えられる (最速)\n-- Bitmap Index Scan + Bitmap Heap Scan: 該当行が多い時の戦略\n-- Nested Loop / Hash Join / Merge Join: JOIN の戦略\n\n-- 重要な指標\n-- cost=0.00..8.00 rows=1 width=64\n-- ↑ コスト見積もり / 推定行数 / 平均バイト幅\n-- (ANALYZE 時) actual time=0.012..0.013 rows=1 loops=1\n-- ↑ 実測時間 / 実測行数 / ループ回数\n\n-- 改善前後の比較が王道のチューニング手順\n-- 1. EXPLAIN ANALYZE で測る\n-- 2. INDEX 追加 / クエリ書き換え\n-- 3. 再度 EXPLAIN ANALYZE で改善確認",
            language: "sql",
            notes: [
              "EXPLAIN ANALYZE は実際にクエリを実行するので、UPDATE/DELETE では BEGIN/ROLLBACK で囲む",
              "推定 rows と actual rows が大きくズレてたら統計情報が古い → `ANALYZE table_name` でリフレッシュ",
              "JOIN 大量 + Nested Loop が深い時は `work_mem` 不足の可能性 (Hash Join に切り替わらない)",
            ],
          },
          {
            heading: "7.5 N+1 と Slow Query の典型対策",
            body: "実務で頻出する『遅い SQL』のチェックリスト: N+1、不要な SELECT *、INDEX 無し、OFFSET 大、関数でカラム加工、巨大 IN リスト、巨大 OR、無駄な DISTINCT、無駄な COUNT(*)。",
            code: "-- ❌ N+1\nfor user in users:\n  SELECT * FROM posts WHERE user_id = ?;\n-- ✅ JOIN または preload\nSELECT u.*, p.*\nFROM users u LEFT JOIN posts p ON u.id = p.user_id;\n\n-- ❌ OFFSET 1000000 — 全件スキャンに近い\nSELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 1000000;\n-- ✅ Keyset Pagination\nSELECT * FROM posts WHERE id < ? ORDER BY id DESC LIMIT 20;\n\n-- ❌ 巨大 IN (10000 件)\nSELECT * FROM users WHERE id IN (1, 2, ..., 10000);\n-- ✅ 一時表 / VALUES / JOIN に変える\n\n-- ❌ COUNT(*) を毎リクエスト\nSELECT COUNT(*) FROM huge_table;            -- 全件スキャン\n-- ✅ 統計表 (pg_stat_user_tables の reltuples)、または別途カウンタテーブル\n\n-- ❌ 関数で加工\nWHERE DATE(created_at) = '2026-01-01';      -- INDEX 効かない\n-- ✅ 範囲指定\nWHERE created_at >= '2026-01-01' AND created_at < '2026-01-02';",
            language: "sql",
            notes: [
              "Slow Query Log (PostgreSQL: log_min_duration_statement、MySQL: slow_query_log) で重いクエリを発見",
              "本番 DB は pg_stat_statements (PostgreSQL) で頻出 + 累積実行時間を可視化",
            ],
          },
        ],
        keyTakeaways: [
          "INDEX は『カラム値そのままの比較』で効く — 関数で加工すると無効",
          "複合 INDEX は左端から順に。等値 → 範囲 → ORDER BY の順で並べる",
          "EXPLAIN ANALYZE で実測 → INDEX 追加 → 再測定の繰り返し",
          "N+1 / 巨大 OFFSET / 関数加工 / COUNT(*) は典型 Slow Query パターン",
        ],
        comprehensionQuestionIds: ["sql-022", "sql-023", "sql-024", "sql-025"],
      },
    ],
};

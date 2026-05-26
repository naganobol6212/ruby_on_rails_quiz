# 💎 RubyDojo

Ruby on Rails を **クイズ** と **学習ジャーナル** で身につける、無料の学習アプリ。

🔗 **アプリを開く:** https://ruby-on-rails-quiz-yu1v.vercel.app/

---

## このアプリでできること

### 1. クイズで Ruby/Rails を体系的に学ぶ

| カテゴリ | 内容 |
|---|---|
| 💎 Ruby 基礎 | 変数・型・nil・真偽値・メソッド定義など |
| 📦 コレクション | Array / Hash / Enumerable / ブロック処理 |
| 🧱 クラスとモジュール | 継承・Mixin・attr_accessor |
| ⚡ Ruby 上級 | Proc/Lambda・例外・メタプログラミング |
| 🔎 コードリーディング | 複数行コードの挙動・出力を予測 |
| 🛤️ Rails 規約 | 命名規則・MVC・CoC |
| 🔀 ルーティング & コントローラ | RESTful・before_action・Strong Parameters |
| 🗄️ ActiveRecord | 関連・スコープ・クエリ・マイグレーション |
| 🧪 RSpec テスト | describe/it/expect、factory_bot、モック |
| 📜 ログ調査・運用 | tail/grep/journalctl、障害対応の型 |
| 🔧 Git & GitHub | merge/rebase、stash、conflict 解決 |
| 🛡️ セキュリティ (OWASP) | Mass Assignment、SQLi、CSRF、XSS |
| 🔬 デバッグ & パフォーマンス | bullet、EXPLAIN、APM |
| 🐧 Linux & CLI | find/grep/ssh/権限/xargs |
| 🛠️ 実践課題 | 実務想定タスク (FizzBuzz から API 認証・メタプロまで) |
| 🧠 AI エンジニアリング基礎 | Anthropic 5 ワークフロー / ReAct / RAG / LLMOps / NIST AI RMF / ISO 42001 / EU AI Act |
| 🎓 Anthropic 公式認定 (CCA-F) | Claude Certified Architect — Foundations 試験対策 (5 ドメイン) |
| ⚙️ Claude Code 基礎 | ハーネス / CLAUDE.md / Hooks / Skills / Subagents / MCP / Plugins |
| 🛠️ Claude Code 実務活用 | Plan モード / 並列セッション / Output Styles / IDE / Web / 自動化 |
| 🔐 AI セキュリティ | OWASP LLM Top 10 (2025) / Prompt Injection / Lethal Trifecta / MCP セキュリティ |

各問題には:
- **段階的ヒント** (3 段階。最後は『答えに近いヒント』として明示)
- **詳しい解説** — なぜそうなるのか、関連コード例、よくある間違い
- **完璧 / 見直しマーク** で復習対象を管理

### 2. 学習ジャーナルで構造化言語力を鍛える

6 種類のテンプレートで日々の学びを言語化:

| テンプレ | 効果 |
|---|---|
| 📋 KPT | 振り返り → 次行動への変換力 |
| 🌟 STAR | 経験を再現性ある説明に落とす力 |
| 🔍 5W1H | 要素抜けに気付く分解力 |
| ✍️ YWT | 継続しやすい日次ログ |
| 🗣️ PREP | 結論ファーストの説明力 |
| 📝 日報 | 上司・チーム向けの構造化報告 |

各テンプレートに **使い方・記入例・コツ** がモーダルで表示されるので、初心者でも書き始められます。

---

## 使い方

### 🎯 クイズに挑戦する

1. トップから興味のあるカテゴリをクリック
2. **「最初から順番に」** で頭からチャレンジ、または **個別の問題を直接選択**
3. 答えた後、解説を読んで:
   - ✓ **完璧** ボタン → 復習不要
   - 🔁 **見直し** ボタン → あとで復習対象に追加
4. カテゴリ一覧画面で **難易度フィルタ** (初/中/上) や **状態フィルタ** (未挑戦/見直し/完璧) で絞り込み可能
5. 全問完璧にすると 🏆 **マスター達成** バッジが付与

### 💡 ヒントを使うコツ

- 1 段階目: 方向性のヒント (まず自分で考える)
- 2 段階目: より具体的なヒント
- 3 段階目: 答えに近い決定的ヒント (本当に詰まった時だけ)

なるべく 1〜2 段階目で答えにたどり着くと記憶に残ります。

### 🛠️ 実践課題の使い方

実務想定のタスク (Rails モデル設計、N+1 解消、Service Object など) は:

1. 要件を読む
2. **アプリ内のコードエディタ** に自分で書いてみる (Tab=2スペース、自動保存)
3. **「サンプル解答を見る」** で答え合わせ
4. レビュー観点・よくある間違いを確認

### 📝 ジャーナルの書き方

1. ナビの **ジャーナル** → 書きたいテンプレートのカードをクリック
2. 各項目を埋める (自動でドラフト保存)
3. **「セルフレビュー」** ボタンで簡易チェック (文字数・数字の有無・主観表現など)
4. **「保存する」** で記録
5. 過去の記録は一覧から **タイトル・テンプレ種別・記入日時・文字数** で参照可

ジャーナル詳細画面では **テキストコピー** ボタンで Slack / Notion 等に転記できます。日報用途にも便利。

---

## データの取り扱い

デフォルトは **ローカル保存のみ** (アカウント不要、 サーバーへの送信もなし)。
**ログインすると同じ進捗をデバイス間で同期** できます (任意機能)。

- すべてあなたの **ブラウザ (LocalStorage)** に保存されます
- ログインしない限り、 サーバーへ送信される情報は **一切ありません**
- リセットしたい時: ブラウザの DevTools → Application → Local Storage → 該当 origin をクリア

⚠️ ブラウザのデータを削除すると未同期の記録は消えます。 ログインしておけばクラウドからリストア可能。 ジャーナルの **コピー** ボタンで外部 (Notion 等) への転記も推奨。

### ☁️ クラウド同期 (GitHub ログイン) のセットアップ

セルフホストする場合に同期機能を有効化するには Supabase の無料枠で 5 分。
何もしなければ従来通り LocalStorage のみ動作し、 ログインボタンは表示されません。

1. **Supabase プロジェクトを作成** ([app.supabase.com](https://app.supabase.com/))
2. **SQL マイグレーション実行**: `supabase/migrations/0001_init.sql` を SQL Editor に貼って実行
3. **GitHub OAuth を有効化**:
   - GitHub 側で [OAuth App を作成](https://github.com/settings/developers) (Callback URL は Supabase の `https://<project>.supabase.co/auth/v1/callback`)
   - Supabase 側で Authentication → Providers → GitHub に Client ID / Secret を登録
4. **環境変数を設定**: `.env.local.example` を `.env.local` にコピーし、 Supabase の URL と anon key を記入
5. デプロイ環境 (Vercel / Cloudflare Pages 等) でも同じ環境変数を設定

設計詳細: Supabase Auth + Postgres + Row Level Security で「自分の行だけ読み書き」 を DB レベルで保証。 anon key はクライアントに露出して OK (RLS で守られている)。

---

## こんな人におすすめ

- ✅ 未経験から Ruby/Rails で実務に入るために体系的に学びたい
- ✅ Ruby Silver / Gold の試験対策で問題演習したい
- ✅ チェリー本・パーフェクト Ruby on Rails で学んだ内容を定着させたい
- ✅ 日々の学びを言語化する習慣を作りたい
- ✅ 振り返りや日報を書く力を鍛えたい

---

## ライセンス

学習用途で自由にお使いください。

# CodeDojo

複数の言語・フレームワーク・ DevOps 知識を **クイズ** と **学習ジャーナル** と **フラッシュカード** で身につける、 無料の学習プラットフォーム。

🔗 **アプリを開く:** https://code-dojo-app.vercel.app/

---

## このアプリでできること

### 1. クイズで横断的に学ぶ (800+ 問)

| トラック | 主なカテゴリ |
|---|---|
| 💎 Ruby / Rails | Ruby 基礎・コレクション・クラスとモジュール・Ruby 上級 (Proc/Lambda/メタプロ)・コードリーディング・Rails 規約・ルーティング・ActiveRecord・RSpec・ログ運用・セキュリティ・デバッグ・実践課題 |
| 🟨 JavaScript | 基礎・関数・非同期 (Promise / async / WebWorker) |
| 🔷 TypeScript | tsconfig・型システム・Generics・型ガード・Utility Types |
| ⚛️ React / Next.js / Nuxt | Hooks・Server/Client Components・App Router |
| 🐍 Python | 基礎・データ構造・関数 |
| 🗄 SQL | 基礎・JOIN・上級 (Window 関数 / CTE) |
| 🏛 DB 設計 | 正規化・INDEX 戦略・スキーマ設計 |
| 🔧 Git / GitHub | merge / rebase・stash・conflict 解決 |
| 🐧 Linux & CLI | find / grep / ssh / 権限管理 |
| 🛡 セキュリティ | OWASP Top 10・Mass Assignment・XSS / CSRF / SQLi |
| 🧠 AI エンジニアリング | Anthropic 5 ワークフロー・ReAct・RAG・LLMOps・NIST AI RMF |
| ⚙️ Claude Code | ハーネス・CLAUDE.md・Hooks・Skills・Subagents・MCP・Plugins |
| 🛠 Claude Code 実務 | Plan モード・並列セッション・Output Styles・IDE 連携 |
| 🔐 AI セキュリティ | OWASP LLM Top 10 (2025)・Prompt Injection・Lethal Trifecta |

各問題には:
- **段階的ヒント** (3 段階。 最後は『答えに近いヒント』 として明示)
- **詳しい解説** — なぜそうなるのか、 関連コード例、 よくある間違い、 公式ドキュメント参照
- **完璧 / 見直しマーク** で復習対象を管理
- **学び直しガイド** — つまずいた章へワンタップ遷移
- 難易度は **初級 / 中級 / 上級 / Expert** の 4 段階

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

各テンプレートに **使い方・記入例・コツ** がモーダルで表示されるので、 初心者でも書き始められます。

### 3. フラッシュカード (SM-2 アルゴリズム)

クイズの解説やジャーナルから自動で SRS カード化。 Anki と同じ SM-2 アルゴリズムで「忘れた頃にちょうど出てくる」 を実現。

### 4. 📚 参考書 — 体系的に読む

各トラック (Ruby / TypeScript / DB 設計 等) を **章立て** で読み通せるガイド。 章末には「理解度確認クイズ」 が紐付き、 学んだ直後に確認できる。

---

## 使い方

### 🎯 クイズに挑戦する

1. トップから興味のあるカテゴリをクリック
2. **「最初から順番に」** で頭からチャレンジ、 または **個別の問題を直接選択**
3. 答えた後、 解説を読んで:
   - ✓ **完璧** ボタン → 復習不要
   - 🔁 **見直し** ボタン → あとで復習対象に追加
4. カテゴリ一覧画面で **難易度フィルタ** (初/中/上/Expert) や **状態フィルタ** (未挑戦/見直し/完璧) で絞り込み可能
5. 全問完璧にすると 🏆 **マスター達成** バッジが付与

### 💡 ヒントを使うコツ

- 1 段階目: 方向性のヒント (まず自分で考える)
- 2 段階目: より具体的なヒント
- 3 段階目: 答えに近い決定的ヒント (本当に詰まった時だけ)

なるべく 1〜2 段階目で答えにたどり着くと記憶に残ります。

### 📝 ジャーナルの書き方

1. ナビの **ジャーナル** → 書きたいテンプレートのカードをクリック
2. 各項目を埋める (自動でドラフト保存)
3. **「セルフレビュー」** ボタンで簡易チェック (文字数・数字の有無・主観表現など)
4. **「保存する」** で記録
5. 過去の記録は一覧から **タイトル・テンプレ種別・記入日時・文字数** で参照可

ジャーナル詳細画面では **テキストコピー** ボタンで Slack / Notion 等に転記できます。 日報用途にも便利。

---

## データの取り扱い

デフォルトは **ローカル保存のみ** (アカウント不要、 サーバーへの送信もなし)。
**ログインすると同じ進捗をデバイス間で同期** できます (任意機能)。

- ログインしない限り、 すべてあなたの **ブラウザ (LocalStorage)** に保存されます
- ログインしない限り、 サーバーへ送信される情報は **一切ありません**
- リセットしたい時: ブラウザの DevTools → Application → Local Storage → 該当 origin をクリア

⚠️ ブラウザのデータを削除すると未同期の記録は消えます。 ログインしておけばクラウドからリストア可能。 ジャーナルの **コピー** ボタンで外部 (Notion 等) への転記も推奨。

### ☁️ クラウド同期 (GitHub ログイン) のセットアップ

セルフホストする場合に同期機能を有効化するには Supabase の無料枠で 10 分。 何もしなければ従来通り LocalStorage のみ動作し、 ログインボタンは表示されません。

1. **Supabase プロジェクトを作成** ([app.supabase.com](https://app.supabase.com/))
2. **SQL マイグレーション実行**: `supabase/migrations/0001_init.sql` を SQL Editor に貼って実行
3. **GitHub OAuth を有効化**:
   - GitHub 側で [OAuth App を作成](https://github.com/settings/developers) (Callback URL は Supabase の `https://<project>.supabase.co/auth/v1/callback`)
   - Supabase 側で Authentication → Providers → GitHub に Client ID / Secret を登録
4. **Authentication → URL Configuration** で Site URL と Redirect URLs を設定
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback` (本番) + `http://localhost:3000/auth/callback` (開発)
5. **環境変数を設定** (Vercel 等):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<Publishable key>
   ```
6. 再デプロイ (`NEXT_PUBLIC_*` はビルド時に焼き込まれるため必須)

設計詳細: Supabase Auth + Postgres + Row Level Security で「自分の行だけ読み書き」 を DB レベルで保証。 anon (Publishable) key はクライアントに露出して OK (RLS で守られている)。

---

## こんな人におすすめ

- ✅ 複数の言語/フレームワークを横断的に勉強したい
- ✅ Ruby Silver / Gold、 Anthropic CCA-F、 IPA 試験等の対策で問題演習したい
- ✅ 書籍 (チェリー本・パーフェクト Rails・型システム入門 等) で学んだ内容を定着させたい
- ✅ 日々の学びを言語化する習慣を作りたい
- ✅ AI / LLM アプリ開発の基礎セキュリティを押さえたい
- ✅ シニアエンジニアの『設計判断』 の感覚を養いたい (Expert ティア問題)

---

## 技術スタック

- **Next.js 16** (App Router, SSG)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Framer Motion** (アニメーション)
- **Mermaid** (図表)
- **Supabase** (任意機能: 認証 + データ同期)

---

## ライセンス

学習用途で自由にお使いください。

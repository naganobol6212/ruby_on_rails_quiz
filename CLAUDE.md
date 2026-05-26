# CLAUDE.md

このリポジトリでAI (Claude Code等) と共同作業するときの指針。

## プロジェクト概要

**CodeDojo** — 複数言語/フレームワーク (Ruby/Rails, JavaScript, TypeScript, React, Next.js, Python, SQL, Git, AI/Claude 等) をクイズ + 参考書 + 実践課題で横断学習できる SPA。 進捗は LocalStorage 保存、 ログイン時は Supabase で同期。

## スタック

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS 4
- Supabase (Auth + Postgres)
- PWA (manifest + service worker)

## 主要コマンド

```sh
npm run dev       # 開発サーバー
npm run build     # 本番ビルド (型エラー / ルート生成エラーを検出)
npm run lint      # ESLint

# 直接呼ぶ場合
npx tsc --noEmit  # 型チェックのみ
```

PR を出す前に `npx tsc --noEmit && npx eslint src/ && npx next build` を必ず通す。

## ディレクトリ地図

```
src/
  app/                       # Next.js App Router
    layout.tsx               # メタデータ / OGP / 認証 / ヘッダー / フッター
    page.tsx                 # トップ (今日何をやる)
    error.tsx                # グローバルエラー境界
    not-found.tsx            # 404
    roadmap/
      page.tsx               # トラック選択
      [track]/page.tsx       # 個別ロードマップ
      RoadmapView.tsx        # 描画本体 (props 受け取り型)
    quiz/[category]/[questionId]/
    crud/                    # CRUD 実践課題 (Rails)
    guide/                   # 参考書
    stats/                   # 学習統計
    journal/                 # 学習ジャーナル
    explanations/            # 自己説明アーカイブ
    flashcards/              # フラッシュカード
    review/                  # 復習
    track/[trackId]/         # トラック別のカテゴリ一覧
    about/, changelog/, auth/, offline/

  components/                # 共通 UI (SiteHeader, BottomNav, ThemeToggle, AuthButton 等)

  data/
    tracks.ts                # トラック定義 (id / name / emoji / status)
    categories.ts            # カテゴリ定義 (各カテゴリは trackId を持つ)
    roadmap.ts               # 型定義 + Ruby を `roadmap` として後方互換 re-export
    roadmaps/                # トラック別ロードマップ本体
      index.ts               # レジストリ (trackRoadmaps / getRoadmap / summarize)
      ruby.ts, javascript.ts, typescript.ts
    questions*.ts            # 問題データ (問題 ID 先頭は `カテゴリ短縮形-連番3桁` 例: rb-001, jsf-011)
    all-questions.ts         # 全 questions を統合 export
    guides.ts                # 参考書本文 (1 ファイルに集約。 将来分割予定)

  lib/
    types.ts                 # TrackId / CategoryId / Question 等の型
    storage.ts               # LocalStorage I/O
    auth/                    # Supabase 認証コンテキスト + 同期
    stats.ts                 # 統計計算
```

## 拡張の型 (よくある作業)

### 新しい言語/技術トラックを追加する
1. `src/lib/types.ts` の `TrackId` ユニオンに id を追加
2. `src/data/tracks.ts` にトラック情報を追加 (status: "available" or "coming-soon")
3. `src/data/categories.ts` にそのトラックのカテゴリを追加 (`trackId: "新ID"`)
4. `src/data/questions-*.ts` に問題を追加 (ID 先頭は `カテゴリ短縮形-001` から)
5. ロードマップを作る場合: `src/data/roadmaps/<track>.ts` を新規作成し、 `roadmaps/index.ts` の `trackRoadmaps` に登録

### 既存トラックに問題を追加
- カテゴリの問題 ID 連番の続きで追加
- カテゴリ名は `src/data/categories.ts` の `name` と一致させる

### ロードマップ phase の color
`emerald | sky | violet | amber | rose` の 5 色のみ。 増やすときは `RoadmapPhase['color']` と `StepCard.tsx` の `PHASE_COLORS` を同時更新。

## コーディング規約

- **コメント**: 何を (WHAT) は書かず、 なぜ (WHY) と非自明な制約だけを 1 行で
- **絵文字**: ユーザーが明示的に求めない限り基本書かない。 ただし `tracks.ts` / `categories.ts` / ロードマップの `emoji` フィールドは UI 表示用なので例外
- **日本語**: UI 文言はすべて日本語 (敬体)。 半角英数と日本語の間にスペースを入れる
- **後方互換**: マージ済み PR の挙動を壊さない。 `roadmap.ts` の `roadmap` export のように、 旧 API を re-export で温存する手をまず検討
- **テスト**: 現状 Vitest 等のフレームワークは未導入。 追加する場合は別 PR で

## ブランチ運用

- 主開発は `main`
- AI セッションは `claude/<short-name>` ブランチで作業
- マージ済みブランチには追加コミットしない (新しいブランチを切る)
- force-push は `--force-with-lease` を使い、 共有ブランチでは原則使わない

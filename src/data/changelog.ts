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

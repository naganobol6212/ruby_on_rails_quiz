// 学習ジャーナル: 構造化テンプレートで日々の学びを記録する

import { syncDeleteJournalEntry, syncPushJournalEntry } from "./sync";

export type TemplateId =
  | "3line"
  | "kpt"
  | "star"
  | "5w1h"
  | "yww"
  | "prep"
  | "daily-report";

export type TemplateField = {
  key: string;
  label: string;
  hint: string;
  placeholder: string;
  multiline?: boolean;
  /**
   * 『書きにくい人向け』の答えやすい問い。
   * placeholder より具体的で、自分の経験を引き出すきっかけになる質問。
   * UI ではチップで並べ、クリックでフィールド先頭に挿入される。
   */
  prompts?: string[];
};

export type TemplateExample = {
  title: string;
  context?: string;
  content: Record<string, string>;
};

export type TemplateTip = string;

export type Template = {
  id: TemplateId;
  name: string;
  emoji: string;
  description: string;
  // 何を鍛えるか (背景の解説)
  rationale: string;
  // どんな場面で使うか
  useCase: string;
  // 鍛えられる具体的なスキル (短いリスト)
  skills: string[];
  // 続けるコツ・うまく書くコツ
  tips: TemplateTip[];
  fields: TemplateField[];
  // 記入例 (実際に書かれたサンプル)
  examples: TemplateExample[];
};

export const templates: Template[] = [
  // -------------------------------------------------------------------------
  {
    id: "3line",
    name: "3 行ジャーナル",
    emoji: "✏️",
    description:
      "今日 / 学び / 次の一歩 を 1 行ずつ。書き慣れない人の最初の一歩におすすめ",
    rationale:
      "構造化ジャーナルの『ミニマム単位』。事実 (今日) → 内省 (学び) → アクション (次の一歩) の流れだけを 3 行で書きます。書き続ける障壁を最小化しながら、KPT / YWT で鍛えられる思考の型を毎日体に染み込ませる入門用テンプレ。慣れてきたら他のテンプレへ移行を。",
    useCase:
      "ジャーナル初心者 / 完璧主義で続かない人 / 疲れていて長文が無理な日 / 通勤中の 1 分振り返り。3 行だけなら絶対に書ける、を毎日積み上げます。",
    skills: [
      "毎日の継続力 (一番低いハードル)",
      "事実 → 学び → 行動 への流れを体感する",
      "短く端的に書く力",
    ],
    tips: [
      "1 行は 1 文でも単語でも箇条書きでも OK。 完璧を狙わない",
      "『今日』が浮かばなければ『印象に残った 1 つ』だけで OK (会議 / コード / 会話 何でも)",
      "『学び』はかっこいい気付きじゃなくていい。「あれ知らなかった」「再確認した」レベルでも資産になる",
      "『次の一歩』は本当に小さく (例: 『明日 1 つのドキュメントだけ読む』)。実行できる粒度に",
      "週末などに 3 行を 7 個並べて読み返すと、自分のテーマが見えてくる",
    ],
    fields: [
      {
        key: "today",
        label: "今日の出来事",
        hint: "1 行で。印象に残った 1 つ",
        placeholder: "例: チェリー本 7 章を読んだ / PR レビューでブロック解除",
        prompts: [
          "今日、印象に残った瞬間は?",
          "コード / 会議 / 会話 で『お』と思ったことは?",
          "詰まった所、または解けた所は?",
          "今日 1 番時間を使ったことは何?",
        ],
      },
      {
        key: "learning",
        label: "学び / 気付き",
        hint: "1 行で。短くても OK",
        placeholder:
          "例: includes と preload は load 戦略が違う / N+1 は bullet で検知できる",
        prompts: [
          "今日『知らなかった』と思ったことは?",
          "昨日まで曖昧だったことが少しクリアになった事は?",
          "自分の予想と違った結果はあった?",
          "誰かの考え方で『なるほど』と思った瞬間は?",
        ],
      },
      {
        key: "next",
        label: "明日やる小さな一歩",
        hint: "1 行で。5 分で始められる粒度に",
        placeholder:
          "例: bullet gem を development.rb に入れる / RSpec の let 章を読む",
        prompts: [
          "明日の最初に手を付けるならこれ、というものは?",
          "今日の続きで 5 分で始められることは?",
          "今日の学びを『試す』としたら何をしますか?",
          "誰かに聞く / 共有する べきことは?",
        ],
      },
    ],
    examples: [
      {
        title: "実例: ある火曜日",
        content: {
          today: "ペアプロで User モデルの validation テストを 5 本書いた",
          learning:
            "shoulda-matchers で validate_presence_of(:email).is_at_most(255) と 1 行で書ける",
          next: "明日、既存の spec を shoulda-matchers で書き直してみる (まず 1 ファイル)",
        },
      },
      {
        title: "実例: 疲れていた日",
        content: {
          today: "障害対応で 1 日が消えた",
          learning: "Slack の検索は from:@user で人縛り検索が速い",
          next: "ポストモーテムの下書きを 10 分で書く",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "kpt",
    name: "KPT 振り返り",
    emoji: "📋",
    description: "Keep (続ける) / Problem (課題) / Try (試す) の 3 観点で振り返り",
    rationale:
      "アジャイル開発で広く使われる定番フレームワーク。事実 (Keep/Problem) → アクション (Try) の流れを毎回踏むことで、振り返りが『感想』で終わらず確実に次の行動に繋がります。日次・週次・スプリント終了時に使うのが王道。",
    useCase:
      "1 日の業務終わり / 週末の振り返り / スプリントレトロ / プロジェクト終了時。チームでホワイトボードに貼って共有する使い方も定番。",
    skills: [
      "事実と評価を分けて捉える観察力",
      "課題から具体的な行動を導く問題解決力",
      "良い習慣を意識化して継続する力",
    ],
    tips: [
      "Keep には『習慣・姿勢・ツール選択』も書く。タスクの成果だけだと『たまたまうまく行った』で終わる",
      "Problem は『他人のせい』ではなく『自分がコントロールできること』に絞る (例: 「設計レビューが少なすぎる」→「次回は早めに設計レビューを依頼する」)",
      "Try は『明日からやる、5 分で始められる』レベルに落とす。粒度が大きいと実行されない",
      "1 週間後に過去 Try を見返して、実行できたか○×を付ける『Try レビュー』を習慣化",
    ],
    fields: [
      {
        key: "keep",
        label: "Keep — 続けたい良かったこと",
        hint: "うまく行ったやり方、習慣、ツール、姿勢など。",
        placeholder:
          "例: 詰まったらまず公式ドキュメントを開く習慣がついた / PR 出す前にセルフレビューを 5 分やる",
        multiline: true,
        prompts: [
          "今日『うまく行った』と感じた瞬間は具体的にいつ?",
          "詰まった時に役に立ったツール / 手順 / コマンドは?",
          "次もこの調子で続けたい習慣・姿勢は?",
          "チームや自分から「よかった」と評価されたことは?",
          "新しく試して『これは続けよう』と思ったやり方は?",
        ],
      },
      {
        key: "problem",
        label: "Problem — 課題に感じたこと",
        hint: "つまずいた点、時間を浪費した原因、理解が浅い領域。",
        placeholder:
          "例: ActiveRecord の N+1 を毎回 includes で慌てて直している / RSpec の let の挙動を雰囲気で使ってる",
        multiline: true,
        prompts: [
          "今日、想定より時間がかかった作業は?その原因は?",
          "『雰囲気で使ってる』『よく分かってない』と感じた技術 / 概念は?",
          "繰り返し詰まっている同じパターンはある?",
          "レビューや障害で指摘された / 自分で気付いた問題は?",
          "効率が悪いと感じる自分の手順 / 習慣は?",
        ],
      },
      {
        key: "try",
        label: "Try — 次に試すこと",
        hint: "Problem への具体的な対応策。明日から実行可能なレベルに落とす。",
        placeholder:
          "例: PR 出す前に bullet gem のログを確認する手順をチェックリスト化する",
        multiline: true,
        prompts: [
          "Problem 1 つに対して、明日から 5 分で始められる行動は?",
          "Problem の原因を学ぶために『何を / どこから読む』?",
          "誰かに聞く / 共有する のがいいことは?",
          "チェックリスト / テンプレ / 自動化 で再発を防げる Problem はある?",
          "1 週間後にレビューする時、どう測ると効果が分かる?",
        ],
      },
    ],
    examples: [
      {
        title: "RailsアプリのN+1対応の日",
        context: "実務で初めて bullet を導入した日",
        content: {
          keep: "・ログを tail -f で常時監視しながら開発する姿勢\n・bullet gem を development.rb に追加するときに『alert/log/console』を全部有効にした",
          problem: "・既存コードでもN+1が3箇所見つかった。レビュー時に拾えていない\n・includes と eager_load の使い分けがあやふやで毎回ググっている",
          try: "・PRテンプレに『bulletログの確認』チェック欄を追加\n・週末に includes/preload/eager_load の違いを15分でブログにまとめる",
        },
      },
      {
        title: "週次のチーム振り返り",
        content: {
          keep: "デイリーで「困っていること」を最初に共有する流れができた。早期に手助けが入る",
          problem: "PR レビューがフリーズしがち。レビュアー固定で属人化",
          try: "PR テンプレに『推奨レビュアー』欄を追加し、ローテーションで2名指名する",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "star",
    name: "STAR 法",
    emoji: "🌟",
    description: "Situation / Task / Action / Result で 1 つの経験を整理",
    rationale:
      "もとは行動面接で使われる構造化技法。状況→課題→自分の行動→結果と数字、の流れで話すことで、聞き手が『何が起きてあなたは何をしたか』を一発で理解できます。職務経歴書、面接、ポストモーテム、上司への報告で再利用可能。",
    useCase:
      "障害対応の振り返り / 大きなタスク完了時 / 転職用の経験棚卸し / 期末評価の自己評価書作成。1 経験につき 1 STAR が原則。",
    skills: [
      "経験を『再現可能な物語』として説明する力",
      "自分の貢献と結果を数字で語る力",
      "判断の根拠を後から言語化する力 (経験を資産化)",
    ],
    tips: [
      "Action は『チームでやったこと』ではなく『自分が判断・実行したこと』を書く。『I』が主語",
      "Result は必ず数字を 1 つ以上入れる (改善率・削減時間・処理件数など)。数字がないと再現性のない感想に見える",
      "Task は『要件』ではなく『自分が掲げたゴール』。任された仕事 + どこを優先したかの判断を含む",
      "失敗経験でも書ける。Result は『何を学んだか / 次にどう活かすか』で締めれば資産になる",
    ],
    fields: [
      {
        key: "situation",
        label: "Situation — 状況",
        hint: "5W1H を意識して、誰が何の前提で、いつ、どこで起きたか。",
        placeholder:
          "例: 本番リリース直前、決済 API のレスポンスが平均 800ms から 3.5s に劣化していると CS チームから報告",
        multiline: true,
        prompts: [
          "いつ / どこで起きた? (時刻・環境・画面)",
          "気付いたのは誰? どう検知 (アラート / 報告 / 監視) した?",
          "前提として何が決まっていた / 期待されていた?",
          "影響範囲 (ユーザー数 / 売上 / 機能) は?",
        ],
      },
      {
        key: "task",
        label: "Task — 自分が取り組むべき課題",
        hint: "自分の役割と達成すべきゴール。優先順位の判断も含めて。",
        placeholder:
          "例: 当日中に原因を特定し、暫定対応の判断材料を CTO に渡す。本格修正は翌日対応で良い",
        multiline: true,
        prompts: [
          "自分の役割 / 立場は何だった?",
          "達成すべきゴールは? (期限・成功条件)",
          "何を優先 / 何を後回しにすると決めた?",
          "外せない制約 (時間・予算・SLA) は何だった?",
        ],
      },
      {
        key: "action",
        label: "Action — 自分の行動",
        hint: "具体的に何をどう実行したか。判断の根拠も含める。「I」を主語に。",
        placeholder:
          "例: 1) New Relic で該当エンドポイントのトレースを確認 → 決済 API 呼び出し前に N+1 が発生していた\n2) ステージングで再現確認、includes で 1 クエリにまとめる修正を作成\n3) hotfix ブランチで PR、レビュー 2 名でマージ後、本番デプロイ",
        multiline: true,
        prompts: [
          "まず何から始めた? その判断理由は?",
          "途中で方針を変えた瞬間はあった? なぜ?",
          "他のメンバーとどう連携 (相談 / 委譲) した?",
          "ツール / コマンド / クエリで決め手になったものは?",
          "(主語『私』で) 自分が判断・実行したことだけに絞ると?",
        ],
      },
      {
        key: "result",
        label: "Result — 結果と学び",
        hint: "定量・定性両方で。次に活かせる教訓も書く。",
        placeholder:
          "例: P95 3.5s → 180ms (-95%)。CS への問い合わせも翌日 0 件。\n学び: APM での『普段のベースライン』を眺める習慣がなかった。週次でダッシュボードを見る時間をブロック",
        multiline: true,
        prompts: [
          "数字で言える結果は? (前後比較・削減率・件数)",
          "ユーザー / チームへの影響はどう変わった?",
          "この経験から得た学びを 1 文で言うと?",
          "次に似た状況になったら、最初にやることは?",
          "再発防止 / 仕組み化 として残せたことは?",
        ],
      },
    ],
    examples: [
      {
        title: "本番障害ハンドリング (1.5h で復旧)",
        context: "AWS RDS の CPU 100% アラート",
        content: {
          situation:
            "土曜 22 時、CloudWatch アラート発火。本番 RDS の CPU が 30 分間 95% 以上で推移。ユーザーからは『画面が遅い』との SNS 投稿が散見されていた。",
          task:
            "オンコール担当として 30 分以内に原因仮説、1 時間以内にユーザー影響を解消する。本格対応は翌週で OK。",
          action:
            "1) RDS Performance Insights で Top SQL を確認 → posts テーブルのフルスキャンが上位に\n2) 該当クエリを発行しているコードを特定 → 検索画面の order(:created_at) に index 無し\n3) ALTER TABLE で created_at にインデックス追加 (CONCURRENTLY)\n4) 5 分で適用完了、APM の応答時間が即座に改善",
          result:
            "RDS CPU 95% → 18%、検索画面の P95 4.2s → 320ms。SNS 投稿も収束。\n学び: index 漏れは PR レビューで気づくべきだった。Strong Migrations で検出ルール追加 + EXPLAIN を PR description に書く運用に変更",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "5w1h",
    name: "5W1H 整理",
    emoji: "🔍",
    description: "Who / When / Where / What / Why / How で事象を多角的に分解",
    rationale:
      "1 つの出来事を 6 軸で分解する練習。要素抜けに気付く癖がつき、報告書・タスク依頼・障害連絡の精度が劇的に上がります。『状況をフレームで切る』練習として最適。",
    useCase:
      "障害発生時の初動共有 (Slack に書く前に下書き) / 新しいタスクを依頼する前の整理 / ニュース記事の要約練習 / 学んだ概念の整理。",
    skills: [
      "情報を多軸で構造化する分解力",
      "報告・連絡で何が抜けているかに気付く力",
      "曖昧な依頼や報告を『答えやすい質問』に変換する力",
    ],
    tips: [
      "わからない軸も『不明』『未確認』と明示して残す。空欄より抜けが見えやすい",
      "Why は 2 つに分けると深まる: 『なぜ起きた (技術的原因)』『なぜ重要 (ビジネス影響)』",
      "How は『今後どうする』ではなく『どう対応した・する』。Action 寄りに書く",
      "障害報告の場合: When は『発生時刻・検知時刻・収束時刻』の 3 つを書くと完璧",
    ],
    fields: [
      {
        key: "what",
        label: "What — 何が起きた / 何を学んだ",
        hint: "中心となる事実。動詞で短く。",
        placeholder: "例: Sidekiq Job がリトライループに入り続けた",
        prompts: [
          "1 文で言うとどんな出来事 / 学び?",
          "動詞で書くと『〜が〜した』のような形?",
          "誰かに 1 行で報告するとしたら?",
        ],
      },
      {
        key: "when",
        label: "When — いつ",
        hint: "日時・フェーズ・頻度。障害なら検知/発生/収束を分けて",
        placeholder: "例: 月曜 14:30 検知、リリース直後の 14:15 から発生、14:50 に対応完了",
        prompts: [
          "発生 / 検知 / 収束 の 3 つの時刻は?",
          "何度目の出来事? 頻度は?",
          "リリース直後 / 月初 / 週末 など特定のフェーズで起きやすい?",
        ],
      },
      {
        key: "where",
        label: "Where — どこで",
        hint: "システム名・画面・コードパス・環境",
        placeholder:
          "例: 本番環境 (Heroku eu)、Sidekiq worker の WelcomeJob、app/jobs/welcome_job.rb",
        prompts: [
          "どの環境 (本番 / staging / dev) で?",
          "ファイルパス / クラス名 / エンドポイントを具体的に",
          "影響範囲はどこまで? (1 機能 / 全体 / 特定ユーザーのみ)",
        ],
      },
      {
        key: "who",
        label: "Who — 誰が関与・影響",
        hint: "ユーザー / 自分 / チーム / 外部サービス",
        placeholder: "例: 影響: 新規登録ユーザー約 200 名 (重複メール)。対応: 自分とインフラ担当 1 名",
        prompts: [
          "影響を受けたのは誰? (具体数 or 属性)",
          "対応に関わったメンバーは?",
          "上流 / 下流 で関わる外部サービスは?",
        ],
      },
      {
        key: "why",
        label: "Why — なぜ起きた / なぜ重要",
        hint: "原因 (技術 + ビジネス両軸で)",
        placeholder:
          "例: 技術的: discard_on の指定漏れで RecordNotFound 例外でも無限リトライ。ビジネス的: ユーザー体験悪化 + メール送信コスト増",
        multiline: true,
        prompts: [
          "技術的な原因を 1 文で?",
          "『なぜ』を 5 回繰り返すと根本原因は何?",
          "ビジネス / ユーザーへの影響を金額 / 数 で表すと?",
          "なぜ今までは表面化していなかった?",
        ],
      },
      {
        key: "how",
        label: "How — どう対応 / どう活かす",
        hint: "対応手順 / 今後の再発防止",
        placeholder:
          "例: ApplicationJob に discard_on の標準を追加 + PR テンプレに項目追加。Sidekiq Dead Set も監視へ",
        multiline: true,
        prompts: [
          "暫定対応の手順 (1, 2, 3) は?",
          "本格修正で何を変える?",
          "再発防止: コード / プロセス / ドキュメント のどれを変える?",
          "監視 / アラート / テスト で次回早く気付ける仕組みは?",
        ],
      },
    ],
    examples: [
      {
        title: "Sidekiq リトライループの分析",
        content: {
          what: "WelcomeJob が同一ジョブで 25 回リトライ、メールも 25 通送信",
          when: "金曜 18:10 検知 / 17:45 デプロイ後から発生 / 18:30 hotfix デプロイで停止",
          where: "本番 (Heroku) / Sidekiq worker / app/jobs/welcome_job.rb",
          who: "影響: 同日登録 12 名 (各 25 通メール)。対応: 自分 1 名、レビュー 1 名",
          why: "原因: User が createされる前にJobがperform_laterされていた → User.find が失敗 → 25回リトライ。なぜ重要: 顧客に重複メールで信頼低下、SendGrid 課金 +12,000 通",
          how: "after_commit に変更 + retry_on の RecordNotFound を discard_on に変更。再発防止としてrubocop-rspec のカスタムルールで perform_later の位置を検査",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "yww",
    name: "YWT (やった / わかった / 次やる)",
    emoji: "✍️",
    description: "やったこと / わかったこと / 次やること で簡潔な日次振り返り",
    rationale:
      "産能大学発祥の振り返り型。KPT より軽くて短時間で書けるため、毎日続けやすい。3 ヶ月続けると『わかったこと』の蓄積が圧倒的な資産になります。",
    useCase:
      "毎日 5 分のクイック振り返り / 学習時間の終わりに / オンライン学習・書籍学習のログとして。",
    skills: [
      "毎日続ける習慣力 (一番小さく書ける型式なので継続率が高い)",
      "『なんとなくの学び』を言語化する力",
      "学習の連続性を作る (前日の T → 今日の Y へ繋ぐ)",
    ],
    tips: [
      "Y (やった) は箇条書きでよい。完了タスク・読んだもの・触ったコード",
      "W (わかった) はメインディッシュ。『なぜそうなるか』『前の理解とどう違うか』を書くと深まる",
      "T (次やる) は翌日の Y にちゃんと書けるか?を意識して具体的に",
      "毎日同じ場所 (例: 寝る前 5 分) で書くと続く。Notion / Obsidian / このアプリ等、開きやすい場所で",
    ],
    fields: [
      {
        key: "done",
        label: "Y — 今日やったこと",
        hint: "事実ベースで箇条書き。タスク・読んだもの・書いたコード",
        placeholder:
          "・チェリー本 7 章を読了\n・User モデルの validation テストを 5 ケース追加\n・PR #142 のレビュー対応",
        multiline: true,
        prompts: [
          "今日完了したタスク / コミットは?",
          "読んだ書籍 / 記事 / ドキュメントは?",
          "触ったコード / ファイル / コマンドは?",
          "誰かと話した内容で印象に残ったものは?",
        ],
      },
      {
        key: "learned",
        label: "W — わかったこと",
        hint: "理解できた概念・仕組み。『なぜ』を入れる",
        placeholder:
          "・deliver_later は ActionMailer が自動で ActiveJob でラップしているだけで、本質は perform_later と同じ\n・has_secure_password は bcrypt gem のラッパーで、cost=12 がデフォ。テストでは cost を下げて高速化できる",
        multiline: true,
        prompts: [
          "今日『なるほど』と思った瞬間は?",
          "昨日まで曖昧だった概念で、少しクリアになった事は?",
          "『なぜ動くか』が分かった仕組みは?",
          "自分の予想と違った結果から学んだことは?",
          "前と今の理解の差分を 1 文で言うと?",
        ],
      },
      {
        key: "next",
        label: "T — 次やること",
        hint: "明日 / 次回の具体的なアクション",
        placeholder:
          "・retry_on / discard_on のドキュメントを読んで、リトライ戦略を実プロジェクトで設定\n・チェリー本 8 章 (例外処理) を読む",
        multiline: true,
        prompts: [
          "今日の続きで明日まず手を付けるのは?",
          "今日の学びを『試す』としたら何をする?",
          "誰かに聞く / 共有する べきことは?",
          "5 分で始められる小さな次の一歩は?",
        ],
      },
    ],
    examples: [
      {
        title: "RSpec を初めて触った日",
        content: {
          done:
            "・factory_bot で User factory を作成\n・User モデルの validation spec を 8 ケース書いた\n・request spec で /users#create のテスト追加",
          learned:
            "・let は遅延評価される。使われないテストでは生成されないので、副作用ありなら let! を使う\n・build_stubbed は DB INSERT 無しで id まで持つ偽オブジェクト。バリデーションだけのテストなら create より圧倒的に速い (DB を叩かない)\n・request spec は HTTP リクエストを送るので、ルーティング + コントローラ + ビューを一気通貫でテストできる",
          next:
            "・factory に trait を追加してロール別ユーザーを生成できるようにする\n・shoulda-matchers を導入してバリデーションテストを 1 行で書けるようにする",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "prep",
    name: "PREP 法 (説明訓練)",
    emoji: "🗣️",
    description: "Point (結論) → Reason (理由) → Example (例) → Point (再結論)",
    rationale:
      "ビジネスコミュニケーションの基本型。『最初と最後に結論を 2 度言う』ことで聞き手の理解が定着し、口頭でも文章でも『伝わる』表現に変わります。技術的な説明・面接・社内 LT の準備に最適。",
    useCase:
      "ペアプロでの設計説明 / コードレビューで自分の判断を説明 / 面接の技術的質問への回答練習 / Slack で長い説明を書く前の下書き。",
    skills: [
      "結論ファーストで話す力 (聞き手の負担を減らす)",
      "理由と具体例で論を補強する力",
      "曖昧な疑問を 1 つの主張に絞り込む力",
    ],
    tips: [
      "Point は『〜である』『〜すべき』と言い切る。曖昧語 (思う・かもしれない) を排除",
      "Reason は 1〜3 個。それ以上書くと結論がぼやける",
      "Example はコード例 / 数字 / 経験談で具体的に。これが説得力の源泉",
      "再 Point は別の言い回しで補強。最初と全く同じ文だとくどい",
      "1 テーマ 5 分で書く練習を続けると、Slack 投稿の質が劇的に上がる",
    ],
    fields: [
      {
        key: "topic",
        label: "テーマ / 質問",
        hint: "誰かに説明する想定のお題を 1 文で",
        placeholder: "例: Ruby の Symbol と String、いつどっちを使う？",
        prompts: [
          "今日学んだ概念で誰かに説明したいものは?",
          "面接や勉強会で『説明してください』と言われそうな話題は?",
          "新人に教えるなら、何から説明する?",
        ],
      },
      {
        key: "point",
        label: "P — 結論 (一言で)",
        hint: "最初に言い切る。『〜である』で締める",
        placeholder:
          "識別子としての用途は Symbol、ユーザーから受け取る可変なテキスト値は String を使う",
        multiline: true,
        prompts: [
          "この問いへの答えを 1 文で言うと?",
          "『つまり〜である』で締める形にすると?",
          "曖昧語 (思う・かもしれない) を抜くとどう書ける?",
        ],
      },
      {
        key: "reason",
        label: "R — 理由",
        hint: "1〜3 個の理由。比較で書くと明確になる",
        placeholder:
          "1. Symbol は immutable で同名なら同一オブジェクト → 比較速度・メモリ効率が良い\n2. String は mutable で都度生成 → 動的に組み立てる用途に向く\n3. ユーザー入力を to_sym すると無制限にシンボル生成されメモリリーク懸念",
        multiline: true,
        prompts: [
          "なぜそう言える?根拠を 3 つ挙げると?",
          "対比相手と比べた時の違いは?",
          "技術的な仕組み (内部実装 / 計算量) で言うと?",
        ],
      },
      {
        key: "example",
        label: "E — 具体例",
        hint: "コード例・シナリオで補強",
        placeholder:
          "Hash のキー: { name: 'Alice', role: :admin } のように key と状態フラグは Symbol\n値: user.name = 'Alice' のような可変テキストは String\nアンチパターン: params[:role].to_sym (ユーザー入力をSymbol化) → 攻撃者が好きなだけメモリ消費可能",
        multiline: true,
        prompts: [
          "コードで書くと?",
          "実際に遭遇した場面 / バグ事例は?",
          "アンチパターン (やりがちな間違い) を 1 つ挙げると?",
          "数字 (件数 / 時間 / バイト) で示せる例は?",
        ],
      },
      {
        key: "point2",
        label: "P — 再結論",
        hint: "最初の Point を別の言い回しで補強",
        placeholder:
          "つまり『役割が固定された名前・識別子』なら Symbol、『その場で生成される / 外部から来るデータ』なら String と覚えると判断に迷わない",
        multiline: true,
        prompts: [
          "最初の結論を別の言葉で言い換えると?",
          "判断に迷った時の『覚え方』ルールにすると?",
          "1 行で結論を再強調すると?",
        ],
      },
    ],
    examples: [
      {
        title: "テストにモックを使う基準",
        content: {
          topic: "RSpec で stub / mock を使うべき基準は？",
          point:
            "外部依存 (ネットワーク / 課金 / メール送信) は必ずモック、自プロジェクト内のクラス連携はなるべく実物を使う",
          reason:
            "1. 外部依存をモックしないとテストが遅く・脆くなる\n2. 自プロジェクト内を全部モックするとリファクタで一斉に壊れて意味がない\n3. モックは『契約』を表す。Stripe API の挙動を再現するのは Stripe gem の責任で、私達はその契約を信じる",
          example:
            "OK: allow(Stripe::Charge).to receive(:create).and_return(double(id: 'ch_xxx'))\nNG: 自プロジェクトの PostService をモックして、PostsController から呼ぶ部分をテスト\n→ 結合バグが見つからない。実物を使う + 契約テスト的に書く",
          point2:
            "ルール: 『プロセス境界を超えるもの』はモック、『同じプロセス内のクラス連携』は実物。コストとリアリティのバランスを取る",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "daily-report",
    name: "日報フォーマット",
    emoji: "📝",
    description: "上司・チームに共有する形式 (サマリー / 進捗 / 学び / 相談 / 明日)",
    rationale:
      "上司との信頼関係は日々の報告で築かれる。曖昧な『順調に進めています』ではなく、構造化された日報を出すことで『仕事が見える』 → 安心される → 任される範囲が広がる、の好循環を作れます。",
    useCase:
      "毎日終業前の 10 分 / Slack の DM や日報チャンネルに投稿 / 新人〜2 年目で特に効果大 (信頼貯金が貯まる)。",
    skills: [
      "報連相を構造化する力",
      "事実と相談を分けて書く力",
      "明日の計画を具体的に書く力 (= 自分の予定が見える)",
    ],
    tips: [
      "サマリーは『今日を一言で』。Slack のプレビューに出るので最重要",
      "進捗は『タスク → 結果 (% or ✓)』の形式。何を / どこまでが明確に",
      "相談は『判断してほしいこと』を明示。読み手が即答できる質問にする",
      "明日の予定は優先順 + 想定時間。実態とのずれを翌日に検証すると見積もり精度が上がる",
      "毎日続けると評価面談時に『振り返り資料』として使える。年末年始に大きな価値を発揮",
    ],
    fields: [
      {
        key: "summary",
        label: "1 行サマリー",
        hint: "今日を一言で。Slack スレッドの最初に貼れるレベル",
        placeholder: "例: Welcome Mailer の Job 化 PR をレビュー依頼まで完了 (テストは 80%)",
        prompts: [
          "今日の主役タスクを 1 文で言うと?",
          "上司に『今日何した?』と聞かれたら何と答える?",
          "進捗率を %で添えるとどう?",
        ],
      },
      {
        key: "progress",
        label: "今日の進捗",
        hint: "番号付きで『タスク → 結果』。何が完了 / 進行中 / 未着手か明示",
        placeholder:
          "1. Welcome Mailer の Job 化実装 ✓\n2. Job のテスト (request spec) 80% (perform_later 検証が残)\n3. ステージングデプロイ + 動作確認 ✓\n4. ドキュメント更新 未着手",
        multiline: true,
        prompts: [
          "今日完了したタスクは? (✓ で番号付き)",
          "進行中の作業はどこまで進んだ? (% で)",
          "予定していたが未着手のタスクは? 理由は?",
          "予定外で対応した作業 (差し込み) は?",
        ],
      },
      {
        key: "learnings",
        label: "今日の学び",
        hint: "技術 / プロセスで気付いたこと。短くても OK",
        placeholder:
          "・ActiveJob::TestHelper の have_enqueued_job matcher は perform_later の検証に便利\n・retry_on は wait: :polynomially_longer が Rails 7.1+ のデフォルト推奨",
        multiline: true,
        prompts: [
          "今日初めて知った API / 設定 / コマンドは?",
          "ドキュメントを読んで『へえ』と思ったことは?",
          "ペアプロ / レビュー で学んだ書き方は?",
          "プロセス / コミュニケーションで気付いたことは?",
        ],
      },
      {
        key: "blockers",
        label: "詰まり / 相談したいこと",
        hint: "誰の判断が必要かを明示。判断材料も添える",
        placeholder:
          "・Sidekiq の Dead Set 監視: 何件溜まったら通知すべきか? 過去 30 日の平均 3 件 / 日。10 件超えで通知の運用案 (要 @チームリード判断)",
        multiline: true,
        prompts: [
          "判断を仰ぎたい論点と、判断材料 (数字 / 案) は?",
          "他チーム / 外部に依頼している待ち事項は?",
          "技術的に詰まっていて助けが欲しいことは?",
          "リスク / 懸念で共有しておきたいことは?",
        ],
      },
      {
        key: "tomorrow",
        label: "明日の予定",
        hint: "優先順 + 想定時間。実績との差分が見積もり精度の材料に",
        placeholder:
          "1. テスト残り (1h)\n2. PR レビュー対応 + マージ (1h)\n3. ドキュメント更新 (0.5h)\n4. 次タスク (検索 API 設計) のキックオフ (2h)",
        multiline: true,
        prompts: [
          "明日まず手を付ける優先タスクは? 想定時間は?",
          "今日積み残したタスクで明日続けるものは?",
          "MTG / ペアプロ / 1on1 の予定は?",
          "明日中に終わらせたいゴールは?",
        ],
      },
    ],
    examples: [
      {
        title: "実例: ある木曜日の日報",
        content: {
          summary:
            "Welcome Mailer の Job 化 PR をレビュー依頼まで完了 (#312, 残りテスト 1 ケース)",
          progress:
            "1. Welcome Mailer の Job 化実装 ✓ (PR #312)\n2. request spec で perform_later 検証 80% (assert_enqueued_with の引数指定で詰まり中)\n3. ステージングで動作確認 ✓ (3 件で perform_later → メール送信を確認)\n4. README の Sidekiq 起動手順を最新化 ✓",
          learnings:
            "・assert_enqueued_with は args/queue/at で絞り込み可\n・ActionMailer は内部で ActionMailer::DeliveryJob を perform_later している。なので Mailer も Job として扱える\n・本番では Sidekiq の dead queue を週次でチェックする運用が必要そう",
          blockers:
            "・Sidekiq Dead Set の閾値: 10 件 / 日で Slack 通知する運用にして良いか? (過去 30 日平均は 3 件)。承認もらえれば明日 alerting を実装します → @tanaka さん",
          tomorrow:
            "1. テスト残り 1 ケース完了 + マージ依頼 (1h)\n2. Sidekiq alerting 実装 (条件付き、2h)\n3. 次タスク: ユーザー検索 API の設計レビュー資料作成 (2.5h)\n4. ペアプロ: 山田さんと N+1 調査ワークショップ 16:00- (1.5h)",
        },
      },
    ],
  },
];

export const findTemplate = (id: string) =>
  templates.find((t) => t.id === id);

// LocalStorage に保存される journal entry
export type JournalEntry = {
  id: string;
  templateId: TemplateId;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: Record<string, string>;
};

const STORAGE_KEY = "rrq_journal_v1";

const emit = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("rrq:journal-updated"));
  }
};

export function loadEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as JournalEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: JournalEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  emit();
}

export function createEntry(
  templateId: TemplateId,
  content: Record<string, string>,
  title?: string,
): JournalEntry {
  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    templateId,
    createdAt: now,
    updatedAt: now,
    title: title?.trim() || defaultTitle(templateId, content),
    content,
  };
  const entries = loadEntries();
  entries.unshift(entry);
  saveEntries(entries);
  syncPushJournalEntry(entry);
  return entry;
}

export function updateEntry(
  id: string,
  content: Record<string, string>,
  title?: string,
): JournalEntry | null {
  const entries = loadEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const updated: JournalEntry = {
    ...entries[idx],
    content,
    title: title?.trim() || entries[idx].title,
    updatedAt: new Date().toISOString(),
  };
  entries[idx] = updated;
  saveEntries(entries);
  syncPushJournalEntry(updated);
  return updated;
}

export function deleteEntry(id: string) {
  const entries = loadEntries().filter((e) => e.id !== id);
  saveEntries(entries);
  syncDeleteJournalEntry(id);
}

export function findEntry(id: string): JournalEntry | undefined {
  return loadEntries().find((e) => e.id === id);
}

function defaultTitle(
  templateId: TemplateId,
  content: Record<string, string>,
): string {
  const candidates: Record<TemplateId, string[]> = {
    "3line": ["today", "learning"],
    kpt: ["keep", "problem", "try"],
    star: ["task", "situation"],
    "5w1h": ["what", "why"],
    yww: ["learned", "done"],
    prep: ["topic", "point"],
    "daily-report": ["summary", "progress"],
  };
  const keys = candidates[templateId] ?? Object.keys(content);
  for (const k of keys) {
    const v = (content[k] ?? "").trim();
    if (v) return v.slice(0, 40);
  }
  const today = new Date().toLocaleDateString("ja-JP");
  return `${today} の振り返り`;
}

export function entryToText(entry: JournalEntry): string {
  const template = findTemplate(entry.templateId);
  if (!template) return JSON.stringify(entry.content, null, 2);

  const date = new Date(entry.createdAt).toLocaleDateString("ja-JP");
  const lines: string[] = [];
  lines.push(`【${template.name}】${entry.title}`);
  lines.push(`日付: ${date}`);
  lines.push("");
  for (const field of template.fields) {
    const value = entry.content[field.key]?.trim();
    if (!value) continue;
    lines.push(`■ ${field.label}`);
    lines.push(value);
    lines.push("");
  }
  return lines.join("\n").trim();
}

// ===========================================================================
// 継続記録 / 統計 (Streak / Stats / Heatmap)
// ===========================================================================

/** YYYY-MM-DD 形式のローカル日付キー */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 0:00 始まりの Date を返す (時刻情報を落とす) */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffInDays(a: Date, b: Date): number {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / 86400000);
}

export type StreakInfo = {
  /** 現在の連続記録日数 (今日 or 昨日まで連続なら) */
  current: number;
  /** これまでの最長連続日数 */
  longest: number;
  /** 記録のあった日数 (重複排除) */
  totalDays: number;
  /** 直近で書いた日付 (なければ null) */
  lastDate: string | null;
  /** 今日記録があるか */
  todayWritten: boolean;
  /** 昨日記録があるか (今日まだ書いてない時に連続継続中か判定する) */
  yesterdayWritten: boolean;
};

export function computeStreak(entries: JournalEntry[]): StreakInfo {
  const today = startOfDay(new Date());
  const todayKey = toDateKey(today);
  const yesterdayKey = toDateKey(new Date(today.getTime() - 86400000));

  if (entries.length === 0) {
    return {
      current: 0,
      longest: 0,
      totalDays: 0,
      lastDate: null,
      todayWritten: false,
      yesterdayWritten: false,
    };
  }

  // 日付ごとに集約 (重複排除)
  const dayKeys = new Set<string>();
  for (const e of entries) {
    dayKeys.add(toDateKey(new Date(e.createdAt)));
  }
  const sortedDates = Array.from(dayKeys)
    .map((k) => new Date(`${k}T00:00:00`))
    .sort((a, b) => b.getTime() - a.getTime()); // 新しい順

  const todayWritten = dayKeys.has(todayKey);
  const yesterdayWritten = dayKeys.has(yesterdayKey);

  // current streak: 今日 or 昨日から遡って何日連続
  let current = 0;
  const anchor = todayWritten ? today : yesterdayWritten ? new Date(today.getTime() - 86400000) : null;
  if (anchor) {
    let cursor = anchor;
    while (dayKeys.has(toDateKey(cursor))) {
      current++;
      cursor = new Date(cursor.getTime() - 86400000);
    }
  }

  // longest streak: 全期間で最長
  let longest = 0;
  let run = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const gap = diffInDays(sortedDates[i - 1], sortedDates[i]);
    if (gap === 1) {
      run++;
    } else {
      longest = Math.max(longest, run);
      run = 1;
    }
  }
  longest = Math.max(longest, run, current);

  return {
    current,
    longest,
    totalDays: dayKeys.size,
    lastDate: sortedDates[0] ? toDateKey(sortedDates[0]) : null,
    todayWritten,
    yesterdayWritten,
  };
}

/** 直近 N 日 (今日含む) の日別件数 Map (key: YYYY-MM-DD) */
export function dailyCounts(entries: JournalEntry[], days = 365): Map<string, number> {
  const counts = new Map<string, number>();
  const today = startOfDay(new Date());
  const oldest = new Date(today.getTime() - (days - 1) * 86400000);
  for (const e of entries) {
    const d = new Date(e.createdAt);
    if (d < oldest) continue;
    const key = toDateKey(d);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/** 特定日のエントリ (新しい順) */
export function entriesOnDay(
  entries: JournalEntry[],
  date: Date = new Date(),
): JournalEntry[] {
  const key = toDateKey(date);
  return entries
    .filter((e) => toDateKey(new Date(e.createdAt)) === key)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** 最後に使ったテンプレ ID を覚える / 取得 (毎日同じ型で書ける UX 用) */
const LAST_TEMPLATE_KEY = "rrq_journal_last_template_v1";

export function rememberLastTemplate(templateId: TemplateId) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_TEMPLATE_KEY, templateId);
  } catch {
    /* noop */
  }
}

export function getLastTemplateId(): TemplateId | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(LAST_TEMPLATE_KEY);
    if (!v) return null;
    return templates.some((t) => t.id === v) ? (v as TemplateId) : null;
  } catch {
    return null;
  }
}

/** 同じテンプレで書いた直近 1 件 (createdAt より前) を取得 — 継続性表示用 */
export function previousEntryOfTemplate(
  entries: JournalEntry[],
  templateId: TemplateId,
  beforeDate?: Date,
): JournalEntry | null {
  const cutoff = beforeDate ? beforeDate.getTime() : Date.now();
  const candidates = entries
    .filter(
      (e) =>
        e.templateId === templateId &&
        new Date(e.createdAt).getTime() < cutoff,
    )
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return candidates[0] ?? null;
}

export type MonthlyCount = {
  /** YYYY-MM */
  ym: string;
  count: number;
};

/** 月別件数 (直近 N ヶ月、古い順) */
export function monthlyCounts(entries: JournalEntry[], months = 6): MonthlyCount[] {
  const now = new Date();
  const buckets: MonthlyCount[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({ ym, count: 0 });
  }
  const ymOf = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };
  for (const e of entries) {
    const ym = ymOf(e.createdAt);
    const bucket = buckets.find((b) => b.ym === ym);
    if (bucket) bucket.count++;
  }
  return buckets;
}

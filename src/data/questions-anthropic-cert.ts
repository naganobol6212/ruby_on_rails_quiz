import type { Question } from "@/lib/types";

/**
 * CCA-F (Claude Certified Architect — Foundations) 模擬問題集 — 本番形式 30 問。
 * 6 つの本番想定シナリオ × 5 ドメイン (Agentic 27% / Claude Code 20% / Prompt 20% / MCP 18% / Context 15%) の構成。
 * 試験本番と同じく、シナリオ文脈を読んでトレードオフを判断する設問に揃えている。
 *
 * ID 規則: acc-{scenario}-{domain}
 *   scenario: a〜f (6 つのシナリオ)
 *   domain:   ag (Agentic) / cc (Claude Code) / pe (Prompt) / mc (MCP) / cx (Context)
 */

// シナリオの定型ヘッダー (各問の冒頭に貼る短縮版)
const SC = {
  a: "**シナリオ A — SaaS スタートアップが Claude Code を 30 名規模で社内展開**: SRE が CLAUDE.md・slash command・MCP の標準化を任され、GitHub Actions と統合した PR レビュー自動化を構築している。",
  b: "**シナリオ B — 大手 EC のカスタマーサポート自動応答エージェント**: 月 50 万件の問い合わせをエージェントで一次対応。注文 API・在庫 API・返金 API を MCP 化し、信頼度が低い案件のみ人間にエスカレーション。",
  c: "**シナリオ C — 法務部門の契約書 PDF 構造化抽出パイプライン**: 数千件の NDA・MSA から条項を JSON で抽出し、CRM に投入。誤抽出は法務リスクに直結するため精度と検証性が最重要。",
  d: "**シナリオ D — 製薬企業の社内ナレッジ検索 (RAG + MCP)**: 論文 DB・社内 Wiki・実験ノート (NotebookLM)・Slack の 4 MCP サーバを横断する研究者向けアシスタント。機微情報のスコープ管理が必須。",
  e: "**シナリオ E — 銀行の KYC 審査支援エージェント (Human-in-the-loop)**: 本人確認書類と取引履歴から異常を検出。最終判断は審査担当者で、エージェントは候補と根拠を提示するのみ。監査ログ義務あり。",
  f: "**シナリオ F — OSS リポジトリのバグ修正自動化 (Multi-Subagent)**: GitHub Issue を受けて Plan / Code / Review の 3 Subagent でパッチを生成、CI を回し PR を出すパイプライン。長尺コンテキストで暴走しやすい。",
};

export const anthropicCertQuestions: Question[] = [
  // ===========================================================================
  // シナリオ A: SaaS スタートアップ社内 Claude Code 展開
  // ===========================================================================
  {
    id: "acc-a-ag",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.a}\n\nCEO が「全社員がエージェントに何でも任せられる単一の汎用エージェントを 1 つ作って」と要望してきた。アーキテクトとして最も適切な応答は？`,
    choices: [
      "用途別 (PR レビュー / インシデント対応 / ドキュメント生成 など) に Subagent または slash command を切り分け、汎用 1 個ではなく『context 分離・専門化・並列化』の利得が orchestration コストを上回る範囲で構成する",
      "1 つの巨大な CLAUDE.md にすべての業務指示を書き、Claude にすべてを任せる",
      "Subagent は使わずプロンプトをスイッチで分岐させる単一エージェントを作る",
      "全社員にそれぞれ完全に独立した Claude を割り当て、共有しない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Anthropic 公式の判断軸 (context 分離・専門性・並列化 vs orchestration コスト) に沿った設計。",
      "不正解。巨大 CLAUDE.md は context window を圧迫し、関係ない指示が判断を歪める。",
      "不正解。プロンプトスイッチは context が混ざり verify が困難。",
      "不正解。共有なしは規約・ベストプラクティスの再利用が効かず、組織展開の利点を失う。",
    ],
    hints: [
      "Subagent 設計は『汎用 vs 専門』の天秤。",
      "context isolation がキーワード。",
      "1 つに詰めるのも、無秩序に分けるのも誤り。",
    ],
    explanation: {
      summary:
        "用途別に Subagent / slash command を切り出すのが正解。Anthropic は『context 分離・専門性・並列化のメリットが orchestration コストを上回るときに分割する』を公式の判断軸としている。",
      reason:
        "汎用 1 個は CLAUDE.md が肥大化し、PR レビュー向けの指示がインシデント対応の判断にノイズとして混ざる。逆に分けすぎると引き渡しエラー・観測性低下のコストが上回る。CCA-F の Agentic ドメイン (27%) の中核論点。",
      references: [
        { label: "Introduction to Subagents", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-a-cc",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.a}\n\n社員ごとに「個人的なメモ」も書きたい一方、組織として強制したいガイドライン (PII の扱い・コミット規約) もある。CLAUDE.md の階層をどう設計する？`,
    choices: [
      "Enterprise memory に強制ガイドライン、Project memory に PJ 固有規約、User memory に個人メモ。優先順位は Enterprise > Project > User",
      "全員が同じ 1 つの CLAUDE.md を共有編集する",
      "個人メモを Project memory に書き、全員に強制する",
      "Enterprise memory は廃止し User memory のみ使う",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Claude Code の 3 階層メモリ (Enterprise / Project / User) と優先順位を正しく使い分け。",
      "不正解。共有編集は競合とガバナンス崩壊を招く。",
      "不正解。個人設定を Project に書くと全員に強制され混乱。",
      "不正解。組織ポリシーの強制が効かなくなる。",
    ],
    hints: [
      "CLAUDE.md は 3 階層。",
      "強制したい指示は最上位レイヤに。",
      "個人メモは User scope。",
    ],
    explanation: {
      summary:
        "Claude Code は Enterprise / Project / User の 3 階層メモリを持ち、強制ガイドラインは Enterprise、PJ 固有規約は Project、個人メモは User に分けるのが正解。",
      reason:
        "Foundations の Claude Code ドメイン (20%) はメモリ階層の上書き順序とスコープ管理が頻出。Enterprise を使うとセキュリティポリシーを全社員に強制でき、User scope の個人カスタムと両立できる。",
      references: [
        { label: "Claude Code docs — memory", url: "https://docs.claude.com/claude-code" },
      ],
    },
  },
  {
    id: "acc-a-pe",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.a}\n\nPR レビュー用の custom slash command を作成。レビュー結果を CI が機械処理できるよう、severity ごとに件数を JSON で出力させたい。最も堅い実装は？`,
    choices: [
      "Tool Use の input_schema で {high:int, medium:int, low:int, comments:[{file,line,note}]} を JSON Schema で固定し、few-shot で 2 例示してから本番入力を渡す",
      "プロンプトに『JSON で返して』とだけ書き、後処理で正規表現でパース",
      "Markdown 表で返させ、awk でパース",
      "自由文で返させ、別の Claude で要約",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Tool Use / structured output で型保証 + few-shot で安定化が王道。",
      "不正解。スキーマ未固定の JSON は欠落・余計な前置きでパース失敗。",
      "不正解。Markdown のパースは脆い。",
      "不正解。2 段階処理はコスト増 + ハルシネーション増幅。",
    ],
    hints: [
      "structured output が Prompt ドメインの中核。",
      "JSON Schema + few-shot。",
      "後処理の正規表現は脆い。",
    ],
    explanation: {
      summary:
        "Tool Use の input_schema (JSON Schema) で出力構造を固定し、few-shot で 1〜2 例示するのが Prompt Engineering ドメイン (20%) の王道。",
      reason:
        "structured output を Tool Use 経由で要求すると、Claude 側が JSON を必ず schema に沿った形で返すため後処理の正規表現が不要。プロンプトで『JSON で』と頼むだけだと、前置きや markdown コードフェンスが混ざりやすい。",
      references: [
        { label: "Building with the Claude API", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api" },
      ],
    },
  },
  {
    id: "acc-a-mc",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.a}\n\nGitHub の MCP サーバを導入。全社員が同じ GitHub Token を使うことになっており、個人検証用のプライベートリポジトリにも触れてしまう。MCP server scope の設計として最適なのは？`,
    choices: [
      "Project scope で organization repo 限定の token を配布、User scope で個人の Personal Access Token を別途登録 (本番 PR には Project scope を使用)",
      "Local scope に全員 root の Token を配布",
      "User scope に管理者 Token を入れ全員で共有",
      "MCP server は廃止して全部 Bash で叩く",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。MCP の scope (Local / Project / User) を分けて権限を最小化。",
      "不正解。全員 root 配布は権限過多。",
      "不正解。管理者 Token 共有は監査・取り消し不能。",
      "不正解。MCP の利点を捨てる必要はない。",
    ],
    hints: [
      "MCP には Local / Project / User の scope がある。",
      "本番権限と個人検証を分離。",
      "最小権限の原則。",
    ],
    explanation: {
      summary:
        "MCP server の scope (Local / Project / User) を分けて『業務 Token = Project』『個人 Token = User』に切り分けるのが Tool Design & MCP ドメイン (18%) の正解。",
      reason:
        "Tool Use 設計では『どの粒度で server を共有するか』が頻出論点。Project scope なら repo にコミットされ team 全体に配布、User scope なら個人マシンにのみ存在する設定。本番権限を Project に置けば監査も効く。",
      references: [
        { label: "Advanced MCP", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-a-cx",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.a}\n\nGitHub Actions で 5,000 行クラスの PR をレビューさせると、context window を使い切って末尾の指示が無視される事故が発生。応急対応として最も適切なのは？`,
    choices: [
      "差分 chunk 化 + Subagent で per-file レビュー → 集約 Subagent で要点統合、上限超過時は『要レビュー箇所のみ』を要約してエスカレーション",
      "上位モデルに切り替えるだけで他は変えない",
      "全部のレビューを諦め、人間に丸投げ",
      "プロンプトの末尾に『最後まで読んで』とだけ追記",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。chunk 分割 + 集約 Subagent + エスカレーション、という Context Management ドメインの定石。",
      "不正解。モデルだけ変えても根本のコンテキスト圧迫は残る。",
      "不正解。自動化の利点を放棄する過剰反応。",
      "不正解。注意書きでは context overflow は防げない。",
    ],
    hints: [
      "Context overflow への対処は分割 + 要約。",
      "Subagent で per-file 並列化。",
      "上限超過時は HITL へエスカレーション。",
    ],
    explanation: {
      summary:
        "Context Management ドメイン (15%) の典型対応。差分を file 単位で chunk 化 → 各 Subagent でレビュー → 集約 Subagent で要点統合 → 上限超過時は HITL にエスカレーション。",
      reason:
        "context window は使い切ると指示が消えるが、Anthropic 推奨の手法は『分割して並列化』『集約 Subagent で要点を要約』『信頼度が落ちたら人間に渡す』の 3 段構え。モデル変更は補助手段に過ぎない。",
      references: [
        { label: "Anthropic Learn", url: "https://www.anthropic.com/learn" },
      ],
    },
  },

  // ===========================================================================
  // シナリオ B: EC カスタマーサポート自動応答
  // ===========================================================================
  {
    id: "acc-b-ag",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.b}\n\n返金処理エージェントで「実行 → そのまま完了報告」というループが回っていたが、誤返金事故が月数件発生。Anthropic 公式のエージェントループに沿った最小変更は？`,
    choices: [
      "gather context → take action → verify の 3 段階のうち抜けている verify を追加 (返金 API の応答コードと金額を再 GET して照合)",
      "ループを廃止し、一発実行に変更",
      "verify はコストが高いので、ランダム抽出で 10% のみ検証",
      "API 呼び出し前にユーザーに 5 段階で確認させる UI を追加",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。verify ステップの欠落が事故の根本原因。",
      "不正解。verify を抜くとさらに悪化。",
      "不正解。金融処理で 10% サンプリングは監査要件を満たさない。",
      "不正解。UI 変更は本質的解決ではなく、エージェントループの修正が先。",
    ],
    hints: [
      "Anthropic のエージェントループは 3 段階。",
      "最後は verify。",
      "API 応答を別 API で確認するパターン。",
    ],
    explanation: {
      summary:
        "Anthropic 公式のエージェントループ『gather context → take action → verify』に揃え、欠落していた verify (返金結果の再取得・金額照合) を追加する。",
      reason:
        "Agentic ドメイン (27%) の最頻出論点。verify がないとハルシネーションや API エラーが沈黙してしまい、本番では監査・補償リスクに直結する。verify ステップは別ツール / 別 API で『起きたかどうか』を確認するパターンが定石。",
      references: [
        { label: "Anthropic Learn", url: "https://www.anthropic.com/learn" },
      ],
    },
  },
  {
    id: "acc-b-cc",
    categoryId: "anthropic-cert",
    difficulty: "beginner",
    type: "choice",
    question: `${SC.b}\n\n本番運用ではエージェントを CI/CD で起動する。Claude Code を非対話 / 自動実行で安全に走らせるベストプラクティスとして最も適切なのは？`,
    choices: [
      "非対話モードで permission を最小化、SessionStart hook でテスト・lint を自動投入、操作ログを構造化出力して監査基盤に流す",
      "対話モードで全権限を許可し、人間が常時監視する",
      "Claude Code は CI/CD に組み込まず、ローカルだけで使う",
      "全 permission を dangerouslyDisableSandbox で許可し速度優先",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。非対話 + 最小権限 + hook によるテスト保証 + 構造化ログが正しい本番構成。",
      "不正解。CI に対話モードは現実的でなく監査も困難。",
      "不正解。CI 統合を放棄する必要はない。",
      "不正解。sandbox 無効化は重大なセキュリティリスク。",
    ],
    hints: [
      "permission は最小に。",
      "SessionStart hook でセットアップ。",
      "ログは構造化。",
    ],
    explanation: {
      summary:
        "Claude Code Configuration & Workflows ドメイン (20%) の鉄板構成。非対話モード + 最小権限 + SessionStart hook でテスト/lint 自動投入 + 構造化ログ。",
      reason:
        "本番 CI/CD では人間が即応できないため、permission を絞り、起動時に必要なセットアップ (hook) を自動化し、何が起きたかを後追いできる構造化ログを残すことが必須。SessionStart hook の概念は Foundations で頻出。",
      references: [
        { label: "Claude Code docs", url: "https://docs.claude.com/claude-code" },
      ],
    },
  },
  {
    id: "acc-b-pe",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.b}\n\n顧客の問い合わせ意図を 12 種のカテゴリに分類し、confidence を返したい。意図分類の精度を上げるプロンプトとして最も適切なのは？`,
    choices: [
      "12 カテゴリの定義と境界例を箇条書きで提示、各カテゴリの few-shot を 2〜3 例ずつ、出力は {category, confidence:0.0-1.0, reason} の JSON Schema で固定",
      "『良い感じに分類して』とだけ書き、Claude の常識に任せる",
      "12 カテゴリ全部を 50 件以上の例文付きで提示し、context を埋め尽くす",
      "カテゴリ定義を書かず、12 個の番号だけ列挙",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。境界例 + few-shot + structured output の組み合わせが意図分類の標準形。",
      "不正解。曖昧指示はカテゴリ揺れの主因。",
      "不正解。context 過剰でノイズが増え、コストも跳ねる。",
      "不正解。番号だけでは判別不能。",
    ],
    hints: [
      "境界例の提示が分類精度を決める。",
      "few-shot は『2〜3 例ずつ』が経験則。",
      "structured output で reason も返させる。",
    ],
    explanation: {
      summary:
        "意図分類は『境界例の提示』が鍵。各カテゴリ定義 + 2〜3 例の few-shot + JSON Schema での出力固定が Prompt Engineering ドメイン (20%) の標準形。",
      reason:
        "カテゴリ揺れは『隣接カテゴリの違い』が言語化されていないことが主因。境界例 (例: A と B が紛らわしいケースの判断基準) を明示し、reason を返させると後追い検証もできる。few-shot は多すぎても少なすぎても精度が落ちる。",
      references: [
        { label: "Claude API", url: "https://docs.claude.com/" },
      ],
    },
  },
  {
    id: "acc-b-mc",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.b}\n\n注文 API / 在庫 API / 返金 API を MCP ツール化したが、エージェントが返金前に在庫を戻し忘れるバグが頻発。ツール設計の改善として最適なのは？`,
    choices: [
      "ツール定義の description に『前提条件・副作用・呼び出し順序』を明示し、返金ツールには『先に在庫返却ツールを呼ぶこと』をスキーマレベルで記載 (依存ツールを description で参照)",
      "ツールを 1 つに統合し『返金して』だけ呼ばせる",
      "ツールを廃止し全部プロンプトで処理",
      "返金 API を Claude に隠して人間にやらせる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。MCP ツール設計は description の質と呼び出し順序の明示が肝。",
      "不正解。1 ツール統合は柔軟性とテスタビリティを失う。",
      "不正解。プロンプト処理では副作用を制御できない。",
      "不正解。自動化の利点を放棄。",
    ],
    hints: [
      "MCP ツールの description が判断を左右する。",
      "前提条件・副作用・順序を明示。",
      "良いツール定義は良いエージェント挙動を生む。",
    ],
    explanation: {
      summary:
        "MCP Integration ドメイン (18%) の中核。ツールの description に『前提条件 (これを呼ぶ前に X を確認)』『副作用 (在庫が減る)』『呼び出し順序 (Y → Z)』を明示するのが正解。",
      reason:
        "Claude はツール description を判断材料に選択するため、ここが曖昧だと順序ミスを起こす。Tool Use の input_schema だけでなく description のテキスト品質も設計対象。Advanced MCP コースで深掘りされる。",
      references: [
        { label: "Advanced MCP", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-b-cx",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.b}\n\n返金判断は『金額 ≧ 1 万円 or 顧客 VIP フラグ』のときだけ HITL に上げたい。実装方針として最適なのは？`,
    choices: [
      "エージェントの verify 後に confidence と金額・VIP を見て、ルール+モデル confidence の両方で『HITL に上げる/上げない』を判定。HITL ルートには full context と推奨理由を引き渡し",
      "全件 HITL に上げる",
      "全件自動処理し、事後監査だけ実施",
      "金額条件は無視し、Claude が『不安』と返した時だけ上げる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。確定ルール + モデル confidence の両軸でエスカレーション判定、引き渡し情報も full context が必要。",
      "不正解。HITL コストが過大、自動化の意味がなくなる。",
      "不正解。高リスク案件を後追いで救うのは事故化リスク高。",
      "不正解。金額閾値はルールで担保すべき。",
    ],
    hints: [
      "HITL の上げ条件はルール + 信頼度の組み合わせ。",
      "高額・VIP は確定ルールで。",
      "引き渡し情報は省略しない。",
    ],
    explanation: {
      summary:
        "Context Management & Reliability ドメイン (15%) の典型問題。確定ルール (金額・VIP) + モデル confidence の両軸でエスカレーション条件を作り、引き渡し情報には full context (証拠・推奨理由) を含める。",
      reason:
        "HITL は『どこで切るか』と『何を渡すか』の 2 設計が肝。閾値ルールだけだと境界を巧妙に避ける案件を拾えないし、confidence だけだと高額案件が confidence 高で素通りする。引き渡し情報が薄いと人間判断も精度が落ちる。",
      references: [
        { label: "Anthropic Learn", url: "https://www.anthropic.com/learn" },
      ],
    },
  },

  // ===========================================================================
  // シナリオ C: 法務契約書 PDF 構造化抽出
  // ===========================================================================
  {
    id: "acc-c-ag",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.c}\n\n初期実装では 1 つのプロンプトで PDF 全文を渡して全条項を一括抽出していたが、長文 NDA で『機密保持期間』を誤抽出する事故が増えた。Subagent の切り出し方として最も適切なのは？`,
    choices: [
      "条項分類 Subagent で章タイトル単位に分割 → 条項別の専門 Subagent (機密保持 / 解約 / 損害賠償) でそれぞれ抽出 → 集約で JSON 統合",
      "一発プロンプトのまま温度を下げる",
      "全条項を 1 つの巨大プロンプトに統合し token 上限を最大に上げる",
      "Subagent は使わず人間に丸投げ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。専門 Subagent で context isolation + 専門化を効かせる典型構成。",
      "不正解。温度では context 圧迫の問題は解けない。",
      "不正解。token 上限拡張は注意分散を悪化させがち。",
      "不正解。自動化の利点を放棄。",
    ],
    hints: [
      "条項単位で context を分ける。",
      "専門 Subagent の利点を活かす。",
      "集約 Subagent で JSON 統合。",
    ],
    explanation: {
      summary:
        "条項分類 → 条項別の専門 Subagent → 集約、と分けるのが Agentic ドメイン (27%) の典型構成。専門 Subagent ごとに評価データを別管理できる利点もある。",
      reason:
        "全文一発プロンプトは context が散漫で『関連箇所の見落とし』と『他条項のノイズによる誤抽出』が同時に起きる。条項単位で context isolation すると、各 Subagent は『機密保持の専門家』として high precision を出せる。",
      references: [
        { label: "Introduction to Subagents", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-c-cc",
    categoryId: "anthropic-cert",
    difficulty: "beginner",
    type: "choice",
    question: `${SC.c}\n\n法務部全員が同じ抽出パイプラインを使う前提で、抽出ロジック (プロンプト + JSON Schema + 検証ルール) を再利用可能な形にしたい。Claude Code の機能として最適なのは？`,
    choices: [
      "Agent Skill として抽出ロジックをパッケージ化し、Project memory から呼び出す",
      "全員の User memory に同じ巨大プロンプトをコピペする",
      "プロンプトを Slack で共有してもらう",
      "毎回ゼロから書き直してもらう",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Agent Skill はまさに『再利用可能なエージェント部品』のための機能。",
      "不正解。コピペは更新追従できない。",
      "不正解。バージョン管理が効かない。",
      "不正解。再利用性ゼロ。",
    ],
    hints: [
      "再利用可能な部品 = Agent Skill。",
      "Project scope で配布。",
      "ロジックをコード化する。",
    ],
    explanation: {
      summary:
        "Agent Skill はエージェントの再利用可能な部品を定義する機能。抽出ロジック (プロンプト + schema + 検証) をパッケージし、Project memory から呼び出す形にするのが Claude Code ドメイン (20%) の答え。",
      reason:
        "Skill 化することで『同じ抽出器を全員が安定的に呼ぶ』『更新が一箇所で済む』『テストを Skill 単位で書ける』というメリットがある。Introduction to Agent Skills コースに該当。",
      references: [
        { label: "Introduction to Agent Skills", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-c-pe",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.c}\n\n抽出結果に『不明な値の捏造』が混ざる。Prompt Engineering で捏造を抑える最も効果的な指示の組み合わせは？`,
    choices: [
      "(1) 出力 JSON Schema で nullable を許可、(2) 『該当条項がなければ null を返す』を明示、(3) 各値に source_excerpt フィールドを必須化し原文引用を要求、(4) few-shot に『見つからない例』を含める",
      "『嘘をつくな』とだけ強く書く",
      "出力フォーマットを自由文にして自然な抽出を期待する",
      "temperature=2.0 にして創造性を上げる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。nullable + 引用必須 + ネガティブ few-shot の組み合わせがハルシネーション対策の正攻法。",
      "不正解。精神論的指示は弱い。",
      "不正解。自由文はさらに揺れる。",
      "不正解。temperature を上げると捏造が増える。",
    ],
    hints: [
      "nullable を許可。",
      "引用 (source_excerpt) を必須に。",
      "見つからないケースの few-shot。",
    ],
    explanation: {
      summary:
        "捏造抑制は (1) nullable JSON Schema、(2) 『なければ null』の明示、(3) source_excerpt の必須化 (原文引用)、(4) ネガティブ few-shot の 4 点セット。Prompt Engineering ドメイン (20%) の応用問題。",
      reason:
        "ハルシネーションは『無理にでも値を埋めようとする』圧力で起きる。null を許容し、源泉引用を必須化することで『元になった文字列を出せない場合は null』という強い制約が効く。ネガティブ few-shot (見つからない例) でモデルの想定挙動を固める。",
      references: [
        { label: "Building with the Claude API", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-c-mc",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.c}\n\n抽出した JSON を CRM (Salesforce) に登録するため MCP ツール化する。ツール失敗時 (重複・FK 違反など) の設計として最適なのは？`,
    choices: [
      "ツールはエラー種別をコード化して構造化エラーを返す。retryable なものは exponential backoff で 3 回、non-retryable (FK 違反など) は即座にエージェントに通知して人間判断へエスカレーション",
      "全エラーで無限リトライ",
      "エラーは握り潰してログにだけ書く",
      "エラー時にツールがフリーズして応答を返さない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。retryable / non-retryable の分類 + バックオフ + エスカレーションが MCP の標準形。",
      "不正解。無限リトライは API 過剰負荷とコスト爆発の元。",
      "不正解。握り潰しは『静かに壊れる』最悪パターン。",
      "不正解。応答返却なしは context window を消費し続けタイムアウト。",
    ],
    hints: [
      "エラーは構造化して返す。",
      "retryable と non-retryable を分ける。",
      "バックオフ + エスカレーション。",
    ],
    explanation: {
      summary:
        "MCP Integration ドメイン (18%) のエラーハンドリング標準形。エラーをコード化 (retryable / non-retryable / partial-success) し、retryable は exponential backoff、non-retryable は HITL へエスカレーション。",
      reason:
        "Foundations では『ツール失敗時のリトライ / エスカレーション設計』が頻出。エラーを単純な文字列ではなく構造で返すことで、Claude が適切にリトライ判断できる。Advanced MCP コースの中心トピック。",
      references: [
        { label: "Advanced MCP", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-c-cx",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.c}\n\n100 ページ超の MSA を 1 回のセッションで処理すると context 枯渇する。コンテキスト管理戦略として最適なのは？`,
    choices: [
      "PDF を章で chunk 化 → 重要章のみフル投入、それ以外は要約をプリロード → 章別 Subagent で抽出 → 全体集約時は要約のみ参照し、必要なら原文を再フェッチ",
      "全 100 ページを 1 度に投入して長尺モデルに任せる",
      "100 ページを 10 ページずつ独立に処理し、相互参照は諦める",
      "ランダムに 20 ページだけ読む",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。チャンク化 + 要約プリロード + 必要時再フェッチが Context ドメインの定石。",
      "不正解。長尺モデルでも文脈分散で精度が落ちる。",
      "不正解。条項間の相互参照を無視すると法務的に致命的。",
      "不正解。サンプリングは法務には許容されない。",
    ],
    hints: [
      "chunk + 要約 + 再フェッチ。",
      "重要章はフル投入。",
      "集約では要約のみ。",
    ],
    explanation: {
      summary:
        "Context Management ドメイン (15%) の応用。PDF を章で chunk 化し、重要章はフル投入、その他は要約をプリロード、章別 Subagent で抽出、集約時は要約のみ参照、必要時のみ原文を再フェッチする 3 階層構造が王道。",
      reason:
        "長尺モデルに任せても『中盤の細部を見落とす』(needle-in-haystack 問題) が出る。階層的に context を組むことで、各 Subagent が必要な情報だけに集中でき、verify ステップで原文再フェッチを挟めば見落としも防げる。",
      references: [
        { label: "Anthropic Learn", url: "https://www.anthropic.com/learn" },
      ],
    },
  },

  // ===========================================================================
  // シナリオ D: 製薬の社内ナレッジ検索 RAG + MCP
  // ===========================================================================
  {
    id: "acc-d-ag",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.d}\n\n4 つの MCP サーバ (論文 / Wiki / 実験ノート / Slack) を全部 1 つのエージェントに繋いだら、ツール選択ミスが頻発。設計改善として最適なのは？`,
    choices: [
      "ルーター Subagent でユーザー質問を分類 → 用途別 Subagent (論文専門 / 社内専門 / 横断専門) に振り分け、各 Subagent は必要な MCP サーバのみ接続",
      "ツール数を減らすため 1 ツール 1 API に合体させる",
      "ツール選択は全部ユーザーに毎回選ばせる",
      "MCP を捨てて静的検索インデックスに置き換える",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。ルーター + 専門 Subagent で context isolation を効かせる。",
      "不正解。1 ツール統合は粒度が荒く制御不能。",
      "不正解。UX が崩壊。",
      "不正解。RAG の柔軟性を失う。",
    ],
    hints: [
      "ルーター Subagent を作る。",
      "用途別に MCP を絞る。",
      "ツール数が増えると Claude の判断ミスも増える。",
    ],
    explanation: {
      summary:
        "Agentic ドメイン (27%) の頻出パターン。ルーター Subagent で質問を分類し、用途別 Subagent (論文専門 / 社内専門 / 横断) に振り分けて、各 Subagent は必要な MCP サーバのみ接続する。",
      reason:
        "ツール数が増えるとエージェントは適切なものを選ぶ精度が落ちる (大規模ツール選択問題)。ルーター + 専門 Subagent パターンで各エージェントの選択肢を絞ることで精度が回復する。",
      references: [
        { label: "Introduction to Subagents", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-d-cc",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.d}\n\n部門ごとに参照できる Wiki スペースが違う。Claude Code に部門メンバーを区別させたい。実装方針として最適なのは？`,
    choices: [
      "部門ごとに別 Project の CLAUDE.md (Project memory) を用意し、その配下に部門専用 MCP server (Project scope で部門 token を埋め込み) を配置。Enterprise memory には全社共通のセキュリティポリシー",
      "全員が同じ CLAUDE.md と MCP token を使う",
      "Slack ID をプロンプトに毎回貼って Claude に判断させる",
      "MCP を捨ててプロンプトに Wiki 全文を貼る",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Project memory + Project scope MCP で部門隔離、Enterprise memory で全社共通ポリシーを強制。",
      "不正解。最小権限違反、機密情報漏えい。",
      "不正解。プロンプト経由の認可は脆弱。",
      "不正解。Wiki 全文ロードは context 過大 + 機密混入リスク。",
    ],
    hints: [
      "Project memory と Enterprise memory を組み合わせる。",
      "MCP は Project scope で部門隔離。",
      "認可はメモリ階層と scope で実現。",
    ],
    explanation: {
      summary:
        "Claude Code ドメイン (20%) の組織展開問題。部門隔離は Project memory + Project scope MCP server、全社共通ポリシーは Enterprise memory。",
      reason:
        "認可・スコープ管理は CLAUDE.md と MCP scope の組み合わせで実現する。プロンプトでの認可は injection で容易に突破されるため、実装層で隔離するのが鉄則。",
      references: [
        { label: "Claude Code docs", url: "https://docs.claude.com/claude-code" },
      ],
    },
  },
  {
    id: "acc-d-pe",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.d}\n\nRAG 検索結果 (論文 5 本) をもとに回答させると、引用元を間違える事故が出る。引用精度を上げるプロンプト設計は？`,
    choices: [
      "検索結果を [doc_id, title, snippet] の構造化リストで渡し、回答 JSON に citations:[doc_id] を必須化、各主張に対応する doc_id を 1 つ以上付ける形式に few-shot で固定",
      "検索結果をプレーン結合してまとめて投入",
      "Claude に『出典を覚えておいて』と頼む",
      "Citation は別途人間が追加することにして無視",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。doc_id 付きの構造化リスト + citations 必須 + few-shot 固定が citation 精度の標準形。",
      "不正解。結合プレーンテキストは引用元混乱の主因。",
      "不正解。メモリ的依存はモデル仕様外。",
      "不正解。法務 / コンプライアンス的に許容できない。",
    ],
    hints: [
      "doc_id を持ち回る。",
      "citations フィールドを必須化。",
      "few-shot で形式を固定。",
    ],
    explanation: {
      summary:
        "Prompt Engineering ドメイン (20%) の citation 精度向上策。構造化された RAG 結果 + citation 必須 + few-shot 固定で『どの主張がどの doc から来たか』を明示させる。",
      reason:
        "プレーン結合は context 中で doc 境界が曖昧になり、citation が混線する。doc_id を持ち回ることで Claude は明示的にトレースでき、後段の検証 (該当 doc に本当に書いてあるか) も自動化できる。",
      references: [
        { label: "Building with the Claude API", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-d-mc",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.d}\n\n機微情報 (患者データ) を扱う実験ノート MCP サーバから情報が予期せず Slack MCP に転送される懸念。MCP 設計レベルで防ぐベストプラクティスは？`,
    choices: [
      "実験ノート MCP は read-only かつ Project scope に限定、Slack MCP の post ツールは tool description で『機微情報を含まないこと』を明示、エージェント側で『データ分類タグ』を必ず付与してから外部送信ツールを呼ぶ設計",
      "Slack MCP を全員から削除する",
      "実験ノートを全員に公開して特別扱いをやめる",
      "ガードは諦め、事後監査だけ実施",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。読み取り限定 + scope 限定 + tool description で意図明示 + データ分類タグの 4 段構え。",
      "不正解。Slack 連携の価値を捨てるのは過剰。",
      "不正解。機微情報の公開はコンプライアンス違反。",
      "不正解。事後監査だけでは事故を止められない。",
    ],
    hints: [
      "read-only にする。",
      "scope を限定。",
      "tool description で意図を明示。",
    ],
    explanation: {
      summary:
        "MCP Integration ドメイン (18%) のセキュリティ応用。read-only 化 + scope 限定 + tool description での意図明示 + データ分類タグの 4 段構えで『機微情報がうっかり外部送信される』事故を防ぐ。",
      reason:
        "MCP では『どのサーバがどのデータを扱うか』『どのツールが外部送信するか』を明示することで、エージェントの判断ミスを物理的にブロックできる。CCA-F では AI セキュリティとも交差する重要テーマ。",
      references: [
        { label: "Advanced MCP", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-d-cx",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.d}\n\n研究者の連続質問でセッションが長期化し、初期に渡した『出典明示』指示が薄まる事象 (instruction drift)。対処として最適なのは？`,
    choices: [
      "重要指示は system prompt に固定 + 各ターンで verify ステップとして『出典が付いているか』を自動チェック、欠落時は再要請。長期セッションでは context summary を定期的に圧縮し直す",
      "毎ターン同じ指示をユーザーに復唱させる",
      "セッションを 5 ターンごとに強制終了",
      "instruction drift は仕様なので諦める",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。system prompt 固定 + verify チェック + 定期的なコンテキスト圧縮の 3 本柱。",
      "不正解。UX が崩壊。",
      "不正解。研究の連続性を損なう。",
      "不正解。本番運用で許容できない。",
    ],
    hints: [
      "system prompt に重要指示を固定。",
      "verify で守られているかチェック。",
      "context を定期圧縮。",
    ],
    explanation: {
      summary:
        "Context Management ドメイン (15%) の instruction drift 対策。system prompt 固定 + verify ステップでの遵守チェック + 定期的な context summary 圧縮。",
      reason:
        "長期セッションでは初期指示が context の希釈で効きにくくなる。system prompt に固定し、verify で『出典が付いているか』を毎回チェックし、context を summary に圧縮して再投入することで指示の鮮度を保つ。",
      references: [
        { label: "Anthropic Learn", url: "https://www.anthropic.com/learn" },
      ],
    },
  },

  // ===========================================================================
  // シナリオ E: 銀行 KYC 審査 (HITL)
  // ===========================================================================
  {
    id: "acc-e-ag",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.e}\n\n『エージェントが最終判断を出さない』要件。Agentic 設計の制約として最も適切なのは？`,
    choices: [
      "エージェントの take action は『候補リストの提示』『証拠の整理』『リスクスコアの算出』に限定し、verify ステップで自分の結論に対する反証も同時に出力。判断確定の API は呼べない設計に",
      "信頼できるユーザー (社員) ならエージェントに最終承認させる",
      "エージェントに最終判断させ、人間は事後確認のみ",
      "判断 API を呼ばないように毎回プロンプトで頼む",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。エージェントの権限を物理的に制限 (ツール非提供) + 反証出力で人間判断を支援。",
      "不正解。要件違反、監査基準を満たさない。",
      "不正解。後追い確認は事故誘発。",
      "不正解。プロンプトでの抑制は injection で破られうる。",
    ],
    hints: [
      "判断 API そのものをツールから外す。",
      "反証も出力させる。",
      "プロンプトベースの抑制は脆弱。",
    ],
    explanation: {
      summary:
        "Agentic ドメイン (27%) の HITL 設計問題。エージェントには判断確定ツールを持たせず、候補提示 + 証拠整理 + リスクスコア + 反証出力に役割を限定。物理的にエージェントが判断確定できない構造を作る。",
      reason:
        "プロンプトで『判断するな』と書くだけでは不十分。実装層 (MCP ツールの提供範囲) で判断 API を外せば、injection を受けても物理的に発火できない。反証を出させると人間の意思決定が深くなる。",
      references: [
        { label: "Anthropic Learn", url: "https://www.anthropic.com/learn" },
      ],
    },
  },
  {
    id: "acc-e-cc",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.e}\n\n監査ログ義務 (誰がいつ何を判断補助に使ったか) を満たす Claude Code の設定として最適なのは？`,
    choices: [
      "全 tool 呼び出し / モデル応答 / system prompt / user prompt を構造化ログで永続化、Enterprise memory にログ強制を記載、SessionStart hook でログ送信先を初期化、ログには審査担当 ID と案件 ID を必ず紐付け",
      "ログは取らず Claude の応答に『判断根拠を書いて』と頼む",
      "ローカルファイルにテキストログだけ残す",
      "ログは Claude が良き感じに作成して保存する",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。構造化ログ + Enterprise 強制 + 起動 hook + ID 紐付けの完備構成。",
      "不正解。プロンプト応答ログでは監査要件を満たさない。",
      "不正解。テキストログは検索性・耐改ざん性が低い。",
      "不正解。エージェント自身に監査を任せるのは利益相反。",
    ],
    hints: [
      "ログは構造化 + 永続化。",
      "Enterprise memory で組織強制。",
      "SessionStart hook でセットアップ。",
    ],
    explanation: {
      summary:
        "Claude Code ドメイン (20%) の監査 / コンプライアンス問題。構造化ログ全件保存 + Enterprise memory での強制 + SessionStart hook での初期化 + 案件 ID 紐付けが標準構成。",
      reason:
        "金融業界の監査要件は『誰がいつ何を判断補助に使ったか』のトレース性。Claude Code の構造化ログ機能 + メモリ階層 + hook を組み合わせると、組織横断で破られない監査基盤を作れる。",
      references: [
        { label: "Claude Code docs", url: "https://docs.claude.com/claude-code" },
      ],
    },
  },
  {
    id: "acc-e-pe",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.e}\n\nリスクスコア (0-100) を返させる際、スコアが直感に反するケースが出る (明らかに低リスクなのに 80 など)。Prompt 設計の改善として最適なのは？`,
    choices: [
      "スコアと一緒に rubric (採点基準) ごとの内訳を必須出力、各 rubric には参照証拠 ID を付け、最後に『総合スコア = 各要素の重み付け』を明示するフォーマットに固定",
      "スコアだけ返させ、内訳は不要にする",
      "スコアの返却を諦めて Claude にラベル (低/中/高) だけ返させる",
      "temperature を上げて多様性を出す",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。rubric 内訳 + 証拠 ID + 重み付け明示で説明可能性を確保。",
      "不正解。ブラックボックススコアは監査・改善どちらも不能。",
      "不正解。ラベル化は粒度が荒く要件を満たさない。",
      "不正解。temperature では本質解決にならない。",
    ],
    hints: [
      "rubric の内訳を出させる。",
      "各 rubric に証拠 ID。",
      "重み付けを明示。",
    ],
    explanation: {
      summary:
        "Prompt Engineering ドメイン (20%) の chain-of-thought 派生問題。rubric 内訳 + 証拠 ID 紐付け + 重み付け明示で『なぜそのスコアか』を構造化させる。",
      reason:
        "総合スコアだけだとモデルの内部状態が不可視で改善ループが回らない。rubric を明示すれば人間が違和感を持った時に『どの rubric が暴走しているか』をデバッグできる。説明可能性は金融・医療で必須要件。",
      references: [
        { label: "Building with the Claude API", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-e-mc",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.e}\n\n本人確認書類画像を OCR する MCP サーバを導入。OCR 結果に氏名・住所・口座番号が含まれ、Slack MCP に渡る経路は塞ぎたい。MCP ツール設計レベルでの最善策は？`,
    choices: [
      "OCR MCP の出力に redaction (秘匿化) ツールを並列提供し、デフォルトで PII フィールドはマスク。raw 値が必要な内部ツールにのみアンマスク権限を付与し、外部送信系ツール (Slack / メール) には raw 値が渡らない構造にする",
      "OCR MCP は廃止して人手で書き起こす",
      "Slack MCP に『PII を書かないで』とプロンプトで指示する",
      "全部 raw のまま流して事後に正規表現でフィルタ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。redaction ツール提供 + デフォルトマスク + アンマスク権限分離が PII データフローの正攻法。",
      "不正解。自動化の価値を放棄。",
      "不正解。プロンプト指示は脆弱。",
      "不正解。事後フィルタは事故化リスク高。",
    ],
    hints: [
      "redaction を MCP レベルで提供。",
      "デフォルトはマスク。",
      "アンマスク権限を分離。",
    ],
    explanation: {
      summary:
        "MCP Integration ドメイン (18%) と AI セキュリティの交差問題。Redaction ツール提供 + デフォルトマスク + アンマスク権限分離で PII を外部送信から物理的に切り離す。",
      reason:
        "MCP ツールの設計で『デフォルトで安全』を実現するのが現代のベストプラクティス。raw 値は権限を持つツールのみ取得可能、外部送信ツールには redacted 版が渡る構造にすれば、誤転送事故が物理的に発生しない。",
      references: [
        { label: "Advanced MCP", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-e-cx",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.e}\n\nエスカレーション時の人間への引き渡し情報の設計として最適なのは？`,
    choices: [
      "(1) 候補と reason の構造化サマリ、(2) 関連書類への deep link、(3) confidence と reason の不確実箇所のハイライト、(4) 反証 (もし不採用の場合の根拠)、(5) 監査ログへの完全な context dump へのリンク",
      "Claude の応答を生のまま全部貼る",
      "結論ラベル (承認 / 却下) だけ渡す",
      "情報は最小限にして審査官の自由判断に任せる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。構造化サマリ + deep link + 不確実箇所 + 反証 + 監査リンクの 5 点セット。",
      "不正解。raw dump は読みにくく事故化。",
      "不正解。情報不足で判断品質が落ちる。",
      "不正解。HITL の利点を活かせない。",
    ],
    hints: [
      "構造化サマリ + deep link。",
      "不確実箇所のハイライト。",
      "反証も含める。",
    ],
    explanation: {
      summary:
        "Context Management & Reliability ドメイン (15%) の HITL 引き渡し設計。構造化サマリ + 関連書類への deep link + 不確実箇所ハイライト + 反証 + 監査ログへの link の 5 点セットが Anthropic 推奨形。",
      reason:
        "HITL の判断品質は引き渡し情報の質に比例する。raw dump は読まれず、ラベルだけだと判断材料が足りない。構造化された情報 + 必要時に原文にアクセスできる構造が、人間判断を最も効率化する。",
      references: [
        { label: "Anthropic Learn", url: "https://www.anthropic.com/learn" },
      ],
    },
  },

  // ===========================================================================
  // シナリオ F: OSS バグ修正 Multi-Subagent
  // ===========================================================================
  {
    id: "acc-f-ag",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.f}\n\nPlan / Code / Review の 3 Subagent パイプラインで、Code Subagent が暴走 (無関係な refactor を始める) する。Multi-Subagent オーケストレーションの観点で最適な対処は？`,
    choices: [
      "Plan Subagent の出力を strict JSON Schema (変更ファイル / 変更スコープ) で固定し、Code Subagent は Plan の範囲外のファイルを編集できない契約 (実装側で git pathspec 制限) を作る。Review Subagent は Plan vs Code diff の整合性も検証",
      "Code Subagent の context を増やして詳細を全部教える",
      "Subagent パイプラインを廃止し単一エージェントに統合",
      "全 Subagent に同じ全権を与え自律的に協調させる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Subagent 間の契約 (interface) を strict にし、実装側で物理的に制限する。",
      "不正解。context 増は注意散漫を悪化させる。",
      "不正解。単一化は分業の利点を失う。",
      "不正解。全権 + 自律は orchestration コスト爆発。",
    ],
    hints: [
      "Subagent 間の interface を strict に。",
      "実装側で物理的制限。",
      "Review は Plan vs Code を検証。",
    ],
    explanation: {
      summary:
        "Agentic ドメイン (27%) のマルチエージェント設計問題。Plan 出力を strict schema で固定 + Code の編集範囲を実装層で制限 + Review で Plan vs Code 整合性検証、の 3 層契約。",
      reason:
        "Multi-Subagent はメリットも大きいが、context 共有が緩いと暴走しやすい。各 Subagent の入力/出力を契約として固定し、実装層 (git pathspec / sandbox) で物理的に制限することで暴走を防ぐ。CCA-F で頻出の高度トピック。",
      references: [
        { label: "Claude Code in Action", url: "https://anthropic.skilljar.com/claude-code-in-action" },
      ],
    },
  },
  {
    id: "acc-f-cc",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.f}\n\nPlan / Code / Review を Claude Code の機能で実装する。最適な構成は？`,
    choices: [
      "各 Subagent を Skill として定義 (input / output schema を含む)、Plan Subagent を slash command で起動、Code Subagent は Subagent 機能で並列化可能に、Review Subagent は SessionStop hook で自動起動して PR に inline comment を投稿",
      "全部 1 つの巨大 slash command にして順次実行",
      "Plan / Code / Review それぞれを別ユーザーに手動で頼む",
      "Claude Code は使わず外部 LLM フレームワークで自前実装",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Skills + Subagents + slash command + hook の組み合わせ。",
      "不正解。1 コマンド統合は再利用性 / テスト性が低い。",
      "不正解。自動化の意味がない。",
      "不正解。Claude Code の機能を活かせない。",
    ],
    hints: [
      "Skills / Subagents / slash command / hook を組み合わせる。",
      "Review は SessionStop hook で自動。",
      "並列化は Subagent で。",
    ],
    explanation: {
      summary:
        "Claude Code ドメイン (20%) の高度な機能組み合わせ問題。Skills (再利用部品) + Subagents (並列実行) + slash command (起動) + hook (自動連携) の 4 機能を組み合わせるのが Claude Code in Action コースの王道。",
      reason:
        "Claude Code の機能はそれぞれ独立に強力だが、組み合わせることで本番運用パイプラインを構築できる。Skill で部品化、Subagent で並列化、hook で自動連携、slash command で起動の役割分担を理解できているかが Foundations で問われる。",
      references: [
        { label: "Claude Code in Action", url: "https://anthropic.skilljar.com/claude-code-in-action" },
      ],
    },
  },
  {
    id: "acc-f-pe",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.f}\n\nPlan Subagent の出力 (実装計画) の品質を上げるプロンプト設計は？`,
    choices: [
      "『Explore → Plan → Code → Commit』を念頭に、Plan では (1) 関連ファイルの調査結果、(2) 変更案、(3) 影響範囲、(4) テスト戦略、(5) ロールバック手段の 5 セクション必須化 + 既存類似 PR を few-shot 提示",
      "『良い感じに計画して』とだけ書く",
      "Plan を省略していきなり Code に渡す",
      "Plan の中身は freeform に任せる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Claude Code 101 の Explore → Plan → Code → Commit ワークフローに沿った 5 セクション + few-shot。",
      "不正解。曖昧指示は Plan の品質を下げる。",
      "不正解。Plan の省略は Code 暴走の主因。",
      "不正解。Code Subagent への引き渡し情報が定まらない。",
    ],
    hints: [
      "Explore → Plan → Code → Commit に沿う。",
      "Plan は 5 セクション必須。",
      "few-shot で過去 PR を提示。",
    ],
    explanation: {
      summary:
        "Prompt Engineering ドメイン (20%) と Claude Code 101 の交差問題。Plan を 5 セクション (Explore 結果 / 変更案 / 影響範囲 / テスト戦略 / ロールバック) で構造化 + 類似 PR を few-shot 提示。",
      reason:
        "Plan の品質が低いと Code Subagent への入力が曖昧で全パイプラインが破綻する。Claude Code 101 の Explore → Plan → Code → Commit を念頭に、Plan の中身を schema 化することで安定する。",
      references: [
        { label: "Claude Code 101", url: "https://anthropic.skilljar.com/claude-code-101" },
      ],
    },
  },
  {
    id: "acc-f-mc",
    categoryId: "anthropic-cert",
    difficulty: "intermediate",
    type: "choice",
    question: `${SC.f}\n\nCI を回すために MCP ツール (test-runner / linter / build) を導入する。設計上の最善は？`,
    choices: [
      "test-runner はサブセット / fullsuite モードを引数で選択可能に。各ツールは exit code と構造化エラー (失敗テスト一覧 / 所要時間) を返す。fail-fast モードを description で明示し、Code Subagent は最初 subset → green でフルテストの順で呼べるようにする",
      "全テストを毎回フル実行するツールだけ提供",
      "ツールは exit code だけ返し詳細はログ tail から取る",
      "MCP は使わずプロンプトでテスト結果を Claude が想像で返す",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。サブセット / fullsuite + 構造化エラー + 段階実行のパターン。",
      "不正解。フル実行のみは CI コスト爆発。",
      "不正解。log tail だけだと判断材料不足。",
      "不正解。想像でテスト結果を返すのはハルシネーション。",
    ],
    hints: [
      "subset / fullsuite を選択可能に。",
      "構造化エラーを返す。",
      "段階実行 (subset → fullsuite)。",
    ],
    explanation: {
      summary:
        "MCP Integration ドメイン (18%) の CI ツール設計。サブセット / fullsuite モード + 構造化エラー + 段階実行 (subset → green → fullsuite) パターン。",
      reason:
        "CI ツールはコスト・速度・精度のトレードオフ。粒度を選択可能にしておくと、Code Subagent が状況に応じて使い分けられる。構造化エラーで失敗テスト一覧と所要時間が分かれば、次の Code 修正の方針が立つ。",
      references: [
        { label: "Advanced MCP", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "acc-f-cx",
    categoryId: "anthropic-cert",
    difficulty: "advanced",
    type: "choice",
    question: `${SC.f}\n\n大規模コードベース (10 万行) で Code Subagent が無関係なファイルまで読もうとして context を枯渇させる。verify ステップを含めた信頼性設計として最適なのは？`,
    choices: [
      "ファイル探索は別 Subagent (Explorer) に分離 + sparse-read (該当箇所のみ snippet 抽出) を MCP ツール化。Code Subagent は context 上限の 60% を超えたらタスクを再分割するルールを system prompt に固定。verify ステップで diff 行数の妥当性をチェックし、想定範囲を超えたら自動エスカレーション",
      "Code Subagent に全ファイル読み込みを許可し token 上限を最大化",
      "ファイル数の上限だけ決めて読み込み制限する",
      "Code Subagent は何もせず全部 Plan に詰める",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Explorer 分離 + sparse-read + 自己分割ルール + verify エスカレーションの組み合わせ。",
      "不正解。token 拡張は本質的解決でなくコストも爆発。",
      "不正解。粒度が荒く実用性に欠ける。",
      "不正解。役割分担を壊している。",
    ],
    hints: [
      "Explorer Subagent を分離。",
      "sparse-read で必要箇所のみ。",
      "60% で再分割。",
      "verify で diff 行数チェック。",
    ],
    explanation: {
      summary:
        "Context Management & Reliability ドメイン (15%) と Agentic の交差総合問題。Explorer 分離 + sparse-read MCP ツール + 自己分割ルール (system prompt 固定) + verify での妥当性チェック + エスカレーションの 5 段構え。",
      reason:
        "大規模コードベースは context window の自然な天敵。Anthropic 推奨は『役割分離 (Explorer/Coder) で context を分ける』『必要な snippet のみ読む』『自分の context 残量を判断材料にする』『verify で結果の妥当性を検査する』の組み合わせ。これが Foundations の最頻出複合シナリオ。",
      references: [
        { label: "Anthropic Learn", url: "https://www.anthropic.com/learn" },
        { label: "Claude Code in Action", url: "https://anthropic.skilljar.com/claude-code-in-action" },
      ],
    },
  },
];

import type { Question } from "@/lib/types";

/**
 * Claude Code Fundamentals クイズ (30 問)
 * - ハーネス (4) / CLAUDE.md (5) / Hooks (5) / Skills (4)
 *   / Subagents (4) / MCP (4) / Plugins (2) / Settings (1) / Permissions (1)
 *
 * 出典: code.claude.com/docs/en/* と公式ドキュメント。
 */
export const claudeCodeBasicsQuestions: Question[] = [
  // ===========================================================================
  // ハーネス アーキテクチャ (4)
  // ===========================================================================
  {
    id: "ccb-001",
    categoryId: "claude-code-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "Claude Code の『エージェントハーネス』が 1 ターンで回す 3 フェーズのループとして正しいのは？",
    choices: [
      "プロンプト → 補完 → 表示",
      "コンテキスト収集 → アクション実行 → 結果の検証",
      "プラン → コード生成 → デプロイ",
      "Lint → テスト → コミット",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "純粋な LLM 補完 (オートコンプリート) の動きで、ツールを伴うエージェント動作とは異なる。",
      "正解。公式ドキュメントが明記する『gather context → take action → verify results』の 3 フェーズ。",
      "プロダクト開発のフローに似ているが、ハーネスが回すループとは別物。",
      "CI のフローであって、ハーネスのフェーズ定義ではない。",
    ],
    hints: [
      "ハーネスは『ツール・コンテキスト・実行環境』を Claude にラップする層。",
      "最後のフェーズで結果を確認することで自己修正が可能になる。",
      "公式 docs の overview ページに明記されている。",
    ],
    explanation: {
      summary:
        "Claude Code は『コンテキスト収集 → アクション実行 → 結果検証』の 3 フェーズを 1 ターン内で繰り返すエージェントハーネス。検証フェーズで失敗を検知して自己修正できる。",
      reason:
        "ハーネス (agentic harness) は Claude モデル本体に、ツール群・コンテキスト管理・実行環境を巻き付けた層。ループの各フェーズで Read/Grep/Edit/Bash 等のツールを呼びながら状態を更新し、verify フェーズで lint・テスト・型チェックの結果を見て次のターンへ進む。これにより単発の補完ではなく、複数ステップにわたる継続的な作業が可能になる。",
      references: [
        {
          label: "Claude Code Overview (公式)",
          url: "https://code.claude.com/docs/en/overview",
        },
      ],
    },
  },
  {
    id: "ccb-002",
    categoryId: "claude-code-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "Claude Code が提供する 3 つの実行環境 (execution environment) の組み合わせとして正しいのは？",
    choices: [
      "CLI / Web / Mobile",
      "Development / Staging / Production",
      "Local (デフォルト) / Cloud (Anthropic 管理 VM) / Remote Control (ブラウザから手元のマシンを操作)",
      "Local / Docker / Kubernetes",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "クライアント形態の話で、ハーネスの実行環境分類ではない。",
      "デプロイ環境の話で、Claude Code の実行環境とは別。",
      "正解。docs に記載される 3 種類の実行環境。",
      "Docker や Kubernetes は実行環境の選択肢として公式に列挙されていない。",
    ],
    hints: [
      "デフォルトは手元のマシン (Local)。",
      "Cloud は Anthropic が管理する VM 上で動く。",
      "Remote Control はブラウザから手元の Claude Code を操る形式。",
    ],
    explanation: {
      summary:
        "Local (デフォルト)、Cloud (Anthropic 管理 VM)、Remote Control (ブラウザから手元マシンを駆動) の 3 種。用途・セキュリティ要件に応じて選ぶ。",
      reason:
        "Local はファイルシステムや認証情報に直接アクセスでき柔軟。Cloud は隔離された VM で動くため安全だが手元ファイルには別途連携が必要。Remote Control は外出先のブラウザから手元マシンの Claude Code を操作する形式で、Local の能力を活かしつつ移動先から使える。",
      references: [
        {
          label: "Claude Code Overview",
          url: "https://code.claude.com/docs/en/overview",
        },
      ],
    },
  },
  {
    id: "ccb-003",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "コンテキストウィンドウが逼迫したときに走る『コンパクション (compaction)』の挙動として正しいのは？",
    choices: [
      "まず古いツール出力を捨て、それでも足りなければ要約する。プロジェクトルートの CLAUDE.md は生き残り再注入される",
      "セッション全体をいきなり要約して 1 メッセージに圧縮する",
      "古い会話は完全に消えて復元できない",
      "ネストされた CLAUDE.md (サブディレクトリ) も自動で再ロードされる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。docs に従う動作。ルート CLAUDE.md は『survives and is re-injected』。",
      "段階的処理であって即要約ではない。",
      "履歴は JSONL に保存され、コンパクションは context window 上の話のみ。",
      "ネストされた CLAUDE.md は自動で再ロードされない (公式の注意点)。",
    ],
    hints: [
      "ルート CLAUDE.md は『memory』として再注入される特別扱い。",
      "ネストされた CLAUDE.md は再ロードされないので注意。",
      "`/context` で現在の使用量を確認できる。",
    ],
    explanation: {
      summary:
        "コンパクションは『古いツール出力を捨てる』→『要約する』の段階方式。プロジェクトルートの CLAUDE.md は再注入されるが、サブディレクトリの CLAUDE.md は再ロードされない。",
      reason:
        "長セッションではツール出力 (大きな grep 結果など) がコンテキストを食う。Claude Code はまず古いツール出力から削り、それでも超えるなら会話を要約する。重要なプロジェクト方針はルート CLAUDE.md にまとめておくと、コンパクション後も生き残るので情報損失を防げる。`/context` でいつでも残量を確認できる。",
      references: [
        {
          label: "Claude Code Overview",
          url: "https://code.claude.com/docs/en/overview",
        },
        {
          label: "Memory (CLAUDE.md)",
          url: "https://code.claude.com/docs/en/memory",
        },
      ],
    },
  },
  {
    id: "ccb-004",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Claude が長いツール (例: 大きな grep) を実行中に、停止せずに方針だけ修正したい。正しい操作は？",
    choices: [
      "Esc を 1 回押す",
      "Ctrl+C を押す",
      "新しいセッションを `/clear` で立ち上げ直す",
      "実行中にメッセージを入力して Enter を押す (ステアリングメッセージ。停止せず注入される)",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "Esc 1 回は実行中ツールを停止する。方針修正ではなく中断になる。",
      "Ctrl+C はセッションごと落としてしまう。",
      "セッションをリセットしてしまい状態が失われる。",
      "正解。実行中の入力は停止せず方針だけを差し込む『ステアリング』。",
    ],
    hints: [
      "停止と方針修正は別操作。",
      "Esc は『止める』ボタン。",
      "実行中の入力欄は『差し込む』ボタン。",
    ],
    explanation: {
      summary:
        "実行中に文字を打って Enter するとステアリングメッセージとして注入され、ツール実行を止めずに方針だけ伝えられる。停止したい時は Esc を 1 回。",
      reason:
        "長いツール出力中に途中で『あ、そのファイルは無視して』と気づくケースは多い。Esc で止めると現在のターンが中断されコンテキストの整合性が崩れることがある。ステアリングは現在のターンに追加メッセージを差し込み、ツール完了後に Claude が方針修正を反映する。デバッグ・探索系の長時間ジョブで便利。",
      references: [
        {
          label: "Claude Code Overview",
          url: "https://code.claude.com/docs/en/overview",
        },
      ],
    },
  },

  // ===========================================================================
  // CLAUDE.md (5)
  // ===========================================================================
  {
    id: "ccb-005",
    categoryId: "claude-code-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "CLAUDE.md (Memory) の 4 つのスコープを、ロード順 (広い → 狭い) で正しく並べたものは？",
    choices: [
      "User → Project → Local → Managed",
      "Managed policy → User (~/.claude/CLAUDE.md) → Project (./CLAUDE.md) → Local (./CLAUDE.local.md)",
      "Local → Project → User → Managed policy",
      "Project → User → Managed → Local",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "User は 2 番目で、Project の前。",
      "正解。広い (組織方針) から狭い (個人の作業メモ) の順にロードされ、内容は連結 (concatenate) される。",
      "順序が逆。",
      "順序が不正確。Managed が最初。",
    ],
    hints: [
      "Managed policy は組織が配る固定ポリシー。",
      "Local (CLAUDE.local.md) は gitignore 推奨の個人メモ。",
      "上書きではなく『連結』される点が重要。",
    ],
    explanation: {
      summary:
        "Managed policy → User → Project → Local の順にロードされ、内容は連結される (上書きではない)。Local は gitignore 対象の個人スコープ。",
      reason:
        "Managed policy のパスは macOS が `/Library/Application Support/ClaudeCode/CLAUDE.md`、Linux/WSL が `/etc/claude-code/CLAUDE.md`、Windows が `C:\\Program Files\\ClaudeCode\\CLAUDE.md`。User は `~/.claude/CLAUDE.md`、Project は `./CLAUDE.md` または `./.claude/CLAUDE.md`、Local は `./CLAUDE.local.md`。連結方式なのでチーム共通ルール (Project) と個人の好み (User/Local) を両立できる。",
      references: [
        {
          label: "Memory (CLAUDE.md)",
          url: "https://code.claude.com/docs/en/memory",
        },
      ],
    },
  },
  {
    id: "ccb-006",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "CLAUDE.md の『インポート構文 (@path/to/file)』に関する正しい記述は？",
    choices: [
      "@ は無制限に再帰できる",
      "@ は同ディレクトリのファイルのみ参照可能",
      "@ は廃止された構文で現在は使えない",
      "@ で他ファイルを取り込める。インポートのチェーンは最大 5 hops まで",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "無制限ではない。循環や肥大化を防ぐため上限がある。",
      "相対・絶対パスを問わず参照できる。",
      "現役の構文。`@AGENTS.md` 等で活用されている。",
      "正解。最大深さ 5 hops の制約は公式 docs 明記。",
    ],
    hints: [
      "`@AGENTS.md` のように他フォーマットを取り込むのが典型用途。",
      "深さ制限は 5。",
      "Claude Code は AGENTS.md を直接読まないので import で繋ぐ。",
    ],
    explanation: {
      summary:
        "`@path/to/file` で外部ファイルを CLAUDE.md に取り込める。インポートの連鎖は最大 5 hops まで。AGENTS.md を読ませたい場合は `@AGENTS.md` で取り込む。",
      reason:
        "Claude Code は CLAUDE.md は読むが AGENTS.md は読まない。共通規約を AGENTS.md に置きたい場合は、CLAUDE.md の冒頭に `@AGENTS.md` と書くか symlink する。深さ 5 の制限は循環参照や暴走的肥大化を防ぐためのガード。",
      references: [
        {
          label: "Memory (CLAUDE.md)",
          url: "https://code.claude.com/docs/en/memory",
        },
      ],
    },
  },
  {
    id: "ccb-007",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "CLAUDE.md の推奨される最大行数として、公式が目安に挙げているのは？",
    choices: [
      "10000 行未満",
      "200 行未満 (長くなるほど Claude の遵守率が下がる)",
      "50 行未満",
      "1000 行未満",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "事実上の無制限で、目安として機能しない。",
      "正解。docs に『under 200 lines』とあり、超えると追従が落ちる。",
      "厳しすぎる。",
      "公式が推奨する目安より大幅に多い。",
    ],
    hints: [
      "短く絞ったほうが指示の遵守率が高い。",
      "長くしたいときは import (`@`) で分割するのが定石。",
      "公式が具体的な数値を挙げている。",
    ],
    explanation: {
      summary:
        "CLAUDE.md は『200 行未満』が公式の目安。長くなるほど Claude の遵守率が下がるため、肥大化したら `@` で分割する。",
      reason:
        "システムプロンプトに近い位置で毎ターン読まれるので、長すぎると重要箇所が薄まり遵守率が落ちる。テスト規約・スタイル・ディレクトリ構造などをまず短く要約し、詳細は別ファイルへ切り出して `@docs/style.md` のように import するのが推奨ワークフロー。",
      references: [
        {
          label: "Memory (CLAUDE.md)",
          url: "https://code.claude.com/docs/en/memory",
        },
      ],
    },
  },
  {
    id: "ccb-008",
    categoryId: "claude-code-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "v2.1.59+ で導入された『Auto Memory』機能の挙動として正しいのは？",
    choices: [
      "デフォルト ON。`~/.claude/projects/<project>/memory/MEMORY.md` に追記され、各セッションで先頭 200 行または 25KB が自動ロードされる",
      "デフォルト OFF で、有効化しないと一切動かない",
      "プロジェクトルートの CLAUDE.md を毎回書き換える",
      "クラウド上に保存され、ローカルファイルは作らない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。docs の Auto Memory セクションに記載された仕様。",
      "デフォルトは ON。",
      "別ファイル (MEMORY.md) に書き込み、CLAUDE.md は触らない。",
      "ローカルの `~/.claude/projects/...` 配下に保存される。",
    ],
    hints: [
      "切るには `autoMemoryEnabled: false` または環境変数 `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`。",
      "トピック別ファイル (debugging.md など) はオンデマンド読み込み。",
      "サイズ上限がある。",
    ],
    explanation: {
      summary:
        "Auto Memory は v2.1.59+ で標準 ON。`~/.claude/projects/<project>/memory/MEMORY.md` に学習内容を追記し、セッション開始時に先頭 200 行または 25KB が読まれる。トピック別ファイルは必要時のみロード。",
      reason:
        "ユーザーがいちいち CLAUDE.md を更新しなくても、プロジェクト固有の知見 (テストコマンド・よくあるバグ・好みの命名) を自動蓄積する仕組み。MEMORY.md 本体は要約的に短く保たれ、トピック別ファイル (debugging.md など) を on demand で参照する設計。プライバシー上気になる場合は `autoMemoryEnabled: false` か `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` で停止可能。",
      references: [
        {
          label: "Memory (Auto Memory)",
          url: "https://code.claude.com/docs/en/memory",
        },
      ],
    },
  },
  {
    id: "ccb-009",
    categoryId: "claude-code-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "新規プロジェクトで CLAUDE.md の雛形を生成するための公式コマンドは？",
    choices: ["/bootstrap", "/init", "/setup", "/new"],
    answerIndex: 1,
    choiceExplanations: [
      "存在しないコマンド。",
      "正解。`/init` が CLAUDE.md のスターターを生成する。",
      "存在しないコマンド。",
      "存在しないコマンド。",
    ],
    hints: [
      "Claude Code 同梱のビルトインスキル。",
      "プロジェクトをスキャンして要約を CLAUDE.md に書く。",
      "1 文字で済むコマンド。",
    ],
    explanation: {
      summary:
        "`/init` でプロジェクトをスキャンしてスターター CLAUDE.md を生成する。生成後はチームで議論しながら手で整える。",
      reason:
        "リポジトリ構造・主要言語・テストコマンドなどを Claude が自動で要約し CLAUDE.md に書く。あくまで雛形なのでチームのルール・スタイルガイド・痛点は人間が追記すると遵守率が上がる。後から `@AGENTS.md` で既存規約を取り込むのも有効。",
      references: [
        {
          label: "Memory (CLAUDE.md)",
          url: "https://code.claude.com/docs/en/memory",
        },
      ],
    },
  },

  // ===========================================================================
  // Hooks (5)
  // ===========================================================================
  {
    id: "ccb-010",
    categoryId: "claude-code-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "ツール実行直前にチェックを挟みたい。最も適切な hook イベントは？",
    choices: [
      "PostToolUse (ツール実行後。block 不可)",
      "SessionStart (セッション開始時)",
      "UserPromptSubmit (ユーザー入力直後)",
      "PreToolUse (ツール呼び出し直前。block 可能)",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "PostToolUse は『すでに実行済み』なので block できない。",
      "ツール単位ではなくセッション単位のイベント。",
      "ツール実行ではなくユーザー入力のタイミング。",
      "正解。PreToolUse は実行前に走り、exit 2 で実行をブロックできる。",
    ],
    hints: [
      "イベント名に Pre/Post が付いている。",
      "ブロックできるのは Pre 系。",
      "公式 docs では『PostToolUse cannot block』と明記。",
    ],
    explanation: {
      summary:
        "PreToolUse はツール実行直前に走り、`exit 2` でブロックできる。PostToolUse はツール実行後に走るためブロック不可。",
      reason:
        "PreToolUse は『dangerous な rm を止める』『コミット前に lint を強制する』等の用途。matcher (`Bash|Edit` のような OR、または正規表現) で対象ツールを絞り込み、stderr に理由を書いて exit 2 で返すと Claude にフィードバックされ別の手段を試させられる。PostToolUse は監査ログや lint 自動実行 (失敗しても block しない) 用途。",
      references: [
        {
          label: "Hooks",
          url: "https://code.claude.com/docs/en/hooks",
        },
      ],
    },
  },
  {
    id: "ccb-011",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "hook の exit code とその意味の組み合わせとして正しいのは？",
    choices: [
      "0 = 成功 / 全ての non-zero = セッション中断",
      "1 = 成功 / 0 = エラー",
      "0 = 成功 (stdout は JSON として解釈) / 2 = ブロッキングエラー (stderr が Claude に返される) / その他 non-zero = ノンブロッキングエラー",
      "0 = 成功 / 1 = ブロッキング / 2 = 警告",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "non-zero でも 2 以外はノンブロッキング。",
      "Unix の慣例と逆で誤り。",
      "正解。docs の exit code 仕様。`2` だけが特別な『ブロック』扱い。",
      "1 はブロックではなくノンブロッキングエラー。",
    ],
    hints: [
      "ブロックする値は 1 つだけ。",
      "stdout を JSON にすると追加メタデータを返せる。",
      "stderr の内容はブロック時に Claude へフィードバックされる。",
    ],
    explanation: {
      summary:
        "exit 0 = 成功 (stdout が JSON なら追加情報として解釈)、exit 2 = ブロッキングエラー (stderr が Claude にフィードされる)、その他 non-zero = ノンブロッキングエラー (ログに残るが処理は続く)。",
      reason:
        "『2 だけが特別』を覚えれば良い。例: `git commit` を `--no-verify` 付きでやろうとした時に PreToolUse hook が `echo 'use signed commits' >&2; exit 2` を返すと、Claude は理由を読んで別の手段に切り替える。lint 失敗の通知だけしたい場合は exit 1 (ノンブロッキング) にしておけば作業を止めない。",
      references: [
        {
          label: "Hooks",
          url: "https://code.claude.com/docs/en/hooks",
        },
      ],
    },
  },
  {
    id: "ccb-012",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`command` 型 (シェル) と `http` 型 hook のデフォルトタイムアウトとして正しいのは？",
    choices: [
      "全 hook 一律 10 秒",
      "command / http / mcp_tool はいずれも 600 秒。prompt 型と UserPromptSubmit は 30 秒。agent 型は 60 秒",
      "全 hook 一律 30 秒",
      "command は 60 秒、http は 600 秒",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "短すぎて lint 等が間に合わない。",
      "正解。docs に記載のデフォルトタイムアウト値。",
      "種類ごとに異なるため一律ではない。",
      "command も http も同じ 600 秒。",
    ],
    hints: [
      "重い command/http は長めの 600 秒。",
      "Claude を呼ぶ prompt 型は単発推論なので短い。",
      "agent 型はサブエージェントを介すので中間値。",
    ],
    explanation: {
      summary:
        "command / http / mcp_tool は 600 秒、prompt と UserPromptSubmit は 30 秒、agent 型は 60 秒がデフォルト。必要に応じ hook 設定で上書き可能。",
      reason:
        "ハンドラタイプは 5 種類: `command` (シェル), `http` (POST), `mcp_tool`, `prompt` (単発 Claude), `agent` (サブエージェント, 実験的)。重い処理を想定するハンドラは 600 秒、軽い対話用は 30 秒。タイムアウトを超えるとノンブロッキング失敗扱いとなる。長い処理は backgrounding か非同期キュー連携を検討。",
      references: [
        {
          label: "Hooks",
          url: "https://code.claude.com/docs/en/hooks",
        },
      ],
    },
  },
  {
    id: "ccb-013",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち『ブロック可能な hook イベント』だけを集めた組み合わせは？",
    choices: [
      "PreToolUse / PermissionRequest / UserPromptSubmit / UserPromptExpansion / Stop",
      "PostToolUse / SessionStart / SessionEnd",
      "Notification / FileChanged / CwdChanged",
      "PreToolUse / PostToolUse / SessionEnd",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。docs が明示する『blocking events』。",
      "全て非ブロッキング系。",
      "通知・情報系で非ブロッキング。",
      "PostToolUse はブロック不可なので混在誤り。",
    ],
    hints: [
      "実行『前』の判断に絡むイベントだけがブロックできる。",
      "PostToolUse は時すでに遅し。",
      "Stop は『終わらせていいか』の判断ポイント。",
    ],
    explanation: {
      summary:
        "ブロック可能なのは PreToolUse / PermissionRequest / UserPromptSubmit / UserPromptExpansion / Stop の 5 つ。PostToolUse・SessionStart/End はブロック不可。",
      reason:
        "Stop hook を活用するとテスト未通過のままターン終了するのを防げる (`pnpm test` を実行し失敗なら exit 2 で続行を促す)。UserPromptSubmit hook は危険語の検知 (`rm -rf ~` を含むプロンプトを止める) などに有効。PermissionRequest は許可ダイアログの前にカスタムルールを差し込める。",
      references: [
        {
          label: "Hooks",
          url: "https://code.claude.com/docs/en/hooks",
        },
      ],
    },
  },
  {
    id: "ccb-014",
    categoryId: "claude-code-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "hook の matcher で『Bash と Edit のどちらでも発火させる』指定の書き方として正しいのは？",
    choices: [
      "matcher: \"Bash|Edit\" (パイプ区切りの OR、または正規表現)",
      "matcher: [\"Bash\", \"Edit\"]",
      "matcher: \"Bash,Edit\"",
      "matcher: \"Bash AND Edit\"",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`|` 区切りの OR か正規表現で指定する。`*` または省略は全件。",
      "配列指定は docs の例にない。",
      "カンマ区切りは未対応。",
      "AND 演算子は意味不明 (1 ツールに対する 1 イベントなので AND は成立しない)。",
    ],
    hints: [
      "全件マッチは `*` または matcher 省略。",
      "OR は `|`。",
      "より複雑な指定は正規表現が使える。",
    ],
    explanation: {
      summary:
        "matcher は `*` (省略可) で全件、`Bash|Edit` のような OR、または正規表現で書ける。配列やカンマ区切りはサポート外。",
      reason:
        "例: 編集系ツール全部に lint を仕込みたいなら `\"Edit|Write|MultiEdit\"`、危険コマンドだけ止めたいなら `\"Bash\"` matcher で実装する。パス展開には `${CLAUDE_PROJECT_DIR}` / `${CLAUDE_PLUGIN_ROOT}` / `${CLAUDE_PLUGIN_DATA}` プレースホルダが使える。",
      codeExample:
        "{\n  \"hooks\": {\n    \"PreToolUse\": [\n      {\n        \"matcher\": \"Bash|Edit\",\n        \"hooks\": [\n          {\n            \"type\": \"command\",\n            \"command\": \"${CLAUDE_PROJECT_DIR}/.claude/check.sh\"\n          }\n        ]\n      }\n    ]\n  }\n}",
      references: [
        {
          label: "Hooks",
          url: "https://code.claude.com/docs/en/hooks",
        },
        {
          label: "Zenn: Claude Code 開発ワークフロー自動化",
          url: "https://zenn.dev/lovegraph/articles/1a28dd65e80e5f",
        },
      ],
    },
  },

  // ===========================================================================
  // Skills (4)
  // ===========================================================================
  {
    id: "ccb-015",
    categoryId: "claude-code-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "Skills の基本構造として正しいのは？",
    choices: [
      "1 スキル = 1 シェルスクリプトのみ",
      "スキルは Anthropic 提供のものしか使えない",
      "1 スキル = 1 ディレクトリで、必須ファイルは `SKILL.md` (frontmatter + 本文)。他に補助スクリプトやリソースを同梱できる",
      "1 スキル = 1 JSON ファイル",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "シェルスクリプトはあくまで補助。SKILL.md が本体。",
      "ユーザー・プロジェクト・プラグインからも追加できる。",
      "正解。Agent Skills 標準に従い、ディレクトリ + SKILL.md が最小単位。",
      "JSON ではなく Markdown (frontmatter 付き)。",
    ],
    hints: [
      "Agent Skills 標準 (agentskills.io) に準拠。",
      "SKILL.md には frontmatter (name, description, when_to_use 等) と本文。",
      "`.claude/skills/<name>/SKILL.md` がプロジェクトスコープの定位置。",
    ],
    explanation: {
      summary:
        "スキルはディレクトリ単位で、`SKILL.md` が必須。frontmatter で name / description / when_to_use 等を宣言し、本文で手順を書く。スクリプトやテンプレを同居可能。",
      reason:
        "公式 docs は Agent Skills オープン標準 (agentskills.io) に従うと明記。スキル description はコンテキストに常駐し『いつ呼ぶか』を Claude が判断するための情報、SKILL.md 本体は呼び出された時のみ読み込まれる lazy load 構造。listing budget はコンテキスト窓の 1%、1 件あたり 1,536 文字までと公式に上限あり。",
      references: [
        {
          label: "Skills",
          url: "https://code.claude.com/docs/en/skills",
        },
        {
          label: "Qiita: Claude Code Skills 入門",
          url: "https://qiita.com/dai_chi/items/725d7c644bc860bd1144",
        },
      ],
    },
  },
  {
    id: "ccb-016",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`.claude/commands/deploy.md` と `.claude/skills/deploy/SKILL.md` の両方を作るとどうなる？",
    choices: [
      "Custom Commands は Skills に統合されたため、どちらの形式でも `/deploy` として登録される (重複に注意)",
      "commands 側だけが認識される (旧仕様優先)",
      "skills 側だけが認識される",
      "コンフリクトでセッションが起動しない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Custom Commands は Skills へ統合済み。両方書くと同じスラッシュ名で衝突するため一方に統一すべき。",
      "両方が認識される動作と一致しない。",
      "commands 形式も依然有効。",
      "起動はする (ただし重複は要整理)。",
    ],
    hints: [
      "Custom Commands は廃止ではなく『統合』された。",
      "`.claude/commands/*.md` も `.claude/skills/*/SKILL.md` も同じ仕組みに乗る。",
      "Live change detection で再起動不要。",
    ],
    explanation: {
      summary:
        "Claude Code の更新でカスタムコマンドはスキルに統合された。`.claude/commands/deploy.md` も `.claude/skills/deploy/SKILL.md` も両方 `/deploy` スラッシュコマンドを生成する。重複時の挙動が読みにくくなるため、どちらか一方に揃えるのが運用上安全。",
      reason:
        "スキルは『live change detection』対応で、編集はセッション再起動せず反映される。precedence は Enterprise → Personal (`~/.claude/skills/`) → Project (`.claude/skills/`) → Plugin。`disable-model-invocation: true` を frontmatter に入れるとモデルからの自動呼び出しを止められる (注意: `user-invocable: false` だけではプログラム的呼び出しは止まらない)。",
      references: [
        {
          label: "Skills",
          url: "https://code.claude.com/docs/en/skills",
        },
      ],
    },
  },
  {
    id: "ccb-017",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "SKILL.md の本文内に書く `` !`pnpm test` `` (バッククォート + `!`) の意味は？",
    choices: [
      "Markdown のコードブロックとしてレンダリングされる",
      "セキュリティ上のためエラーになる",
      "Claude が SKILL.md を読む前にシェルでコマンドを実行し、その出力を本文に埋め込む (動的コンテキスト)",
      "Claude にコマンド名を文字列として見せるだけ",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "通常のコードブロックではなく特殊構文。",
      "正規の機能なのでエラーにはならない。",
      "正解。`` !`cmd` `` インラインまたは ```` ```! ```` フェンスで事前実行され、出力が本文に注入される。",
      "プレーン表示ではなく、実行される。",
    ],
    hints: [
      "skill 呼び出し時にプリプロセスされる。",
      "`git log -1` や `pwd` を埋め込みたい時に便利。",
      "フェンス版もある (```` ```! ````)。",
    ],
    explanation: {
      summary:
        "SKILL.md の `` !`cmd` `` および ```` ```! ```` フェンスはスキル本体を Claude に渡す前にシェル実行され、stdout がその場に埋め込まれる『動的コンテキスト』機能。",
      reason:
        "例えばリリーススキルで現在のブランチ・直近コミット・未コミット変更を毎回新鮮な情報として Claude に渡せる。文字列置換系では `$ARGUMENTS` / `$ARGUMENTS[N]` / `$N` / `${CLAUDE_SESSION_ID}` / `${CLAUDE_SKILL_DIR}` が利用可能。",
      codeExample:
        "---\nname: release\ndescription: 新しいリリースを作る\n---\n\n## 現在の状態\n\n- ブランチ: !`git rev-parse --abbrev-ref HEAD`\n- 直近コミット: !`git log -1 --oneline`\n\n```!\ngit status --short\n```\n\n上記を踏まえてリリースノートを書いてください。",
      references: [
        {
          label: "Skills",
          url: "https://code.claude.com/docs/en/skills",
        },
        {
          label: "Qiita: Claude Code Skills 入門",
          url: "https://qiita.com/dai_chi/items/725d7c644bc860bd1144",
        },
      ],
    },
  },
  {
    id: "ccb-018",
    categoryId: "claude-code-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "『モデルが勝手にスキルを呼ばないようにしたい』ときに正しい設定は？",
    choices: [
      "`user-invocable: false` だけで十分",
      "SKILL.md を消す",
      "`allowed-tools: []` を空にする",
      "frontmatter で `disable-model-invocation: true` を設定する (`user-invocable: false` ではプログラム呼び出しが止まらないので不十分)",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "公式 docs に明記された gotcha: ユーザー呼び出しは禁止できてもプログラム的・モデル的呼び出しは止まらない。",
      "スキル自体を消すのは別解で『勝手に呼ばせない』設定の話ではない。",
      "ツール権限の話で、起動制御とは別。",
      "正解。モデル自動起動を止めるのは `disable-model-invocation`。",
    ],
    hints: [
      "公式 docs に『gotcha』として明示されている。",
      "user-invocable と model-invocable は別軸の制御。",
      "明示呼び出し (`/foo`) だけ受けたい時に有効。",
    ],
    explanation: {
      summary:
        "モデル自動呼び出しを禁止するには frontmatter に `disable-model-invocation: true`。`user-invocable: false` ではプログラム的・モデル的呼び出しは止まらないため要注意。",
      reason:
        "破壊的操作 (本番デプロイ等) をスキル化するとモデルが文脈次第で発動してしまう恐れがある。`disable-model-invocation: true` を入れておけばユーザーが `/deploy` と明示した時だけ動く。allowed-tools / effort / model / context: fork / agent / hooks / paths / shell など frontmatter には多くの制御フィールドがある。",
      references: [
        {
          label: "Skills",
          url: "https://code.claude.com/docs/en/skills",
        },
      ],
    },
  },

  // ===========================================================================
  // Subagents (4)
  // ===========================================================================
  {
    id: "ccb-019",
    categoryId: "claude-code-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "サブエージェント (subagent) を使う最大のメリットは？",
    choices: [
      "ファイルへの書き込み速度が上がる",
      "親とは独立したコンテキストウィンドウ・ツール・権限で動かせるため、長い探索をしてもメインのコンテキストを汚さない",
      "並列で無制限にネストして再帰呼び出しできる",
      "親エージェントより必ず賢いモデルが使われる",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "I/O 性能とは無関係。",
      "正解。独立コンテキストが核心的メリット。",
      "サブエージェントは『他のサブエージェントを呼べない』(no nesting)。",
      "デフォルトでは Haiku 等の軽量モデルが選ばれることもある (Explore は Haiku)。",
    ],
    hints: [
      "公式 docs にネスト不可と明記。",
      "Explore は Haiku 駆動。",
      "汚したくないコンテキストを守るのが主眼。",
    ],
    explanation: {
      summary:
        "サブエージェントは独立した context window・カスタム system prompt・ツール権限を持つ。長大な探索や危険な操作を分離してメインを汚さないのが目的。サブエージェントは他のサブエージェントを呼べない。",
      reason:
        "ビルトインで Explore (Haiku, read-only, quick/medium/very-thorough), Plan (read-only, モデル継承), general-purpose (全ツール), statusline-setup, claude-code-guide。Explore と Plan は context を軽く保つために CLAUDE.md と git status の読み込みをスキップする設計。",
      references: [
        {
          label: "Sub-agents",
          url: "https://code.claude.com/docs/en/sub-agents",
        },
      ],
    },
  },
  {
    id: "ccb-020",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ビルトインサブエージェント『Explore』の特徴として正しいのは？",
    choices: [
      "Haiku 駆動・read-only。quick / medium / very-thorough の探索深度を指定でき、CLAUDE.md と git status はロードしない",
      "Opus 4.7 駆動でファイル書き込み可",
      "ユーザーが呼んだ時のみ動き、Claude からは呼べない",
      "Plan モードと同一の機能",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。docs の Explore セクションに記載通り。",
      "Explore は Haiku ベースで read-only。",
      "親 Claude から自動的に呼べる。",
      "Plan も read-only だがモデル継承で別物。",
    ],
    hints: [
      "軽量モデルでサーチを大量に投げる用途。",
      "メインコンテキストを汚さない設計。",
      "探索深度のプリセットがある。",
    ],
    explanation: {
      summary:
        "Explore は Haiku 駆動・read-only のサブエージェント。深さは quick / medium / very-thorough。CLAUDE.md・git status を読まないことで軽量な探索に専念する。",
      reason:
        "巨大リポジトリで『この機能どこにある?』のような探索を Opus でやると context を浪費する。Explore に投げると Haiku で多数の Read/Grep を回し、最後に要約だけ親へ返るのでメインの context window が温存される。Plan はモデル継承の read-only エージェントで設計・計画立案用。",
      references: [
        {
          label: "Sub-agents",
          url: "https://code.claude.com/docs/en/sub-agents",
        },
      ],
    },
  },
  {
    id: "ccb-021",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "サブエージェント定義 (frontmatter) で『一時的な git worktree を切ってその中で作業させる』指定は？",
    choices: [
      "branch: temp",
      "isolation: worktree (デフォルトブランチから一時 worktree を切る。変更がなければ自動クリーンアップ)",
      "isolation: docker",
      "sandbox: true",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "branch フィールドはない。",
      "正解。docs に記載される `isolation: worktree` 機能。",
      "Docker は提供されていない。",
      "そのようなフィールドはない。",
    ],
    hints: [
      "ファイル操作をメインの作業ツリーから分離したい時に使う。",
      "変更がゼロなら自動掃除される。",
      "値は単語 1 つ。",
    ],
    explanation: {
      summary:
        "frontmatter の `isolation: worktree` でサブエージェントを一時 git worktree 内で動かせる。デフォルトブランチから切られ、変更がなければ自動クリーンアップ。",
      reason:
        "メインリポを汚さず安全に試行錯誤させたいときに有効。frontmatter で必須なのは `name` と `description`、任意で `tools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `isolation`, `effort` が使える。v2.1.63 で Task ツールが Agent にリネームされた (Task もエイリアスとして動く)。",
      references: [
        {
          label: "Sub-agents",
          url: "https://code.claude.com/docs/en/sub-agents",
        },
      ],
    },
  },
  {
    id: "ccb-022",
    categoryId: "claude-code-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "サブエージェントのスコープ precedence (上書き順、強い → 弱い) として正しいのは？",
    choices: [
      "Plugin → User → Project → Managed",
      "Project → Managed → User → Plugin",
      "Managed → --agents CLI フラグ → Project (.claude/agents/) → User (~/.claude/agents/) → Plugin",
      "User → Project → Plugin → Managed",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "Managed が最後になっていて誤り。",
      "Managed の位置が間違い。",
      "正解。docs の precedence 順。",
      "Managed が最強で User が中位、順序が違う。",
    ],
    hints: [
      "組織管理 (Managed) が最強。",
      "CLI 引数 `--agents` は次に強い。",
      "Plugin が最も弱い (上書きされやすい)。",
    ],
    explanation: {
      summary:
        "Managed → `--agents` CLI フラグ → Project → User → Plugin の順に強い。同名なら強いスコープのものが使われる。",
      reason:
        "ファイル定義のサブエージェントはセッション開始時にロードされるため、編集後は再起動が必要。一方 `/agents` UI で編集した変更は即時反映される。Plugin の同名エージェントを Project でオーバーライドする、といった運用が可能。",
      references: [
        {
          label: "Sub-agents",
          url: "https://code.claude.com/docs/en/sub-agents",
        },
      ],
    },
  },

  // ===========================================================================
  // MCP (4)
  // ===========================================================================
  {
    id: "ccb-023",
    categoryId: "claude-code-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "MCP (Model Context Protocol) の transport として現在『推奨』されるのは？",
    choices: [
      "sse (deprecated)",
      "stdio (廃止)",
      "websocket",
      "http (streamable-http のエイリアス)",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "sse は deprecated。",
      "stdio はローカル用途で現役だが新規推奨は http。",
      "websocket は MCP の transport 一覧にない。",
      "正解。docs で `http` (streamable-http のエイリアス) が推奨と明記。",
    ],
    hints: [
      "MCP の transport は 3 種類: http / sse / stdio。",
      "sse は古い。",
      "stdio はローカル子プロセス用。",
    ],
    explanation: {
      summary:
        "MCP の transport は http (streamable-http のエイリアス, 推奨) / sse (deprecated) / stdio (ローカルプロセス) の 3 種。新規サーバは http を選ぶのが定石。",
      reason:
        "MCP は modelcontextprotocol.io で標準化されたオープンプロトコル。リモートサーバは http、ローカル子プロセスでホストするツールは stdio という棲み分け。CLI には `claude mcp add` / `list` / `get` / `remove` / `reset-project-choices` / `add-from-claude-desktop` / `add-json` / `serve` が揃う。",
      references: [
        {
          label: "MCP",
          url: "https://code.claude.com/docs/en/mcp",
        },
      ],
    },
  },
  {
    id: "ccb-024",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "MCP サーバの 3 つのスコープのうち『リポジトリにコミットしてチームで共有』するのに使うのは？",
    choices: [
      "Project スコープ (`.mcp.json`、初回利用時に承認プロンプト)",
      "Local スコープ (`~/.claude.json`、個人)",
      "User スコープ (`~/.claude.json`、クロスプロジェクト)",
      "Plugin スコープ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`.mcp.json` はリポジトリにコミットしてチーム共有。安全のため初回利用時に承認プロンプトが出る。",
      "Local は個人用・非共有。",
      "User は自分の全プロジェクトで使うが他人とは共有しない。",
      "Plugin スコープは Plugin が同梱する MCP で、共有方法としては別軸。",
    ],
    hints: [
      "ファイル名にプロジェクトの意図が出ている。",
      "他人のリポを clone した時に承認が必要 (セキュリティ)。",
      "precedence 順は local > project > user > plugin > claude.ai。",
    ],
    explanation: {
      summary:
        "Project スコープ (`.mcp.json`) を使うとチームで MCP 設定を共有できる。初回利用時には承認プロンプトが出る (悪意ある MCP を勝手に走らせないため)。",
      reason:
        "precedence は local > project > user > plugin > claude.ai connector の順。Project の設定を一度承認すると `.claude/settings.local.json` 等に選択が保存される。やり直すには `claude mcp reset-project-choices` を使う。予約サーバ名 `workspace` は使えない。",
      references: [
        {
          label: "MCP",
          url: "https://code.claude.com/docs/en/mcp",
        },
      ],
    },
  },
  {
    id: "ccb-025",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "MCP の『Tool Search』機能について正しい記述は？",
    choices: [
      "Tool Search は廃止された機能",
      "デフォルトで MCP ツールは ToolSearch 経由の deferred (遅延ロード) になる。常時ロードしたいサーバは設定で `alwaysLoad: true` にする",
      "全 MCP ツールが常にコンテキストに乗る",
      "Tool Search は Plugin でしか使えない",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "現役機能。",
      "正解。MCP ツールはデフォルト deferred で、ToolSearch クエリで都度ロードされる。",
      "Tool Search 導入で常時ロードはオプトインに変わった。",
      "Plugin 専用ではない。",
    ],
    hints: [
      "ツール数が増えすぎるとコンテキストを食う問題への対策。",
      "サーバ単位でオプトインできる。",
      "frontmatter ではなく MCP サーバ設定でフラグを立てる。",
    ],
    explanation: {
      summary:
        "Tool Search により MCP ツールはデフォルトで deferred ロードになり、必要な時だけ ToolSearch で取り寄せる。常時ロードしたい場合はサーバ設定で `alwaysLoad: true`。",
      reason:
        "MCP サーバを多数追加するとツール定義の合計トークンが context window を圧迫していた問題への対策。リソースは `@server:protocol://resource/path` 形式で参照、プロンプトは `/mcp__server__prompt` で呼べる。タイムアウト系環境変数は `MCP_TIMEOUT`, `MCP_TOOL_TIMEOUT`, `MAX_MCP_OUTPUT_TOKENS` (デフォルト 25,000)。",
      references: [
        {
          label: "MCP",
          url: "https://code.claude.com/docs/en/mcp",
        },
      ],
    },
  },
  {
    id: "ccb-026",
    categoryId: "claude-code-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "MCP の出力サイズを制御する環境変数のデフォルト値として正しいのは？",
    choices: [
      "MAX_MCP_OUTPUT_TOKENS = 100,000",
      "MAX_MCP_OUTPUT_TOKENS = 設定不要 (無制限)",
      "MAX_MCP_OUTPUT_TOKENS = 25,000",
      "MAX_MCP_OUTPUT_TOKENS = 1,000",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "実際の上限はこれより小さい。",
      "デフォルト値が設定されている。",
      "正解。docs に記載のデフォルト値。",
      "小さすぎて多くのツール結果が切れる。",
    ],
    hints: [
      "5 桁の値。",
      "ツール出力で context を食い潰さないためのセーフガード。",
      "必要なら環境変数で上書き可能。",
    ],
    explanation: {
      summary:
        "`MAX_MCP_OUTPUT_TOKENS` はデフォルト 25,000。大きなレスポンスを返す MCP (DB 結果や検索結果) で context が溢れないようにする上限。",
      reason:
        "他にも `MCP_TIMEOUT` (サーバ起動・初期化のタイムアウト) と `MCP_TOOL_TIMEOUT` (個別ツール呼び出しのタイムアウト) がある。OAuth に対応した MCP サーバならトークンは OS のキーチェーンに保存される。",
      references: [
        {
          label: "MCP",
          url: "https://code.claude.com/docs/en/mcp",
        },
      ],
    },
  },

  // ===========================================================================
  // Plugins (2)
  // ===========================================================================
  {
    id: "ccb-027",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Claude Code プラグインに必須なファイルと、その置き場所として正しいのは？",
    choices: [
      "`<plugin-root>/plugin.yaml` が必須",
      "`<plugin-root>/.claude/plugin.json` が必須",
      "`<plugin-root>/manifest.json` が必須",
      "`<plugin-root>/.claude-plugin/plugin.json` (`name` フィールドが必須)。`.claude-plugin/` 内に置けるのは plugin.json のみで、その他 (skills/agents/hooks 等) はプラグインルート直下",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "YAML ではなく JSON。",
      "`.claude/` ではなく `.claude-plugin/`。",
      "ファイル名は plugin.json。",
      "正解。docs に明示されたマニフェストの場所と命名。",
    ],
    hints: [
      "ディレクトリ名は `.claude-plugin/` (ハイフン)。",
      "中身に入れていいのは 1 ファイルだけ。",
      "スキル名はプラグイン名で名前空間化される。",
    ],
    explanation: {
      summary:
        "プラグインマニフェストは `<plugin-root>/.claude-plugin/plugin.json` で、必須フィールドは `name`。マニフェスト以外のリソース (skills, agents, hooks, mcp 設定, LSP, bin, settings) はプラグインルート直下に置く。",
      reason:
        "スキル名はプラグインで namespace 化され `/my-plugin:hello` のように呼ぶ。ローカルテストは `claude --plugin-dir ./my-plugin` (v2.1.128+ で .zip も可)。変更を読み直すには `/reload-plugins`。マーケットプレイスは `claude-plugins-official` (公式キュレーション、自動利用可) と `claude-community` (オプトイン) の 2 つ。",
      references: [
        {
          label: "Plugins",
          url: "https://code.claude.com/docs/en/plugins",
        },
      ],
    },
  },
  {
    id: "ccb-028",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "プラグインのファイルを編集した後、変更を反映する公式コマンドは？",
    choices: ["/restart", "/refresh", "/sync", "/reload-plugins"],
    answerIndex: 3,
    choiceExplanations: [
      "セッション再起動は不要。",
      "そのようなコマンドはない。",
      "そのようなコマンドはない。",
      "正解。docs で言及されるコマンド。",
    ],
    hints: [
      "セッションを落とさずに済む。",
      "コマンド名にプラグイン管理の動詞が入っている。",
      "ハイフン区切り。",
    ],
    explanation: {
      summary:
        "プラグインの内容を反映するには `/reload-plugins`。セッションを再起動せずプラグインの skills / agents / hooks / MCP 設定が読み直される。",
      reason:
        "Skills は live change detection で個別に即時反映されるが、プラグインマニフェストや mcp 設定など全体に関わる変更は reload-plugins が確実。ローカル開発は `claude --plugin-dir ./my-plugin` で別途追加すると便利。",
      references: [
        {
          label: "Plugins",
          url: "https://code.claude.com/docs/en/plugins",
        },
      ],
    },
  },

  // ===========================================================================
  // Settings (1)
  // ===========================================================================
  {
    id: "ccb-029",
    categoryId: "claude-code-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Claude Code の settings の precedence (強い → 弱い) と、permission rules の合成挙動として正しいのは？",
    choices: [
      "Managed → CLI args → Local project (.claude/settings.local.json) → Shared project (.claude/settings.json) → User (~/.claude/settings.json)。permission rules は MERGE され、いずれかのスコープの deny が優先",
      "User → Project → Managed の順で完全上書き",
      "settings は 1 ファイルしか読まれない",
      "deny より allow が常に優先",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。docs 通りの precedence と merge 動作。",
      "Managed が最強で、また permission は完全上書きでなく merge される。",
      "階層化されたスコープから合成される。",
      "deny が常に優先される (deny → ask → allow の順で評価)。",
    ],
    hints: [
      "組織配布 (Managed) が最強。",
      "permission は配列マージで deny が勝つ。",
      "schema: `https://json.schemastore.org/claude-code-settings.json`。",
    ],
    explanation: {
      summary:
        "precedence は Managed > CLI > Local project > Shared project > User。permission rules は全スコープから merge され、deny → ask → allow の順で評価されるので、どこか 1 つでも deny が当たれば拒否される。",
      reason:
        "Managed (`/etc/claude-code/` 等) が最強なのは組織ポリシーを優先させるため。`.claude/settings.local.json` は gitignored で個人の上書き用。`.claude/settings.json` はリポジトリ共有用。schema 参照は `\"$schema\": \"https://json.schemastore.org/claude-code-settings.json\"` でエディタ補完が効く。",
      references: [
        {
          label: "Settings",
          url: "https://code.claude.com/docs/en/settings",
        },
      ],
    },
  },

  // ===========================================================================
  // Permissions (1)
  // ===========================================================================
  {
    id: "ccb-030",
    categoryId: "claude-code-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Claude Code の permission mode に関する正しい記述は？",
    choices: [
      "`plan` モードでも編集系ツールが使える",
      "`auto` モードは Bedrock / Vertex でも使える",
      "Shift+Tab で default → acceptEdits → plan を循環。`auto` モードは v2.1.83+ かつ Sonnet 4.6 / Opus 4.6 / Opus 4.7 + Anthropic API 限定で、分類器はツール結果を見ない (間接プロンプトインジェクション対策)",
      "`bypassPermissions` でも `rm -rf /` は常に自動許可される",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "`plan` は読み取り専用で編集は不可。",
      "auto モードは Anthropic API のみ。Bedrock / Vertex 非対応。",
      "正解。Shift+Tab の循環順序と auto モードの条件 (バージョン・モデル・プロバイダー) は docs 通り。",
      "`bypassPermissions` でも `rm -rf /` や `rm -rf ~` は依然プロンプトされる安全ガードがある。",
    ],
    hints: [
      "permission mode は 6 種 (default / acceptEdits / plan / auto / dontAsk / bypassPermissions)。",
      "auto は分類器ベースの安全チェックを噛ます。",
      "deny → ask → allow の順で評価される。",
    ],
    explanation: {
      summary:
        "6 モード: default / acceptEdits / plan / auto / dontAsk / bypassPermissions。Shift+Tab は default → acceptEdits → plan を循環。`auto` は v2.1.83+、Sonnet 4.6 / Opus 4.6 / Opus 4.7、Anthropic API でのみ動作。分類器はユーザーメッセージ・ツール呼び出し・CLAUDE.md は見るがツール結果は見ない (間接プロンプトインジェクション対策)。",
      reason:
        "`acceptEdits` は read + 編集 + 作業ディレクトリ内のファイルシステムコマンド (mkdir/touch/mv/cp/rm/rmdir/sed) を自動許可。`bypassPermissions` (= `--dangerously-skip-permissions`) でも `rm -rf /` / `rm -rf ~` は常に確認される。protected paths (`.git`, `.vscode`, `.claude` 等) は auto では基本許可されない。read-only Bash (ls, cat, grep, find, wc, which, diff, stat, du, cd, read-only git 等) は常に許可。",
      references: [
        {
          label: "Permission Modes",
          url: "https://code.claude.com/docs/en/permission-modes",
        },
        {
          label: "Permissions",
          url: "https://code.claude.com/docs/en/permissions",
        },
      ],
    },
  },
];

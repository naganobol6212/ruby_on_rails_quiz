import type { Question } from "@/lib/types";

/**
 * Claude Code 実践活用クイズ (30 問)
 * - IDE 連携 (5) / Web・クラウド・リモート (4) / Output Styles (3)
 * - バックグラウンド・batch・monitor (3) / スラッシュコマンド (3)
 * - ベストプラクティス・コンテキスト管理 (5) / Skill 設計 (3)
 * - 実ワークフロー: PR レビュー / セキュリティ / worktree (4)
 *
 * 出典: code.claude.com/docs/en/*、公式ブログ、ブロガー記事 (2025-2026)。
 */
export const claudeCodePracticeQuestions: Question[] = [
  // ===========================================================================
  // IDE 連携 (5)
  // ===========================================================================
  {
    id: "ccp-001",
    categoryId: "claude-code-practice",
    difficulty: "beginner",
    type: "choice",
    question:
      "VS Code 拡張で、エディタの選択範囲を Claude へ『ファイルパス + 行範囲付きの @-mention』として挿入するショートカットは？",
    choices: [
      "Option/Alt + K",
      "Cmd/Ctrl + Esc",
      "Cmd/Ctrl + Shift + T",
      "Cmd/Ctrl + Shift + Esc",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Option/Alt + K が選択範囲を `@file:lines` の形で Claude 入力欄へ挿入する。",
      "Cmd/Ctrl + Esc はエディタと Claude パネルのフォーカスをトグルするショートカット。",
      "Cmd/Ctrl + Shift + T は閉じた Claude タブを再オープンする。",
      "Cmd/Ctrl + Shift + Esc は新しい会話タブを開く。",
    ],
    hints: [
      "K は『Kontext』のKと覚えると忘れない。",
      "選択している行範囲もそのまま添付される。",
      "Esc 系のショートカットはフォーカス制御 / タブ操作用。",
    ],
    explanation: {
      summary:
        "VS Code 拡張 (1.98.0+) では Option/Alt + K で選択範囲を Claude にファイルパス + 行レンジ付きで貼り付けられる。Esc 系はフォーカスやタブ管理に割り当てられている。",
      reason:
        "@-mention は VS Code 内で fuzzy 補完が効き、フォルダ参照 (末尾スラッシュ) や `@terminal:name`、`@browser` (Claude in Chrome 拡張必須) など IDE 固有の参照も可能。Cursor / Windsurf / Kiro 等の Open VSX 系 IDE でも同じ拡張が動作する。",
      references: [
        { label: "VS Code 拡張 (公式)", url: "https://code.claude.com/docs/en/vs-code" },
      ],
    },
  },
  {
    id: "ccp-002",
    categoryId: "claude-code-practice",
    difficulty: "beginner",
    type: "choice",
    question:
      "VS Code 拡張で『エディタと Claude パネルのフォーカスをトグル』するショートカットは？",
    choices: [
      "Cmd/Ctrl + Esc",
      "Cmd/Ctrl + Shift + Esc",
      "Cmd/Ctrl + Shift + T",
      "Option/Alt + K",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Cmd/Ctrl + Esc がエディタと Claude パネルの間でフォーカスを切り替える。",
      "Shift + Esc は『新しい会話タブを開く』ショートカット。",
      "Shift + T は閉じたタブを再オープンする。",
      "Option/Alt + K は選択範囲を @-mention として挿入する。",
    ],
    hints: [
      "片手で頻繁に切り替える操作なので、押しやすいキーが割り当てられている。",
      "Shift 修飾が付くと『新規』『再オープン』など別の意味になる。",
      "K は context 挿入用。",
    ],
    explanation: {
      summary:
        "Cmd/Ctrl + Esc がフォーカストグル。Shift を足すと『新規会話タブ』、Shift + T は『閉じたタブ再オープン』、Option/Alt + K は『選択を @-mention』と覚えると整理しやすい。",
      reason:
        "VS Code 拡張は Checkpoints UI (リワインド / フォーク / フォーク+リワインド) も含む拡張専用機能を持ち、CLI とは異なるショートカット体系を持っている。JetBrains プラグインは IDE 内ターミナルで CLI と同じモード切替で動作する。",
      references: [
        { label: "VS Code 拡張 (公式)", url: "https://code.claude.com/docs/en/vs-code" },
        { label: "JetBrains プラグイン", url: "https://code.claude.com/docs/en/jetbrains" },
      ],
    },
  },
  {
    id: "ccp-003",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "VS Code 拡張の『Checkpoints UI』が提供する操作として誤っているものはどれ？",
    choices: [
      "別ブランチへ自動 push する",
      "会話を任意の時点にリワインドする",
      "ある時点から会話をフォークする",
      "フォーク + リワインドを同時に行う",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Checkpoints UI に自動 push 機能は無い。Git の push はユーザー操作。",
      "リワインドは Checkpoints UI の中核機能。",
      "フォーク (分岐) も提供される。",
      "フォーク+リワインドの同時操作も UI から可能。",
    ],
    hints: [
      "Checkpoints は『会話・ファイル状態のスナップショット』を扱う機能。",
      "リモートリポジトリへの操作とは別レイヤー。",
      "VS Code 拡張に特化した UI で、CLI 単体には無い。",
    ],
    explanation: {
      summary:
        "Checkpoints UI は VS Code 拡張専用機能で、リワインド・フォーク・フォーク+リワインドの 3 操作を提供する。Git 操作 (push 等) は別。",
      reason:
        "Checkpoints は会話とファイル状態のスナップショット。実験的な変更を試して気に入らなければ巻き戻したり、ある時点から別方針で枝分かれさせられる。Git の commit/push とは独立した『ハーネス内のタイムマシン』として動く。",
      references: [
        { label: "VS Code 拡張 (公式)", url: "https://code.claude.com/docs/en/vs-code" },
      ],
    },
  },
  {
    id: "ccp-004",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "IDE 拡張の『組み込み MCP サーバー (名前: `ide`)』が公開するツールとして正しい組み合わせは？",
    choices: [
      "`mcp__ide__getDiagnostics` (読み取り専用) と `mcp__ide__executeCode` (Jupyter)",
      "`mcp__ide__commit` と `mcp__ide__push`",
      "`mcp__ide__openFile` と `mcp__ide__closeFile`",
      "`mcp__ide__deploy` と `mcp__ide__rollback`",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。診断情報の取得 (read-only) と Jupyter 実行の 2 ツールが公開される。",
      "Git 操作は MCP `ide` の責務ではない。",
      "ファイル開閉 API は提供されていない。",
      "デプロイ系の MCP ツールではない。",
    ],
    hints: [
      "127.0.0.1 のランダムポートでアクティベーション毎にトークン発行。",
      "Jupyter ノートブックを使う人向けの実行ツールが含まれる。",
      "Lint/型エラーを Claude が読むためのツールがある。",
    ],
    explanation: {
      summary:
        "組み込み MCP `ide` は 127.0.0.1 のランダムポートで起動し、起動毎に新しいトークンを発行する。`mcp__ide__getDiagnostics` (読み取り専用) と `mcp__ide__executeCode` (Jupyter) を公開する。",
      reason:
        "IDE の診断 (TypeScript エラー、ESLint 警告など) を Claude が直接読めるため、修正フィードバックループが高速化する。executeCode は Jupyter カーネル上で評価できる。トークンとローカル限定バインドにより、他プロセスからの誤接続を防ぐ。",
      references: [
        { label: "VS Code 拡張 (公式)", url: "https://code.claude.com/docs/en/vs-code" },
      ],
    },
  },
  {
    id: "ccp-005",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "JetBrains プラグインで Claude Code を動かすときの仕組みとして正しいのは？",
    choices: [
      "IDE 内ターミナルで CLI を起動し、CLI と同じモード切替で操作する",
      "JetBrains 独自のサイドパネル UI を提供し、VS Code とは別のショートカット体系になる",
      "クラウドでだけ動き、ローカルでは使えない",
      "API キーを設定するとシンタックスハイライト機能だけ追加される",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。JetBrains 版は IDE 内ターミナルで CLI を呼び出すラッパで、CLI と同じプランモード等が使える。",
      "JetBrains 専用 UI は持たず、ターミナル経由で動く。",
      "ローカル CLI 経由なのでローカルでも動く。",
      "Claude Code はシンタックスハイライトを目的とした拡張ではない。",
    ],
    hints: [
      "Plugin は『CLI のラッパ』に近い形態。",
      "VS Code 版のような独自 UI ではない。",
      "プランモードや /commands もそのまま使える。",
    ],
    explanation: {
      summary:
        "JetBrains プラグインは IDE 内ターミナル上で Claude Code CLI を起動するラッパ。CLI 同等のモード切替・スラッシュコマンドが利用できる。",
      reason:
        "VS Code 拡張のような Checkpoints UI / Cmd+Esc 等の専用ショートカットは無いが、IntelliJ / WebStorm / RubyMine など JetBrains 系 IDE で同じ CLI 体験を提供できる。",
      references: [
        { label: "JetBrains プラグイン (公式)", url: "https://code.claude.com/docs/en/jetbrains" },
      ],
    },
  },

  // ===========================================================================
  // Web / クラウド / リモート (4)
  // ===========================================================================
  {
    id: "ccp-006",
    categoryId: "claude-code-practice",
    difficulty: "beginner",
    type: "choice",
    question:
      "Claude Code on the Web (research preview) を利用できるプランの組み合わせとして正しいのは？",
    choices: [
      "Pro / Max / Team / Enterprise (premium または Chat+Code シート)",
      "Free プランのみ",
      "Enterprise だけ",
      "API クレジット課金ユーザーのみ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Pro / Max / Team および Enterprise (premium または Chat+Code シート) で利用できる。",
      "Free プランでは利用できない (research preview)。",
      "Enterprise のみという制限は無い。",
      "API クレジット利用は別系統。",
    ],
    hints: [
      "claude.ai/code および Claude iOS アプリからアクセス。",
      "Research preview だが Free ではない。",
      "Enterprise はシート種別に注意。",
    ],
    explanation: {
      summary:
        "Claude Code on the Web は研究プレビュー段階で、Pro / Max / Team ユーザーおよび Enterprise (premium / Chat+Code シート) で利用できる。claude.ai/code、Claude iOS アプリ経由でアクセスする。",
      reason:
        "Anthropic 管理のクラウド VM 上で動くため、ローカルマシンを起動しなくてもセッションを走らせられる。ブラウザを閉じてもセッションは継続し、モバイルアプリから進捗を確認できる。",
      references: [
        { label: "Claude Code on the Web (公式)", url: "https://code.claude.com/docs/en/claude-code-on-the-web" },
      ],
    },
  },
  {
    id: "ccp-007",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Claude Code on the Web のセッションで利用可能なパーミッションモードとして正しいのは？",
    choices: [
      "Auto accept edits と Plan mode の 2 つだけ",
      "Ask / Auto / Bypass の 3 つ",
      "すべてのモード (Ask / Auto / Bypass / Plan)",
      "Bypass のみ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Web 版では Auto accept edits と Plan mode の 2 つのみが利用可能。",
      "Ask / Auto / Bypass は CLI 側のモードで Web には無い。",
      "Web ではモードが制限されている。",
      "Bypass は危険なので Web では提供されない。",
    ],
    hints: [
      "クラウド環境の安全性を考えて制限されている。",
      "Plan モードは Web でも有効。",
      "Bypass は人間レビューを飛ばすので Web では非搭載。",
    ],
    explanation: {
      summary:
        "Web 版は Auto accept edits と Plan mode の 2 モードだけ提供。Ask / Auto / Bypass はローカル CLI 用で、Web のクラウド環境では使えない。",
      reason:
        "クラウド環境でユーザー確認を細かく挟むのは UX 上現実的でないため『最初に Plan を見て承認 → 後は auto-accept』という非同期前提の運用に最適化されている。Bypass を Web で許すと監査困難になる。",
      references: [
        { label: "Claude Code on the Web (公式)", url: "https://code.claude.com/docs/en/claude-code-on-the-web" },
      ],
    },
  },
  {
    id: "ccp-008",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "クラウドで走らせていたセッションを『手元のターミナルへ引き継ぐ』ためのコマンドは？",
    choices: [
      "claude --teleport",
      "claude --remote",
      "claude --resume",
      "claude --clone",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`--teleport` でクラウドセッションを手元へ引き寄せる。",
      "`--remote` は逆に、ローカル CLI をリモート (ブラウザ等) から操作するためのもの。",
      "`--resume` は中断したセッションの再開で、環境移動ではない。",
      "そういうフラグは存在しない。",
    ],
    hints: [
      "テレポートは『場所を移す』イメージ。",
      "remote は反対方向の操作。",
      "セッション再開とは別概念。",
    ],
    explanation: {
      summary:
        "`claude --teleport` でクラウドセッションをローカルへ引き継ぐ。逆に `claude --remote` を使うとローカル CLI をブラウザなどから操作できる。",
      reason:
        "クラウドで開始 → 出先で監視 → 戻ってきたらローカル CPU / GPU でリッチに作業継続、というハイブリッド運用が可能。/teleport, /remote のスラッシュコマンドも対応。",
      references: [
        { label: "Claude Code on the Web (公式)", url: "https://code.claude.com/docs/en/claude-code-on-the-web" },
      ],
    },
  },
  {
    id: "ccp-009",
    categoryId: "claude-code-practice",
    difficulty: "beginner",
    type: "choice",
    question:
      "Claude Code on the Web が GitHub リポジトリへアクセスする方式として、公式にサポートされる組み合わせは？",
    choices: [
      "GitHub App または個人アクセストークン (PAT)",
      "SSH 鍵のみ",
      "Anthropic 専用 OAuth スコープのみ",
      "毎回パスワード入力",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。GitHub App か PAT の 2 通り。",
      "Web 環境では SSH 鍵運用は提供されない。",
      "GitHub 側の OAuth スコープが必要であり、Anthropic 独自の代替は無い。",
      "GitHub はパスワード認証を廃止済み。",
    ],
    hints: [
      "組織管理者は GitHub App 推奨。",
      "個人利用なら PAT が手軽。",
      "クラウド VM なので秘密鍵を置きたくない事情がある。",
    ],
    explanation: {
      summary:
        "Web 版は GitHub App か PAT のいずれかで GitHub に接続する。組織は GitHub App による細粒度パーミッションが推奨。",
      reason:
        "クラウド VM に SSH 秘密鍵を持ち込むのはセキュリティ上避けたいので、トークン方式に統一されている。セットアップスクリプトもクラウド環境内で実行される。",
      references: [
        { label: "Claude Code on the Web (公式)", url: "https://code.claude.com/docs/en/claude-code-on-the-web" },
      ],
    },
  },

  // ===========================================================================
  // Output Styles (3)
  // ===========================================================================
  {
    id: "ccp-010",
    categoryId: "claude-code-practice",
    difficulty: "beginner",
    type: "choice",
    question:
      "Claude Code の組み込み Output Style (4 種類) として正しい組み合わせは？",
    choices: [
      "Default / Proactive / Explanatory / Learning",
      "Default / Verbose / Quiet / Debug",
      "Junior / Senior / Architect / Reviewer",
      "Markdown / Plain / JSON / HTML",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Default / Proactive (即実行) / Explanatory (学習向け Insights) / Learning (TODO(human) を挟む) の 4 種類。",
      "そういった命名のスタイルは無い。",
      "ロール名のスタイルは存在しない。",
      "出力フォーマット選択ではない。",
    ],
    hints: [
      "Proactive は『止まらず進む』。",
      "Explanatory は『教育的なコメントを足す』。",
      "Learning は『TODO(human)』を残してユーザーに考えさせる。",
    ],
    explanation: {
      summary:
        "組み込み Output Style は Default / Proactive / Explanatory / Learning の 4 種類。Output Style はユーザーメッセージではなく『システムプロンプト』を変更する仕組み。",
      reason:
        "Proactive はクリティカルな確認を最小限にして実装を進める運用向け。Explanatory は『Insights』として背景・トレードオフを解説する。Learning は意図的に `TODO(human)` マーカーを残し、人間が考える余地を作る教育モード。",
      references: [
        { label: "Output Styles (公式)", url: "https://code.claude.com/docs/en/output-styles" },
      ],
    },
  },
  {
    id: "ccp-011",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Output Style を変更したとき、設定が反映されるタイミングとして正しいのは？",
    choices: [
      "/clear または新規セッションを開始した後",
      "保存と同時に現在のメッセージから即座に",
      "Claude Code を再インストールした後",
      "OS を再起動した後",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Output Style はシステムプロンプトを差し替えるので、新しい会話 (clear or 新セッション) で初めて適用される。",
      "現在実行中の会話には適用されない。",
      "再インストールは不要。",
      "OS の再起動は無関係。",
    ],
    hints: [
      "システムプロンプトは会話の最初に固定される。",
      "途中で差し替えても既に LLM に渡された履歴は変わらない。",
      "/clear で文脈をリセットすれば新しい system prompt が反映される。",
    ],
    explanation: {
      summary:
        "Output Style は LLM のシステムプロンプトを差し替える仕組みのため、`/clear` か新規セッション開始後に反映される。`/config` か `settings.json` の `outputStyle` で切替。",
      reason:
        "実行中の会話は既にモデルへ送信されたシステムプロンプトで動いており、後から書き換えても過去のターンを書き直せない。新しいセッションで最初のターンが構築される際に新スタイルが取り込まれる。",
      references: [
        { label: "Output Styles (公式)", url: "https://code.claude.com/docs/en/output-styles" },
      ],
    },
  },
  {
    id: "ccp-012",
    categoryId: "claude-code-practice",
    difficulty: "advanced",
    type: "choice",
    question:
      "カスタム Output Style を作る際の正しい配置と frontmatter として正しいのは？",
    choices: [
      "`~/.claude/output-styles/` か `.claude/output-styles/` 配下の Markdown。frontmatter に `name` / `description` / `keep-coding-instructions` / `force-for-plugin` が指定可能",
      "`package.json` の `claude.styles` フィールドに JSON で書く",
      "`~/.bashrc` に環境変数として登録する",
      "Anthropic のダッシュボードでのみ管理する",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Markdown + YAML frontmatter で、ユーザー global か repo ローカルに配置する。",
      "package.json での宣言はサポートされていない。",
      "環境変数ではなくファイルベース。",
      "ダッシュボード経由ではなくファイルで管理する。",
    ],
    hints: [
      "Skills 等と同じく `~/.claude/` または `.claude/` 配下に置く。",
      "Markdown 本文がシステムプロンプトに追加される。",
      "`keep-coding-instructions` のデフォルトは false。",
    ],
    explanation: {
      summary:
        "カスタム Output Style は `~/.claude/output-styles/` (ユーザー) か `.claude/output-styles/` (プロジェクト) に Markdown で配置。frontmatter で `name` / `description` / `keep-coding-instructions` / `force-for-plugin` を制御。",
      reason:
        "`keep-coding-instructions: true` にすると Claude Code 既定のコーディング指示を残したまま追記モードになる (デフォルト false は完全置換)。`force-for-plugin` はプラグイン側からの強制適用に使える。",
      references: [
        { label: "Output Styles (公式)", url: "https://code.claude.com/docs/en/output-styles" },
      ],
    },
  },

  // ===========================================================================
  // バックグラウンド / batch / monitor (3)
  // ===========================================================================
  {
    id: "ccp-013",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "現在のセッションそのものを『デタッチして裏で走らせ続ける』スラッシュコマンドは？",
    choices: [
      "/background",
      "/tasks",
      "/batch",
      "/teleport",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`/background` でセッション全体をデタッチしてバックグラウンド化する。",
      "`/tasks` は『今走っているバックグラウンドタスク一覧』を表示するもの。",
      "`/batch` は大きな変更を独立した worktree 群へ分解する。",
      "`/teleport` はクラウドセッションをローカルへ移す。",
    ],
    hints: [
      "セッション単位 vs タスク単位の違いを意識する。",
      "Web 版でブラウザを閉じてもよい挙動と似ている。",
      "一覧表示は別コマンド。",
    ],
    explanation: {
      summary:
        "`/background` はセッション全体をデタッチし、`/tasks` で実行中タスクを確認できる。`/batch` は別物で『大きな変更を独立 worktree 群に分解』する並列実行コマンド。",
      reason:
        "長時間ジョブを別プロセスで走らせ、ユーザーは別の作業に戻れる。サブエージェント frontmatter に `background: true`、Hooks に `async: true` / `asyncRewake` を組み合わせると非同期パイプラインが組める (`asyncRewake` は exit 2 で Claude を起こす)。",
      references: [
        { label: "Slash Commands (公式)", url: "https://code.claude.com/docs/en/commands" },
      ],
    },
  },
  {
    id: "ccp-014",
    categoryId: "claude-code-practice",
    difficulty: "advanced",
    type: "choice",
    question:
      "`/batch` の正しい説明はどれ？",
    choices: [
      "大きな変更を独立した単位に分解し、各単位を別々の worktree で並列実行する",
      "複数の git ブランチを一度に push する",
      "テストを並列実行するだけのコマンド",
      "コミット履歴を squash して 1 つにまとめる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`/batch` はタスク分解 + 並列 worktree 実行の組み合わせ。",
      "git push のラッパではない。",
      "テスト並列実行は別の話。",
      "コミット squash 機能ではない。",
    ],
    hints: [
      "並列性の鍵は『独立した worktree』。",
      "依存関係が無いタスク群を一気に進めるとき有効。",
      "review は人間が後でまとめて行う。",
    ],
    explanation: {
      summary:
        "`/batch` は大規模変更を独立した単位に切り分け、各単位を別 worktree で並行進行させる。各タスクが衝突しないので、後でまとめてレビューできる。",
      reason:
        "1 つの巨大 PR を作るより、独立な小タスクを並列で完成させてから順次マージする方が安全。Claude Code のサブエージェントには `isolation: worktree` の選択肢があり、`/batch` はそれを束ねる上位概念に近い。",
      references: [
        { label: "Slash Commands (公式)", url: "https://code.claude.com/docs/en/commands" },
      ],
    },
  },
  {
    id: "ccp-015",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Claude Code が提供する `Monitor` ツールの挙動として正しいのはどれ？",
    choices: [
      "バックグラウンドで走るスクリプトを監視し、stdout の各行が 1 イベントとしてストリーミングされる",
      "CPU 使用率を計測してダッシュボードに出す",
      "ファイル変更を検知して自動コミットする",
      "ネットワーク帯域を制限する",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Monitor は long-running なバックグラウンドプロセスの stdout を逐次イベント化する。",
      "そのような OS リソース計測機能は無い。",
      "自動コミットは Hook で実装するもの。",
      "ネットワーク制御の役割はない。",
    ],
    hints: [
      "until-loop で『条件が満たされるまで』待つ用途にも使える。",
      "1 行 = 1 イベント、というイメージ。",
      "短い sleep でポーリングするより Monitor を使う方が良い。",
    ],
    explanation: {
      summary:
        "Monitor ツールはバックグラウンドプロセスを購読し、stdout の 1 行ごとにイベント通知する。`until <check>; do sleep 2; done` 形式と組み合わせれば長時間ジョブの完了通知に使える。",
      reason:
        "スリープを連打するよりも、Monitor で待機すれば必要なときだけウェイクアップしてイベントを処理できるので、対話コストが下がる。`run_in_background: true` の Bash ジョブと組み合わせるのが典型的。",
      references: [
        { label: "Agent View (公式)", url: "https://code.claude.com/docs/en/agent-view" },
      ],
    },
  },

  // ===========================================================================
  // スラッシュコマンドの作法 (3)
  // ===========================================================================
  {
    id: "ccp-016",
    categoryId: "claude-code-practice",
    difficulty: "beginner",
    type: "choice",
    question:
      "スラッシュコマンドが Claude Code に『コマンド』として認識される条件として正しいのは？",
    choices: [
      "メッセージの先頭に `/cmd` がある場合のみ。後続テキストは引数になる",
      "メッセージのどこに `/cmd` があっても認識される",
      "改行の直後ならどこでもよい",
      "コードブロックの中に書く必要がある",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。スラッシュコマンドは『メッセージの先頭』だけが認識対象。",
      "中間や末尾に書いても通常テキストとして扱われる。",
      "改行の後でも、メッセージ全体の先頭でなければコマンドにならない。",
      "コードブロックではコマンド扱いされない。",
    ],
    hints: [
      "先頭一致だけ。",
      "後続テキスト = 引数。",
      "中間に `/foo` と書いてもただの文字列。",
    ],
    explanation: {
      summary:
        "スラッシュコマンドはメッセージの先頭にあるときだけコマンドとして起動する。残りのテキストはコマンド引数として渡される。",
      reason:
        "文中にうっかり `/path/to/file` と書いても誤発火しないようにする設計。カスタムコマンドはスキルと統合されており、`/init` や `/memory` 等の組み込みと同列に扱われる。",
      references: [
        { label: "Slash Commands (公式)", url: "https://code.claude.com/docs/en/commands" },
      ],
    },
  },
  {
    id: "ccp-017",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち『組み込みスラッシュコマンドではないもの』はどれ？",
    choices: [
      "/deploy",
      "/plan",
      "/permissions",
      "/checkpoints",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`/deploy` は組み込みコマンドではない。デプロイは Hook や Skill で組むのが一般的。",
      "`/plan` はプランモードへの切替を行う組み込みコマンド。",
      "`/permissions` で許可コマンドの管理ができる。",
      "`/checkpoints` でチェックポイント管理が可能。",
    ],
    hints: [
      "デプロイは Claude Code の責務範囲ではない。",
      "プラン / 権限 / チェックポイントはコア機能。",
      "コマンド一覧は docs にまとまっている。",
    ],
    explanation: {
      summary:
        "組み込みコマンドには `/init` `/memory` `/mcp` `/agents` `/permissions` `/plan` `/model` `/effort` `/context` `/compact` `/btw` `/tasks` `/background` `/batch` `/help` `/clear` `/config` `/resume` `/review` `/security-review` `/cost` `/usage` `/teleport` `/remote` `/worktree` `/checkpoints` `/release-notes` などがあるが `/deploy` は含まれない。",
      reason:
        "デプロイは環境依存なので、ユーザー側で Skill や Hook、もしくは custom slash command として実装する。CI とは別レイヤーであることに注意。",
      references: [
        { label: "Slash Commands (公式)", url: "https://code.claude.com/docs/en/commands" },
      ],
    },
  },
  {
    id: "ccp-018",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "現在の文脈使用率を確認するスラッシュコマンドと、長い会話を要約圧縮するコマンドの組み合わせとして正しいのは？",
    choices: [
      "/context と /compact",
      "/usage と /clear",
      "/tasks と /resume",
      "/memory と /init",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`/context` で使用率、`/compact` で要約圧縮。",
      "`/usage` はサブスクリプション使用量で、文脈使用率ではない。",
      "タスク一覧とセッション再開は別目的。",
      "メモリ初期化系で、これも文脈圧縮ではない。",
    ],
    hints: [
      "60% を超えたら警戒したい。",
      "圧縮は明示的に呼べる。",
      "auto-compaction はロッシーなので手動運用が良い。",
    ],
    explanation: {
      summary:
        "`/context` で現在のコンテキスト使用率を確認、`/compact` で会話を能動的に要約圧縮する。約 60% を超え始めたら早めに compact する運用が推奨される。",
      reason:
        "Auto-compaction は ~83.5% で発火するが、結果は元の 20-30% 程度しか詳細を保持しないロッシー圧縮。重要事項は CLAUDE.md にピン留めし、定期的に手動で `/compact` する方が安定する。",
      references: [
        { label: "Effective Claude Code Workflows 2026", url: "https://medium.com/data-science-collective/effective-claude-code-workflows-in-2026-what-changed-and-what-works-now-c93ebc6f8f50" },
      ],
    },
  },

  // ===========================================================================
  // ベストプラクティス / コンテキスト管理 (5)
  // ===========================================================================
  {
    id: "ccp-019",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "公式 Claude Code 101 で推奨される基本ワークフローの順序は？",
    choices: [
      "Explore → Plan → Code → Commit",
      "Code → Test → Plan → Refactor",
      "Plan → Commit → Code → Explore",
      "Compile → Deploy → Plan → Review",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。公式が繰り返し言及する 4 ステップ。",
      "順序が逆。先に Plan する。",
      "Commit が前過ぎる。",
      "Compile/Deploy はワークフローの主軸ではない。",
    ],
    hints: [
      "まず読む (Explore)。",
      "次に書くものを決める (Plan)。",
      "実装は計画後。",
    ],
    explanation: {
      summary:
        "Anthropic が示す基本ワークフローは『Explore → Plan → Code → Commit』。コードを書く前にコードベースを読み、計画を立ててから書く。",
      reason:
        "Explore でファイル探索 / 仕様確認、Plan で plan mode によりレビューしやすい計画を提示、Code で実装、Commit で意味のある単位でコミット。各フェーズで feedback loop (テスト / linter) を回せば品質が 2-3 倍になる、と公式ブログは説明している。",
      references: [
        { label: "How Claude Code Works in Large Codebases (公式)", url: "https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start" },
      ],
    },
  },
  {
    id: "ccp-020",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "コンテキスト管理の目安として、よく言及される閾値はどれ？",
    choices: [
      "60% を超えたら警戒し、83.5% 付近で auto-compaction が発火する",
      "10% を超えたらセッションを破棄する",
      "100% に達するまで何の挙動も変わらない",
      "30% 以上ではコマンドが受け付けられなくなる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。実務的には 60% 程度で警戒、約 83.5% で auto-compaction (ロッシー) が走る。",
      "10% は実用上ほぼ問題にならない値。",
      "100% まで何も起きない、というのは誤り。auto-compaction が間に挟まる。",
      "30% でロックされる挙動は無い。",
    ],
    hints: [
      "ロッシー圧縮を踏むと細部が消える。",
      "事前に手動 compact が安全。",
      "CLAUDE.md にピン留めしておくと圧縮されても残る。",
    ],
    explanation: {
      summary:
        "実用的な閾値は 60% 警戒・83.5% 付近で auto-compaction 発火。圧縮後は元情報の 20-30% 程度しか残らないロッシー処理のため、重要事項は CLAUDE.md / Memory にピン留めしておく。",
      reason:
        "コンテキストが膨れると速度劣化と精度低下が同時に起きる。事前に `/compact` で要約しておく、サブエージェントへ作業を分離する、不要なファイルを参照しない、などの運用で 60% 以下を維持するのが安定する。",
      references: [
        { label: "Effective Claude Code Workflows 2026", url: "https://medium.com/data-science-collective/effective-claude-code-workflows-in-2026-what-changed-and-what-works-now-c93ebc6f8f50" },
      ],
    },
  },
  {
    id: "ccp-021",
    categoryId: "claude-code-practice",
    difficulty: "beginner",
    type: "choice",
    question:
      "頻繁に使うコマンドを毎回承認する手間を減らす推奨アプローチは？",
    choices: [
      "/permissions で個別に pre-approve する",
      "/permissions bypass で全コマンドを無条件許可する",
      "Hook で全 Bash を素通しにする",
      "毎回 Yes を連打する",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。安全性を保ちつつ摩擦を減らす王道。",
      "全許可は危険で監査困難。",
      "全 Bash 素通し Hook はセキュリティ事故の元。",
      "生産性が下がる。",
    ],
    hints: [
      "ホワイトリスト方式。",
      "全許可は推奨されない。",
      "Hook と組み合わせるのは別目的。",
    ],
    explanation: {
      summary:
        "`/permissions` で『よく使うコマンドだけ』を pre-approve しておく運用が推奨される。全許可 (bypass) は監査困難で危険。",
      reason:
        "個別 pre-approve なら『make test』『rspec』『eslint』など読み取り系 / ローカル限定コマンドだけ素通しでき、`rm -rf` 等の破壊的操作は引き続き確認が走る。プロジェクト `.claude/settings.json` に書けばチーム全員で共有できる。",
      references: [
        { label: "Claude Code Tips & Best Practices (builder.io)", url: "https://www.builder.io/blog/claude-code-tips-best-practices" },
      ],
    },
  },
  {
    id: "ccp-022",
    categoryId: "claude-code-practice",
    difficulty: "advanced",
    type: "choice",
    question:
      "CLAUDE.md について、よく指摘される『落とし穴』はどれ？",
    choices: [
      "CLAUDE.md はフックではないので『always do X』を本当に保証したいなら Hook を実装する必要がある。さらに 200 行を超えると遵守率が下がる傾向がある",
      "CLAUDE.md を置くとモデルが必ず守ってくれるので Hook は不要",
      "CLAUDE.md は長ければ長いほど良い",
      "CLAUDE.md はクラウド版でのみ機能する",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。CLAUDE.md は説得力のあるプロンプトに過ぎず、強制力は Hook で担保する必要がある。",
      "Hook 無しでは『必ず』は保証できない。",
      "200 行を超えると遵守率が下がる、と複数の記事で報告されている。",
      "ローカル / クラウド双方で利用される。",
    ],
    hints: [
      "強制 = Hook、推奨 = CLAUDE.md。",
      "長文は逆効果。",
      "短く・優先順位を明示。",
    ],
    explanation: {
      summary:
        "CLAUDE.md は『指示書』であってフックではない。『必ず X せよ』を保証したい場合は Hook で機械的に強制する必要がある。さらに 200 行超になると遵守率が落ちるため、簡潔に保つ。",
      reason:
        "CLAUDE.md はシステムプロンプトに連結されるため、長すぎると重要事項が埋もれる。Hook (PreToolUse / PostToolUse / Stop 等) ならツール呼び出しのタイミングで実際にスクリプトを実行できるので強制力がある。",
      references: [
        { label: "Effective Claude Code Workflows 2026", url: "https://medium.com/data-science-collective/effective-claude-code-workflows-in-2026-what-changed-and-what-works-now-c93ebc6f8f50" },
        { label: "Claude Code Tips & Best Practices", url: "https://www.builder.io/blog/claude-code-tips-best-practices" },
      ],
    },
  },
  {
    id: "ccp-023",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "コードレビューを Claude にやらせる際、品質が上がりやすい運用はどれ？",
    choices: [
      "実装したセッションとは別の『新しい文脈のセッション』でレビューさせる",
      "実装した直後の同じ会話でそのままレビューさせる",
      "Plan モードのままレビューさせる",
      "Bypass モードでレビューさせる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。書いた本人 (同じセッション) は自分のコードに肯定的になりやすい。フレッシュな文脈の方が辛口に評価する。",
      "同じ会話だと自己肯定バイアスが入りやすい。",
      "Plan モードはレビュー本来の用途ではない。",
      "Bypass はパーミッションの話で品質には直接寄与しない。",
    ],
    hints: [
      "人間のコードレビューと同じ理屈。",
      "並列セッションが活きる場面。",
      "別文脈のほうが客観性が出る。",
    ],
    explanation: {
      summary:
        "コードを書いたセッションとは別の新しいセッションでレビューさせる方が、自己肯定バイアスが入りにくく辛口で有用なレビューが返る。",
      reason:
        "同一文脈では『今書いたばかりの根拠』がプロンプト中に残っていて、それを正当化する方向に推論しがち。並列に動かせる Claude Code の特性を活かして、レビュー用の独立セッションを用意するのが定石。",
      references: [
        { label: "Effective Claude Code Workflows 2026", url: "https://medium.com/data-science-collective/effective-claude-code-workflows-in-2026-what-changed-and-what-works-now-c93ebc6f8f50" },
      ],
    },
  },

  // ===========================================================================
  // Skill 設計 (3)
  // ===========================================================================
  {
    id: "ccp-024",
    categoryId: "claude-code-practice",
    difficulty: "advanced",
    type: "choice",
    question:
      "Skill 内の文言設計について、Qiita 記事 (dai_chi 氏) が指摘した知見として正しいのは？",
    choices: [
      "『CRITICAL / MUST / WORTHLESS』のような強い語を入れると Skill 起動率が約 84% まで上がる",
      "敬語で書くほど起動率が上がる",
      "絵文字を多用すると起動率が上がる",
      "英語で書くと起動率が下がる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。強い語で『これは無視できない』というシグナルを与えると Skill 選択率が上がるという観察。",
      "敬語は起動率と直接相関しない。",
      "絵文字の効用は報告されていない。",
      "英語/日本語の差は本質ではない。",
    ],
    hints: [
      "モデルへ『重要度』を強く伝えるのがコツ。",
      "受動的な表現より命令形。",
      "曖昧な記述だとスキップされがち。",
    ],
    explanation: {
      summary:
        "Skill の description / 本文に『CRITICAL』『MUST』『WORTHLESS』など強めの語を使うと起動率が上がり、ある検証では約 84% まで改善した、と Qiita 記事が報告している。",
      reason:
        "Skill はモデル側が『今この Skill を使うべきか』を判定するため、description の語感がそのまま選択確率に影響する。曖昧な記述だとスキップされて Skill が活きない。逆に強くしすぎると誤発火するので、対象範囲を絞る記述とセットで使う。",
      references: [
        { label: "Qiita: Claude Code Skill 起動率の話", url: "https://qiita.com/kamome_susume/items/af629235d2703e071f18" },
      ],
    },
  },
  {
    id: "ccp-025",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "『CLAUDE.md + Hooks + Skills + Commands』を組み合わせる目的として最も適切な説明は？",
    choices: [
      "ルール / 強制 / 手順 / トリガをそれぞれ役割分担し、レバレッジを最大化する",
      "全部同じことを別の場所に書いて冗長性を持たせる",
      "セキュリティの監査ログを増やす",
      "Anthropic 課金額を抑える",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。それぞれ得意分野が違うので、役割で組み合わせるのが定石。",
      "冗長性目的で重複させるのは推奨されない。",
      "監査ログ目的の構造ではない。",
      "課金額の制御機能ではない。",
    ],
    hints: [
      "CLAUDE.md = ルール集 (推奨)。",
      "Hooks = 強制実行。",
      "Skills = 手順集、Commands = 入り口。",
    ],
    explanation: {
      summary:
        "CLAUDE.md (ルール) / Hooks (機械的強制) / Skills (定型ワークフロー) / Slash Commands (起動トリガ) を役割で使い分けて組み合わせるのが、Claude Code を最大レバレッジで使うコツ。",
      reason:
        "重複させるのではなく、ルールは CLAUDE.md、譲れない強制は Hook、再利用したい一連の手順は Skill、手早く呼び出すための入口は Slash Command というように責務を分けると、保守性と効果が両立する。",
      references: [
        { label: "Claude Code Pro Tips (Zenn)", url: "https://zenn.dev/sexygo/articles/claude-code-pro-tips" },
      ],
    },
  },
  {
    id: "ccp-026",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Skill / Command を書くときの『起動精度を上げる』典型テクニックとして適切でないものはどれ？",
    choices: [
      "description を意図的に曖昧にして広く拾わせる",
      "『TRIGGER when: ...』『SKIP: ...』のように適用条件を箇条書きで明示する",
      "対象ファイルパターン (例: `*.tsx`) を description に書く",
      "強い語 (MUST / CRITICAL) を必要な場面だけ使う",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。曖昧にすると誤発火や非発火が増える。むしろ具体化する方が良い。",
      "TRIGGER / SKIP を分けて書くのは典型テクニック。",
      "ファイルパターンを書くと文脈マッチが効きやすい。",
      "強語は必要なところだけに絞る運用が正解。",
    ],
    hints: [
      "曖昧 = ハズレ。",
      "TRIGGER / SKIP を箇条書きする。",
      "ファイル拡張子は強いシグナル。",
    ],
    explanation: {
      summary:
        "Skill の起動精度を上げるコツは、(1) TRIGGER と SKIP を箇条書きで明示、(2) 対象ファイルパターンを書く、(3) 強い語をピンポイントで使う、の 3 点。逆に description を曖昧にするのは逆効果。",
      reason:
        "曖昧な description は『この Skill を呼ぶべきかわからない』状態を作り、(a) 別の似た Skill が選ばれる、(b) Skill が呼ばれずインライン推論される、という失敗を招く。具体的なトリガと除外条件を書くことで、モデル側の選択が安定する。",
      references: [
        { label: "Qiita: Claude Code Skill 起動率の話", url: "https://qiita.com/kamome_susume/items/af629235d2703e071f18" },
      ],
    },
  },

  // ===========================================================================
  // 実ワークフロー: PR レビュー / セキュリティ / worktree (4)
  // ===========================================================================
  {
    id: "ccp-027",
    categoryId: "claude-code-practice",
    difficulty: "beginner",
    type: "choice",
    question:
      "現在の差分に対してコードレビューを走らせる『組み込みスラッシュコマンド』は？",
    choices: [
      "/review (バンドルされた code-review スキルを実行)",
      "/lint",
      "/format",
      "/diff",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`/review` が code-review スキルを呼び出してレビューを行う。",
      "/lint は組み込みコマンドではない。",
      "/format も組み込みコマンドではない。",
      "/diff という組み込みコマンドは無い。",
    ],
    hints: [
      "Skill とセットで提供される。",
      "PR レビューの定番。",
      "差分に対して効率がいい。",
    ],
    explanation: {
      summary:
        "`/review` はバンドルされた code-review スキルを起動し、現在の差分をレビューする組み込みコマンド。`--comment` フラグでインライン PR コメントとして投稿する派生もある。",
      reason:
        "実装と独立した文脈でレビューを回すワークフローと相性が良い。effort レベル (low/medium/high/high→max) で広さと深さを調整できる。",
      references: [
        { label: "Slash Commands (公式)", url: "https://code.claude.com/docs/en/commands" },
      ],
    },
  },
  {
    id: "ccp-028",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "セキュリティ観点で『現在の変更だけ』をレビューさせる組み込みコマンドは？",
    choices: [
      "/security-review",
      "/review --security",
      "/audit",
      "/cve-scan",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`/security-review` が現在ブランチの保留中変更に対するセキュリティレビューを実行する。",
      "/review はセキュリティ専用ではない。",
      "/audit という組み込みコマンドは無い。",
      "/cve-scan という組み込みコマンドは無い。",
    ],
    hints: [
      "コード全体ではなく『保留中の差分』だけ。",
      "code-review とは別スキル。",
      "PR を出す前のチェックに向く。",
    ],
    explanation: {
      summary:
        "`/security-review` は現在ブランチの保留中変更 (pending changes) を対象にセキュリティレビューを実施する。`/review` (一般コードレビュー) とは別の組み込み。",
      reason:
        "クレデンシャル混入、SSRF、SQL インジェクション、コマンドインジェクション、認可漏れなどの観点で差分をチェックする。プッシュ / PR 化前のセーフティネットとして使うと事故を減らせる。",
      references: [
        { label: "Slash Commands (公式)", url: "https://code.claude.com/docs/en/commands" },
      ],
    },
  },
  {
    id: "ccp-029",
    categoryId: "claude-code-practice",
    difficulty: "intermediate",
    type: "choice",
    question:
      "サブエージェントを worktree で隔離して並列実行したいとき、frontmatter に書く設定として正しいのは？",
    choices: [
      "`isolation: worktree`",
      "`runtime: docker`",
      "`scope: branch`",
      "`mode: parallel`",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`isolation: worktree` で各サブエージェントに独立した git worktree を割り当てる。",
      "Docker ランタイム指定は別物。",
      "そういうキーは存在しない。",
      "`mode: parallel` というキーは存在しない。",
    ],
    hints: [
      "Git worktree を使う。",
      "ファイル衝突が起きないようにするのが目的。",
      "/batch とも親和性が高い。",
    ],
    explanation: {
      summary:
        "サブエージェント frontmatter に `isolation: worktree` を書くと、各エージェントが独立した worktree を持ち、並行作業しても互いのファイルが衝突しない。",
      reason:
        "`/worktree` スラッシュコマンドや `/batch` と組み合わせて、複数タスクを並列実行する典型構成になる。終了後に各 worktree から結果をマージ / レビューする。",
      references: [
        { label: "Slash Commands (公式)", url: "https://code.claude.com/docs/en/commands" },
      ],
    },
  },
  {
    id: "ccp-030",
    categoryId: "claude-code-practice",
    difficulty: "advanced",
    type: "choice",
    question:
      "知らない GitHub リポジトリを clone してすぐ Claude Code を起動するとき、最も警戒すべきセキュリティリスクは？",
    choices: [
      "リポジトリ同梱の `.claude/settings.json` や `.mcp.json` を無条件で信用してしまい、Hook や MCP サーバ経由で任意コードが実行されること",
      "README.md のフォーマットが崩れていること",
      "Markdown の絵文字が文字化けすること",
      ".gitignore が大きすぎて読み込みが遅くなること",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Hooks / MCP サーバはコマンド実行を伴うので、不審な設定を読ませると任意コード実行に直結する。",
      "可読性の問題でセキュリティリスクではない。",
      "文字化けは表示問題でセキュリティリスクではない。",
      "パフォーマンスの話で本質ではない。",
    ],
    hints: [
      "Hook は exec する。",
      "MCP サーバはネットワーク or プロセスを生やす。",
      "起動前に diff で確認する習慣をつける。",
    ],
    explanation: {
      summary:
        "未知のリポジトリの `.claude/settings.json` や `.mcp.json` を無検査で読ませると、Hook / MCP 経由で任意コードが走り得る。clone 直後はまずこれらの設定を確認・無効化してから Claude Code を起動するのが安全。",
      reason:
        "Hook は PreToolUse / PostToolUse / SessionStart 等のタイミングで任意コマンドを実行できる。MCP サーバはプロセス起動 + ツール公開を伴う。悪意あるリポジトリは『clone するだけで安全』だが、Claude Code を有効状態で起動した時点で危険になり得る。プロジェクト設定をユーザー設定で上書き / 無効化する、初回は Plan モードで読むだけにする、などの対策が有効。",
      references: [
        { label: "Claude Code Tips & Best Practices (builder.io)", url: "https://www.builder.io/blog/claude-code-tips-best-practices" },
        { label: "Zenn Scrap: ohkisuguru", url: "https://zenn.dev/ohkisuguru/scraps/7951d17821df0c" },
      ],
    },
  },
];

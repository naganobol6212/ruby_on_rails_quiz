import type { Question } from "@/lib/types";

/**
 * AI Engineering Fundamentals (ai-eng-001 〜 ai-eng-030)
 * - Agent design patterns (Anthropic 5 workflows + ReAct / Reflection / Plan-and-Execute)
 * - RAG fundamentals (chunking, embeddings, hybrid search, re-ranking, RAGAs)
 * - LLMOps (monitoring, tools, technical debt)
 * - Governance (NIST AI RMF, ISO/IEC 42001, EU AI Act, Model Cards)
 */
export const aiEngineeringQuestions: Question[] = [
  // ===========================================================================
  // 🤖 Agent Design Patterns (ai-eng-001 〜 ai-eng-008)
  // ===========================================================================
  {
    id: "ai-eng-001",
    categoryId: "ai-engineering",
    difficulty: "beginner",
    type: "choice",
    question:
      "Anthropic の『Building Effective Agents』における Workflow と Agent の最も本質的な違いは？",
    choices: [
      "Workflow は Anthropic 専用、Agent は OpenAI 専用",
      "Workflow は本番禁止、Agent のみ本番利用可",
      "Workflow は事前定義されたコードパスを LLM とツールが辿る。Agent は LLM 自身がプロセスを動的に決定する",
      "Workflow はマルチモーダル、Agent はテキストのみ",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "ベンダー固有の概念ではない。一般的なエージェント設計の語彙。",
      "Workflow は予測可能で本番運用しやすく、むしろ推奨される。",
      "正解。Anthropic は Workflow = predefined code paths、Agent = LLM が自分でプロセスを舵取り、と明確に定義している。",
      "モダリティの違いではなく『制御フローを誰が決めるか』が本質。",
    ],
    hints: [
      "誰が次のステップを決めるか？",
      "コードで分岐を書くか、LLM に判断させるか。",
      "予測可能性とコストの観点でも違いが出る。",
    ],
    explanation: {
      summary:
        "Workflow は人間が書いたコードパスを LLM が辿る予測可能な構成。Agent は LLM が動的にツール選択・分岐・ループを判断する自律的な構成。",
      reason:
        "Anthropic はまず『Augmented LLM』(LLM + 検索 + ツール + メモリ) を最小単位とし、その上に Workflow と Agent を積む。Workflow は Prompt Chaining / Routing / Parallelization / Orchestrator-Workers / Evaluator-Optimizer の 5 パターンで構成され、フローが予測可能でコスト・レイテンシも見積もりやすい。Agent はタスクの分解数が事前に読めない場合に有効だが、ループや自律的ツール選択により失敗時のコストが大きい。多くの実用ケースは Workflow で十分、というのが Anthropic の主張。",
      references: [
        {
          label: "Anthropic: Building Effective Agents",
          url: "https://www.anthropic.com/research/building-effective-agents",
        },
        {
          label: "Zenn: AIエージェント実装完全ガイド2026",
          url: "https://zenn.dev/ai_nexus/articles/ai-agents-design-patterns",
        },
      ],
    },
  },
  {
    id: "ai-eng-002",
    categoryId: "ai-engineering",
    difficulty: "beginner",
    type: "choice",
    question:
      "Anthropic が定義する『Prompt Chaining』ワークフローの説明として正しいのは？",
    choices: [
      "生成と評価をループさせる",
      "タスクを順次的なサブステップに分解し、各ステップの出力を次の入力にする",
      "1 つの入力を複数の LLM が並列に処理する",
      "分類器で問い合わせを専門ハンドラに振り分ける",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "それは Evaluator-Optimizer の説明。",
      "正解。Prompt Chaining = タスクを直線的なサブステップ列に分け、前段の出力を後段へ渡す。途中に gate (検証) を挟むことも多い。",
      "それは Parallelization (Sectioning / Voting) の説明。",
      "それは Routing の説明。",
    ],
    hints: [
      "5 パターンのうち最もシンプルな直列構成。",
      "アウトラインを作ってから本文生成、のような流れ。",
      "途中で『チェック関門』を挟めば品質を担保しやすい。",
    ],
    explanation: {
      summary:
        "Prompt Chaining は『タスクを直線的なサブステップに分解し、前段の出力を後段の入力にする』最もシンプルなワークフロー。レイテンシとのトレードオフで精度を高める。",
      reason:
        "例: マーケコピー生成 → 多言語翻訳、アウトライン生成 → 各セクション執筆、など。間に決定論的な gate (例: アウトラインに必須項目があるか) を挟むことで品質を担保できる。タスクが明確にサブステップ分解できる時に有効で、各ステップが単純化されるため LLM の精度が上がる。逆にステップ間が結合している場合は Orchestrator-Workers の方が向く。",
      references: [
        {
          label: "Anthropic: Building Effective Agents",
          url: "https://www.anthropic.com/research/building-effective-agents",
        },
      ],
    },
  },
  {
    id: "ai-eng-003",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Anthropic の『Routing』ワークフローを採用すべき典型的なシナリオは？",
    choices: [
      "1 つの長文を複数の観点で同時に評価したい",
      "コードを書いてテストで自動評価しループ修正したい",
      "未知のサブタスクが動的に発生する複雑な調査タスクを実行したい",
      "顧客サポートで一般質問・返金・技術問題などカテゴリごとに専門プロンプトを用意したい",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "それは Parallelization (Sectioning) が適切。",
      "それは Evaluator-Optimizer の典型例。",
      "サブタスク数が予測できないケースは Orchestrator-Workers または Agent が適切。",
      "正解。Routing は分類器 (LLM or 古典 ML) が入力を分類し、それぞれに最適化された下流プロンプト / モデルに流す構成。",
    ],
    hints: [
      "分類 → 専門ハンドラ、という二段構え。",
      "Haiku で簡単な質問、Sonnet で難しい質問、のようにモデル切替もできる。",
      "カテゴリが明確に分けられる時に有効。",
    ],
    explanation: {
      summary:
        "Routing は入力を分類器で識別し、それぞれ専門化された下流プロセス (プロンプト or モデル) に振り分けるパターン。関心の分離とコスト最適化に有効。",
      reason:
        "1 つの巨大プロンプトで全カテゴリを処理しようとすると、ある質問の改善が別カテゴリを劣化させる『プロンプト干渉』が起きる。Routing で関心を分離すれば各ハンドラを独立に改善できる。さらに『Haiku は簡単な質問、Sonnet は複雑な質問』のようにモデル自体を振り分ければコストも最適化できる。分類器の精度がボトルネックになるため、評価データセットでの計測が必須。",
      references: [
        {
          label: "Anthropic: Building Effective Agents",
          url: "https://www.anthropic.com/research/building-effective-agents",
        },
      ],
    },
  },
  {
    id: "ai-eng-004",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Parallelization の 2 つのバリアント『Sectioning』と『Voting』の違いは？",
    choices: [
      "Sectioning は独立サブタスクを並列実行、Voting は同じタスクを複数回実行して集約する",
      "Sectioning はストリーミング、Voting はバッチ",
      "Sectioning は GPU 並列、Voting は CPU 並列",
      "Sectioning は無料、Voting は有料",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Sectioning = 異なる側面を独立に並列、Voting = 同じ問いに複数回挑戦して多数決 / 集約。",
      "実行モードの違いではなく『何を並列するか』の違い。",
      "ハードウェアの違いではない。",
      "課金の違いではなく設計パターンの違い。",
    ],
    hints: [
      "片方は『分割』、もう片方は『冗長化』。",
      "信頼性を上げたいなら同じ質問を複数回投げる。",
      "ガードレールと回答生成を並列に走らせるのは Sectioning の例。",
    ],
    explanation: {
      summary:
        "Sectioning = タスクを独立な側面に分割して並列実行 (例: 回答生成と安全性チェックを並列)。Voting = 同じタスクを複数回実行して結果を集約 (多数決・最良選択など)。",
      reason:
        "Sectioning の典型例は『ガードレール用 LLM が安全性をチェックしつつ、本体 LLM が回答生成』を同時実行し、ガードレールが落ちたら結果を破棄、というパターン。Voting はコード脆弱性レビューで 3 つの異なるプロンプトに同じコードを見せ、1 つでも脆弱性を指摘したら高アラートにする、など信頼性向上に使う。どちらもサブタスク間の依存がない時に有効で、レイテンシを稼げる。",
      references: [
        {
          label: "Anthropic: Building Effective Agents",
          url: "https://www.anthropic.com/research/building-effective-agents",
        },
      ],
    },
  },
  {
    id: "ai-eng-005",
    categoryId: "ai-engineering",
    difficulty: "advanced",
    type: "choice",
    question:
      "Orchestrator-Workers ワークフローを Parallelization (Sectioning) より優先すべき状況は？",
    choices: [
      "サブタスクが完全に独立で、いつも同じ数だけ並列実行すれば良い",
      "評価基準が明確で生成と評価をループしたい",
      "1 種類のシンプルなタスクを高速に大量処理したい",
      "サブタスクの数や種類が入力ごとに動的で事前に予測できない",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "サブタスクが静的なら Parallelization で十分。",
      "それは Evaluator-Optimizer。",
      "オーケストレータを挟むのは過剰、シンプルな Workflow で十分。",
      "正解。サブタスク数が事前に決まらない (例: ファイル横断リファクタで何ファイル変更が要るか不明) ケースで Orchestrator-Workers が真価を発揮。",
    ],
    hints: [
      "事前にステップ数が決まるか、動的に決まるかが鍵。",
      "中央 LLM が問題を分解 → ワーカーに委任 → 結果を統合。",
      "コーディングエージェントでよく使われる構成。",
    ],
    explanation: {
      summary:
        "Orchestrator-Workers は中央 LLM が問題を動的に分解し、ワーカー LLM に委任、結果を統合する。サブタスクが入力ごとに変動する場合に有効。",
      reason:
        "Parallelization はサブタスクが固定 (例: 必ず英・仏・独に翻訳) だが、Orchestrator-Workers はサブタスクをオーケストレータが動的に列挙する。コーディングエージェントが『どのファイルを修正するか』を判断してから複数ワーカーに編集を委任する、研究調査エージェントがどのソースを掘るか決めて並列調査する、などが典型。柔軟性は高いがオーケストレータの判断ミスがコスト・品質に直結する。",
      references: [
        {
          label: "Anthropic: Building Effective Agents",
          url: "https://www.anthropic.com/research/building-effective-agents",
        },
        {
          label: "Zenn: Agent Design Pattern Catalogue",
          url: "https://zenn.dev/hellohazime/articles/ead99ebda1cc5a",
        },
      ],
    },
  },
  {
    id: "ai-eng-006",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Evaluator-Optimizer (生成 + 評価ループ) が特に効果を発揮する条件は？",
    choices: [
      "1 回の生成で十分な単純タスク",
      "リアルタイムストリーミングが必須なタスク",
      "評価基準が明文化できて、人間の繰り返しレビューでも明らかに品質が向上するタスク",
      "評価基準が曖昧でモデルも人間も合意できない創造的タスク",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "1 発で十分なら critic は過剰。",
      "ループするとレイテンシが増えるためむしろリアルタイム性は犠牲になる。",
      "正解。Anthropic は『人間がフィードバックすると改善が明らかに分かるタスク』を Evaluator-Optimizer 適用の指標にしている。",
      "評価合意が取れないと critic が機能せず無限ループになりやすい。",
    ],
    hints: [
      "Generator + Critic の 2 つの LLM ロールが必要。",
      "翻訳のニュアンス改善、複雑検索の網羅性チェックなど。",
      "『良し悪しが言語化できる』ことが前提。",
    ],
    explanation: {
      summary:
        "Evaluator-Optimizer は Generator が出力 → Evaluator が批評 → Generator が修正、を反復するパターン。評価基準が明文化でき、反復で改善が見えるタスクに最適。",
      reason:
        "代表例は文学的な翻訳のニュアンス調整、複雑検索クエリでの追加調査ループ、コードの自動レビューと修正など。Reflection / Reflexion パターンと似ているが、Evaluator-Optimizer は 2 つの LLM ロールが明確に分離している点が特徴。評価基準が曖昧だと critic が空回りし、コスト・レイテンシだけが増える。最大ループ回数の設定とコスト監視が必須。",
      references: [
        {
          label: "Anthropic: Building Effective Agents",
          url: "https://www.anthropic.com/research/building-effective-agents",
        },
      ],
    },
  },
  {
    id: "ai-eng-007",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question: "ReAct パターンが繰り返すループの構成要素は？",
    choices: [
      "Map → Reduce → Shuffle の 3 ステップ",
      "Thought → Action → Observation の 3 ステップ",
      "Plan → Execute → Reflect の 3 ステップ",
      "Encode → Decode → Score の 3 ステップ",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "それは MapReduce。エージェント設計とは別物。",
      "正解。ReAct = Reasoning + Acting。Thought (内的推論) → Action (ツール呼出) → Observation (結果取得) のループ。",
      "それは Plan-and-Execute (+ Reflection) の構成。",
      "ReAct とは無関係なエンコーダ・デコーダ用語。",
    ],
    hints: [
      "Reasoning と Acting を交互に行う、が名前の由来。",
      "ツール呼び出しエージェントの基本形。",
      "LangChain の `create_react_agent` がこのパターン。",
    ],
    explanation: {
      summary:
        "ReAct は Yao+ (2022) 提唱の、Thought (推論) → Action (ツール実行) → Observation (結果観察) を繰り返すエージェント設計パターン。ツール呼び出し型 LLM エージェントの基本形。",
      reason:
        "LLM に『次に何をすべきか考えてからツールを呼べ』と指示することで、いきなりツールを呼ぶよりも正確になることが論文で示された。Observation を次の Thought に渡すことで状態を引き継ぎ、最終回答に到達するまでループする。失敗時の無限ループや過剰なツール呼び出しが課題で、最大ステップ数の制限と中間状態のモニタリングが本番運用では必須。LangGraph や LangChain の標準実装あり。",
      references: [
        {
          label: "Zenn: Agent Design Pattern Catalogue",
          url: "https://zenn.dev/hellohazime/articles/ead99ebda1cc5a",
        },
        {
          label: "LangGraph Docs",
          url: "https://langchain-ai.github.io/langgraph/",
        },
      ],
    },
  },
  {
    id: "ai-eng-008",
    categoryId: "ai-engineering",
    difficulty: "advanced",
    type: "choice",
    question:
      "Plan-and-Execute パターンが ReAct より優れる典型的なケースは？",
    choices: [
      "ストリーミングで逐次トークンを返したい",
      "ツールが 1 つしかなく分岐が無いタスク",
      "長期的・多段階の調査タスクで、最初に全体計画を立てた方がブレが少ない",
      "1 ステップで終わる FAQ 回答",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "プラン生成が前段に入るので逐次性はむしろ落ちる。",
      "分岐不要なら計画も不要。",
      "正解。Plan-and-Execute は最初に明示的なプランを生成、その後でステップ実行する。多段階タスクで途中迷子になるのを防ぐ。",
      "1 ステップで終わるなら計画自体が過剰。",
    ],
    hints: [
      "ReAct は『考えて → 動く』を 1 回ずつ。Plan-and-Execute は『先に全体プランを作る』。",
      "深い調査・複雑コード変更で有効。",
      "プラン精度がタスク全体の質を左右する。",
    ],
    explanation: {
      summary:
        "Plan-and-Execute は最初に LLM が明示的な手順書 (プラン) を生成し、それに従って 1 ステップずつ実行するパターン。多段階タスクで脱線・近視眼的判断を防ぐ。",
      reason:
        "ReAct は各ステップで局所判断するため、長期タスクで『木を見て森を見ず』になりやすい。Plan-and-Execute は事前にプランを立てるため全体最適に近づく。一方でプラン生成の精度が低いと全体が破綻する、途中で前提が変わると追従しにくいなどの欠点もあり、Replan (Reflection と組み合わせて計画を更新する) パターンとセットで使うことが多い。LangGraph で実装例多数。",
      references: [
        {
          label: "Zenn: Agent Design Pattern Catalogue",
          url: "https://zenn.dev/hellohazime/articles/ead99ebda1cc5a",
        },
      ],
    },
  },

  // ===========================================================================
  // 📚 RAG Fundamentals (ai-eng-009 〜 ai-eng-016)
  // ===========================================================================
  {
    id: "ai-eng-009",
    categoryId: "ai-engineering",
    difficulty: "beginner",
    type: "choice",
    question: "RAG (Retrieval-Augmented Generation) の基本フローとして正しいのは？",
    choices: [
      "クエリを埋め込み → ベクトル DB で検索 → 取得した文脈を LLM プロンプトに注入 → 回答生成",
      "クエリでファインチューンし直してから回答生成",
      "LLM の重みを毎回更新して新情報を学習させる",
      "ベクトル DB だけで回答を返し LLM は使わない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。RAG は『検索した文脈を Augment して LLM に渡す』ことで、再学習なしに最新・社内固有情報を扱う。",
      "ファインチューンは別の手法。RAG は推論時に外部知識を注入する。",
      "重み更新は不要。RAG の利点はまさにそれを避けられること。",
      "LLM が最終生成を担うのが RAG。検索だけなら従来の検索エンジン。",
    ],
    hints: [
      "Retrieval = 検索、Augmented = 補強、Generation = 生成。",
      "推論時に外部知識を注入する。",
      "ファインチューンとは別のアプローチ。",
    ],
    explanation: {
      summary:
        "RAG はクエリで関連文書を検索し、その文脈を LLM プロンプトに注入してから生成させる手法。LLM を再学習せずに最新情報・社内固有情報を扱える。",
      reason:
        "オフライン処理で文書をチャンク化 → 埋め込み生成 → ベクトル DB (Chroma / Pinecone / pgvector / Weaviate) に保存。推論時はクエリも埋め込み、類似度検索で top-k を取得し、システムプロンプトに `<context>...</context>` のように差し込んで回答させる。ファインチューンと比較してコスト低・更新容易・幻覚抑制に強いが、検索精度がそのまま回答品質を決めるため Embeddings / Chunking / Re-ranking の設計が肝。",
      codeExample:
        "// 擬似コード\nasync function ragAnswer(query: string) {\n  // 1. クエリを埋め込み\n  const queryEmb = await embed(query)\n  // 2. ベクトル DB で類似検索\n  const chunks = await vectorDB.search(queryEmb, { topK: 5 })\n  // 3. 文脈を組み立て\n  const context = chunks.map(c => c.text).join('\\n---\\n')\n  // 4. LLM に渡して生成\n  return await llm.generate({\n    system: 'context のみを根拠に回答せよ',\n    user: `# 文脈\\n${context}\\n\\n# 質問\\n${query}`,\n  })\n}",
      references: [
        {
          label: "LangChain: RAG",
          url: "https://python.langchain.com/docs/introduction/",
        },
      ],
    },
  },
  {
    id: "ai-eng-010",
    categoryId: "ai-engineering",
    difficulty: "beginner",
    type: "choice",
    question:
      "RAG におけるチャンク (chunking) サイズ設計の典型的な失敗はどれ？",
    choices: [
      "1 チャンクが大きすぎて 1 つの文脈に複数トピックが混ざり、検索ヒット精度が落ちる",
      "チャンクが小さいと埋め込みコストが下がるので常に最小化するのが正解",
      "チャンクは必ず 1 文字単位にする",
      "チャンクサイズは LLM の出力長と一致させる必要がある",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。大きすぎるチャンクは『同一ベクトルに複数トピック』を埋め込むため、検索でノイズが増える。逆に小さすぎると文脈が分断される。",
      "小さすぎると文脈が切れ、回答に必要な情報が複数チャンクに散らばる。",
      "1 文字では意味ベクトルとして無意味。",
      "出力長と入力チャンク長は無関係。",
    ],
    hints: [
      "1 チャンク = 1 トピック、が目安。",
      "オーバーラップを入れて文脈の断絶を防ぐのが定石。",
      "セマンティック分割・タイトル付与なども有効。",
    ],
    explanation: {
      summary:
        "チャンクが大きすぎると 1 ベクトルに複数トピックが混在し検索精度が落ちる。小さすぎると文脈が分断され回答に必要な情報が拾えない。500〜1000 トークン程度 + オーバーラップ 10〜20% が一般的出発点。",
      reason:
        "実務では『見出し単位で分割 + 親ドキュメントのメタデータ保持』『RecursiveCharacterTextSplitter で段落 → 文 → 単語と階層的に分割』『Semantic Chunking (埋め込み距離が大きい所で切る)』などが定番。FAQ なら 1 QA = 1 チャンク、長い技術文書なら見出し + オーバーラップが良いことが多い。実データで Recall@k と Faithfulness を測りつつ調整する。",
      references: [
        {
          label: "Zenn: AIエージェント実装完全ガイド2026",
          url: "https://zenn.dev/ai_nexus/articles/ai-agents-design-patterns",
        },
      ],
    },
  },
  {
    id: "ai-eng-011",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Hybrid Search (ハイブリッド検索) における dense と sparse の組み合わせとは？",
    choices: [
      "オンプレ DB とクラウド DB を両方検索する",
      "Dense (埋め込みベクトル類似度) と Sparse (BM25 など語彙一致) を併用し結果を融合する",
      "高解像度画像と低解像度画像を組み合わせる検索",
      "GPU 検索と CPU 検索を並列で走らせる手法",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "デプロイ位置の話ではない。",
      "正解。Dense は意味検索に強く、Sparse は固有名詞・ID・コード片など完全一致に強い。RRF (Reciprocal Rank Fusion) などで融合する。",
      "画像解像度とは無関係。",
      "ハードウェアではなくアルゴリズムの併用。",
    ],
    hints: [
      "ベクトル検索だけだと『型番』『商品コード』のような完全一致に弱い。",
      "BM25 が代表的な sparse 検索。",
      "結果の統合には RRF がよく使われる。",
    ],
    explanation: {
      summary:
        "Hybrid Search は意味的類似度 (dense, 埋め込み) と語彙一致 (sparse, BM25 など) を組み合わせる検索手法。RRF 等で結果を融合し、意味と完全一致の両方に強い検索を実現する。",
      reason:
        "Dense embeddings は『同じ意味の言い換え』に強いが、製品コード `XJ-2025-A` のようなトークンを意味として扱えない。一方 BM25 などの sparse 検索は語彙一致に強いが言い換えに弱い。両者の上位を Reciprocal Rank Fusion (1 / (k + rank)) で統合すると Recall が大幅に向上する。Pinecone / Weaviate / pgvector + tsvector / OpenSearch などが標準的にハイブリッド検索をサポート。",
      references: [
        {
          label: "Pinecone: Hybrid Search",
          url: "https://www.pinecone.io/learn/hybrid-search-intro/",
        },
      ],
    },
  },
  {
    id: "ai-eng-012",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "本番品質の RAG で『Re-ranker (再ランキング)』を入れる目的は？",
    choices: [
      "埋め込みコストを下げる",
      "初段で取得した数十〜数百件を cross-encoder で精密採点し、LLM に渡す top 5〜10 を選び直す",
      "ベクトル DB の容量を減らす",
      "LLM の出力をリランクする",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "埋め込みコストとは無関係。",
      "正解。Bi-encoder の高速検索で広く拾い、cross-encoder (Cohere Rerank 3.5 / BGE-Reranker など) で精密スコアリングする 2 段構成が定番。",
      "容量削減のためではない。",
      "対象は『検索結果』であって生成結果ではない。",
    ],
    hints: [
      "Bi-encoder は速いが粗い、Cross-encoder は遅いが正確。",
      "上位 100 件を精査して上位 10 件に絞る、のような流れ。",
      "Cohere Rerank 3.5 や BGE-Reranker が有名。",
    ],
    explanation: {
      summary:
        "Re-ranker はベクトル検索で広く拾った候補を cross-encoder で精密採点し直し、LLM に渡す本当に関連性の高い数件に絞り込む工程。Recall と Precision のバランスを取る。",
      reason:
        "Bi-encoder (埋め込みコサイン) は数千万件を高速に絞れるが、クエリと文書を独立に埋め込むため精度に限界がある。Cross-encoder はクエリと文書をペアで Transformer に入れて関連スコアを出すため精度が高いが計算量が大きい。そこで『bi-encoder で top-100 → cross-encoder で top-10』の 2 段構成が本番 RAG の標準。Cohere Rerank 3.5 / BGE-Reranker-v2 / Voyage rerank などが商用 / OSS で利用可能。",
      references: [
        {
          label: "Cohere: Rerank",
          url: "https://docs.cohere.com/docs/rerank-overview",
        },
      ],
    },
  },
  {
    id: "ai-eng-013",
    categoryId: "ai-engineering",
    difficulty: "advanced",
    type: "choice",
    question:
      "Adaptive RAG が単純な RAG より優れる点は？",
    choices: [
      "GPU の動的割り当てを行う",
      "埋め込みモデルを毎回再学習する",
      "ベクトル DB を 2 つ並列利用する",
      "クエリの複雑度を分類して、単純なら直接回答・複雑なら多段検索、と戦略を切り替える",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "ハードウェア割り当てとは無関係。",
      "埋め込み再学習はしない。",
      "DB を増やすことではない。",
      "正解。Adaptive RAG は分類器でクエリを No-retrieval / Single-step / Multi-step に振り分け、コストと精度を両立する。",
    ],
    hints: [
      "シンプルな『今日の天気は？』に多段検索は過剰。",
      "クエリの複雑度に応じて経路を変える。",
      "Routing パターンを RAG に適用したような構成。",
    ],
    explanation: {
      summary:
        "Adaptive RAG はクエリを分類器で複雑度判定し、戦略 (検索なし / 1 回検索 / 多段検索 + 自己反省) を切り替える。コストと精度を両立する RAG 設計。",
      reason:
        "単純 RAG は『どんな質問でも必ず検索する』ためコストとレイテンシが無駄になり、複雑質問では検索 1 回では足りない。Adaptive RAG は分類器 (小さい LLM や fine-tuned 分類器) でクエリを A: モデル知識で十分 / B: 1 回検索で十分 / C: 多段検索 + Self-RAG / CRAG が必要、に振り分ける。Self-RAG (検索要否や信頼性を自己判定) や CRAG (検索品質を評価して Web 検索にフォールバック) と組み合わせるのが研究トレンド。",
      references: [
        {
          label: "Adaptive-RAG (arXiv 2403.14403)",
          url: "https://arxiv.org/abs/2403.14403",
        },
      ],
    },
  },
  {
    id: "ai-eng-014",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "RAGAs の `Faithfulness` メトリックが計測しているものは？",
    choices: [
      "検索された文脈の Precision",
      "クエリと検索結果の意味的類似度",
      "生成された回答内の主張が、取得した文脈から推論可能である割合 (幻覚抑制の指標)",
      "クエリと回答の語彙一致度",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "それは Context Precision の説明。",
      "それは Embedding 類似度の話で別物。",
      "正解。Faithfulness = 回答中の主張のうち何 % が context から裏付けられるか。LLM-as-judge で測り、幻覚率の代理指標になる。",
      "それは BLEU / ROUGE 系の語彙メトリクス。",
    ],
    hints: [
      "幻覚 (hallucination) を測りたい時に見る指標。",
      "『回答の主張』を文脈で裏付けられるか。",
      "RAGAs の生成側メトリクスのひとつ。",
    ],
    explanation: {
      summary:
        "Faithfulness は『生成回答の各主張のうち何 % が取得文脈から推論可能か』を測る指標。LLM-as-judge が回答を主張単位に分解し、各主張が context から導けるか判定する。幻覚抑制の代理指標。",
      reason:
        "RAGAs の 4 大メトリクスは『検索品質: Context Precision / Context Recall』『生成品質: Faithfulness / Answer Relevancy』に分かれる。Faithfulness が低い場合は LLM の幻覚 or プロンプトでの根拠強制不足、Context Recall が低い場合は検索の取りこぼし、と切り分けて改善できる。Context Recall だけは ground-truth 回答が必要で、他は ground-truth なしでも計算できる。",
      references: [
        {
          label: "RAGAs Metrics",
          url: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/",
        },
      ],
    },
  },
  {
    id: "ai-eng-015",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "RAGAs の `Context Recall` メトリックの特徴として正しいのは？",
    choices: [
      "ground-truth 不要で常にゼロショット評価できる",
      "LLM の応答時間を測る",
      "生成側メトリクスである",
      "4 大メトリクスの中で唯一 ground-truth 回答を必要とする (検索が必要情報を網羅できたかを測る)",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "Context Recall だけは ground-truth が必要。",
      "レイテンシ計測は別の話。",
      "Context Recall は検索品質側のメトリクス。",
      "正解。Context Recall は ground-truth 回答に必要な情報が検索結果に含まれていたかを評価するため、参照回答が必須。",
    ],
    hints: [
      "『取りこぼしがなかったか』を測る。",
      "正解側から見て『その情報が context にあるか』。",
      "4 メトリクスの中で 1 つだけ特殊な要件がある。",
    ],
    explanation: {
      summary:
        "Context Recall は『ground-truth 回答に必要な情報が、検索された context に含まれていたか』を測る。RAGAs 4 メトリクスの中で唯一参照回答が必須。",
      reason:
        "Context Precision (上位 context のうち本当に必要なものの割合・signal-to-noise) と対をなす指標。Recall が低ければチャンク分割やクエリリフォーミュレーション、ハイブリッド検索の導入を検討。Precision が低ければ Re-ranker や top-k 調整。Faithfulness と Answer Relevancy が生成品質、Context Precision / Recall が検索品質、と分けて 4 象限で改善ロードマップを引くのが定石。",
      references: [
        {
          label: "RAGAs Metrics",
          url: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/",
        },
      ],
    },
  },
  {
    id: "ai-eng-016",
    categoryId: "ai-engineering",
    difficulty: "beginner",
    type: "choice",
    question:
      "次のうち『ベクトルデータベース』ではないものはどれ？",
    choices: [
      "Redis Streams",
      "Pinecone",
      "Chroma",
      "pgvector (PostgreSQL 拡張)",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Redis Streams はメッセージストリーム機構でベクトル検索専用ではない (Redis にはベクトル検索機能 RediSearch があるが、Streams 自体は別物)。",
      "Pinecone はマネージドな代表的ベクトル DB。",
      "Chroma はオープンソースの軽量ベクトル DB。",
      "pgvector は PostgreSQL に近似最近傍検索を追加する拡張。",
    ],
    hints: [
      "ベクトル DB = 高次元埋め込みの ANN (近似最近傍) 検索が主目的。",
      "Stream / queue 系は別カテゴリ。",
      "PostgreSQL も拡張を入れればベクトル DB として使える。",
    ],
    explanation: {
      summary:
        "Pinecone / Chroma / Weaviate / Qdrant / Milvus / pgvector などがベクトル DB。Redis Streams はメッセージストリームでベクトル検索専用ではない (ただし RediSearch でベクトルもサポート)。",
      reason:
        "ベクトル DB は HNSW / IVF などの ANN インデックスで高次元コサイン類似度を高速に取れることが本質。Pinecone はマネージドで運用フリー、Chroma は OSS で軽量プロトタイプ向き、Weaviate / Qdrant は OSS + マネージドで本番にも使える、pgvector は既存 PostgreSQL を活かせるためチームの学習コストが低い。要件 (スケール / 既存 DB / 運用負荷) で選ぶ。",
      references: [
        {
          label: "pgvector",
          url: "https://github.com/pgvector/pgvector",
        },
      ],
    },
  },

  // ===========================================================================
  // 📊 LLMOps (ai-eng-017 〜 ai-eng-023)
  // ===========================================================================
  {
    id: "ai-eng-017",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "LLMOps が従来の MLOps と最も異なる点として適切なのは？",
    choices: [
      "Python が使えない",
      "成果物がモデル重みではなくプロンプト・RAG インデックス・システムメッセージ等が中心で、評価も決定論的でなく LLM-judge / 人手中心",
      "GPU を使わない",
      "クラウドで動かせない",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "Python は標準。",
      "正解。LLMOps では prompt・RAG index・system message が一級の成果物で、出力は自由文・評価は LLM-as-judge / 人手が中心。",
      "GPU はむしろ推論で多用する。",
      "クラウドが主戦場。",
    ],
    hints: [
      "何を変えたら挙動が変わるか？",
      "MLOps では『重み』、LLMOps では？",
      "評価が決定論的でないところも大きな違い。",
    ],
    explanation: {
      summary:
        "LLMOps はプロンプト・RAG インデックス・システムメッセージなどの非モデル成果物を一級市民として扱い、LLM-judge や人手評価を回し、トークン単位のコストを監視する点で MLOps と異なる。",
      reason:
        "MLOps は『学習 → 評価 (Accuracy/F1) → デプロイ』で重みが主成果物だった。LLMOps では学習をスキップしてプロンプト / 検索 / ツール構成を変える方が一般的で、評価も自由テキストに対する Faithfulness や Answer Relevancy のように LLM-judge or 人手評価を伴う。コストも学習コストではなく『1 リクエストあたりのトークン課金』が支配的。プロンプトのバージョン管理 (LangSmith / Langfuse の Prompt Management) が新たに必要になる。",
      references: [
        {
          label: "Langfuse Docs",
          url: "https://langfuse.com/docs",
        },
      ],
    },
  },
  {
    id: "ai-eng-018",
    categoryId: "ai-engineering",
    difficulty: "beginner",
    type: "choice",
    question:
      "LLM サービスの本番監視で『P95 latency』を見る理由は？",
    choices: [
      "平均値では隠れる『遅いリクエスト 5%』のユーザー体験劣化を捕捉できる",
      "コスト計算に必須",
      "GPU 温度を表す指標",
      "モデル精度を表す指標",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。平均は外れ値に薄められるため、P95 / P99 などのパーセンタイルでテール側を見るのが SRE の定石。",
      "コストは別途トークン単価で計算する。",
      "ハードウェア温度ではない。",
      "精度メトリクスではない。",
    ],
    hints: [
      "『5% の遅いユーザー』の体感を平均は捨ててしまう。",
      "P50 = 中央値、P95 / P99 はテール。",
      "SLO 設定でよく使う指標。",
    ],
    explanation: {
      summary:
        "P95 latency は『95% のリクエストがこの時間以内に返る』値。平均では薄まる遅い 5% のユーザー体験を可視化できる。SLO 設定や容量計画で必須。",
      reason:
        "LLM 推論は出力長によりレイテンシが大きくぶれるため、平均だけ見ると『大体は速い』に見えて実際は P95 で 30 秒かかるケースが見えない。LangSmith / Langfuse / Arize Phoenix などの観測基盤では P50 / P95 / P99 を時系列で出せる。ストリーミング応答なら TTFT (Time To First Token) と TBT (Time Between Tokens) も別軸で監視する。",
      references: [
        {
          label: "Langfuse: Tracing",
          url: "https://langfuse.com/docs/tracing",
        },
      ],
    },
  },
  {
    id: "ai-eng-019",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "LLMOps ツールの選定: 『LangChain / LangGraph と密結合で公式統合が最も強い』のはどれ？",
    choices: [
      "Arize Phoenix",
      "LiteLLM",
      "LangSmith",
      "Langfuse",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "Phoenix は OpenTelemetry-native でフレームワーク非依存。",
      "LiteLLM は複数プロバイダのゲートウェイで観測専用ではない。",
      "正解。LangSmith は LangChain 公式の観測・評価プラットフォーム。LangChain / LangGraph の trace を最小設定で取れる。",
      "Langfuse は OSS で自己ホスト可、フレームワーク非依存。",
    ],
    hints: [
      "LangChain と『同じ会社』のプロダクト。",
      "trace の取り回しに自前計装がほぼ要らない。",
      "他は OSS or フレームワーク非依存。",
    ],
    explanation: {
      summary:
        "LangSmith は LangChain 社が提供する公式観測 / 評価プラットフォーム。LangChain / LangGraph と密結合で trace 自動取得・データセット評価・プロンプト管理が一体化している。",
      reason:
        "Langfuse は OSS (MIT) で self-host 可、トークン単位のコスト追跡が強い。Arize Phoenix は OpenTelemetry-native でフレームワーク非依存・RAGAs ネイティブ統合。LiteLLM は OpenAI / Anthropic / Bedrock / Vertex 等を統一 API で呼ぶ proxy / gateway で、観測機能もあるが本領は『マルチプロバイダ抽象化』。要件 (SaaS でいいか自己ホスト必須か、LangChain 依存か非依存か) で組み合わせる。",
      references: [
        {
          label: "LangSmith",
          url: "https://docs.smith.langchain.com/",
        },
        {
          label: "Langfuse",
          url: "https://langfuse.com/docs",
        },
      ],
    },
  },
  {
    id: "ai-eng-020",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "『LiteLLM』が解決する代表的な課題は？",
    choices: [
      "ベクトル DB の代替",
      "プロンプトの構文ハイライト",
      "GPU クラスタの自動構築",
      "OpenAI / Anthropic / Bedrock / Vertex など複数プロバイダを統一 API で呼び、フォールバック / レート制限 / コスト制御を一元化する",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "ベクトル DB ではない。",
      "エディタ機能ではない。",
      "インフラ自動構築ツールでもない。",
      "正解。LiteLLM は 100+ プロバイダを OpenAI 互換 API でラップする proxy / SDK。プロバイダ切替・コスト制御に便利。",
    ],
    hints: [
      "Multi-provider gateway。",
      "プロバイダ間のフォールバック・rate limit 制御が主目的。",
      "OpenAI 互換 API でラップする。",
    ],
    explanation: {
      summary:
        "LiteLLM は OpenAI / Anthropic / Bedrock / Vertex / Azure / Ollama など 100+ プロバイダを OpenAI 互換 API で統一呼び出しできる proxy / SDK。フォールバック・ロードバランス・コスト制限・キー管理を一元化できる。",
      reason:
        "プロバイダ依存を SDK レベルで吸収するため、Anthropic が落ちた時に OpenAI に自動フォールバック、特定モデルでレート制限超えたら別キーに切替、などのポリシーをコードを書かずに proxy 側で表現できる。利用料 / ユーザー単位のクォータ管理も可能で、エンタープライズの『複数プロバイダを安全に並走させたい』要件に応える。観測機能は LangSmith / Langfuse / Phoenix への送信に対応。",
      references: [
        {
          label: "LiteLLM Docs",
          url: "https://docs.litellm.ai/",
        },
      ],
    },
  },
  {
    id: "ai-eng-021",
    categoryId: "ai-engineering",
    difficulty: "advanced",
    type: "choice",
    question:
      "LLM システム特有の『技術的負債』として誤っているのは？",
    choices: [
      "埋め込みドリフト (新モデルとの非互換)",
      "サイレントな品質劣化 (テスト網羅率が低くデグレに気づきにくい)",
      "学習データのラベルノイズ",
      "プロンプトドリフト (時間経過で挙動が変わる)",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "埋め込みドリフトも特有。モデル切替で既存インデックスが使えなくなる。",
      "出力が自由テキストなので決定論的テストが書きにくく、デグレが見えにくい。",
      "正解。ラベルノイズは MLOps の問題で、LLMOps 固有ではない (RAG ではむしろドキュメント品質が該当)。",
      "プロンプトドリフトは LLMOps 特有の課題。バージョン管理必須。",
    ],
    hints: [
      "MLOps と LLMOps の課題を切り分ける問題。",
      "学習データのラベルは LLM 利用者は通常触らない。",
      "プロンプト・埋め込み・評価データセットの管理が LLMOps の鍵。",
    ],
    explanation: {
      summary:
        "LLMOps 固有の技術的負債は『プロンプトドリフト』『埋め込みドリフト』『LLM-as-judge の合意ドリフト』『サイレント品質劣化』など。学習データのラベルノイズは伝統的 ML / MLOps の課題で LLMOps 固有とは言えない。",
      reason:
        "プロンプトドリフト = モデル更新 (Claude 3.5 → 4.5 等) で同じプロンプトが微妙に違う挙動になる。埋め込みドリフト = 埋め込みモデルを変えると既存インデックスを再生成する必要がある。サイレント品質劣化 = 自由テキスト出力ゆえユニットテストが書きにくく、評価データセットを継続的に回さないと気づけない。これらに対処するため、プロンプト / 評価データのバージョニング、回帰スイート、本番トラフィックのサンプリング監査が必須。",
      references: [
        {
          label: "Langfuse: Evaluation",
          url: "https://langfuse.com/docs/scores/overview",
        },
      ],
    },
  },
  {
    id: "ai-eng-022",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "プロンプトのバージョニングをコードのバージョニングと『別管理』にする利点は？",
    choices: [
      "LLM が自動でプロンプトを書き換える",
      "非エンジニアもプロンプトを編集・実験・ロールバックでき、リリースを伴わず A/B テストできる",
      "Git が不要になる",
      "プロンプトを暗号化できる",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "自動書換は別の概念。",
      "正解。LangSmith / Langfuse の Prompt Management のように、プロンプトを別レジストリで管理するとリリースなしで差し替え可能になる。",
      "Git は引き続きコードで使う。",
      "暗号化機能とは別の話。",
    ],
    hints: [
      "PM やドメインエキスパートに編集してもらいたい。",
      "リリースと切り離して差し替えたい。",
      "A/B テストと組み合わせやすい。",
    ],
    explanation: {
      summary:
        "プロンプトをコードと別レジストリで管理すると、非エンジニアも編集でき、リリースを伴わずに本番差し替え・A/B テスト・即時ロールバックが可能になる。",
      reason:
        "コードに埋めると改善のたびにデプロイが必要で、PM やドメインエキスパートが手を入れにくい。LangSmith / Langfuse / PromptLayer などの Prompt Management は『プロンプトのバージョン・タグ・本番ラベル・実験との紐付け』を提供し、コードからは ID で参照する。本番タグを別バージョンに差し替えるだけで切替でき、incident 時もワンクリックでロールバック。同時に評価データセットへの紐付けで回帰確認も自動化できる。",
      references: [
        {
          label: "LangSmith: Prompt Hub",
          url: "https://docs.smith.langchain.com/prompt_engineering",
        },
      ],
    },
  },
  {
    id: "ai-eng-023",
    categoryId: "ai-engineering",
    difficulty: "advanced",
    type: "choice",
    question:
      "本番 RAG で『幻覚率の上昇』に気づくのに最も適した監視構成は？",
    choices: [
      "本番トラフィックをサンプリングし、LLM-judge で Faithfulness を継続計測 + 閾値下落でアラート",
      "P95 latency のみ監視",
      "GPU 使用率のみ監視",
      "ベクトル DB のディスク使用量のみ監視",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Faithfulness を本番サンプル + LLM-as-judge で継続計測するのが定番。",
      "レイテンシだけでは品質劣化に気づけない。",
      "ハードウェア指標だけでは検知できない。",
      "ストレージ指標は無関係。",
    ],
    hints: [
      "品質を直接測る指標が要る。",
      "RAGAs の指標を流用できる。",
      "全件は高コストなのでサンプリング + LLM-judge。",
    ],
    explanation: {
      summary:
        "本番トラフィックをサンプリングし、LLM-as-judge で Faithfulness / Answer Relevancy を継続計測。閾値割れでアラート + 直近変更 (プロンプト・モデル・インデックス) との相関を見るのが王道。",
      reason:
        "Faithfulness は ground-truth 不要で計算できるため、本番ログに後付けで回せる。Langfuse / Phoenix の Scoring API に LLM-judge スコアを書き戻し、ダッシュボードで時系列追跡。劣化検知時は『プロンプト更新』『モデル切替』『ドキュメント追加』のどれが効いたかを変更履歴と突き合わせる。RAGAs ライブラリは Phoenix / Langfuse 連携が公式にあり、サンプリング率は 1〜5% 程度から始めるのが現実的。",
      references: [
        {
          label: "RAGAs Metrics",
          url: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/",
        },
      ],
    },
  },

  // ===========================================================================
  // ⚖️ Governance (ai-eng-024 〜 ai-eng-030)
  // ===========================================================================
  {
    id: "ai-eng-024",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "NIST AI Risk Management Framework (AI RMF 1.0) の 4 つのコア機能は？",
    choices: [
      "Plan / Do / Check / Act",
      "Identify / Protect / Detect / Respond",
      "Collect / Train / Deploy / Audit",
      "Govern / Map / Measure / Manage",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "それは ISO の PDCA。AI RMF とは別。",
      "それは NIST CSF (Cybersecurity Framework) の機能。",
      "AI RMF の機能名ではない。",
      "正解。NIST AI RMF 1.0 (2023年1月) は Govern / Map / Measure / Manage の 4 コア機能。Govern が横断的に他 3 つを統べる。",
    ],
    hints: [
      "Govern が他 3 つを横断的に支える。",
      "Map = リスクの文脈把握、Measure = 計測、Manage = 対応。",
      "PDCA や CSF と混同しやすい。",
    ],
    explanation: {
      summary:
        "NIST AI RMF 1.0 (2023年1月公開) のコア機能は Govern / Map / Measure / Manage の 4 つ。Govern は文化・ポリシー・役割を整える横断機能で、Map (文脈把握)・Measure (計測)・Manage (対応) を統べる。任意適用で第三者認証はない。",
      reason:
        "2024年7月には生成 AI 向けの Generative AI Profile (NIST AI 600-1) が追加公開され、生成 AI 固有のリスク (CBRN 拡散・自己拡散コード・幻覚・データ漏洩等) と各機能でのアクションを示した。米国連邦調達や州法 (Colorado AI Act 等) で参照され、事実上のデファクトリスク管理フレームワーク。任意適用なのが ISO/IEC 42001 (認証可) との大きな差。",
      references: [
        {
          label: "NIST AI RMF",
          url: "https://airc.nist.gov/airmf-resources/airmf/",
        },
      ],
    },
  },
  {
    id: "ai-eng-025",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ISO/IEC 42001:2023 の特徴として正しいものは？",
    choices: [
      "EU 加盟国のみ適用される法律",
      "Google が発行したガイドライン",
      "世界初の AI マネジメントシステム (AIMS) 国際規格で、第三者認証が可能・ISO 27001 等と同じ Annex SL 構造・PDCA ベース",
      "米国の任意フレームワークで認証はできない",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "ISO 規格は国際標準で EU 限定ではない。",
      "ISO は国際標準化機構が発行する規格で企業発行ではない。",
      "正解。ISO/IEC 42001 は AI マネジメントシステム (AIMS) の認証可能規格で、ISO 27001 / 9001 と共通の Annex SL 構造・PDCA。",
      "それは NIST AI RMF の特徴。",
    ],
    hints: [
      "ISO 27001 (ISMS) の AI 版、と理解すると分かりやすい。",
      "第三者認証ができるかどうか。",
      "PDCA サイクルを採用。",
    ],
    explanation: {
      summary:
        "ISO/IEC 42001:2023 は 2023 年 12 月発行の世界初の AI マネジメントシステム (AIMS) 国際規格。ISO 27001/9001 と同じ Annex SL 構造・PDCA を採用し、DNV / BSI 等で第三者認証可能。AI 影響評価・ライフサイクル管理・サプライヤー監督を要求する。",
      reason:
        "NIST AI RMF が任意適用フレームワーク (法令ではなくガイダンス) なのに対し、ISO/IEC 42001 は『認証可能』が最大の差別化要因。EU AI Act 対応や入札要件で『AIMS 認証あり』が引き合いになりつつある。組織のリスク・倫理・透明性・データ品質を継続改善する仕組みを要求し、ISO 27001 を持つ組織は Annex SL の共通章で実装コストを抑えられる。",
      references: [
        {
          label: "ISO/IEC 42001",
          url: "https://www.iso.org/standard/42001",
        },
      ],
    },
  },
  {
    id: "ai-eng-026",
    categoryId: "ai-engineering",
    difficulty: "intermediate",
    type: "choice",
    question:
      "EU AI Act の『4 つのリスク階層』として正しい組み合わせは？",
    choices: [
      "Red / Yellow / Green / White",
      "Unacceptable / High / Limited / Minimal",
      "Critical / High / Medium / Low",
      "Tier 1 / Tier 2 / Tier 3 / Tier 4",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "色分けはマーケ用で公式分類ではない。",
      "正解。EU AI Act は Unacceptable (禁止) / High (厳格義務) / Limited (透明性義務) / Minimal (義務なし) の 4 階層。",
      "似ているが公式用語ではない。",
      "Tier 表記は EU AI Act の用語ではない。",
    ],
    hints: [
      "禁止カテゴリと最小リスクの間に 2 段階。",
      "高リスクは厳格義務、限定リスクは透明性義務。",
      "信号機 (Red/Yellow/Green) 風の口語化はあるが法文上は別。",
    ],
    explanation: {
      summary:
        "EU AI Act の 4 階層は Unacceptable (社会信用スコアリング・サブリミナル操作などは禁止) / High (Annex III 該当: 採用・教育・重要インフラ等で厳格義務) / Limited (チャットボット・ディープフェイクは透明性義務) / Minimal (スパムフィルタ等は義務なし)。",
      reason:
        "高リスクは『リスク管理システム、データガバナンス、技術文書、ロギング、透明性、人間による監督、適合性評価、市場投入後監視』が義務化される。汎用 AI モデル (GPAI) は別軸で規制され、訓練計算量 10^25 FLOPs 超は『システミックリスク』として追加義務 (敵対的評価 / インシデント報告 / サイバーセキュリティ)。",
      references: [
        {
          label: "EU AI Act 公式",
          url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
        },
        {
          label: "High-level Summary",
          url: "https://artificialintelligenceact.eu/high-level-summary/",
        },
      ],
    },
  },
  {
    id: "ai-eng-027",
    categoryId: "ai-engineering",
    difficulty: "advanced",
    type: "choice",
    question:
      "EU AI Act の『発効日』と段階適用の組合せとして正しいのは？",
    choices: [
      "2024年8月1日に発効。禁止行為 2025年2月、GPAI 義務 2025年8月、高リスク 2026年8月、完全適用 2027年8月",
      "2023年1月発効、2024年1月から全条項適用",
      "2025年1月発効、2026年から段階適用",
      "2022年12月発効、即日全面適用",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。EU AI Act は 2024年8月1日 entry into force。段階適用のマイルストーンは Feb 2025 (禁止)、Aug 2 2025 (GPAI)、Aug 2 2026 (高リスク)、Aug 2 2027 (完全適用)。",
      "発効日が違う。",
      "発効日が違う。",
      "段階適用される。",
    ],
    hints: [
      "発効は 2024 年夏。",
      "禁止条項が最も早く適用される。",
      "段階適用で全面適用までは数年かかる。",
    ],
    explanation: {
      summary:
        "EU AI Act は 2024年8月1日に発効 (entry into force)。禁止行為は 2025年2月、GPAI 義務は 2025年8月2日、高リスクシステムは 2026年8月2日、完全適用は 2027年8月2日と段階適用される。",
      reason:
        "完全適用を待たずに禁止行為・GPAI 義務は先行発効しているため、サプライヤーは早めの対応が必要。違反時の制裁金は最大 €35M または世界売上の 7% (禁止違反)、€15M または 3% (GPAI 違反)、€7.5M または 1% (誤情報提供) と高額。GPAI のシステミックリスク閾値は累積訓練計算量 10^25 FLOPs。",
      references: [
        {
          label: "EU AI Act 公式",
          url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
        },
      ],
    },
  },
  {
    id: "ai-eng-028",
    categoryId: "ai-engineering",
    difficulty: "advanced",
    type: "choice",
    question:
      "EU AI Act における『汎用 AI モデル (GPAI) のシステミックリスク』を判定する訓練計算量の閾値は？",
    choices: [
      "10^12 FLOPs",
      "10^25 FLOPs",
      "10^18 FLOPs",
      "10^30 FLOPs",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "桁が異なる。",
      "正解。EU AI Act は累積訓練計算量 > 10^25 FLOPs を『システミックリスクを持つ GPAI』とみなす推定基準にした。",
      "桁が異なる。",
      "桁が異なる。",
    ],
    hints: [
      "GPT-4 級の大規模モデルが目安。",
      "10 の 25 乗 FLOPs。",
      "閾値超過は追加義務 (敵対的評価・インシデント報告等)。",
    ],
    explanation: {
      summary:
        "EU AI Act では累積訓練計算量が 10^25 FLOPs を超える GPAI を『システミックリスク』モデルとみなし、敵対的評価・インシデント報告・サイバーセキュリティ等の追加義務を課す。",
      reason:
        "この閾値はおおむね GPT-4 級の大規模モデルに相当し、将来的に技術進歩に応じて欧州委員会が更新する権限を持つ。閾値未満でも欧州委員会が他要素 (パラメータ数・データ品質・モダリティ・ユーザー数等) から指定可能。GPAI 義務 (技術文書整備・著作権ポリシー・学習データ要約公開) は閾値に関係なく全 GPAI に適用される。",
      references: [
        {
          label: "EU AI Act 公式",
          url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
        },
      ],
    },
  },
  {
    id: "ai-eng-029",
    categoryId: "ai-engineering",
    difficulty: "beginner",
    type: "choice",
    question:
      "『Model Cards』を提唱した 2018 年の論文の主旨として正しいのは？",
    choices: [
      "モデルの用途・学習データ・サブグループ別性能・倫理的考慮・限界事項を統一フォーマットで開示し、透明性と説明責任を高める",
      "GPU の効率測定指標を提案する",
      "強化学習の新アルゴリズムを提案する",
      "ベクトル DB のスキーマを定義する",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Mitchell ら (Google, 2018) の『Model Cards for Model Reporting』は、用途・学習データ・サブグループ性能・倫理・限界を統一フォーマットで開示することを提唱。",
      "ハードウェア指標とは無関係。",
      "アルゴリズム論文ではない。",
      "DB スキーマとは無関係。",
    ],
    hints: [
      "栄養成分表示の AI モデル版、というアナロジーが有名。",
      "Google の Margaret Mitchell らが提唱。",
      "Hugging Face Hub のモデルカードは事実上の標準形式。",
    ],
    explanation: {
      summary:
        "Model Cards は Mitchell+ (Google, 2018) が arXiv:1810.03993『Model Cards for Model Reporting』で提唱した、モデルの用途・学習データ・サブグループ別性能・倫理的配慮・限界を統一フォーマットで開示する文書。",
      reason:
        "『AI モデルの栄養成分表示』に例えられる。Google / Hugging Face / Meta / Anthropic などが採用し、Hugging Face Hub のモデルカードは事実上の業界標準。EU AI Act の技術文書要件や ISO/IEC 42001 の透明性要件とも親和的で、サブグループ性能 (性別・年代・人種等での精度差) の開示はバイアス監査の出発点になる。",
      references: [
        {
          label: "Model Cards for Model Reporting (arXiv)",
          url: "https://arxiv.org/abs/1810.03993",
        },
        {
          label: "Hugging Face Model Cards",
          url: "https://huggingface.co/docs/hub/model-cards",
        },
      ],
    },
  },
  {
    id: "ai-eng-030",
    categoryId: "ai-engineering",
    difficulty: "advanced",
    type: "choice",
    question:
      "あるチームが EU 市場に高リスク AI システムを投入する。NIST AI RMF / ISO 42001 / EU AI Act / Model Cards の役割分担として最も適切なのは？",
    choices: [
      "4 つは互いに排他的でどれか 1 つを選ぶ",
      "EU AI Act は任意ガイダンス、NIST AI RMF は法的要件",
      "Model Cards は法的義務でその他はオプション",
      "EU AI Act が法的要件、ISO/IEC 42001 が認証可能な実装フレーム、NIST AI RMF が補完的ガイダンス、Model Cards が透明性開示の具体的文書",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "排他ではなく組み合わせて使う。",
      "EU AI Act は法令、NIST AI RMF は任意。",
      "Model Cards 自体は規格や法律ではなく実務文書。",
      "正解。法令 (EU AI Act) + マネジメントシステム認証 (ISO 42001) + リスク管理ガイダンス (NIST AI RMF) + 透明性文書 (Model Cards) が階層的・補完的に機能する。",
    ],
    hints: [
      "法令 / 認証 / 任意ガイダンス / 透明性文書、と層が違う。",
      "EU AI Act は強制力、NIST AI RMF は任意。",
      "ISO 42001 は認証取得で対外説明に使える。",
    ],
    explanation: {
      summary:
        "EU AI Act = 法的強制要件 (高リスクは厳格義務)、ISO/IEC 42001 = AIMS の認証可能フレーム (PDCA で継続改善)、NIST AI RMF = 任意ガイダンス (Govern/Map/Measure/Manage)、Model Cards = モデル単位の透明性開示文書、と層が異なり補完的に組み合わせて使う。",
      reason:
        "実務では『EU AI Act の高リスク要件を網羅』するために、ISO/IEC 42001 で組織の AIMS を構築 (リスク・データ・サプライヤー・ライフサイクル) し、NIST AI RMF の Map / Measure を運用ハンドブックとして使い、各モデルに Model Card を発行することで技術文書要件と透明性要件を満たす、という階層的アプローチが取られる。さらに OECD AI Principles や各国ガイドライン (日本: AI 事業者ガイドライン) が周辺にあり、コンプライアンス担当・AI エンジニア・法務が連携して整合性を取る。",
      references: [
        {
          label: "EU AI Act 公式",
          url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
        },
        {
          label: "NIST AI RMF",
          url: "https://airc.nist.gov/airmf-resources/airmf/",
        },
        {
          label: "ISO/IEC 42001",
          url: "https://www.iso.org/standard/42001",
        },
      ],
    },
  },
];

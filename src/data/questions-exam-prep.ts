import type { Question } from "@/lib/types";

/**
 * 試験・認定まとめクイズ。
 * 4 カテゴリ × 6 問 = 計 24 問。受験料・出題範囲・合格点・対策の頻出ポイント。
 *
 * カテゴリ:
 *  - exam-ipa     : IPA / データ認定
 *  - exam-lang-os : 言語・OS 認定
 *  - exam-ai-claude : AI・Claude 関連認定
 *  - exam-cloud   : クラウド認定 (AWS/GCP/Azure)
 */
export const examPrepQuestions: Question[] = [
  // ===========================================================================
  // IPA / データ認定 (ip-001 〜 006)
  // ===========================================================================
  {
    id: "ip-001",
    categoryId: "exam-ipa",
    difficulty: "beginner",
    type: "choice",
    question: "基本情報技術者試験 (FE) の合格基準として正しいのは?",
    choices: [
      "科目 A・科目 B ともに 600 点以上 (1000 点満点、IRT 方式)",
      "全問正答率 80% 以上",
      "面接で合格を判定",
      "TOEIC 700 点と同等",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。2023 年度以降は通年 CBT、IRT 方式で科目 A/B 各 600 点。",
      "不正解。素点 80% の単純判定ではない。",
      "不正解。面接は実施されない。",
      "不正解。語学試験とは無関係。",
    ],
    hints: [
      "2023 年度から CBT 化、IRT 方式に。",
      "科目 A (旧午前) と 科目 B (旧午後)。",
      "1000 点満点で各 600 点。",
    ],
    explanation: {
      summary:
        "基本情報技術者 (FE) は 2023 年度以降通年 CBT、IRT (項目応答理論) 方式で 1000 点満点、科目 A・科目 B それぞれ 600 点以上で合格。",
      reason:
        "従来の午前/午後・80 問固定方式から、IRT による難易度補正付き採点に移行。受験回数の制限が緩和され通年受験可能に。Pearson VUE テストセンターで受験。",
      references: [
        { label: "IPA 基本情報技術者試験", url: "https://www.ipa.go.jp/shiken/kubun/fe.html" },
      ],
    },
  },
  {
    id: "ip-002",
    categoryId: "exam-ipa",
    difficulty: "beginner",
    type: "choice",
    question: "応用情報技術者試験 (AP) の出題形式として正しいのは?",
    choices: [
      "午前: 80 問四択 / 午後: 11 問から 5 問選択の記述式 (春・秋の年 2 回、紙ベース)",
      "全問四択 100 問 / CBT 通年",
      "全問記述式 / 1 日 8 時間",
      "プログラミング実技のみ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。AP は午前 (60%) + 午後 (60%) で合格、年 2 回の紙試験。",
      "不正解。それは FE の特徴。",
      "不正解。8 時間試験は存在しない。",
      "不正解。実技試験ではない。",
    ],
    hints: [
      "FE と違って紙ベースで年 2 回。",
      "午後は記述式で 5 問選択。",
      "両方 60% で合格。",
    ],
    explanation: {
      summary:
        "応用情報技術者 (AP) は春 (4月) / 秋 (10月) の年 2 回、紙ベース筆記試験。午前 80 問四択 (60% 以上) + 午後 11 問中 5 問選択の記述式 (60% 以上) で合格。",
      reason:
        "FE が CBT 化されたのに対し、AP は依然として紙の年 2 回試験。午後は記述式のため、文章で論理的に説明する力が必要。受験料は 7,500 円 (2024 年改定)。",
      references: [
        { label: "IPA 応用情報技術者試験", url: "https://www.ipa.go.jp/shiken/kubun/ap.html" },
      ],
    },
  },
  {
    id: "ip-003",
    categoryId: "exam-ipa",
    difficulty: "intermediate",
    type: "choice",
    question: "高度情報処理技術者試験 (例: データベーススペシャリスト) の構成として正しいのは?",
    choices: [
      "午前I (共通) / 午前II (専門) / 午後I (記述) / 午後II (論述 or 長文記述) の 4 部構成",
      "午前と午後の 2 部構成のみ",
      "全問四択で CBT",
      "口述試験のみ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。高度試験は 4 部構成、それぞれで基準点クリアが必要。",
      "不正解。2 部構成は AP まで。",
      "不正解。CBT 化はされていない。",
      "不正解。口述はない。",
    ],
    hints: [
      "午前は I (共通) と II (専門) に分かれる。",
      "午後は I (記述) と II (論述/長文記述)。",
      "全段階で 60% 必要。",
    ],
    explanation: {
      summary:
        "高度試験 (DB スペシャリスト・ネットワークスペシャリスト・情報処理安全確保支援士 等) は 4 部構成。午前I (高度共通) / 午前II (専門 25 問四択) / 午後I (記述、複数大問から選択) / 午後II (論述 or 長文記述)。",
      reason:
        "AP 合格者は 2 年間『午前I 免除』の特典あり。各段階で 60% 以上 + 論述系は論文の論理性が評価対象。年 1 回 (春 or 秋) の紙試験。",
      references: [
        { label: "IPA 高度試験", url: "https://www.ipa.go.jp/shiken/index.html" },
      ],
    },
  },
  {
    id: "ip-004",
    categoryId: "exam-ipa",
    difficulty: "beginner",
    type: "choice",
    question: "G 検定 (ジェネラリスト検定) の特徴として正しいのは?",
    choices: [
      "JDLA が実施、ディープラーニングの基礎知識を問うオンライン試験 (自宅受験・参考書持込可)、約 200 問 / 120 分",
      "ディープラーニングのコーディング実技試験",
      "対面・参考書禁止のクローズドブック試験",
      "TOEIC 同等の語学資格",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。G 検定は自宅オンライン受験 + 参考書持込可、約 200 問を 120 分で解く。",
      "不正解。コーディングは E 資格の方が実技寄り。",
      "不正解。オープンブック方式。",
      "不正解。AI 知識検定で語学とは無関係。",
    ],
    hints: [
      "JDLA = 日本ディープラーニング協会。",
      "自宅でオンライン受験可。",
      "参考書持込可 (オープンブック)。",
    ],
    explanation: {
      summary:
        "G 検定は JDLA (日本ディープラーニング協会) 主催。自宅オンライン受験で参考書・検索 OK だが、約 200 問を 120 分で解くため事前学習なしでは時間が足りない。受験料 13,200 円 (一般) / 5,500 円 (学生)。",
      reason:
        "E 資格 (エンジニア向け実装試験) との対で位置付けられる『ビジネス側の AI リテラシー』認定。AI 倫理・法規制 / 機械学習手法 / ディープラーニング各論が出題範囲で、最新法規 (改正個人情報保護法 / EU AI Act) もカバー。",
      references: [
        { label: "JDLA G 検定", url: "https://www.jdla.org/certificate/general/" },
      ],
    },
  },
  {
    id: "ip-005",
    categoryId: "exam-ipa",
    difficulty: "intermediate",
    type: "choice",
    question: "E 資格の受験要件として正しいのは?",
    choices: [
      "JDLA 認定プログラムを過去 2 年以内に修了していること (修了番号が必須)",
      "誰でも自由に受験できる",
      "大学院修士以上の学位が必要",
      "G 検定合格が必須",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。認定プログラム修了が必須要件。",
      "不正解。前提なしではない。",
      "不正解。学位は不要。",
      "不正解。G 検定との従属関係はない。",
    ],
    hints: [
      "認定プログラムの修了が前提。",
      "プログラムは複数の事業者が提供。",
      "費用が高めなのはプログラム代込みのため。",
    ],
    explanation: {
      summary:
        "E 資格 (エンジニア資格) は JDLA 認定プログラムを過去 2 年以内に修了していることが受験要件。受験料 33,000 円 (一般) に加え認定プログラム費用 (10〜30 万円程度) が別途必要。",
      reason:
        "実装寄りの試験で、誤差逆伝播・最適化アルゴリズム・CNN/RNN/Transformer 等の数式と実装が問われる。認定プログラム制により『一定の学習量を担保』する設計。",
      references: [
        { label: "JDLA E 資格", url: "https://www.jdla.org/certificate/engineer/" },
      ],
    },
  },
  {
    id: "ip-006",
    categoryId: "exam-ipa",
    difficulty: "intermediate",
    type: "choice",
    question: "データサイエンティスト検定 (DS 検定) リテラシーレベルの特徴は?",
    choices: [
      "データサイエンティスト協会が認定。CBT で 100 問 100 分、データサイエンス力 / データエンジニア力 / ビジネス力の 3 カテゴリから出題",
      "Kaggle 上位入賞が認定条件",
      "実技のみ (Python の解析課題)",
      "G 検定との二択でどちらかしか受けられない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。3 カテゴリ構成の CBT 試験。",
      "不正解。Kaggle は無関係。",
      "不正解。リテラシーレベルは知識試験で実技ではない。",
      "不正解。両方受験可能。",
    ],
    hints: [
      "3 カテゴリ: DS 力 / DE 力 / ビジネス力。",
      "CBT 通年受験。",
      "100 問 100 分。",
    ],
    explanation: {
      summary:
        "DS 検定リテラシーレベルは一般社団法人データサイエンティスト協会の認定資格。CBT で 100 問 100 分。3 つのスキルカテゴリ (データサイエンス力・データエンジニア力・ビジネス力) から幅広く出題され、受験料 11,000 円 (一般) / 5,500 円 (学生)。",
      reason:
        "G 検定が AI 寄り (DL 中心) なのに対し、DS 検定はデータ分析・統計・SQL・ビジネス活用までを横断する『データ人材としての基礎』。データ分析を業務で扱う非エンジニアにも適。",
      references: [
        { label: "DS 検定", url: "https://www.datascientist.or.jp/dscertification/" },
      ],
    },
  },

  // ===========================================================================
  // 言語・OS 認定 (lo-001 〜 006)
  // ===========================================================================
  {
    id: "lo-001",
    categoryId: "exam-lang-os",
    difficulty: "beginner",
    type: "choice",
    question: "Ruby 技術者認定試験 Silver / Gold の関係として正しいのは?",
    choices: [
      "Silver は Ruby 文法・組み込みクラスの基礎、Gold は Silver の知識前提で Ruby 高度機能・標準ライブラリ・メタプログラミングまで。受験料は各 16,500 円",
      "Silver 合格すると自動的に Gold 取得",
      "Gold は Rails の試験",
      "Silver と Gold は別言語",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Silver → Gold の二階建て。",
      "不正解。Gold は別途受験必要。",
      "不正解。どちらも Ruby 本体の試験で Rails は別。",
      "不正解。Ruby Association の同じ枠組み。",
    ],
    hints: [
      "Silver と Gold の 2 レベル。",
      "Ruby Association が運営。",
      "CBT で Pearson VUE。",
    ],
    explanation: {
      summary:
        "Ruby 技術者認定試験 (Ruby Association 認定) は Silver と Gold の 2 レベル。Silver は文法と組み込みクラス、Gold はメタプログラミング・標準ライブラリ・例外設計までを問う。CBT 90 分で 50 問、合格基準は 75%。",
      reason:
        "Rails の試験ではなく Ruby 本体の試験。Gold は受験前に Silver 合格が推奨 (必須ではない)。最新版は Ruby 3.x 対応版で、`rightward assignment` や `pattern matching` も出題範囲。",
      references: [
        { label: "Ruby 技術者認定試験", url: "https://www.ruby.or.jp/ja/certification/examination/" },
      ],
    },
  },
  {
    id: "lo-002",
    categoryId: "exam-lang-os",
    difficulty: "beginner",
    type: "choice",
    question: "Python 認定 PCEP と PCAP の違いとして正しいのは?",
    choices: [
      "PCEP は入門レベル (構文・データ型・関数)、PCAP は中級 (OOP・例外・モジュール・標準ライブラリ)。両方とも OpenEDG が認定",
      "PCEP は Python 2 専用、PCAP は Python 3 専用",
      "PCEP は無料、PCAP は有料",
      "両者は別言語の試験",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。難易度階層が PCEP → PCAP → PCPP1 → PCPP2 の順。",
      "不正解。両方とも Python 3 ベース。",
      "不正解。両方とも有料。",
      "不正解。同じ Python 認定。",
    ],
    hints: [
      "PCEP → PCAP → PCPP1 → PCPP2。",
      "OpenEDG が認定団体。",
      "PCEP は入門、PCAP は中級。",
    ],
    explanation: {
      summary:
        "OpenEDG (Open Education and Development Group) が認定する Python 認定。PCEP (入門) → PCAP (中級) → PCPP1 / PCPP2 (上級) の 4 階層。PCEP は $59、PCAP は $295。CBT 形式で OnVUE プロクター付きでオンライン受験可能。",
      reason:
        "Python Institute による国際認定で、Anaconda 環境構築や基本ライブラリ (math / random / platform 等) も範囲。PCAP からは OOP・例外階層・モジュール設計が中心になる。日本での受験者は近年急増。",
      references: [
        { label: "Python Institute", url: "https://pythoninstitute.org/certification" },
      ],
    },
  },
  {
    id: "lo-003",
    categoryId: "exam-lang-os",
    difficulty: "intermediate",
    type: "choice",
    question: "LPIC (Linux Professional Institute Certification) のレベル階層として正しいのは?",
    choices: [
      "LPIC-1 (101 + 102 試験) / LPIC-2 (201 + 202) / LPIC-3 (300/303/305/306 のいずれか)。各レベル 2 試験以上の合格で認定",
      "LPIC は 1 試験で全レベル取得",
      "LPIC-3 から受験できる",
      "LPIC は CBT ではなく面接",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。3 レベル × 各 2 試験 (LPIC-3 のみ 1 試験) の構成。",
      "不正解。複数試験必須。",
      "不正解。下位レベル合格が前提。",
      "不正解。CBT で受験。",
    ],
    hints: [
      "Level 1 / 2 / 3 の 3 階層。",
      "各レベルで 2 試験 (LPIC-3 は 1 試験)。",
      "受験料は 1 試験 16,500 円。",
    ],
    explanation: {
      summary:
        "LPIC は Linux Professional Institute (カナダ) 認定。LPIC-1 (101/102) → LPIC-2 (201/202) → LPIC-3 (300/303/305/306 のいずれか) の 3 階層。1 試験 16,500 円 (税込)、CBT で日本語受験可能。認定有効期間は 5 年。",
      reason:
        "国内では Linux Academy (株式会社シー・キューブド) の LinuC が併存。LinuC は Linux Foundation 公認、LPIC は LPI 直接認定。出題範囲は重複しつつ若干違うので、応募先の指定を確認すべき。",
      references: [
        { label: "LPI 日本支部", url: "https://lpi.or.jp/" },
      ],
    },
  },
  {
    id: "lo-004",
    categoryId: "exam-lang-os",
    difficulty: "intermediate",
    type: "choice",
    question: "Oracle Java SE Certified Professional の最新世代 (Java 21) の特徴は?",
    choices: [
      "1Z0-830 (Java SE 21 Developer Professional) の 1 試験で Professional 取得。Pattern Matching / Records / Virtual Threads / Sealed Classes など Java 17〜21 の新機能が出題範囲",
      "Associate と Professional の 2 試験必須",
      "対面試験のみ",
      "Java 8 までしか試験がない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Java 21 では 1Z0-830 一発合格でプロフェッショナル取得可能。",
      "不正解。Java 21 から 1 試験ルートになった。",
      "不正解。Pearson VUE で CBT 受験可能。",
      "不正解。Java 8/11/17/21 のラインがある。",
    ],
    hints: [
      "Java 21 LTS 対応の試験は 1Z0-830。",
      "Pattern Matching / Records / Virtual Threads が範囲。",
      "Pearson VUE で受験。",
    ],
    explanation: {
      summary:
        "Oracle Java SE Certified Professional は Java 21 LTS 対応の 1Z0-830 で取得可能。受験料 ¥37,730 (税込)、Pearson VUE で CBT。出題範囲は Sealed Classes、Records、Pattern Matching for switch、Virtual Threads、Structured Concurrency など最新機能まで。",
      reason:
        "従来は Associate (1Z0-808) + Professional (1Z0-809) の 2 段階だったが、Java 21 から 1 試験で Professional に到達できる新方式に。クラウド向け開発・最新 JDK 機能を意識した出題比重。",
      references: [
        { label: "Oracle Java Certification", url: "https://education.oracle.com/java-certifications" },
      ],
    },
  },
  {
    id: "lo-005",
    categoryId: "exam-lang-os",
    difficulty: "beginner",
    type: "choice",
    question: "PHP 技術者認定試験 (PHP 8) の構成として正しいのは?",
    choices: [
      "上級・初級の 2 段階。PHP 8 ベースで出題、CBT 60 問 70 分、合格基準 70%。受験料は初級 13,200 円・上級 16,500 円",
      "全レベル無料で 1 試験のみ",
      "1 日 8 時間の長時間試験",
      "面接形式",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。初級 / 上級の 2 レベル。",
      "不正解。有料で 2 レベル。",
      "不正解。70 分試験。",
      "不正解。CBT 試験。",
    ],
    hints: [
      "PHP 技術者認定機構が運営。",
      "初級と上級。",
      "Pearson VUE で CBT。",
    ],
    explanation: {
      summary:
        "PHP 技術者認定試験は PHP 技術者認定機構が運営。PHP 8 対応版があり、初級と上級の 2 段階。CBT 60 問 70 分、合格基準 70%。",
      reason:
        "PHP のシェア低下に伴い知名度は下がりつつあるが、レガシー保守案件・WordPress 系・Laravel 案件ではいまだ評価される。Pearson VUE で受験可能。",
      references: [
        { label: "PHP 技術者認定試験", url: "https://www.phpexam.jp/" },
      ],
    },
  },
  {
    id: "lo-006",
    categoryId: "exam-lang-os",
    difficulty: "intermediate",
    type: "choice",
    question: "Kubernetes 関連認定 CKA / CKAD / CKS の違いとして正しいのは?",
    choices: [
      "CKA = クラスタ管理者、CKAD = アプリ開発者、CKS = セキュリティ専門 (CKA 合格が前提)。3 試験ともパフォーマンスベース (実機で yaml を書く実技)",
      "3 試験ともペーパー筆記試験",
      "全試験で CKA が必須",
      "CKAD は GCP のみで実施",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。役割別 3 試験 + CKS のみ CKA 前提。",
      "不正解。実機での実技試験。",
      "不正解。CKA 必須は CKS だけ。",
      "不正解。クラウド非依存。",
    ],
    hints: [
      "CKA / CKAD / CKS の 3 種類。",
      "実機で yaml を書く実技試験。",
      "CNCF + Linux Foundation 認定。",
    ],
    explanation: {
      summary:
        "Kubernetes 認定は CNCF (Cloud Native Computing Foundation) + Linux Foundation 認定の 3 試験。CKA (Certified Kubernetes Administrator) はクラスタ管理、CKAD (Application Developer) はアプリ開発、CKS (Security Specialist) はセキュリティで CKA 合格が前提。各試験 $445、2 時間の実技。",
      reason:
        "全試験パフォーマンスベース (PSI Bridge でブラウザ越しに ssh 操作)。マニフェスト記述、デバッグ、ロール設定、Pod セキュリティなどを実機で問われる。合格証明はクラウドネイティブ求人で高評価。",
      references: [
        { label: "Linux Foundation Training", url: "https://training.linuxfoundation.org/" },
      ],
    },
  },

  // ===========================================================================
  // AI / Claude 関連認定 (ai-001 〜 006)
  // ===========================================================================
  {
    id: "ai-001",
    categoryId: "exam-ai-claude",
    difficulty: "beginner",
    type: "choice",
    question: "現時点 (2026 年 5 月) で Anthropic から公式リリースされている認定試験は?",
    choices: [
      "CCA-F (Claude Certified Architect — Foundations) のみ。Seller / Developer / Advanced Architect は 2026 年内に追加予定",
      "Seller / Developer / Architect の 3 種類すべて",
      "Anthropic は公式認定を提供していない",
      "Bedrock Specialty が Anthropic 公式認定",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。CCA-F のみがリリース済み。他は予告段階。",
      "不正解。リリース済みは CCA-F だけ。",
      "不正解。CCA-F が存在する。",
      "不正解。Bedrock は AWS の認定で別物。",
    ],
    hints: [
      "CCA-F は 2026 年 3 月 12 日リリース。",
      "Partner Network と同時発表。",
      "他認定は予告段階。",
    ],
    explanation: {
      summary:
        "Anthropic 公式認定は CCA-F (Claude Certified Architect — Foundations) のみがリリース済み (2026 年 3 月 12 日)。Seller (営業) / Developer (実装) / Advanced Architect (上級設計、CCA-F 前提) は 2026 年内に追加予定。",
      reason:
        "Claude Partner Network ($100M 投資) 発足と同時に CCA-F を発表し、まず Foundations 層を整備。今後 3 系統 (Sell / Build / Design) の専門認定が積み上がる予定で、人材タグ付けエコシステムを構築している。",
      references: [
        { label: "Claude Partner Network", url: "https://www.anthropic.com/news/claude-partner-network" },
      ],
    },
  },
  {
    id: "ai-002",
    categoryId: "exam-ai-claude",
    difficulty: "beginner",
    type: "choice",
    question: "CCA-F 試験の合格ライン・問題数・時間として正しい組み合わせは?",
    choices: [
      "合格 720 / 1000 (約 72%)、60 問、120 分、ドメイン加重スコアリング",
      "合格 60%、100 問、180 分",
      "合格 90%、30 問、60 分",
      "合格 70%、80 問、240 分",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。スケーリングスコアで 720、60 問 120 分。",
      "不正解。問題数も時間も違う。",
      "不正解。問題数が少なすぎる。",
      "不正解。時間が長すぎる。",
    ],
    hints: [
      "1000 点満点で 720。",
      "60 問を 120 分。",
      "ドメイン加重 (27/20/20/18/15%)。",
    ],
    explanation: {
      summary:
        "CCA-F は 1000 点満点で合格 720 (約 72%)、60 問・120 分。ドメイン重みは Agentic 27% > Claude Code 20% = Prompt 20% > MCP 18% > Context 15%。",
      reason:
        "シナリオ駆動の選択式試験で、6 つの本番想定シナリオに紐付いた設問が出題される。1 問 2 分のペース配分。配点の重いドメインを優先的に固めるのが定石。",
      references: [
        { label: "CCA-F アクセス申請", url: "https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request" },
      ],
    },
  },
  {
    id: "ai-003",
    categoryId: "exam-ai-claude",
    difficulty: "intermediate",
    type: "choice",
    question: "CCA-F の受験料と受験ゲートとして正しいのは?",
    choices: [
      "通常 $99 USD / 回。Claude Partner Network メンバー組織の最初の 5,000 名は Early Access で無料受験可能 (Network 加盟自体は無料)",
      "$499 / 回、誰でも受験可能",
      "完全無料、誰でも受験可能",
      "$1,000 / 回、Anthropic 社員推薦が必要",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。$99 と Partner Network ゲート。",
      "不正解。価格も入口も違う。",
      "不正解。Partner Network 限定。",
      "不正解。社員推薦は不要。",
    ],
    hints: [
      "Partner Network メンバー限定。",
      "加盟自体は無料。",
      "Early Access は 5,000 名無料。",
    ],
    explanation: {
      summary:
        "CCA-F は $99 USD / 回。受験には Claude Partner Network メンバー組織所属が必要 (組織加盟は無料)。Network 加盟組織の最初の 5,000 名は Early Access として無料受験可能。",
      reason:
        "Partner Network 加盟が受験ゲート。所属企業が加盟していれば受験できる仕組み。所属企業未加盟なら、組織として加盟申請を提案できる。",
      references: [
        { label: "Claude Partner Network", url: "https://www.anthropic.com/news/claude-partner-network" },
      ],
    },
  },
  {
    id: "ai-004",
    categoryId: "exam-ai-claude",
    difficulty: "beginner",
    type: "choice",
    question: "AWS Certified AI Practitioner (AIF-C01) の特徴として正しいのは?",
    choices: [
      "AWS の AI/ML 入門認定。Foundation Model / Bedrock / SageMaker JumpStart など AWS の生成 AI サービスを含む。受験料 $100、CBT 90 分",
      "Anthropic 公式の認定",
      "AWS のアーキテクト試験 SAA の前提",
      "実技のみで AWS Lambda の関数を書く",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。AWS の AI/ML 入門認定。",
      "不正解。AWS の認定。",
      "不正解。SAA とは別ライン。",
      "不正解。知識問題で実技ではない。",
    ],
    hints: [
      "AWS の Practitioner ライン。",
      "Bedrock や SageMaker JumpStart も範囲。",
      "受験料 $100。",
    ],
    explanation: {
      summary:
        "AWS Certified AI Practitioner (AIF-C01) は AWS の AI/ML 入門認定。2024 年に新設。受験料 $100、CBT 90 分、65 問。Foundation Model (Anthropic Claude を含む) / Bedrock / SageMaker JumpStart / 責任ある AI が出題範囲。",
      reason:
        "Bedrock 経由で Claude を使う組織が増えたため、AWS が AI 利用者向けに新設した入門認定。生成 AI の基礎理解 + AWS サービスの組み合わせを問う。",
      references: [
        { label: "AWS Certified AI Practitioner", url: "https://aws.amazon.com/certification/certified-ai-practitioner/" },
      ],
    },
  },
  {
    id: "ai-005",
    categoryId: "exam-ai-claude",
    difficulty: "intermediate",
    type: "choice",
    question: "Anthropic Academy (anthropic.skilljar.com) のコース受講要件は?",
    choices: [
      "全コース無料、メールアドレス登録のみで受講可能 (Partner Network 加盟不要)",
      "月額 $29 のサブスク",
      "Partner Network 加盟必須",
      "コースごとに $49〜199",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。学習自体は誰でも無料。",
      "不正解。サブスク制ではない。",
      "不正解。受講には加盟不要。",
      "不正解。個別課金なし。",
    ],
    hints: [
      "学習は無料・誰でも。",
      "Partner Network は試験のゲート。",
      "Skilljar 上で配信。",
    ],
    explanation: {
      summary:
        "Anthropic Academy のコースは全 17 本程度、すべて無料、メールアドレスのみで登録可能。Partner Network 加盟は CCA-F 受験のゲートで、Academy の受講には関係ない。",
      reason:
        "学習ハードルを下げてエコシステム全体の Claude スキルを底上げする戦略。Claude 101 / Claude Code 101 / Introduction to MCP / Advanced MCP / Introduction to Subagents / Introduction to Agent Skills / Building with the Claude API などが揃う。",
      references: [
        { label: "Anthropic Academy", url: "https://anthropic.skilljar.com/" },
      ],
    },
  },
  {
    id: "ai-006",
    categoryId: "exam-ai-claude",
    difficulty: "intermediate",
    type: "choice",
    question: "Microsoft Azure AI Engineer Associate (AI-102) の位置付けとして正しいのは?",
    choices: [
      "Azure AI サービス (Azure OpenAI / Cognitive Services / AI Search) を使った AI ソリューション実装の中級認定。受験料 $165、CBT 100 分",
      "Anthropic 認定",
      "Microsoft Office の認定",
      "オンプレ AI モデルの設計試験",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Azure AI 中級認定。",
      "不正解。Microsoft 認定で Anthropic は別。",
      "不正解。Office MOS は別物。",
      "不正解。Azure クラウド前提。",
    ],
    hints: [
      "Azure OpenAI / Cognitive Services / AI Search が範囲。",
      "中級 (Associate) レベル。",
      "受験料 $165。",
    ],
    explanation: {
      summary:
        "AI-102 は Microsoft Azure の AI Engineer Associate 認定。Azure OpenAI Service / AI Search / Document Intelligence / Speech / Vision など、Azure 上で AI ソリューションを実装するスキルを問う。受験料 $165、CBT 100 分。",
      reason:
        "Azure OpenAI Service 経由で GPT を使う企業が急増し、Microsoft が公式に AI Engineer 認定を打ち出している。Azure Fundamentals (AZ-900) → AI Fundamentals (AI-900) → AI Engineer (AI-102) の階層。",
      references: [
        { label: "AI-102", url: "https://learn.microsoft.com/credentials/certifications/azure-ai-engineer/" },
      ],
    },
  },

  // ===========================================================================
  // クラウド認定 (cl-001 〜 006)
  // ===========================================================================
  {
    id: "cl-001",
    categoryId: "exam-cloud",
    difficulty: "beginner",
    type: "choice",
    question: "AWS Certified Solutions Architect — Associate (SAA-C03) の受験料・時間・問題数の組み合わせは?",
    choices: [
      "$150、130 分、65 問、合格 720 / 1000 (スケーリング)",
      "$300、180 分、100 問、合格 90%",
      "$50、60 分、30 問、合格 60%",
      "$500、240 分、150 問、合格 80%",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。SAA-C03 の正しい構成。",
      "不正解。これは Professional 級の価格と難度。",
      "不正解。Practitioner 級でも安すぎる。",
      "不正解。AWS でこの価格・問題数の試験はない。",
    ],
    hints: [
      "Associate 級 $150 が標準。",
      "130 分・65 問。",
      "スケーリングスコアで 720。",
    ],
    explanation: {
      summary:
        "AWS SAA-C03 (Solutions Architect — Associate) は $150、130 分、65 問、合格 720 / 1000。Pearson VUE / PSI で受験。再受験は 14 日待機。",
      reason:
        "AWS 認定の中で最も受験者が多い『花形』Associate 試験。EC2 / VPC / S3 / RDS / ALB / Route 53 / IAM / SQS / SNS など主要サービスの設計判断を問うシナリオ問題が中心。CLF (Cloud Practitioner) は前提ではないが下地として有効。",
      references: [
        { label: "AWS SAA", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
      ],
    },
  },
  {
    id: "cl-002",
    categoryId: "exam-cloud",
    difficulty: "intermediate",
    type: "choice",
    question: "AWS Certified Solutions Architect — Professional (SAP-C02) の特徴として正しいのは?",
    choices: [
      "$300、180 分、75 問。複数アカウント / マルチリージョン / ハイブリッド / 移行戦略など Associate より複雑なシナリオが出題される",
      "Associate より易しい入門試験",
      "AWS Lambda 専用試験",
      "対面試験のみ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Professional の正しい構成と特徴。",
      "不正解。Professional は Associate より難しい上位試験。",
      "不正解。Lambda 専用ではない総合試験。",
      "不正解。Pearson VUE で CBT 可能。",
    ],
    hints: [
      "Professional は $300。",
      "180 分・75 問。",
      "複数アカウント / マルチリージョン / 移行が頻出。",
    ],
    explanation: {
      summary:
        "SAP-C02 は AWS の上位 Solutions Architect 認定。$300、180 分、75 問。マルチアカウント (AWS Organizations / Control Tower)、マルチリージョン災害対策、ハイブリッドクラウド、大規模移行 (MAP / Application Migration Service) などのシナリオが中心。",
      reason:
        "Associate (SAA) との難度差は大きく、シナリオ問題の選択肢が 4 つとも『一見正解』に見える設計。実務経験 2 年以上が推奨される。Foundations 系のクラウド資格としての到達点。",
      references: [
        { label: "AWS SAP", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
      ],
    },
  },
  {
    id: "cl-003",
    categoryId: "exam-cloud",
    difficulty: "intermediate",
    type: "choice",
    question: "AWS Certified Machine Learning Specialty (MLS-C01) の出題範囲として正しいのは?",
    choices: [
      "データエンジニアリング / 探索的データ解析 / モデリング / ML 実装と運用 (SageMaker, Comprehend, Forecast 等)",
      "RDS / DynamoDB 等のデータベース運用のみ",
      "EC2 / VPC 等のインフラ運用のみ",
      "AWS の請求・課金管理のみ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。MLS-C01 の 4 ドメイン。",
      "不正解。DB 運用は Database Specialty (廃止予定) の範囲。",
      "不正解。インフラのみは Associate 系。",
      "不正解。課金は別の枠組み。",
    ],
    hints: [
      "4 ドメイン: データエンジ / EDA / モデリング / 実装運用。",
      "SageMaker が中心。",
      "Specialty 級は $300。",
    ],
    explanation: {
      summary:
        "MLS-C01 は AWS 機械学習スペシャリティ認定。$300、180 分、65 問。出題は (1) データエンジニアリング、(2) 探索的データ解析、(3) モデリング、(4) ML 実装と運用 の 4 ドメイン。SageMaker, Glue, Comprehend, Forecast, Bedrock などの組合せが頻出。",
      reason:
        "AWS の Specialty 認定の中でもデータ系職種に強く評価される。新設の AI Practitioner (AIF-C01) は入門寄り、MLS-C01 は本格的なモデリング/運用設計を問う。",
      references: [
        { label: "AWS MLS", url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/" },
      ],
    },
  },
  {
    id: "cl-004",
    categoryId: "exam-cloud",
    difficulty: "beginner",
    type: "choice",
    question: "GCP の代表的な認定 Professional Cloud Architect (PCA) の特徴は?",
    choices: [
      "$200、120 分、50〜60 問。ケーススタディ (TerramEarth / Mountkirk Games 等) を含むシナリオ駆動。Google Cloud のソリューション設計能力を問う上位認定",
      "$50、30 分の入門試験",
      "実技で Terraform を書く試験",
      "Anthropic との共同認定",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。PCA は GCP 上位認定でケーススタディ駆動。",
      "不正解。これは Cloud Digital Leader (CDL) や ACE (Associate) のサイズ感に近い。",
      "不正解。知識試験で IaC 実技ではない。",
      "不正解。GCP 単独。",
    ],
    hints: [
      "ケーススタディ (TerramEarth / Mountkirk 等)。",
      "$200、120 分。",
      "Associate Cloud Engineer (ACE) より上位。",
    ],
    explanation: {
      summary:
        "Google Cloud Professional Cloud Architect (PCA) は GCP の代表的な上位認定。$200、120 分、50〜60 問。試験には 4 つの公式ケーススタディ (TerramEarth / Mountkirk Games / Helicopter Racing League / EHR Healthcare) が含まれシナリオ駆動で問われる。",
      reason:
        "GCP は (1) Cloud Digital Leader 入門、(2) Associate Cloud Engineer (ACE) 中級、(3) Professional 系 (Cloud Architect / Data Engineer / ML Engineer / DevOps Engineer / Security Engineer / Cloud Network Engineer / Database Engineer / Workspace Administrator) の階層構造。PCA は最も汎用性が高い。",
      references: [
        { label: "Google Cloud Certifications", url: "https://cloud.google.com/certification" },
      ],
    },
  },
  {
    id: "cl-005",
    categoryId: "exam-cloud",
    difficulty: "intermediate",
    type: "choice",
    question: "Google Cloud Professional Machine Learning Engineer (PMLE) の出題範囲は?",
    choices: [
      "ML 問題のフレーミング / データ準備とパイプライン / モデル構築 / モデルデプロイ / MLOps と監視 (Vertex AI を中心)",
      "Google Workspace 管理のみ",
      "GCP の請求管理のみ",
      "BigQuery のクエリチューニングのみ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。PMLE の 5 ドメイン構成。",
      "不正解。Workspace Admin は別認定。",
      "不正解。請求は別領域。",
      "不正解。BigQuery 専門は Data Engineer。",
    ],
    hints: [
      "Vertex AI が中心。",
      "ML フレーミング → データ → モデル → デプロイ → MLOps。",
      "PMLE は $200。",
    ],
    explanation: {
      summary:
        "PMLE は GCP の ML Engineer 認定。$200、120 分、50〜60 問。ML 問題フレーミング / データ準備とパイプライン / モデル構築 / モデルデプロイ / MLOps と監視 の 5 ドメイン構成。Vertex AI / BigQuery ML / TensorFlow / Kubeflow Pipelines / Model Monitoring が中心。",
      reason:
        "ML エンジニアリング全体の設計判断を問う。データパイプライン (Dataflow / Dataproc) からモデル運用 (Vertex AI Pipelines / Model Registry) まで広範囲。AWS MLS-C01 と並ぶ ML 中核認定。",
      references: [
        { label: "PMLE", url: "https://cloud.google.com/certification/machine-learning-engineer" },
      ],
    },
  },
  {
    id: "cl-006",
    categoryId: "exam-cloud",
    difficulty: "beginner",
    type: "choice",
    question: "Microsoft Azure の主要認定階層として正しいのは?",
    choices: [
      "Fundamentals (AZ-900 / AI-900 / DP-900 等) → Associate (AZ-104 / AZ-204 / AI-102 等) → Expert (AZ-305 / AZ-400)",
      "Fundamentals 1 種類のみ",
      "Expert から受験可能",
      "Azure 認定は廃止された",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。3 階層 + 役割別の分岐。",
      "不正解。複数階層が存在。",
      "不正解。下位推奨 (必須ではない)。",
      "不正解。現役で運用中。",
    ],
    hints: [
      "Fundamentals → Associate → Expert の 3 階層。",
      "AZ-900 が入門。",
      "AZ-305 は Solutions Architect Expert。",
    ],
    explanation: {
      summary:
        "Microsoft Azure の認定は Fundamentals → Associate → Expert の 3 階層 + 役割別 (Administrator / Developer / Solutions Architect / Security Engineer / AI Engineer / Data Engineer 等) で構成。Fundamentals 級 (AZ-900) は $99、Associate (AZ-104) と Expert (AZ-305) は $165。",
      reason:
        "AZ-900 (Azure Fundamentals) は前提なしで受験可能、AI-900 / DP-900 と並ぶ入門。AZ-305 (Designing Microsoft Azure Infrastructure Solutions) は Architect Expert で AZ-104 合格が推奨。AI-102 は AI Engineer Associate で Bedrock 競合の Azure OpenAI 関連が中心。",
      references: [
        { label: "Microsoft Certifications", url: "https://learn.microsoft.com/certifications/" },
      ],
    },
  },
];

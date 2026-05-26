import type { Guide } from "./types";

export const examPrepOverviewGuide: Guide = {
    id: "exam-prep-overview",
    trackId: "exam-prep",
    title: "試験・認定の地図 — 受験料 / 出題範囲 / 合格戦略",
    subtitle:
      "IPA / 言語・OS / AI・Claude / クラウド (AWS・GCP・Azure) の主要認定を 4 章で俯瞰。受験料・問題数・合格点・対策ルートを一気に押さえる",
    audience:
      "資格取得を検討中だが『どれが何を測るのか』『費用感』『勉強順』が見えにくい人、社内人材育成計画を立てる人",
    sources: [
      { label: "IPA 情報処理技術者試験", url: "https://www.ipa.go.jp/shiken/" },
      { label: "AWS Certification", url: "https://aws.amazon.com/certification/" },
      { label: "Google Cloud Certifications", url: "https://cloud.google.com/certification" },
      { label: "Microsoft Certifications", url: "https://learn.microsoft.com/certifications/" },
      { label: "Claude Partner Network", url: "https://www.anthropic.com/news/claude-partner-network" },
    ],
    emoji: "🎓",
    relatedCategoryIds: [
      "code-reading",
      "ruby-basics",
      "python-basics",
      "sql-basics",
      "db-design",
      "linux-cli",
      "security",
      "ai-engineering",
      "claude-code-basics",
      "ai-security",
    ],
    chapters: [
      {
        id: "ipa-and-data",
        title: "1. IPA / データ認定 — 国内の標準骨格",
        intro:
          "国家試験 (FE / AP / 高度) は国内 SIer・社内 SE で根強い評価。G 検定 / E 資格 / DS 検定はビジネス〜エンジニアの AI 系横断軸。",
        readingMinutes: 8,
        objectives: [
          "IPA 試験の階層 (FE → AP → 高度) と CBT 化状況を説明できる",
          "G 検定・E 資格・DS 検定の役割の違いを区別できる",
          "自分の役割に応じた受験順を組み立てられる",
        ],
        references: [
          { label: "IPA 試験区分", url: "https://www.ipa.go.jp/shiken/kubun/index.html" },
          { label: "JDLA 認定", url: "https://www.jdla.org/certificate/" },
          { label: "DS 検定", url: "https://www.datascientist.or.jp/dscertification/" },
        ],
        sections: [
          {
            heading: "1.1 IPA 情報処理技術者試験の階層",
            body: "IPA 試験は (a) 入門の **IT パスポート (IP)** = 非エンジニア含む情報リテラシー、(b) 基礎の **基本情報技術者 (FE)** = 2023 年度から通年 CBT・IRT 方式、(c) 中堅の **応用情報技術者 (AP)** = 春秋年 2 回・午後は記述、(d) 上位の **高度情報処理技術者試験** = 9 区分 (DB スペシャリスト / NW スペシャリスト / セキュリティ支援士 / プロマネ / IT ストラテジスト 等) の 4 階層。",
            code: "受験ルート例\n  非IT職: IP → (FE)\n  若手 SE: FE → AP → 高度 (DB or NW or セキュリティ)\n  管理職: AP → IT ストラテジスト / システム監査\n  CBT 化済: IP / FE\n  紙試験: AP / 高度 (年 1〜2 回)",
            language: "text",
            notes: [
              "AP 合格者は 2 年間『高度試験の午前 I 免除』 — 高度を狙うなら AP は通過点として有効",
              "受験料は AP / 高度ともに 7,500 円 (2024 年改定)、IP / FE は 7,500 円",
              "高度試験のうち情報処理安全確保支援士は『士業』登録制で更新義務あり",
            ],
          },
          {
            heading: "1.2 高度試験の構成 (午前 I・II / 午後 I・II)",
            body: "高度試験は 4 部構成。各段階で 60% 以上が必要 (午前 I は AP 合格で 2 年免除可)。午後 II は『論述 (プロマネ / ストラテジスト 等)』または『長文記述 (DB / NW)』に分かれる。論述系は『2,400 字程度を 2 時間で書く』ため、構成テンプレートと業務経験ストックが鍵。",
            code: "▼ DB スペシャリスト (秋季) の例\n  午前 I  (共通) 30 問 50 分 — AP レベル\n  午前 II (専門) 25 問 40 分 — DB 専門知識\n  午後 I  (記述) 3 問中 2 問選択 90 分 — 設計問題\n  午後 II (長文記述) 2 問中 1 問選択 120 分 — 大規模 DB 設計",
            language: "text",
            notes: [
              "午後 II の長文記述系は『手書き』のため書く体力も問われる",
              "論述系 (プロマネ等) は『自分の経験プロジェクト 1〜2 件のストック』があると圧倒的有利",
            ],
          },
          {
            heading: "1.3 G 検定 / E 資格 / DS 検定の役割分担",
            body: "AI 系の 3 大認定はそれぞれ役割が違う。**G 検定** (JDLA、自宅オンライン、参考書 OK) = ジェネラリスト向け AI リテラシー、200 問 120 分。**E 資格** (JDLA、認定プログラム前提) = エンジニア向け、誤差逆伝播や CNN/Transformer の数式実装。**DS 検定** (データサイエンティスト協会、CBT) = データサイエンス力 / データエンジニア力 / ビジネス力の 3 軸 100 問 100 分。",
            code: "選び方の目安\n  ビジネス側 (PdM / 営業 / 企画):        G 検定 → DS 検定リテラシー\n  データ分析職:                          DS 検定 → G 検定\n  ML エンジニア:                         G 検定 → E 資格\n  研究寄り:                              E 資格 + 大学院 / 論文\n\n費用感\n  G 検定:        13,200 円 (一般) / 5,500 円 (学生)\n  E 資格:        33,000 円 + 認定プログラム 10〜30 万円\n  DS 検定 (L1):  11,000 円 (一般) / 5,500 円 (学生)",
            language: "text",
            notes: [
              "E 資格は『認定プログラム 2 年以内修了』が必須要件 — 費用と時間の投資が大きい",
              "G 検定は参考書持込可だが、200 問 / 120 分 = 1 問 36 秒で時間勝負",
              "DS 検定は SQL や統計の基礎を含むので、データ分析職の足元固めに有効",
            ],
          },
        ],
        keyTakeaways: [
          "IPA は IP → FE → AP → 高度の 4 階層、FE/IP は通年 CBT、AP/高度は紙の年 2 回 (高度は春か秋のいずれか)",
          "AP 合格は高度試験の午前 I 免除 (2 年間) — 高度を狙うなら AP は通過点",
          "AI 系は G 検定 (ビジネス) / E 資格 (実装) / DS 検定 (データ横断) の 3 系統で役割分担",
        ],
      },
      {
        id: "languages-and-os",
        title: "2. 言語・OS 認定 — 専門スキルのタグ付け",
        intro:
          "Ruby Silver/Gold、Python PCEP/PCAP、LPIC、Oracle Java、CKA/CKAD/CKS など。技術タグとして履歴書・LinkedIn で見られやすい。",
        readingMinutes: 7,
        objectives: [
          "Ruby Silver/Gold、Python PCEP/PCAP/PCPP の階層を区別できる",
          "LPIC と LinuC の違いを把握し、応募先に合わせて選べる",
          "Kubernetes 認定 (CKA/CKAD/CKS) の対象とパフォーマンスベース試験を理解する",
        ],
        references: [
          { label: "Ruby Association 認定", url: "https://www.ruby.or.jp/ja/certification/" },
          { label: "Python Institute", url: "https://pythoninstitute.org/certification" },
          { label: "LPI 日本支部", url: "https://lpi.or.jp/" },
          { label: "Linux Foundation Training", url: "https://training.linuxfoundation.org/" },
        ],
        sections: [
          {
            heading: "2.1 Ruby 技術者認定 (Silver / Gold)",
            body: "Ruby Association 認定。**Silver** = 文法・組み込みクラス・基本ライブラリ。**Gold** = メタプログラミング・モジュール設計・例外設計・標準ライブラリ深堀り。CBT 90 分・50 問・合格 75%。各 16,500 円。最新は Ruby 3.x 対応版で、`pattern matching` / `rightward assignment` / `endless method` 等の新機能も範囲。",
            code: "Silver で問われる代表例\n  String / Array / Hash の頻出メソッド\n  範囲式 / 真偽値判定 / nil 安全\n  ブロック・Proc・Lambda の基礎\n\nGold で追加される例\n  Module / Mixin の include/prepend/extend\n  メソッド探索 (ancestors / method_missing)\n  Struct / OpenStruct / Comparable / Enumerable の自作実装",
            language: "ruby",
            notes: [
              "Silver なしで Gold 直行も可能 (推奨されないだけ)",
              "Rails の試験ではなく Ruby 本体 — Active Record などは出ない",
              "出題はメソッド戻り値や継承順序など『細部』が多く、Ruby を毎日書いていてもケアレスミスしがち",
            ],
          },
          {
            heading: "2.2 Python 認定 (PCEP / PCAP / PCPP1 / PCPP2)",
            body: "OpenEDG (Python Institute) 認定の 4 階層。**PCEP** ($59、入門) = 構文・データ型・関数。**PCAP** ($295、中級) = OOP・例外・モジュール・標準ライブラリ。**PCPP1/PCPP2** ($495 各、上級) = デザインパターン・GUI / ネットワーク・テスティング・データベース・科学計算。OnVUE プロクター付きでオンライン受験可能。",
            code: "選び方ガイド\n  Python 学習開始 1〜3 ヶ月:        PCEP\n  Python で OOP / 業務 1 年:        PCAP\n  Python で大規模アプリ:            PCPP1 → PCPP2\n\n参考: 日本の他 Python 試験\n  Python 3 エンジニア認定基礎試験 (Odyssey CBT、11,000 円)\n  Python 3 エンジニア認定データ分析試験 (11,000 円)",
            language: "text",
            notes: [
              "OpenEDG はグローバル認定 — 海外案件・外資面接でアピール可",
              "日本国内のみなら『Python 3 エンジニア認定基礎試験』(Odyssey CBT) も選択肢",
              "PCEP は無料の模擬試験あり (OpenEDG 公式)",
            ],
          },
          {
            heading: "2.3 LPIC / LinuC / Kubernetes (CKA/CKAD/CKS)",
            body: "**LPIC** (Linux Professional Institute、カナダ) と **LinuC** (LPI 日本支部 + Linux Foundation 公認、日本独自) は出題範囲が重なるが運営が違う。LPIC-1 (101+102 試験) → LPIC-2 (201+202) → LPIC-3 (1 試験で 300/303/305/306 選択)。**Kubernetes 認定** は CKA (Administrator) / CKAD (Application Developer) / CKS (Security Specialist、CKA 前提) の 3 種。すべて実機で yaml を書くパフォーマンスベース試験。",
            code: "LPIC vs LinuC\n  LPIC: LPI 直接認定、有効期間 5 年、グローバル流通\n  LinuC: LPI 日本支部 + Linux Foundation 公認、5 年更新、国内 SIer で評価\n  → 応募先の指定資格を確認してから受験を決める\n\nKubernetes 認定の特徴\n  CKA:  クラスタ管理 ($445、2 時間、実機 yaml 操作)\n  CKAD: アプリ開発 ($445、2 時間)\n  CKS:  セキュリティ ($445、2 時間、CKA 合格が前提)\n  → PSI Bridge でブラウザ越し ssh 操作、検索エンジンは Kubernetes 公式 docs のみ参照可",
            language: "text",
            notes: [
              "LPIC-1 1 試験あたり 16,500 円 (税込)、合計 33,000 円で LPIC-1 認定",
              "CKA/CKAD/CKS は CNCF 主催のため Cloud Native 求人で高評価、海外で時給換算が上がる",
              "Kubernetes 認定は実機なので bash + kubectl の操作速度が合否を分ける",
            ],
          },
          {
            heading: "2.4 Oracle Java / PHP / その他言語",
            body: "**Oracle Java SE Certified Professional** は Java 21 LTS 対応の **1Z0-830** で取得可能 (¥37,730、Pearson VUE)。1 試験で Professional 取得という新方式。Pattern Matching、Records、Virtual Threads、Sealed Classes 等の最新機能が出題。**PHP 技術者認定** は PHP 8 ベースで初級 (13,200 円) / 上級 (16,500 円) の 2 段階。CBT 60 問 70 分、合格 70%。",
            code: "言語認定の評価度感 (国内案件目線)\n  ◎ Ruby Silver/Gold:  Rails 系 SaaS / 受託で評価\n  ◎ Java SE:           大企業 SIer / 銀行系で必須に近い\n  ◎ Python:           AI / データ系では PCEP/PCAP より実績重視\n  △ PHP:              WordPress / Laravel 案件で参考程度",
            language: "text",
            notes: [
              "Oracle Java は受験料が高い (¥37,730) ため、業務で Java を継続的に書く人向け",
              "Java 8 (1Z0-808/809) の試験は 2025 年以降順次終了 — 最新版は 1Z0-830 (Java 21)",
              "PHP 認定は需要が下がりつつあるが、レガシー保守案件では今でも見られる",
            ],
          },
        ],
        keyTakeaways: [
          "Ruby Silver/Gold、Python PCEP/PCAP は『言語熟練度のタグ』として履歴書で有効",
          "LPIC と LinuC は応募先の指定資格をまず確認してから選ぶ (出題範囲はほぼ重複)",
          "Kubernetes 認定 (CKA/CKAD/CKS) は実機パフォーマンスベース — 操作速度がそのまま合否",
        ],
        // 関連クイズは Track ページ (/track/exam-prep) の各認定カードからアクセス可能
      },
      {
        id: "ai-and-claude",
        title: "3. AI・Claude 関連認定 — 急成長領域",
        intro:
          "Anthropic CCA-F (現行) / 予告中の Seller・Developer・Advanced Architect、AWS AI Practitioner、Azure AI Engineer、Google PMLE。2025-2026 で一気に整備された領域。",
        readingMinutes: 9,
        objectives: [
          "Anthropic 公式認定 (CCA-F 現行 + 予告中の Seller/Developer/Advanced) の全体像を説明できる",
          "AWS / Azure / Google の AI 系認定の対象範囲を比較できる",
          "ロール (営業 / 開発 / アーキ) に応じた受験ルートを描ける",
        ],
        references: [
          { label: "Claude Partner Network", url: "https://www.anthropic.com/news/claude-partner-network" },
          { label: "Anthropic Academy", url: "https://anthropic.skilljar.com/" },
          { label: "AWS AI Practitioner", url: "https://aws.amazon.com/certification/certified-ai-practitioner/" },
          { label: "AI-102", url: "https://learn.microsoft.com/credentials/certifications/azure-ai-engineer/" },
          { label: "GCP PMLE", url: "https://cloud.google.com/certification/machine-learning-engineer" },
        ],
        sections: [
          {
            heading: "3.1 Anthropic 公式認定 (CCA-F 現行 + 予告中)",
            body: "Anthropic は 2026 年 3 月 12 日に Claude Partner Network を発足し、同日 CCA-F (Claude Certified Architect — Foundations) を公開。**CCA-F** = $99、60 問・120 分、シナリオ駆動、ドメイン加重 (Agentic 27% / Claude Code 20% / Prompt 20% / MCP 18% / Context 15%)、合格 720 / 1000。Network 加盟組織所属が受験ゲート (加盟自体は無料)、Early Access として 5,000 名まで無料受験可能。",
            code: "Anthropic 認定ロードマップ\n  2026/3: CCA-F リリース ← 現行はこれだけ\n  2026 年内 (予告):\n    - Seller 認定        営業向け\n    - Developer 認定      実装向け\n    - Advanced Architect  上級設計 (CCA-F 前提)\n\n対策の王道 (3 ヶ月想定)\n  Month 1: Claude 101 + AI Fluency でリテラシー固め\n  Month 2: Claude Code 101 + Intro to MCP + Subagents\n  Month 3: Building with the Claude API + 実プロジェクト演習\n  → 全コース Anthropic Academy (skilljar) で無料",
            language: "text",
            notes: [
              "受験は Skilljar 上のプロクター付きオンライン試験、外部ツール参照禁止 (closed-book)",
              "Partner Network 加盟は組織単位 — 個人での加盟はできない",
              "Anthropic Academy のコース受講は誰でも無料 (Partner Network 不要)",
            ],
            diagram: `flowchart LR
  A[Anthropic Academy 受講<br/>誰でも無料] --> B[Partner Network 組織加盟<br/>所属企業が加盟済 or 加盟申請]
  B --> C[CCA-F 受験<br/>$99 or Early Access 無料]
  C --> D{合格 720/1000?}
  D -->|Yes| E[Foundations 認定取得]
  D -->|No| F[ドメイン弱点を学習し再受験]
  E --> G[今後: Seller / Developer / Advanced Architect]`,
            diagramCaption: "CCA-F 受験フロー (組織加盟 → 受験 → 上位認定)",
          },
          {
            heading: "3.2 CCA-F の 5 ドメインと配点",
            body: "CCA-F の合格戦略は『配点重みに沿った時間配分』。**Agentic Architecture 27%** = エージェントループ (gather → take action → verify) / Subagent / Multi-Agent。**Claude Code 20%** = CLAUDE.md 階層 (Enterprise/Project/User) / slash command / hook / SessionStart hook。**Prompt Engineering 20%** = structured output / few-shot / JSON Schema / data extraction。**MCP 18%** = ツール設計 / scope (Local/Project/User) / エラー処理。**Context Management 15%** = context window 管理 / エスカレーション / HITL 設計。",
            code: "ドメイン別の対策コース (Anthropic Academy)\n  Agentic 27%       → Introduction to Subagents, Agent Skills, Claude Code in Action\n  Claude Code 20%   → Claude Code 101, Claude Code in Action\n  Prompt 20%        → Claude 101, Building with the Claude API\n  MCP 18%           → Introduction to MCP, Advanced MCP\n  Context 15%       → Anthropic Learn 記事 + 実運用経験\n\n推奨学習時間配分 (3 ヶ月想定 = 120 時間)\n  Agentic:      32 時間 (27%)\n  Claude Code:  24 時間 (20%)\n  Prompt:       24 時間 (20%)\n  MCP:          22 時間 (18%)\n  Context:      18 時間 (15%)",
            language: "text",
            notes: [
              "Anthropic 推奨: Claude 製品を 6 ヶ月以上本番運用した経験 — 未経験合格は厳しい",
              "シナリオ駆動なので『正答が複数候補に見える』設問が多い — 実務勘が効く",
              "scaling score なので試験回ごとの難易度差は吸収される (素点 72% ≠ scaled 720)",
            ],
          },
          {
            heading: "3.3 主要クラウドの AI 認定",
            body: "クラウド各社も AI 認定を急速に整備。**AWS Certified AI Practitioner (AIF-C01)** = 2024 年新設の入門、$100、65 問 90 分、Bedrock や Claude on Bedrock を含む。**AWS ML Specialty (MLS-C01)** = $300、ML 実務向け 4 ドメイン (データエンジ / EDA / モデリング / 実装運用)、SageMaker 中心。**Azure AI-102** = AI Engineer Associate、$165、100 分、Azure OpenAI / AI Search / Document Intelligence。**GCP PMLE** = $200、ML フレーミング → MLOps の 5 ドメイン、Vertex AI 中心。",
            code: "主要 AI 認定の比較 (2026/5 時点)\n  認定名                    入門料  難度   対象\n  Anthropic CCA-F          $99    中〜高 Claude エコシステム\n  AWS AI Practitioner      $100   低     AWS AI 入門 (Bedrock 含む)\n  AWS ML Specialty         $300   高     AWS で本格 ML 実装\n  Azure AI-102             $165   中     Azure OpenAI / Cognitive Services\n  Google PMLE              $200   高     GCP Vertex AI / MLOps\n  Google ML Engineer など多数\n\nロール別ルート推奨\n  PdM / 営業:        G 検定 + Anthropic Seller (予告)\n  Claude 実装者:     CCA-F + Anthropic Developer (予告)\n  AWS で AI 開発:    AWS AI Practitioner → MLS-C01\n  Azure で AI 開発:  AZ-900 → AI-900 → AI-102\n  GCP で AI 開発:    GCP ACE → PMLE",
            language: "text",
            notes: [
              "AWS Bedrock 経由で Claude を使う組織が増え、AWS AI Practitioner が AWS 側の入口に",
              "GCP PMLE は『データ → モデル → MLOps』を一気通貫で問うため難度高",
              "クラウド ML 認定は各社 2〜3 年で大改訂が入る — 受験前に最新シラバスを必ず確認",
            ],
          },
        ],
        keyTakeaways: [
          "Anthropic 公式は CCA-F のみがリリース済み (2026/3)、Seller / Developer / Advanced Architect は 2026 年内に追加予定",
          "CCA-F の合格戦略は『ドメイン重み (Agentic 27% / Claude Code 20% / Prompt 20% / MCP 18% / Context 15%) に沿った学習時間配分』",
          "クラウドの AI 認定は AWS (AI Practitioner / MLS) / Azure (AI-102) / GCP (PMLE) で役割分担、利用クラウドに揃える",
        ],
        // 関連クイズは Track ページ (/track/exam-prep) の各認定カードからアクセス可能
      },
      {
        id: "cloud-certifications",
        title: "4. クラウド認定 — AWS / GCP / Azure の主要ライン",
        intro:
          "AWS Foundational/Associate/Professional/Specialty、GCP Foundational/Associate/Professional、Azure Fundamentals/Associate/Expert。3 大クラウドの認定階層と代表試験を整理。",
        readingMinutes: 10,
        objectives: [
          "AWS の 4 階層 (Foundational/Associate/Professional/Specialty) と代表試験を説明できる",
          "GCP / Azure の 3 階層と AWS との対応関係を整理できる",
          "受験順 (CLF → SAA → SAP など) と費用感を踏まえて学習計画を立てられる",
        ],
        references: [
          { label: "AWS Certification", url: "https://aws.amazon.com/certification/" },
          { label: "Google Cloud Certifications", url: "https://cloud.google.com/certification" },
          { label: "Microsoft Certifications", url: "https://learn.microsoft.com/certifications/" },
        ],
        sections: [
          {
            heading: "4.1 AWS 認定の階層と代表試験",
            body: "AWS は **Foundational** (CLF / AIF-C01)、**Associate** (SAA / SOA / DVA / DEA / MLA)、**Professional** (SAP / DOP)、**Specialty** (Security / Networking / Machine Learning / Advanced Networking 等) の 4 階層。受験は Pearson VUE または PSI でオンライン/テストセンター選択可能。各認定は 3 年で失効、上位試験合格で下位も自動延長。",
            code: "AWS 主要試験の受験料・時間・問題数\n  Foundational (CLF / AIF-C01):     $100  90 分 65 問\n  Associate (SAA / SOA / DVA / DEA): $150  130 分 65 問\n  Professional (SAP / DOP):         $300  180 分 75 問\n  Specialty (MLS / SCS / ANS など):  $300  180 分 65 問\n\n合格基準 (スケーリングスコア)\n  Foundational: 700 / 1000\n  Associate:    720 / 1000\n  Professional: 750 / 1000\n  Specialty:    750 / 1000\n\n推奨受験順 (フルスタックエンジニア)\n  CLF (任意の足慣らし) → SAA → SAP → (Specialty 1〜2)\n  CLF (任意の足慣らし) → DVA → SOA → SAP",
            language: "text",
            notes: [
              "Cloud Practitioner (CLF) は『前提なし』 — 営業・PdM・非エンジニアにも適",
              "Specialty で人気高いのは MLS-C01 (ML)、SCS-C02 (Security)、ANS-C01 (Advanced Networking)",
              "再受験は不合格から 14 日待機、合格は別試験へすぐ進める",
            ],
            diagram: `flowchart TB
  CLF[CLF: Cloud Practitioner 入門<br/>$100 - 前提なし]
  AIF[AIF-C01: AI Practitioner<br/>$100 - AI 入門]
  SAA[SAA: Solutions Architect Associate<br/>$150]
  SOA[SOA: SysOps Admin Associate<br/>$150]
  DVA[DVA: Developer Associate<br/>$150]
  DEA[DEA: Data Engineer Associate<br/>$150]
  MLA[MLA: ML Engineer Associate<br/>$150]
  SAP[SAP: Solutions Architect Professional<br/>$300]
  DOP[DOP: DevOps Engineer Professional<br/>$300]
  MLS[MLS: ML Specialty<br/>$300]
  SCS[SCS: Security Specialty<br/>$300]
  CLF --> SAA
  CLF --> DVA
  CLF --> AIF
  SAA --> SAP
  DVA --> DOP
  SOA --> DOP
  DEA --> MLS
  MLA --> MLS
  AIF --> MLS
  SAA --> SCS`,
            diagramCaption: "AWS 認定の主要ルート (CLF 入門 → Associate → Professional/Specialty)",
          },
          {
            heading: "4.2 GCP 認定の階層と代表試験",
            body: "GCP は **Foundational** (Cloud Digital Leader)、**Associate** (Cloud Engineer = ACE)、**Professional** (Cloud Architect / Data Engineer / ML Engineer / DevOps Engineer / Security Engineer / Cloud Network Engineer / Database Engineer / Workspace Administrator 等 8〜9 種) の 3 階層。Professional 試験はケーススタディ駆動 (公式 4 シナリオ) で実務寄り。",
            code: "GCP 主要試験の受験料・時間\n  Cloud Digital Leader (CDL): $99   90 分 50〜60 問 (入門)\n  Associate Cloud Engineer (ACE): $125 120 分 50〜60 問 (中級)\n  Professional 全般:           $200  120 分 50〜60 問\n\n人気の Professional 試験\n  Cloud Architect (PCA):        ケーススタディ含む汎用上位\n  Data Engineer (PDE):          BigQuery / Dataflow / Dataproc 中心\n  ML Engineer (PMLE):           Vertex AI 中心、MLOps まで\n  Cloud DevOps Engineer (PCDOE): SRE 寄り\n  Security Engineer (PCSE):     GCP セキュリティ全般\n\n推奨受験順\n  非エンジニア:       CDL → (任意で ACE)\n  クラウドエンジニア: CDL → ACE → PCA\n  データエンジニア:   ACE → PDE\n  ML エンジニア:      ACE → PMLE",
            language: "text",
            notes: [
              "GCP 認定は有効期間 2 年 — AWS/Azure (3 年) より短い",
              "PCA / PDE / PMLE はケーススタディ (公式の架空企業) を含む — 事前に case を読んで臨む",
              "Cloud Digital Leader は AWS CLF / Azure AZ-900 と並ぶ『非エンジニア向け』入門",
            ],
          },
          {
            heading: "4.3 Azure 認定の階層と代表試験",
            body: "Azure は **Fundamentals** (AZ-900 / AI-900 / DP-900 / SC-900)、**Associate** (AZ-104 / AZ-204 / AI-102 / DP-203 / SC-200 等)、**Expert** (AZ-305 / AZ-400 / SC-100) の 3 階層 + 役割別。Microsoft Learn (公式) の無料学習パスが充実しており、教材コスト ゼロで受験準備が可能。",
            code: "Azure 主要試験の受験料\n  Fundamentals (AZ/AI/DP/SC-900): $99  60 分 40〜60 問\n  Associate:                     $165 120 分 40〜60 問\n  Expert:                        $165 150 分 40〜60 問\n\n主要試験の対象\n  AZ-900: Azure 全般入門 (前提なし、非エンジニアにも)\n  AI-900: Azure AI 入門 (Cognitive Services 中心)\n  DP-900: Azure データ入門 (SQL / Cosmos DB / Synapse)\n  SC-900: Azure セキュリティ入門\n  AZ-104: Azure Administrator (中級、IaaS / VM / Network 中心)\n  AZ-204: Azure Developer (中級、App Service / Functions 中心)\n  AI-102: Azure AI Engineer (中級、Azure OpenAI / AI Search)\n  AZ-305: Designing Microsoft Azure Infrastructure (Expert、AZ-104 推奨前提)\n  AZ-400: Azure DevOps Engineer (Expert、CI/CD 中心)\n  SC-100: Azure Security Architect (Expert)\n\n推奨受験順\n  非エンジニア:        AZ-900 のみ\n  Azure 管理者:        AZ-900 → AZ-104 → AZ-305\n  Azure 開発者:        AZ-900 → AZ-204 → AZ-400\n  Azure AI エンジニア: AZ-900 → AI-900 → AI-102",
            language: "text",
            notes: [
              "Azure 認定は『学割』が手厚く、学生は受験料が大幅割引される試験が多い",
              "MS Learn (公式無料学習) と Practice Assessment (公式無料模試) でほぼ完結",
              "Azure 認定は 1 年で失効するライン (Fundamentals は永続、Associate/Expert は要更新)",
            ],
          },
          {
            heading: "4.4 3 大クラウド認定のロードマップ早見表",
            body: "全体を一望すると、各クラウドの認定は『入門 → 中級 → 上位』のパターンが共通。利用クラウドに応じて 1 つに集中するのが原則。マルチクラウド戦略の場合も、まず 1 クラウドで Professional 級まで取ってから次に進む方が学習効率が高い。",
            code: "3 大クラウド認定 対応表 (大まかに)\n  入門:        AWS CLF      = GCP CDL  = Azure AZ-900\n  AI 入門:     AWS AIF-C01  = -         = Azure AI-900\n  Associate:   AWS SAA      = GCP ACE  = Azure AZ-104\n  AI 中級:     -            = -         = Azure AI-102\n  ML 系:       AWS MLS-C01  = GCP PMLE = Azure DP-100 (廃止予定)\n  Professional: AWS SAP     = GCP PCA  = Azure AZ-305\n  DevOps Pro:   AWS DOP      = GCP PCDOE = Azure AZ-400\n  Security:    AWS SCS      = GCP PCSE = Azure SC-200/SC-100\n\n年間予算の目安 (受験 + 教材)\n  AWS SAA まで:    $150 + 教材 $50 = 約 3 万円\n  AWS SAP まで:    + $300 + 教材 $100 = 累計 約 9 万円\n  GCP PCA まで:    $200 + 教材 $50 = 約 4 万円\n  Azure AZ-305 まで: $165 + MS Learn 無料 = 約 2.5 万円",
            language: "text",
            notes: [
              "再受験ポリシーは AWS = 14 日待機、GCP = 14 日 / 60 日 / 1 年と段階的、Azure = 24 時間待機",
              "認定取得後は LinkedIn のデジタルバッジ (Credly) と連動 — 自動で履歴書に反映可",
              "資格更新 (recertification) は AWS 3 年 / Azure 1 年 / GCP 2 年と各社で違う",
            ],
          },
        ],
        keyTakeaways: [
          "AWS は 4 階層 (Foundational/Associate/Professional/Specialty)、GCP/Azure は 3 階層 + 役割別",
          "受験順は『入門 (CLF/CDL/AZ-900) は任意の足慣らし、Associate (SAA/ACE/AZ-104) を本命にして Professional に進む』が王道",
          "資格更新は AWS 3 年 / Azure 1 年 (Fundamentals 除く) / GCP 2 年 — 取得後の保守コストも考慮",
        ],
        // 関連クイズは Track ページ (/track/exam-prep) の各認定カードからアクセス可能
      },
    ],
};

/**
 * 試験・認定の『概要カード』データ。
 *
 * クイズではなく「こういう試験がある」 + 「練習はこのカテゴリで」 という導線。
 * 出典 (各 officialUrl) を一次情報とする。受験料・形式は時期で変動するので
 * 必ず公式で最新を確認すること、をページ側で注記する。
 */

export type ExamGroupId = "ipa" | "lang-os" | "ai-claude" | "cloud";

export type ExamProfile = {
  id: string;
  groupId: ExamGroupId;
  name: string;
  short?: string;
  emoji: string;
  vendor: string;
  fee: string;
  format: string;
  passingScore: string;
  scope: string[];
  strategy: string;
  officialUrl: string;
  /** この試験対策に役立つ既存カテゴリ (id) */
  relatedCategoryIds?: string[];
  /** 関連ガイド id */
  relatedGuideIds?: string[];
};

export type ExamGroup = {
  id: ExamGroupId;
  name: string;
  emoji: string;
  description: string;
  accentClass: string;
};

export const examGroups: ExamGroup[] = [
  {
    id: "ipa",
    name: "IPA / データ系認定",
    emoji: "🇯🇵",
    description:
      "国家試験 (IP / FE / AP / 高度) と AI・データ系 (G 検定 / E 資格 / DS 検定)。 国内 SIer・社内 SE で評価される標準骨格。",
    accentClass: "from-yellow-500/20 to-amber-500/5",
  },
  {
    id: "lang-os",
    name: "言語・OS 認定",
    emoji: "🐧",
    description:
      "Ruby / Python / Java / LPIC / Kubernetes 等。 履歴書・LinkedIn の技術タグとして見られやすい専門認定。",
    accentClass: "from-emerald-500/20 to-teal-500/5",
  },
  {
    id: "ai-claude",
    name: "AI・Claude 関連認定",
    emoji: "🤖",
    description:
      "Anthropic CCA-F を中心とした AI 開発者向け認定。 クラウドベンダ系の AI 認定も含む。",
    accentClass: "from-purple-500/20 to-fuchsia-500/5",
  },
  {
    id: "cloud",
    name: "クラウド認定",
    emoji: "☁️",
    description:
      "AWS / GCP / Azure 主要 3 ベンダの認定パス。 入門 → アソシエイト → プロフェッショナルの 3 階層構成が共通。",
    accentClass: "from-sky-500/20 to-blue-500/5",
  },
];

export const examProfiles: ExamProfile[] = [
  // ============================================================
  // IPA / データ系認定
  // ============================================================
  {
    id: "ipa-ip",
    groupId: "ipa",
    name: "IT パスポート試験",
    short: "IP",
    emoji: "🪪",
    vendor: "IPA",
    fee: "7,500 円",
    format: "CBT 通年 / 100 問 / 120 分 / 四択",
    passingScore: "総合 600 / 1000、 ストラテジ・マネジメント・テクノロジ各 300 以上",
    scope: [
      "ストラテジ系 (経営戦略 / 法務 / 会計)",
      "マネジメント系 (PM / SLA / 監査)",
      "テクノロジ系 (基礎理論 / ネットワーク / セキュリティ)",
    ],
    strategy:
      "非エンジニア含む全社員向け IT リテラシー。 新人研修・営業職の社内必須で使われる。 過去問道場系を 2-3 周で合格圏。",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/ip.html",
    relatedCategoryIds: ["security", "linux-cli", "practical"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "ipa-fe",
    groupId: "ipa",
    name: "基本情報技術者試験",
    short: "FE",
    emoji: "🎯",
    vendor: "IPA",
    fee: "7,500 円",
    format: "CBT 通年 / 科目 A 60 問 90 分 + 科目 B 20 問 100 分 / IRT 方式",
    passingScore: "科目 A・B ともに 600 / 1000 点 (IRT 換算)",
    scope: [
      "科目 A: テクノロジ系 (アルゴリズム / DB / NW / セキュリティ)",
      "科目 B: 擬似言語によるアルゴリズム + 情報セキュリティ",
      "2023 年度から通年 CBT 化、 IRT (項目応答理論) で難易度補正",
    ],
    strategy:
      "若手エンジニアの定番。 科目 B (擬似言語) はトレース力勝負なので、 配列 / 木 / ハッシュの動きを手で追う練習を最優先。",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/fe.html",
    relatedCategoryIds: ["code-reading", "sql-basics", "security", "js-basics", "python-basics"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "ipa-ap",
    groupId: "ipa",
    name: "応用情報技術者試験",
    short: "AP",
    emoji: "📘",
    vendor: "IPA",
    fee: "7,500 円",
    format: "紙 / 春・秋年 2 回 / 午前 80 問 150 分 + 午後 11 問中 5 問選択 150 分 (記述)",
    passingScore: "午前・午後ともに 60 / 100 点",
    scope: [
      "午前: テクノロジ + マネジメント + ストラテジ 全 80 問四択",
      "午後: アルゴリズム / DB / NW / セキュリティ / プロマネ / 経営戦略 等から記述",
      "AP 合格で高度試験の午前 I 免除 (2 年間)",
    ],
    strategy:
      "高度試験への中継点。 午後は記述式 — 過去問 5 年分を解いて『書く型』を作る。 セキュリティは必須、 他 4 問は得意分野で。",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/ap.html",
    relatedCategoryIds: ["code-reading", "sql-basics", "sql-joins", "security", "db-design", "practical"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "ipa-db",
    groupId: "ipa",
    name: "データベーススペシャリスト試験",
    short: "DB",
    emoji: "🗄️",
    vendor: "IPA",
    fee: "7,500 円",
    format: "紙 / 秋年 1 回 / 午前 I・II + 午後 I (記述) + 午後 II (長文記述)",
    passingScore: "各段階で 60 / 100 点 (午前 I は AP 合格で 2 年免除可)",
    scope: [
      "概念・論理・物理データモデル設計",
      "正規化 / トランザクション / 索引 / SQL チューニング",
      "午後 II は大規模 DB 設計の長文記述 (120 分 / 1 問)",
    ],
    strategy:
      "AP 合格者の次の一歩。 午後 II は ER 図と関数従属を素早く読み解く訓練が中核。 業務で論理設計に関わっている人は射程内。",
    officialUrl: "https://www.ipa.go.jp/shiken/kubun/db.html",
    relatedCategoryIds: ["sql-basics", "sql-joins", "sql-advanced", "db-design", "active-record"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "g-kentei",
    groupId: "ipa",
    name: "G 検定",
    short: "G",
    emoji: "🎓",
    vendor: "JDLA (日本ディープラーニング協会)",
    fee: "13,200 円 (一般) / 5,500 円 (学生)",
    format: "オンライン自宅受験 / 200 問 / 120 分 / 参考書持込可",
    passingScore: "非公開 (例年 65-70% 程度と推測)",
    scope: [
      "AI / 機械学習 / ディープラーニング基礎",
      "AI のビジネス活用と社会実装、 法規制 (AI 法 / 著作権)",
      "生成 AI / LLM / プロンプトエンジニアリングも 2023 年以降追加",
    ],
    strategy:
      "ビジネス職向け AI リテラシー。 1 問 36 秒の高速戦のため、 用語暗記より『どこを引けば答えがある』を整理。 公式テキスト + 模試 2-3 回。",
    officialUrl: "https://www.jdla.org/certificate/general/",
    relatedCategoryIds: ["ai-engineering", "ai-security"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "e-shikaku",
    groupId: "ipa",
    name: "E 資格",
    short: "E",
    emoji: "🧠",
    vendor: "JDLA (日本ディープラーニング協会)",
    fee: "33,000 円 + 認定プログラム 10-30 万円",
    format: "テストセンター CBT / 約 100 問 / 120 分",
    passingScore: "非公開 (各分野でバランス、 例年 60-70%)",
    scope: [
      "応用数学 (線形代数 / 確率統計 / 情報理論)",
      "機械学習 / ディープラーニング (CNN / RNN / Transformer / 強化学習 / 生成モデル)",
      "開発・運用環境 (分散学習 / モデル圧縮 / エッジ推論)",
    ],
    strategy:
      "エンジニア向け実装認定。 認定プログラム修了 (2 年以内) が必須要件 — 時間と費用の投資大。 Numpy で誤差逆伝播を自分で書ける所がスタートライン。",
    officialUrl: "https://www.jdla.org/certificate/engineer/",
    relatedCategoryIds: ["ai-engineering", "python-basics"],
    relatedGuideIds: ["exam-prep-overview"],
  },

  // ============================================================
  // 言語・OS 認定
  // ============================================================
  {
    id: "ruby-cert",
    groupId: "lang-os",
    name: "Ruby Association 認定 Ruby プログラマ (Silver / Gold)",
    short: "Ruby Silver/Gold",
    emoji: "💎",
    vendor: "Ruby Association",
    fee: "16,500 円 / 試験",
    format: "CBT 通年 / 50 問 / 90 分 / 四択",
    passingScore: "75 / 100 点 (Silver / Gold とも)",
    scope: [
      "Silver: 文法 / 組み込みクラス (String, Array, Hash, IO) / オブジェクト指向基礎",
      "Gold: Module / メタプログラミング / 例外 / Proc / オブジェクトモデル詳細",
      "対象は Ruby 3.x (2023 年改訂以降)",
    ],
    strategy:
      "Silver は公式模試 + 「Ruby 技術者認定試験合格教本」 で 2-3 週間。 Gold は Module / クラス継承 / メソッド探索順の理解が鍵で、 IRB で動きを確認しながら進める。",
    officialUrl: "https://www.ruby.or.jp/ja/certification/",
    relatedCategoryIds: ["ruby-basics", "collections", "ruby-oop", "ruby-advanced", "code-reading"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "python-cert",
    groupId: "lang-os",
    name: "Python Institute 認定 (PCEP / PCAP / PCPP)",
    short: "PCEP/PCAP",
    emoji: "🐍",
    vendor: "OpenEDG Python Institute",
    fee: "PCEP $59 / PCAP $295 / PCPP $195 (各レベル)",
    format: "Pearson VUE CBT / PCEP 30 問 40 分 / PCAP 40 問 65 分",
    passingScore: "PCEP 70% / PCAP 70%",
    scope: [
      "PCEP (Entry): 基本構文 / データ型 / 制御構造 / 関数",
      "PCAP (Associate): OOP / 例外 / モジュール / ファイル I/O",
      "PCPP (Professional): GUI / ネットワーク / DB / デザインパターン",
    ],
    strategy:
      "国際認定で英語問題。 公式 Python Essentials コース (無料 LMS) を一周してから過去問。 国内では Python エンジニア認定基礎試験 (PythonED) も人気。",
    officialUrl: "https://pythoninstitute.org/certification",
    relatedCategoryIds: ["python-basics"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "lpic",
    groupId: "lang-os",
    name: "LPIC-1 / LPIC-2 / LPIC-3",
    short: "LPIC",
    emoji: "🐧",
    vendor: "LPI (Linux Professional Institute)",
    fee: "16,500 円 / 試験 (LPIC-1 は 101 + 102 の 2 試験)",
    format: "Pearson VUE CBT / 60 問 90 分 / 選択 + 記述",
    passingScore: "500 / 800 点",
    scope: [
      "LPIC-1: シェル / ファイルシステム / プロセス / 基本ネットワーク",
      "LPIC-2: 高度ネットワーク / DNS / Web / メール / セキュリティ",
      "LPIC-3: 仮想化 / セキュリティ / 高可用性 (3 分野から選択)",
    ],
    strategy:
      "国内インフラ職の定番。 似た日本独自の LinuC (LPI-Japan) もあるので応募先企業の指定を確認。 ping-t (Web 問題集) + 実機演習が王道。",
    officialUrl: "https://www.lpi.org/our-certifications/",
    relatedCategoryIds: ["linux-cli", "git-github"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "k8s-cncf",
    groupId: "lang-os",
    name: "Kubernetes 認定 (CKA / CKAD / CKS)",
    short: "CKA/CKAD/CKS",
    emoji: "☸️",
    vendor: "CNCF / Linux Foundation",
    fee: "$395 / 試験",
    format: "オンライン / パフォーマンスベース (実機操作) / CKA・CKAD 2 時間 / CKS 2 時間",
    passingScore: "CKA 66% / CKAD 66% / CKS 67%",
    scope: [
      "CKA (Administrator): クラスタ構築 / トラブルシュート / ネットワーク",
      "CKAD (Developer): Pod / Deployment / ConfigMap / Probe / Helm",
      "CKS (Security): RBAC / NetworkPolicy / Pod Security / 脆弱性スキャン",
    ],
    strategy:
      "実機で kubectl を叩く実技試験。 killer.sh の模擬試験 (受験料に 2 回分付属) を 80% 取れるまで反復。 alias / yaml 補完設定の事前準備が時間短縮の鍵。",
    officialUrl: "https://www.cncf.io/training/certification/",
    relatedCategoryIds: ["linux-cli", "git-github", "security"],
    relatedGuideIds: ["exam-prep-overview"],
  },

  // ============================================================
  // AI・Claude 関連認定
  // ============================================================
  {
    id: "anthropic-cca-f",
    groupId: "ai-claude",
    name: "Claude Certified Associate - Foundational (CCA-F)",
    short: "CCA-F",
    emoji: "🅰️",
    vendor: "Anthropic",
    fee: "無料 (Anthropic Academy 経由)",
    format: "オンライン / 多肢選択 / 約 60 問 / 90 分",
    passingScore: "70% 程度 (非公開)",
    scope: [
      "Agentic AI 基礎 (定義 / 自律性スペクトル / HITL)",
      "Claude Code (CLI / Subagents / hooks / MCP)",
      "Prompt Engineering (XML タグ / few-shot / chain-of-thought)",
      "MCP (Model Context Protocol) / Context Window 管理",
    ],
    strategy:
      "Anthropic Academy のコース (無料) を一通り → 公式 docs を辞書代わりに → 本サイトの Claude Code 基礎・実践カテゴリで手を動かす。 試験は実務シナリオ寄り。",
    officialUrl: "https://www.anthropic.com/news/claude-partner-network",
    relatedCategoryIds: [
      "claude-code-basics",
      "claude-code-practice",
      "ai-engineering",
      "ai-security",
    ],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "aws-aif",
    groupId: "ai-claude",
    name: "AWS Certified AI Practitioner",
    short: "AIF-C01",
    emoji: "🅰️🟧",
    vendor: "AWS",
    fee: "$100 (USD)",
    format: "Pearson VUE CBT / 85 問 / 90 分",
    passingScore: "700 / 1000 (スケールドスコア)",
    scope: [
      "AI / ML / 生成 AI 基礎概念",
      "Bedrock / SageMaker / Q の用途と使い分け",
      "責任ある AI / セキュリティ / コンプライアンス",
    ],
    strategy:
      "AWS の AI エントリ認定 (2024 年新設)。 AWS Skill Builder の無料コース + Bedrock の Playground を触る。 Cloud Practitioner と並列受験する人が多い。",
    officialUrl: "https://aws.amazon.com/certification/certified-ai-practitioner/",
    relatedCategoryIds: ["ai-engineering", "ai-security"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "gcp-pmle",
    groupId: "ai-claude",
    name: "Google Cloud Professional Machine Learning Engineer",
    short: "PMLE",
    emoji: "🤖🟦",
    vendor: "Google Cloud",
    fee: "$200 (USD)",
    format: "Pearson VUE CBT / 約 50-60 問 / 120 分",
    passingScore: "非公開 (推定 70-75%)",
    scope: [
      "Vertex AI / AutoML / BigQuery ML",
      "MLOps パイプライン (Vertex Pipelines / Kubeflow)",
      "責任ある AI / 公平性 / 説明可能性",
    ],
    strategy:
      "GCP の上位 AI 認定。 Vertex AI ハンズオン (Qwiklabs) と公式模試。 SAA-Pro 級の難度で、 実務 1-2 年経験が前提。",
    officialUrl:
      "https://cloud.google.com/learn/certification/machine-learning-engineer",
    relatedCategoryIds: ["ai-engineering"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "azure-ai102",
    groupId: "ai-claude",
    name: "Microsoft Azure AI Engineer Associate",
    short: "AI-102",
    emoji: "🤖🟪",
    vendor: "Microsoft",
    fee: "$165 (USD) / 一部国は割引",
    format: "Pearson VUE CBT / 40-60 問 / 100 分 / ケーススタディあり",
    passingScore: "700 / 1000",
    scope: [
      "Azure OpenAI Service / Azure AI Services",
      "Cognitive Search / Document Intelligence",
      "責任ある AI / コンテンツフィルタ",
    ],
    strategy:
      "Azure 上で生成 AI / OpenAI を使う実装者向け。 Microsoft Learn の AI-102 ラーニングパスを完走 + Azure ポータルで触る。",
    officialUrl: "https://learn.microsoft.com/credentials/certifications/azure-ai-engineer/",
    relatedCategoryIds: ["ai-engineering", "ai-security"],
    relatedGuideIds: ["exam-prep-overview"],
  },

  // ============================================================
  // クラウド認定
  // ============================================================
  {
    id: "aws-clf",
    groupId: "cloud",
    name: "AWS Certified Cloud Practitioner",
    short: "CLF-C02",
    emoji: "☁️🟧",
    vendor: "AWS",
    fee: "$100 (USD)",
    format: "Pearson VUE CBT or オンライン / 65 問 / 90 分",
    passingScore: "700 / 1000",
    scope: [
      "AWS の基本概念 (リージョン / AZ / VPC / IAM)",
      "主要サービスの用途 (EC2 / S3 / RDS / Lambda)",
      "課金モデル / サポートプラン / Well-Architected",
    ],
    strategy:
      "AWS 入門の定番。 Skill Builder の無料コース + 模擬試験。 営業・PM など非エンジニアも取得。 SAA への踏み台。",
    officialUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    relatedCategoryIds: ["security", "linux-cli", "practical"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "aws-saa",
    groupId: "cloud",
    name: "AWS Certified Solutions Architect - Associate",
    short: "SAA-C03",
    emoji: "🏛️🟧",
    vendor: "AWS",
    fee: "$150 (USD)",
    format: "Pearson VUE CBT / 65 問 / 130 分",
    passingScore: "720 / 1000",
    scope: [
      "高可用 / フォールトトレラント設計",
      "VPC / Route53 / ELB / Auto Scaling",
      "ストレージ / DB 選択 / セキュリティ / コスト最適化",
    ],
    strategy:
      "AWS 認定の最人気。 公式問題集 + WhizLabs/Tutorials Dojo の模試で 80% 安定が合格圏。 Well-Architected の 6 つの柱を軸に。",
    officialUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    relatedCategoryIds: ["security", "db-design", "linux-cli"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "aws-sap",
    groupId: "cloud",
    name: "AWS Certified Solutions Architect - Professional",
    short: "SAP-C02",
    emoji: "🏛️🟧⭐",
    vendor: "AWS",
    fee: "$300 (USD)",
    format: "Pearson VUE CBT / 75 問 / 180 分 / 長文問題",
    passingScore: "750 / 1000",
    scope: [
      "マルチアカウント / Organizations / SCP",
      "ハイブリッド / Direct Connect / Transit Gateway",
      "移行戦略 / Disaster Recovery / コスト最適化",
    ],
    strategy:
      "AWS 最高難度の 1 つ。 SAA 取得後、 業務で 1-2 年運用してからが現実的。 問題文が長く読解スピードが重要 — 過去問を時間を測って解く。",
    officialUrl: "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
    relatedCategoryIds: ["security", "db-design"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "gcp-ace",
    groupId: "cloud",
    name: "Google Associate Cloud Engineer",
    short: "ACE",
    emoji: "🛠️🟦",
    vendor: "Google Cloud",
    fee: "$125 (USD)",
    format: "Pearson VUE CBT / 50 問 / 120 分",
    passingScore: "非公開 (推定 70%)",
    scope: [
      "GCP リソースのデプロイと運用",
      "Compute Engine / GKE / Cloud Run / Cloud Functions",
      "IAM / Cloud SQL / Cloud Storage / モニタリング",
    ],
    strategy:
      "GCP の入口。 Qwiklabs (Google Cloud Skills Boost) のハンズオン + 公式模試。 gcloud CLI のオプションを手で打つ練習が効く。",
    officialUrl: "https://cloud.google.com/learn/certification/cloud-engineer",
    relatedCategoryIds: ["linux-cli", "security"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "gcp-pca",
    groupId: "cloud",
    name: "Google Professional Cloud Architect",
    short: "PCA",
    emoji: "🏛️🟦",
    vendor: "Google Cloud",
    fee: "$200 (USD)",
    format: "Pearson VUE CBT / 50-60 問 / 120 分 / ケーススタディあり",
    passingScore: "非公開 (推定 70-75%)",
    scope: [
      "ビジネス要件→技術設計の変換",
      "セキュリティ / コンプライアンス / 信頼性設計",
      "公式ケーススタディ 4 件 (Mountkirk Games / TerramEarth など) を要事前読み込み",
    ],
    strategy:
      "GCP 最上位。 ACE 取得後の人気資格。 公式ケーススタディ熟読 + Whizlabs 模試。 SAA-Pro と並ぶ難度で、 AI 開発以外の GCP 全般を問う。",
    officialUrl: "https://cloud.google.com/learn/certification/cloud-architect",
    relatedCategoryIds: ["security", "db-design"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "azure-az104",
    groupId: "cloud",
    name: "Microsoft Azure Administrator Associate",
    short: "AZ-104",
    emoji: "🛠️🟪",
    vendor: "Microsoft",
    fee: "$165 (USD)",
    format: "Pearson VUE CBT / 40-60 問 / 120 分 / ハンズオンラボあり",
    passingScore: "700 / 1000",
    scope: [
      "Azure ID / Entra ID (旧 Azure AD)",
      "VM / VNet / NSG / Storage / Backup",
      "監視 / Azure Monitor / Log Analytics",
    ],
    strategy:
      "Azure 管理者の基本認定。 Microsoft Learn の AZ-104 パス完走 + Azure 無料枠で実機操作。 PowerShell / Azure CLI 両方の構文に触れておく。",
    officialUrl: "https://learn.microsoft.com/credentials/certifications/azure-administrator/",
    relatedCategoryIds: ["security", "linux-cli"],
    relatedGuideIds: ["exam-prep-overview"],
  },
  {
    id: "azure-az305",
    groupId: "cloud",
    name: "Microsoft Azure Solutions Architect Expert",
    short: "AZ-305",
    emoji: "🏛️🟪",
    vendor: "Microsoft",
    fee: "$165 (USD)",
    format: "Pearson VUE CBT / 40-60 問 / 120 分 / ケーススタディあり",
    passingScore: "700 / 1000",
    scope: [
      "ID とガバナンスの設計",
      "データ / インフラ / アプリケーションの設計",
      "AZ-104 合格が前提 (Expert 認定)",
    ],
    strategy:
      "Azure アーキテクト最上位。 AZ-104 取得後 1 年程度の実務経験者向け。 公式ラーニングパス + ケーススタディ系問題集。",
    officialUrl: "https://learn.microsoft.com/credentials/certifications/azure-solutions-architect/",
    relatedCategoryIds: ["security", "db-design"],
    relatedGuideIds: ["exam-prep-overview"],
  },
];

export const examProfilesByGroup = (groupId: ExamGroupId) =>
  examProfiles.filter((p) => p.groupId === groupId);

export const findExamProfile = (id: string) =>
  examProfiles.find((p) => p.id === id);

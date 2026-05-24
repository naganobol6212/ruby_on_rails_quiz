export type Difficulty = "beginner" | "intermediate" | "advanced";

// ===========================================================================
// Track (上位: 言語/フレームワーク軸)
// ===========================================================================
export type TrackId =
  | "ruby"
  | "javascript"
  | "typescript"
  | "react"
  | "nextjs"
  | "nuxt"
  | "python"
  | "sql"
  | "db-design"
  | "git"
  | "infosec"
  | "linux";

export type Track = {
  id: TrackId;
  name: string;
  short: string;
  emoji: string;
  description: string;
  accentClass: string;
  ringClass: string;
  status: "available" | "coming-soon";
};

// ===========================================================================
// Category
// ===========================================================================
export type CategoryId =
  // Ruby/Rails (既存)
  | "ruby-basics"
  | "collections"
  | "ruby-oop"
  | "ruby-advanced"
  | "code-reading"
  | "rails-convention"
  | "routing-controller"
  | "active-record"
  | "rspec"
  | "logs"
  | "git-github"
  | "security"
  | "debugging"
  | "linux-cli"
  | "practical"
  // JavaScript / TypeScript
  | "js-basics"
  | "js-functions"
  | "js-async"
  | "ts-basics"
  // React / Next.js / Nuxt
  | "react-fundamentals"
  | "nextjs-basics"
  | "nuxt-basics"
  // Python
  | "python-basics"
  // SQL
  | "sql-basics"
  | "sql-joins"
  | "sql-advanced"
  // DB 設計
  | "db-design";

export type Category = {
  id: CategoryId;
  trackId: TrackId;
  name: string;
  description: string;
  emoji: string;
  accentClass: string;
  ringClass: string;
};

// ===========================================================================
// Question
// ===========================================================================
/**
 * 構造化された「自己説明の模範解答」。
 * 結論 → 理由 → 具体例 → (任意で) 落とし穴 の順で組み立てる。
 * クライアントやチームに口頭で説明するつもりで書く。
 */
export type ModelSelfExplanation = {
  /** 1〜2 文で「答え」を断定する */
  conclusion: string;
  /** なぜそうなるか、内部メカニズムまで踏み込んだ説明 */
  reason: string;
  /** 「たとえば〜」で始まる、現場で遭遇する具体例 */
  example: string;
  /** ここを踏むとハマる、という代表的な落とし穴 (任意) */
  pitfall?: string;
};

export type Explanation = {
  summary: string;
  reason: string;
  codeExample?: string;
  commonMistakes?: string[];
  references?: { label: string; url: string }[];

  /**
   * 初心者向けの「噛み砕いた」解説。reason が難しいと感じた人が
   * トグルで開いて読む。です・ます調、専門用語を最小化、比喩 OK。
   */
  beginnerExplanation?: string;

  /**
   * 「自分の言葉で説明」の模範解答 (構造化)。
   * 未指定なら SelfExplanationBox は summary を表示する。
   */
  modelSelfExplanation?: ModelSelfExplanation;
};

type BaseQuestion = {
  id: string;
  categoryId: CategoryId;
  difficulty: Difficulty;
  question: string;
  code?: string;
  hints: string[];
  explanation: Explanation;
};

export type ChoiceQuestion = BaseQuestion & {
  type: "choice";
  choices: string[];
  answerIndex: number;
  /**
   * 各選択肢に対する「なぜ正解 / なぜ不正解か」の 1〜2 行解説。
   * 配列長は choices と同じ。回答開示後にのみ表示。
   */
  choiceExplanations?: string[];
};

export type TextQuestion = BaseQuestion & {
  type: "text";
  answers: string[];
};

export type PracticalQuestion = BaseQuestion & {
  type: "practical";
  requirements: string[];
  sampleSolution: string;
  reviewPoints: string[];
};

export type Question = ChoiceQuestion | TextQuestion | PracticalQuestion;

// ===========================================================================
// Progress
// ===========================================================================
export type ReviewMark = "mastered" | "review" | null;

export type QuestionAttempt = {
  questionId: string;
  solved: boolean;
  attempts: number;
  hintsUsed: number;
  lastAnsweredAt: string;
  mark: ReviewMark;
  /** 構造化言語訓練: ユーザーが自分の言葉で書いた説明 */
  selfExplanation?: string;
  selfExplanationUpdatedAt?: string;
};

export type Progress = {
  attempts: Record<string, QuestionAttempt>;
  totalSolved: number;
  totalAttempts: number;
  bestStreak: number;
};
